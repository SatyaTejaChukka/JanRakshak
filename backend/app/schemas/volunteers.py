"""
Pydantic Schemas for Civilian Volunteer Corps and NDRF Mobilization.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class VolunteerApplicationCreate(BaseModel):
    fullName: str = Field(..., example="K. Sai Kumar")
    phone: str = Field(..., example="+91 98480 11990")
    govtIdType: str = Field(..., example="Aadhaar")
    govtIdNumber: str = Field(..., example="XXXX-XXXX-4912")
    ward: str = Field(..., example="Ward 14 (Coastal Belt)")
    address: str = Field(..., example="Near Fishermen Colony, Beach Road")
    skills: List[str] = Field(..., example=["First Aid & CPR", "Swimming & Water Rescue"])
    equipmentAvailable: List[str] = Field(default=[], example=["Inflatable Raft", "2x Life Jackets"])
    availability: str = Field(default="Immediate (24x7)", example="Immediate (24x7)")
    bloodGroup: str = Field(default="O+", example="O+")


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


class DirectVolunteerCreate(BaseModel):
    name: str = Field(..., example="M. Srinivas & Team")
    phone: str = Field(..., example="+91 94401 22334")
    ward: str = Field(..., example="Ward 14 (Coastal Belt)")
    role: str = Field(..., example="Fishermen Community Boat Skipper")
    equipment: str = Field(..., example="1x Motorized Boat + 4 Life Jackets")
    skills: List[str] = Field(..., example=["Swimming & Water Rescue"])
    status: str = Field(default="Available", example="Available")


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
    incidentId: str = Field(..., example="ELD-4091")
    targetStatus: str = Field(default="En Route", example="En Route")
