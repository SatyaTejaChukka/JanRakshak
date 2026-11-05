"""
API Endpoints for Emergency SOS and Vulnerable Citizen Assistance.
"""

from typing import List
from datetime import datetime, timezone
import random
from fastapi import APIRouter, HTTPException, status

from backend.app.schemas.sos import (
    SOSTriggerRequest,
    SOSResponse,
    ElderProfileSchema,
    ProximityVolunteer,
)
from backend.app.services.mock_db import db_store

router = APIRouter(prefix="/sos", tags=["Emergency Life-Safety & SOS"])


@router.get("/elder-profile", response_model=ElderProfileSchema)
async def get_elder_profile():
    """Retrieve pre-registered senior citizen vulnerability profile."""
    return db_store.elder_profile


@router.put("/elder-profile", response_model=ElderProfileSchema)
async def update_elder_profile(payload: ElderProfileSchema):
    """Update vulnerability registry details and critical medical needs."""
    db_store.elder_profile = payload.dict()
    return db_store.elder_profile


@router.post("/trigger", response_model=SOSResponse, status_code=status.HTTP_201_CREATED)
async def trigger_emergency_sos(payload: SOSTriggerRequest):
    """
    Trigger emergency SOS signal for vulnerable elder citizen.
    Dispatches nearest community volunteers (<500m) and NDRF boat squads.
    """
    sos_id = f"ELD-{random.randint(4100, 4999)}"
    elder = db_store.elder_profile

    # Set nearest volunteer en-route
    if db_store.active_volunteers:
        first_vol = db_store.active_volunteers[0]
        first_vol["status"] = "En Route"
        first_vol["assignedIncidentId"] = sos_id

    return SOSResponse(
        sosEventId=sos_id,
        status="DISPATCHED",
        elderName=elder["fullName"],
        location=elder["address"],
        proximityVolunteerCount=len(db_store.active_volunteers),
        assignedUnit="NDRF 10th Bn IRB Boat #04",
        destinationShelter="Andhra University Indoor Sports Complex Hub",
        timestamp="Just now",
    )


@router.get("/proximity-volunteers", response_model=List[ProximityVolunteer])
async def get_proximity_volunteers():
    """List verified community responders within 500m proximity radius."""
    results = []
    for vol in db_store.active_volunteers:
        results.append(
            ProximityVolunteer(
                id=vol["id"],
                name=vol["name"],
                phone=vol["phone"],
                ward=vol["ward"],
                distanceMeters=vol.get("distanceMeters", 200),
                role=vol["role"],
                equipment=vol["equipment"],
                status=vol["status"],
                isVerifiedByNDRF=vol.get("isVerifiedByNDRF", True),
            )
        )
    return results
