"""
Pydantic Schemas for Emergency SOS, Senior Registry, and Proximity Rescue.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from backend.app.schemas.tickets import Coordinates


class EmergencyContactSchema(BaseModel):
    name: str
    relation: str
    phone: str


class ElderProfileSchema(BaseModel):
    id: str
    fullName: str
    age: int
    ward: str
    address: str
    criticalNeeds: List[str]
    emergencyContacts: List[EmergencyContactSchema]
    floorLevel: str
    evacuationDifficulty: str
    proximityVolunteerCount: int = 0


class SOSTriggerRequest(BaseModel):
    elderProfileId: Optional[str] = None
    triggerType: str = Field(default="ONE_TAP_PANIC", example="ONE_TAP_PANIC")  # VOICE_COMMAND, ONE_TAP_PANIC, 2G_SMS
    coordinates: Optional[Coordinates] = None
    batteryPercentage: Optional[int] = Field(default=85, ge=0, le=100)


class SOSResponse(BaseModel):
    sosEventId: str
    status: str
    elderName: str
    location: str
    proximityVolunteerCount: int
    assignedUnit: Optional[str] = None
    destinationShelter: Optional[str] = None
    timestamp: str


class ProximityVolunteer(BaseModel):
    id: str
    name: str
    phone: str
    ward: str
    distanceMeters: int
    role: str
    equipment: str
    status: str
    isVerifiedByNDRF: bool
