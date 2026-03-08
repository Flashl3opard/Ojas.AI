from io import BytesIO
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.api.routes.diet import get_latest_plan
from app.models.user import User


router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/diet/{patient_id}/pdf")
def export_diet_pdf(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> StreamingResponse:
    plan = get_latest_plan(patient_id=patient_id, db=db, user=user)

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    y = height - 50
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, f"Ojas.AI Diet Plan - Patient #{patient_id}")
    y -= 25

    pdf.setFont("Helvetica", 11)
    pdf.drawString(50, y, f"Daily Calories: {plan.daily_calories}")
    y -= 18
    pdf.drawString(50, y, f"Macros: {plan.macros}")
    y -= 24

    for meal_name, items in plan.meals_json.items():
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(50, y, meal_name.capitalize())
        y -= 16
        pdf.setFont("Helvetica", 10)
        for item in items:
            text = f"- {item.get('name')} ({item.get('quantity')}, {item.get('calories')} kcal)"
            pdf.drawString(60, y, text[:105])
            y -= 14
            if y < 60:
                pdf.showPage()
                y = height - 50
        y -= 8

    pdf.save()
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=diet-plan-{patient_id}.pdf"},
    )
