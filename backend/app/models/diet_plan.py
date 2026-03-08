from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class DietPlan(Base):
    __tablename__ = "diet_plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    daily_calories: Mapped[int] = mapped_column(Integer, nullable=False)
    macros: Mapped[dict] = mapped_column(JSON, nullable=False)
    meals_json: Mapped[dict] = mapped_column(JSON, nullable=False)

    patient = relationship("Patient", back_populates="diet_plans")
