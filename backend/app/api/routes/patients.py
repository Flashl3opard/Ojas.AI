from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database.session import get_db
from app.models.patient import Patient
from app.models.user import User, UserRole
from app.schemas.patient import PatientCreate, PatientResponse


router = APIRouter(prefix="/patients", tags=["Patients"])


def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    meters = height_cm / 100
    return round(weight_kg / (meters * meters), 2)


@router.post("", response_model=PatientResponse)
def create_patient(
    payload: PatientCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.dietitian)),
) -> PatientResponse:
    patient = Patient(
        dietitian_id=user.id,
        patient_user_id=payload.patient_user_id,
        name=payload.name,
        age=payload.age,
        gender=payload.gender,
        height=payload.height,
        weight=payload.weight,
        bmi=calculate_bmi(payload.weight, payload.height),
        activity_level=payload.activity_level,
        medical_conditions=payload.medical_conditions,
        allergies=payload.allergies,
        dietary_preferences=payload.dietary_preferences,
        goal=payload.goal,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.get("", response_model=list[PatientResponse])
def list_patients(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[PatientResponse]:
    if user.role == UserRole.dietitian:
        return db.query(Patient).filter(Patient.dietitian_id == user.id).all()

    return db.query(Patient).filter(Patient.patient_user_id == user.id).all()


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> PatientResponse:
    patient = db.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if user.role == UserRole.dietitian and patient.dietitian_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    if user.role == UserRole.patient and patient.patient_user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    return patient
