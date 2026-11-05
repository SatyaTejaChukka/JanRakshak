"""
Pydantic Schemas for Cyclone Relief Shelters.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class ShelterResponse(BaseModel):
    id: str
    name: str
    location: str
    distanceKm: float
    totalCapacity: int
    currentOccupants: int
    amenities: List[str]
    medicalOfficer: str
    contactNumber: str
    waterSupplyStatus: str
    generatorStatus: str
    safeRouteStatus: str


class ShelterOccupancyUpdate(BaseModel):
    delta: int = Field(..., description="Positive to add occupants, negative to discharge", example=25)
