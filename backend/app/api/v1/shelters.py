"""
API Endpoints for Cyclone Relief Shelters.
"""

from typing import List
from fastapi import APIRouter, HTTPException, status

from backend.app.schemas.shelters import ShelterResponse, ShelterOccupancyUpdate
from backend.app.services.mock_db import db_store

router = APIRouter(prefix="/shelters", tags=["Cyclone Relief Shelters"])


@router.get("", response_model=List[ShelterResponse])
async def list_shelters():
    """Retrieve all cyclone relief shelters with real-time occupancy and generator status."""
    return db_store.shelters


@router.patch("/{shelter_id}/occupancy", response_model=ShelterResponse)
async def update_shelter_occupancy(shelter_id: str, payload: ShelterOccupancyUpdate):
    """Adjust occupant count for a shelter (e.g. check-in or transfer)."""
    shelter = next((s for s in db_store.shelters if s["id"] == shelter_id), None)
    if not shelter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Shelter {shelter_id} not found"
        )

    new_count = shelter["currentOccupants"] + payload.delta
    shelter["currentOccupants"] = max(0, min(shelter["totalCapacity"], new_count))
    return shelter
