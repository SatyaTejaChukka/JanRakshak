"""
API Endpoints for System Operating Mode and Real-Time Telemetry.
"""

from fastapi import APIRouter

from backend.app.schemas.system import (
    SystemModeToggleRequest,
    SystemModeResponse,
    TelemetryResponse,
)
from backend.app.services.mock_db import db_store

router = APIRouter(prefix="/system", tags=["System & Telemetry"])


@router.get("/mode", response_model=SystemModeResponse)
async def get_system_mode():
    """Get current operating mode (Civic Normal vs. Disaster Emergency)."""
    is_disaster = db_store.is_disaster_mode
    return SystemModeResponse(
        isDisasterMode=is_disaster,
        modeLabel="DISASTER RED ALERT" if is_disaster else "CIVIC NORMAL",
        activeSheltersCount=len(db_store.shelters) if is_disaster else 0,
        ndrfCommandStatus="WAR ROOM DEPLOYED" if is_disaster else "STANDBY",
        updatedAt="Just now",
    )


@router.post("/mode", response_model=SystemModeResponse)
async def toggle_system_mode(payload: SystemModeToggleRequest):
    """District Collector override: toggle system between Normal and Disaster Emergency."""
    db_store.is_disaster_mode = payload.isDisasterMode
    is_disaster = db_store.is_disaster_mode

    return SystemModeResponse(
        isDisasterMode=is_disaster,
        modeLabel="DISASTER RED ALERT" if is_disaster else "CIVIC NORMAL",
        activeSheltersCount=len(db_store.shelters) if is_disaster else 0,
        ndrfCommandStatus="WAR ROOM DEPLOYED" if is_disaster else "STANDBY",
        updatedAt="Just now",
    )


@router.get("/telemetry", response_model=TelemetryResponse)
async def get_system_telemetry():
    """Real-time operational telemetry strip data."""
    is_disaster = db_store.is_disaster_mode
    open_defects = len([t for t in db_store.tickets if t["currentStage"] != "resolved"])

    if is_disaster:
        return TelemetryResponse(
            operatingMode="DISASTER_RED_ALERT",
            statusMessage="IMD Cyclone Red Alert · 18 Coastal Shelters Active · NDRF War Room Dispatched",
            windGustKmh=124,
            surgeMeters=3.8,
            activeDefectsCount=open_defects,
            onTimeSlaPercentage=91.4,
            deduplicationActive=True,
        )

    return TelemetryResponse(
        operatingMode="CIVIC_NORMAL",
        statusMessage="GVMC Ward 14 · 42 Open Defects · 94.2% On-Time SLA · PostGIS Deduplication Online",
        windGustKmh=None,
        surgeMeters=None,
        activeDefectsCount=open_defects,
        onTimeSlaPercentage=94.2,
        deduplicationActive=True,
    )
