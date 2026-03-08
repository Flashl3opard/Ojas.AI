from datetime import datetime
from pydantic import BaseModel, Field


class MacroBreakdown(BaseModel):
    protein: str
    carbs: str
    fats: str


class MealItem(BaseModel):
    name: str
    calories: int = Field(ge=0)
    quantity: str
    notes: str | None = None


class DietGenerateRequest(BaseModel):
    patient_id: int


class DietPlanStructured(BaseModel):
    daily_calories: int
    macros: MacroBreakdown
    meals: dict[str, list[MealItem]]


class DietPlanResponse(BaseModel):
    id: int
    patient_id: int
    created_at: datetime
    daily_calories: int
    macros: dict
    meals_json: dict

    model_config = {"from_attributes": True}
