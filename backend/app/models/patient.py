from datetime import datetime
import enum
from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"


class ActivityLevel(str, enum.Enum):
    sedentary = "sedentary"
    light = "light"
    moderate = "moderate"
    active = "active"
    athlete = "athlete"


class Goal(str, enum.Enum):
    weight_loss = "weight_loss"
    maintenance = "maintenance"
    weight_gain = "weight_gain"


class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    dietitian_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    patient_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[Gender] = mapped_column(Enum(Gender), nullable=False)
    height: Mapped[float] = mapped_column(Float, nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    bmi: Mapped[float] = mapped_column(Float, nullable=False)
    activity_level: Mapped[ActivityLevel] = mapped_column(Enum(ActivityLevel), nullable=False)

    medical_conditions: Mapped[str | None] = mapped_column(Text, nullable=True)
    allergies: Mapped[str | None] = mapped_column(Text, nullable=True)
    dietary_preferences: Mapped[str | None] = mapped_column(Text, nullable=True)
    goal: Mapped[Goal] = mapped_column(Enum(Goal), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    dietitian = relationship("User", back_populates="patients", foreign_keys=[dietitian_id])
    diet_plans = relationship("DietPlan", back_populates="patient", cascade="all, delete-orphan")
    progress_logs = relationship("ProgressLog", back_populates="patient", cascade="all, delete-orphan")
