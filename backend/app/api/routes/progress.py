from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database.session import get_db
from app.models.patient import Patient
from app.models.progress_log import ProgressLog
from app.models.user import User, UserRole
from app.schemas.progress import ProgressCreate, ProgressResponse


router = APIRouter(prefix="/progress", tags=["Progress"])


@router.post("", response_model=ProgressResponse)
def create_progress(
    payload: ProgressCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.dietitian)),
) -> ProgressResponse:
    patient = db.get(Patient, payload.patient_id)
    if not patient or patient.dietitian_id != user.id:
        raise HTTPException(status_code=404, detail="Patient not found")

    progress = ProgressLog(
        patient_id=payload.patient_id,
        date=payload.date,
        weight=payload.weight,
        notes=payload.notes,
    )
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress


@router.get("/{patient_id}", response_model=list[ProgressResponse])
def list_progress(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[ProgressResponse]:
    patient = db.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if user.role == UserRole.dietitian and patient.dietitian_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    if user.role == UserRole.patient and patient.patient_user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    return (
        db.query(ProgressLog)
        .filter(ProgressLog.patient_id == patient_id)
        .order_by(ProgressLog.date.asc())
        .all()
    )
