from datetime import datetime
from pydantic import BaseModel, Field
from app.models.patient import ActivityLevel, Gender, Goal


class PatientCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    age: int = Field(ge=1, le=120)
    gender: Gender
    height: float = Field(gt=0)
    weight: float = Field(gt=0)
    activity_level: ActivityLevel
    medical_conditions: str | None = None
    allergies: str | None = None
    dietary_preferences: str | None = None
    goal: Goal
    patient_user_id: int | None = None


class PatientResponse(PatientCreate):
    id: int
    dietitian_id: int
    bmi: float
    created_at: datetime

    model_config = {"from_attributes": True}
