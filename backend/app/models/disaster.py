"""
Disaster Emergency Management, Vulnerability Registry, Relief Shelters, and SOS ORM models.
"""

from typing import List, Optional
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    CheckConstraint,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry, Geography

from backend.app.models.base import Base, TimestampMixin


class VulnerabilityProfile(Base, TimestampMixin):
    """
    Registry for bedridden seniors, dialysis patients, and vulnerable citizens.
    Enables proactive prioritization before cyclone landfall.
    """
    __tablename__ = "vulnerability_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=True
    )
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    ward_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("wards.id", ondelete="SET NULL"), nullable=True, index=True
    )
    ward_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Coordinates of vulnerable citizen's home for evacuation routing
    location = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=True)
    floor_level: Mapped[str] = mapped_column(String(20), default="Ground Floor", nullable=False)
    evacuation_difficulty: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("evacuation_difficulty IN ('Low', 'Medium', 'High')"),
        default="High",
        nullable=False,
    )
    critical_needs = mapped_column(JSONB, default=list, nullable=False)
    has_power_backup: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="vulnerability_profile")
    emergency_contacts: Mapped[List["EmergencyContact"]] = relationship(
        "EmergencyContact", back_populates="profile", cascade="all, delete-orphan"
    )
    sos_requests: Mapped[List["SOSRequest"]] = relationship("SOSRequest", back_populates="profile")


class EmergencyContact(Base):
    """
    Next-of-kin contacts for emergency telephone and SMS dispatch during cellular blackout.
    """
    __tablename__ = "emergency_contacts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("vulnerability_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    relation: Mapped[str] = mapped_column(String(50), nullable=False)
    phone: Mapped[str] = mapped_column(String(15), nullable=False)
    priority_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    # Relationships
    profile: Mapped["VulnerabilityProfile"] = relationship("VulnerabilityProfile", back_populates="emergency_contacts")


class ReliefShelter(Base, TimestampMixin):
    """
    Designated Cyclone Relief Shelter with real-time occupancy and generator telemetry.
    """
    __tablename__ = "relief_shelters"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)  # 'SHELTER-01'
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    location_address: Mapped[str] = mapped_column(Text, nullable=False)
    coordinates = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    ward_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("wards.id", ondelete="SET NULL"), nullable=True
    )
    distance_km: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    current_occupants: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    amenities = mapped_column(JSONB, default=list, nullable=False)
    medical_officer_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    contact_number: Mapped[str] = mapped_column(String(15), nullable=False)
    water_supply_status: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("water_supply_status IN ('Abundant', 'Moderate', 'Critical')"),
        default="Abundant",
        nullable=False,
    )
    generator_status: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("generator_status IN ('Operational', 'Standby', 'Offline')"),
        default="Operational",
        nullable=False,
    )
    safe_route_status: Mapped[str] = mapped_column(
        String(30),
        CheckConstraint("safe_route_status IN ('Clear & Elevated', 'Caution - Waterlogged', 'Inaccessible')"),
        default="Clear & Elevated",
        nullable=False,
    )

    # Relationships
    sos_destinations: Mapped[List["SOSRequest"]] = relationship("SOSRequest", back_populates="destination_shelter")


class TacticalDispatchUnit(Base):
    """
    Official NDRF 10th Battalion & SDRF Motorized Boats, Hydraulic Cranes, and Helis.
    """
    __tablename__ = "tactical_dispatch_units"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)  # 'UNIT-B01'
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(
        String(50),
        CheckConstraint("type IN ('Inflatable Motor Boat (IRB)', 'Tree Clearing Crane Unit', 'Emergency Medical Team', 'Helicopter Air-Drop')"),
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("status IN ('Deployed', 'Available', 'Refueling', 'Maintenance')"),
        default="Available",
        nullable=False,
    )
    location_name: Mapped[str] = mapped_column(String(150), nullable=False)
    current_location = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=True)
    assigned_incident_desc: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    dispatched_sos: Mapped[List["SOSRequest"]] = relationship("SOSRequest", back_populates="assigned_unit")


class SOSRequest(Base):
    """
    Emergency Distress Panic Call.
    Dispatches nearest community volunteers (<500m) and NDRF rescue boats.
    """
    __tablename__ = "sos_requests"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)  # 'ELD-4091'
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    profile_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("vulnerability_profiles.id", ondelete="SET NULL"), nullable=True
    )
    channel: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("channel IN ('VOICE_TRIGGER', 'ONE_TAP_PANIC', '2G_SMS', 'MANUAL_DISPATCH')"),
        default="ONE_TAP_PANIC",
        nullable=False,
    )
    location = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    address_text: Mapped[str] = mapped_column(Text, nullable=False)
    ward_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("wards.id", ondelete="SET NULL"), nullable=True, index=True
    )
    battery_percentage: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    assigned_unit_id: Mapped[Optional[str]] = mapped_column(
        String(32), ForeignKey("tactical_dispatch_units.id", ondelete="SET NULL"), nullable=True
    )
    destination_shelter_id: Mapped[Optional[str]] = mapped_column(
        String(32), ForeignKey("relief_shelters.id", ondelete="SET NULL"), nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(30),
        CheckConstraint("status IN ('TRIGGERED', 'ACKNOWLEDGED', 'VOLUNTEER_EN_ROUTE', 'RESCUE_IN_PROGRESS', 'EVACUATED_TO_SHELTER', 'CANCELLED')"),
        default="TRIGGERED",
        nullable=False,
        index=True,
    )
    priority: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("priority IN ('HIGH', 'CRITICAL', 'EXTREME')"),
        default="CRITICAL",
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    profile: Mapped[Optional["VulnerabilityProfile"]] = relationship("VulnerabilityProfile", back_populates="sos_requests")
    assigned_unit: Mapped[Optional["TacticalDispatchUnit"]] = relationship("TacticalDispatchUnit", back_populates="dispatched_sos")
    destination_shelter: Mapped[Optional["ReliefShelter"]] = relationship("ReliefShelter", back_populates="sos_destinations")
    responders: Mapped[List["SOSResponder"]] = relationship("SOSResponder", back_populates="sos_request", cascade="all, delete-orphan")


class Hazard(Base):
    """
    Roadblock Exclusion Polygons.
    Fed dynamically into OpenRouteService avoid_polygons parameter.
    """
    __tablename__ = "hazards"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)  # 'HAZ-01'
    ticket_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tickets.id", ondelete="SET NULL"), nullable=True
    )
    type: Mapped[str] = mapped_column(
        String(50),
        CheckConstraint("type IN ('Road Waterlogging', 'Fallen High-Tension Wire', 'Uprooted Banyan Tree', 'Embankment Breach', 'Debris Barrier')"),
        nullable=False,
    )
    # PostGIS Polygon bounding the blocked road segment
    polygon = mapped_column(Geometry(geometry_type="POLYGON", srid=4326), nullable=False)
    center_point = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    severity: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("severity IN ('Moderate', 'High', 'Extreme')"),
        default="High",
        nullable=False,
    )
    recommended_action: Mapped[str] = mapped_column(Text, nullable=False)
    is_evacuation_route_impacted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
    reported_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    cleared_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class Alert(Base):
    """
    IMD Meteorological Warning Broadcasts & Coastal Storm Surge Polygons.
    """
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source: Mapped[str] = mapped_column(String(50), default="IMD Cyclone Warning Centre Visakhapatnam", nullable=False)
    alert_level: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("alert_level IN ('YELLOW', 'ORANGE', 'RED')"),
        nullable=False,
    )
    headline: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    affected_polygon = mapped_column(Geometry(geometry_type="MULTIPOLYGON", srid=4326), nullable=False)
    projected_surge_meters: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    max_wind_gust_kmh: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
