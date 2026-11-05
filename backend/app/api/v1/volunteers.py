"""
API Endpoints for Civilian Volunteer Corps and NDRF Mobilization.
"""

from typing import List, Optional
import random
import re
from fastapi import APIRouter, HTTPException, Query, status

from backend.app.schemas.volunteers import (
    VolunteerApplicationCreate,
    VolunteerApplicationResponse,
    ActiveVolunteerResponse,
    DirectVolunteerCreate,
    DispatchVolunteerRequest,
)
from backend.app.services.mock_db import db_store

router = APIRouter(prefix="/volunteers", tags=["Civilian Volunteer Corps"])


@router.get("/applications", response_model=List[VolunteerApplicationResponse])
async def list_volunteer_applications(
    status_filter: Optional[str] = Query(None, description="Filter by status (PENDING, APPROVED, REJECTED)"),
    user_id: Optional[str] = Query(None, description="Filter strictly by citizen User ID"),
    phone: Optional[str] = Query(None, description="Filter strictly by citizen Phone"),
):
    """List citizen volunteer applications with user isolation support."""
    apps = list(db_store.volunteer_applications)
    if user_id:
        apps = [a for a in apps if a.get("userId") == user_id]
    elif phone:
        clean_q = re.sub(r"\D", "", phone)[-10:]
        if clean_q:
            apps = [
                a for a in apps
                if re.sub(r"\D", "", a.get("phone", ""))[-10:] == clean_q
            ]

    if status_filter and status_filter != "All":
        apps = [a for a in apps if a["status"] == status_filter]
    return apps


@router.post("/applications", response_model=VolunteerApplicationResponse, status_code=status.HTTP_201_CREATED)
async def submit_volunteer_application(payload: VolunteerApplicationCreate):
    """Public citizen submission of volunteer interest form via Disaster Portal."""
    new_id = f"APP-{random.randint(710, 999)}"
    new_app = {
        "id": new_id,
        "fullName": payload.fullName,
        "phone": payload.phone,
        "govtIdType": payload.govtIdType,
        "govtIdNumber": payload.govtIdNumber,
        "ward": payload.ward,
        "address": payload.address,
        "skills": payload.skills,
        "equipmentAvailable": payload.equipmentAvailable,
        "availability": payload.availability,
        "bloodGroup": payload.bloodGroup,
        "userId": payload.userId,
        "status": "PENDING",
        "appliedAt": "Just now",
        "reviewedBy": None,
    }

    db_store.volunteer_applications.insert(0, new_app)
    return new_app


@router.post("/applications/{app_id}/approve", response_model=ActiveVolunteerResponse)
async def approve_volunteer_application(app_id: str):
    """NDRF approval: converts public application into active verified volunteer corps."""
    app = next((a for a in db_store.volunteer_applications if a["id"] == app_id), None)
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Application {app_id} not found"
        )

    app["status"] = "APPROVED"
    app["reviewedBy"] = "Capt. Vikram Singh (NDRF 10th Bn)"

    new_vol_id = f"VOL-{str(len(db_store.active_volunteers) + 1).zfill(2)}"
    new_vol = {
        "id": new_vol_id,
        "name": app["fullName"],
        "phone": app["phone"],
        "ward": app["ward"],
        "distanceMeters": random.randint(120, 380),
        "role": "Community Disaster First Responder",
        "equipment": ", ".join(app["equipmentAvailable"]) if app["equipmentAvailable"] else "First Aid Kit",
        "skills": app["skills"],
        "status": "Available",
        "isVerifiedByNDRF": True,
        "assignedIncidentId": None,
        "onboardedBy": "PUBLIC_APPLICATION",
    }

    db_store.active_volunteers.insert(0, new_vol)
    return new_vol


@router.post("/applications/{app_id}/reject")
async def reject_volunteer_application(app_id: str):
    """NDRF rejection of volunteer application."""
    app = next((a for a in db_store.volunteer_applications if a["id"] == app_id), None)
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Application {app_id} not found"
        )

    app["status"] = "REJECTED"
    return {"message": f"Application {app_id} marked as REJECTED"}


@router.get("/active", response_model=List[ActiveVolunteerResponse])
async def list_active_volunteers(
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    ward: Optional[str] = Query(None, description="Filter by ward"),
):
    """List active vetted volunteer corps."""
    volunteers = db_store.active_volunteers
    if status_filter and status_filter != "All":
        volunteers = [v for v in volunteers if v["status"] == status_filter]
    if ward and ward != "All":
        volunteers = [v for v in volunteers if ward in v["ward"]]
    return volunteers


@router.post("/direct", response_model=ActiveVolunteerResponse, status_code=status.HTTP_201_CREATED)
async def direct_onboard_volunteer(payload: DirectVolunteerCreate):
    """Direct fast-track registration of trusted fishermen/divers by NDRF officer."""
    new_id = f"VOL-{str(len(db_store.active_volunteers) + 1).zfill(2)}"
    new_vol = {
        "id": new_id,
        "name": payload.name,
        "phone": payload.phone,
        "ward": payload.ward,
        "distanceMeters": random.randint(150, 450),
        "role": payload.role,
        "equipment": payload.equipment,
        "skills": payload.skills,
        "status": payload.status,
        "isVerifiedByNDRF": True,
        "assignedIncidentId": None,
        "onboardedBy": "NDRF_DIRECT_ENTRY",
    }

    db_store.active_volunteers.insert(0, new_vol)
    return new_vol


@router.post("/{volunteer_id}/dispatch", response_model=ActiveVolunteerResponse)
async def dispatch_volunteer(volunteer_id: str, payload: DispatchVolunteerRequest):
    """Dispatch volunteer to active SOS emergency incident."""
    vol = next((v for v in db_store.active_volunteers if v["id"] == volunteer_id), None)
    if not vol:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Volunteer {volunteer_id} not found"
        )

    vol["status"] = payload.targetStatus
    vol["assignedIncidentId"] = payload.incidentId
    return vol
