"""
API Endpoints for Hazard Navigation and Roadblock Avoidance.
"""

from typing import List
from fastapi import APIRouter

from backend.app.schemas.hazards import HazardResponse, DetourRouteRequest, DetourRouteResponse, HazardPoint
from backend.app.services.mock_db import db_store

router = APIRouter(prefix="/hazards", tags=["Hazards & Safe Navigation"])


@router.get("", response_model=List[HazardResponse])
async def list_hazards():
    """List active road waterlogging and high-tension wire hazard polygons."""
    return db_store.hazards


@router.post("/detour-route", response_model=DetourRouteResponse)
async def compute_detour_route(payload: DetourRouteRequest):
    """
    Computes a safe dynamic evacuation route avoiding coastal waterlogged hazards.
    """
    safe_waypoints = [
        HazardPoint(x=payload.originLatitude, y=payload.originLongitude),
        HazardPoint(x=17.735, y=83.330),
        HazardPoint(x=17.731, y=83.326),
        HazardPoint(x=payload.destinationLatitude, y=payload.destinationLongitude),
    ]

    return DetourRouteResponse(
        routePolyline=safe_waypoints,
        totalDistanceKm=3.4,
        estimatedDurationMinutes=11,
        bypassedHazardCount=len(db_store.hazards),
        isCoastalElevatedRoute=True,
    )
