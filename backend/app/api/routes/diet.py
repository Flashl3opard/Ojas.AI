from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database.session import get_db
from app.models.diet_plan import DietPlan
from app.models.patient import Patient
from app.models.user import User, UserRole
from app.schemas.diet import DietGenerateRequest, DietPlanResponse
from app.services.ai_service import generate_diet_plan
from app.services.cache import cache_service


router = APIRouter(prefix="/diet", tags=["Diet Plans"])


@router.post("/generate", response_model=DietPlanResponse)
def generate_plan(
    payload: DietGenerateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.dietitian)),
) -> DietPlanResponse:
    patient = db.get(Patient, payload.patient_id)
    if not patient or patient.dietitian_id != user.id:
        raise HTTPException(status_code=404, detail="Patient not found")

    plan_data = generate_diet_plan(patient)

    plan = DietPlan(
        patient_id=patient.id,
        daily_calories=plan_data["daily_calories"],
        macros=plan_data["macros"],
        meals_json=plan_data["meals"],
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)

    cache_service.set_json(f"diet:{patient.id}:latest", {
        "id": plan.id,
        "patient_id": plan.patient_id,
        "daily_calories": plan.daily_calories,
        "macros": plan.macros,
        "meals_json": plan.meals_json,
        "created_at": plan.created_at.isoformat(),
    })

    return plan


@router.get("/{patient_id}", response_model=DietPlanResponse)
def get_latest_plan(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> DietPlanResponse:
    patient = db.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if user.role == UserRole.dietitian and patient.dietitian_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    if user.role == UserRole.patient and patient.patient_user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    cached = cache_service.get_json(f"diet:{patient_id}:latest")
    if cached:
        return DietPlanResponse(
            id=cached["id"],
            patient_id=cached["patient_id"],
            created_at=cached["created_at"],
            daily_calories=cached["daily_calories"],
            macros=cached["macros"],
            meals_json=cached["meals_json"],
        )

    plan = (
        db.query(DietPlan)
        .filter(DietPlan.patient_id == patient_id)
        .order_by(DietPlan.created_at.desc())
        .first()
    )
    if not plan:
        raise HTTPException(status_code=404, detail="No diet plan found")

    return plan


@router.get("/{patient_id}/weekly")
def get_weekly_meal_planner(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict:
    latest = get_latest_plan(patient_id=patient_id, db=db, user=user)
    week = {}
    start = date.today()
    for day in range(7):
        label = (start + timedelta(days=day)).isoformat()
        week[label] = latest.meals_json

    return {
        "patient_id": patient_id,
        "daily_calories": latest.daily_calories,
        "macros": latest.macros,
        "week": week,
    }


@router.get("/{patient_id}/grocery-list")
def get_grocery_list(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict:
    latest = get_latest_plan(patient_id=patient_id, db=db, user=user)
    items: list[str] = []
    for meal_items in latest.meals_json.values():
        for item in meal_items:
            items.append(item.get("name", "Item"))

    unique_items = sorted(set(items))
    return {"patient_id": patient_id, "items": unique_items}
