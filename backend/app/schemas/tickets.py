"""
Pydantic Schemas for Civic Defects, Master Tickets, and 50m Spatial Deduplication.
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class Coordinates(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)


class AssignedCrew(BaseModel):
    workerName: str
    unitId: str
    phone: str
    checkedInTime: Optional[str] = None


class TicketCreate(BaseModel):
    category: str = Field(..., json_schema_extra={"example": "Pothole & Craters"})
    title: str = Field(..., json_schema_extra={"example": "Severe 15cm Crater on Beach Road"})
    location: str = Field(..., json_schema_extra={"example": "Opposite Lawson's Bay Colony Arch"})
    coordinates: Coordinates
    citizenName: str = Field(..., json_schema_extra={"example": "Chukka Satya Teja"})
    citizenPhone: str = Field(..., json_schema_extra={"example": "+91 98480 12345"})
    userId: Optional[str] = None
    citizenAadhaar: Optional[str] = None
    severity: str = Field(default="Medium", json_schema_extra={"example": "Critical"})
    beforeImageUrl: Optional[str] = None


class SpatialDedupCheckRequest(BaseModel):
    category: str
    coordinates: Coordinates


class SpatialDedupCheckResponse(BaseModel):
    isDuplicate: bool
    existingTicketId: Optional[str] = None
    distanceMeters: Optional[float] = None
    existingMergedCount: Optional[int] = None
    message: str


class TicketStageUpdate(BaseModel):
    stage: str = Field(..., json_schema_extra={"example": "in_progress"})
    notes: Optional[str] = None


class AssignOfficerRequest(BaseModel):
    officerId: str = Field(..., json_schema_extra={"example": "OFF-01"})
    targetSlaHours: Optional[int] = Field(default=48, json_schema_extra={"example": 48})


class PhotoAuditRequest(BaseModel):
    decision: str = Field(..., json_schema_extra={"example": "APPROVE"})  # APPROVE | REJECT
    reason: Optional[str] = None


class TicketResponse(BaseModel):
    id: str
    category: str
    title: str
    location: str
    coordinates: Coordinates
    reportedAt: str
    currentStage: str
    citizenName: str
    citizenPhone: str
    userId: Optional[str] = None
    citizenAadhaar: Optional[str] = None
    clusterParentId: Optional[str] = None
    mergedCount: int
    severity: str
    assignedCrew: Optional[AssignedCrew] = None
    beforeImageUrl: Optional[str] = None
    afterImageUrl: Optional[str] = None
