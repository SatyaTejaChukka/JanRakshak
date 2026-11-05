"""
Pydantic Schemas for Civilian Volunteer Corps and NDRF Mobilization.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class VolunteerApplicationCreate(BaseModel):
    fullName: str = Field(..., json_schema_extra={"example": "K. Sai Kumar"})
    phone: str = Field(..., json_schema_extra={"example": "+91 98480 11990"})
    govtIdType: str = Field(..., json_schema_extra={"example": "Aadhaar"})
    govtIdNumber: str = Field(..., json_schema_extra={"example": "XXXX-XXXX-4912"})
    ward: str = Field(..., json_schema_extra={"example": "Ward 14 (Coastal Belt)"})
    address: str = Field(..., json_schema_extra={"example": "Near Fishermen Colony, Beach Road"})
    skills: List[str] = Field(..., json_schema_extra={"example": ["First Aid & CPR", "Swimming & Water Rescue"]})
    equipmentAvailable: List[str] = Field(default=[], json_schema_extra={"example": ["Inflatable Raft", "2x Life Jackets"]})
    availability: str = Field(default="Immediate (24x7)", json_schema_extra={"example": "Immediate (24x7)"})
    bloodGroup: str = Field(default="O+", json_schema_extra={"example": "O+"})
    userId: Optional[str] = None


class VolunteerApplicationResponse(BaseModel):
    id: str
    fullName: str
    phone: str
    govtIdType: str
    govtIdNumber: str
    ward: str
    address: str
    skills: List[str]
    equipmentAvailable: List[str]
    availability: str
    bloodGroup: str
    status: str
    appliedAt: str
    reviewedBy: Optional[str] = None
    userId: Optional[str] = None


class DirectVolunteerCreate(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "M. Srinivas & Team"})
    phone: str = Field(..., json_schema_extra={"example": "+91 94401 22334"})
    ward: str = Field(..., json_schema_extra={"example": "Ward 14 (Coastal Belt)"})
    role: str = Field(..., json_schema_extra={"example": "Fishermen Community Boat Skipper"})
    equipment: str = Field(..., json_schema_extra={"example": "1x Motorized Boat + 4 Life Jackets"})
    skills: List[str] = Field(..., json_schema_extra={"example": ["Swimming & Water Rescue"]})
    status: str = Field(default="Available", json_schema_extra={"example": "Available"})


class ActiveVolunteerResponse(BaseModel):
    id: str
    name: str
    phone: str
    ward: str
    distanceMeters: Optional[int] = None
    role: str
    equipment: str
    skills: List[str]
    status: str
    isVerifiedByNDRF: bool
    assignedIncidentId: Optional[str] = None
    onboardedBy: str


class DispatchVolunteerRequest(BaseModel):
    incidentId: str = Field(..., json_schema_extra={"example": "ELD-4091"})
    targetStatus: str = Field(default="En Route", json_schema_extra={"example": "En Route"})
