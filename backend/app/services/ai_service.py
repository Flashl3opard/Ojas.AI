from math import floor
from openai import OpenAI

from app.core.config import get_settings
from app.models.patient import Goal, Patient


def _activity_factor(level: str) -> float:
    factors = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "athlete": 1.9,
    }
    return factors.get(level, 1.55)


def _target_calories(patient: Patient) -> int:
    bmr = 10 * patient.weight + 6.25 * patient.height - 5 * patient.age
    if patient.gender.value == "male":
        bmr += 5
    elif patient.gender.value == "female":
        bmr -= 161

    tdee = bmr * _activity_factor(patient.activity_level.value)
    if patient.goal == Goal.weight_loss:
        tdee -= 350
    elif patient.goal == Goal.weight_gain:
        tdee += 300

    return max(1200, floor(tdee))


def _fallback_plan(patient: Patient) -> dict:
    calories = _target_calories(patient)
    protein_g = max(70, floor(patient.weight * 1.6))
    fats_g = floor((calories * 0.25) / 9)
    carbs_g = floor((calories - protein_g * 4 - fats_g * 9) / 4)

    return {
        "daily_calories": calories,
        "macros": {
            "protein": f"{protein_g}g",
            "carbs": f"{carbs_g}g",
            "fats": f"{fats_g}g",
        },
        "meals": {
            "breakfast": [
                {"name": "Oats with chia and berries", "calories": 420, "quantity": "1 bowl", "notes": "High fiber"}
            ],
            "lunch": [
                {"name": "Dal, brown rice, mixed vegetables", "calories": 620, "quantity": "1 plate", "notes": "Balanced macros"}
            ],
            "dinner": [
                {"name": "Paneer/tofu stir-fry with millet roti", "calories": 560, "quantity": "1 plate", "notes": "High protein"}
            ],
            "snacks": [
                {"name": "Greek yogurt with nuts", "calories": 230, "quantity": "1 cup", "notes": "Satiety support"},
                {"name": "Seasonal fruit", "calories": 140, "quantity": "1 serving", "notes": "Micronutrients"},
            ],
        },
    }


def generate_diet_plan(patient: Patient) -> dict:
    settings = get_settings()
    if settings.llm_provider != "openai" or not settings.openai_api_key:
        return _fallback_plan(patient)

    prompt = f"""
You are a clinical nutrition assistant. Generate a personalized one-day diet plan in strict JSON.
Patient:
- Age: {patient.age}
- Gender: {patient.gender.value}
- Height (cm): {patient.height}
- Weight (kg): {patient.weight}
- BMI: {patient.bmi}
- Activity Level: {patient.activity_level.value}
- Medical Conditions: {patient.medical_conditions or 'None'}
- Allergies: {patient.allergies or 'None'}
- Dietary Preferences: {patient.dietary_preferences or 'None'}
- Goal: {patient.goal.value}

Return only valid JSON with this schema:
{{
  "daily_calories": number,
  "macros": {{"protein":"string","carbs":"string","fats":"string"}},
  "meals": {{
    "breakfast": [{{"name":"string","calories":number,"quantity":"string","notes":"string"}}],
    "lunch": [{{...}}],
    "dinner": [{{...}}],
    "snacks": [{{...}}]
  }}
}}
""".strip()

    try:
        client = OpenAI(api_key=settings.openai_api_key)
        response = client.responses.create(
            model=settings.openai_model,
            input=prompt,
            temperature=0.4,
            max_output_tokens=1200,
        )

        text = response.output_text
        import json
        return json.loads(text)
    except Exception:
        return _fallback_plan(patient)
