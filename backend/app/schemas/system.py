"""
Pydantic Schemas for Global Operating Mode and Live System Telemetry.
"""

from typing import Optional
from pydantic import BaseModel, Field


class SystemModeToggleRequest(BaseModel):
    isDisasterMode: bool = Field(..., example=True)


class SystemModeResponse(BaseModel):
    isDisasterMode: bool
    modeLabel: str
    activeSheltersCount: int
    ndrfCommandStatus: str
    updatedAt: str


class TelemetryResponse(BaseModel):
    operatingMode: str
    statusMessage: str
    windGustKmh: Optional[int] = None
    surgeMeters: Optional[float] = None
    activeDefectsCount: int
    onTimeSlaPercentage: float
    deduplicationActive: bool
