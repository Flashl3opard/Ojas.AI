from datetime import date
from pydantic import BaseModel, Field


class ProgressCreate(BaseModel):
    patient_id: int
    date: date
    weight: float = Field(gt=0)
    notes: str | None = Field(default=None, max_length=500)


class ProgressResponse(BaseModel):
    id: int
    patient_id: int
    date: date
    weight: float
    notes: str | None = None

    model_config = {"from_attributes": True}
