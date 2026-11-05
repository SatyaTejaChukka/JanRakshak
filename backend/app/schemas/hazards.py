"""
Pydantic Schemas for Navigation Hazards and Roadblock Polygons.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class HazardPoint(BaseModel):
    x: float
    y: float


class HazardResponse(BaseModel):
    id: str
    type: str
    coordinates: HazardPoint
    severity: str
    reportedAt: str
    recommendedAction: str
    isEvacuationRouteImpacted: bool


class DetourRouteRequest(BaseModel):
    originLatitude: float
    originLongitude: float
    destinationLatitude: float
    destinationLongitude: float


class DetourRouteResponse(BaseModel):
    routePolyline: List[HazardPoint]
    totalDistanceKm: float
    estimatedDurationMinutes: int
    bypassedHazardCount: int
    isCoastalElevatedRoute: bool
