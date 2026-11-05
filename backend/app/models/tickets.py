"""
Civic Defects, Master Tickets, 50m Deduplicated Reports, and Audit Logs.
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
from geoalchemy2 import Geography

from backend.app.models.base import Base, TimestampMixin


class Category(Base):
    """
    Defect and Hazard Category Classification (Potholes, Drainage, Trees, Power Lines).
    """
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)  # 'POTHOLE', 'DRAINAGE_BLOCK'
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    group_code: Mapped[str] = mapped_column(String(30), nullable=False)  # 'ROAD', 'DRAINAGE', 'ELECTRICAL'
    base_weight: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    is_hazard: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    disaster_only: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    default_agency_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("agencies.id", ondelete="SET NULL"), nullable=True
    )

    # Relationships
    default_agency: Mapped[Optional["Agency"]] = relationship("Agency", back_populates="categories")
    sla_policies: Mapped[List["SLAPolicy"]] = relationship("SLAPolicy", back_populates="category", cascade="all, delete-orphan")
    tickets: Mapped[List["Ticket"]] = relationship("Ticket", back_populates="category")


class SLAPolicy(Base):
    """
    Operating-mode dependent resolution SLAs (Normal mode vs. Disaster emergency mode).
    """
    __tablename__ = "sla_policies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    category_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )
    operating_mode: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("operating_mode IN ('NORMAL', 'DISASTER')"),
        nullable=False,
    )
    target_resolution_hours: Mapped[int] = mapped_column(Integer, nullable=False)
    escalation_tier_hours: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationships
    category: Mapped["Category"] = relationship("Category", back_populates="sla_policies")


class Ticket(Base, TimestampMixin):
    """
    Master Aggregated Work Order.
    Clusters all citizen complaints within a 50-meter radius (ST_DWithin).
    """
    __tablename__ = "tickets"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    ticket_number: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)  # 'TKT-8902'
    category_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True
    )
    category_name: Mapped[str] = mapped_column(String(100), nullable=False)
    
    # Precise PostGIS Point location of the defect cluster centroid
    location = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    address_text: Mapped[str] = mapped_column(Text, nullable=False)
    
    ward_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("wards.id", ondelete="SET NULL"), nullable=True, index=True
    )
    assigned_agency_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("agencies.id", ondelete="SET NULL"), nullable=True
    )
    assigned_officer_id: Mapped[Optional[str]] = mapped_column(
        String(32), ForeignKey("municipal_officers.id", ondelete="SET NULL"), nullable=True, index=True
    )
    
    stage: Mapped[str] = mapped_column(
        String(30),
        CheckConstraint("stage IN ('submitted', 'deduplicated', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected')"),
        default="submitted",
        nullable=False,
        index=True,
    )
    operating_mode: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("operating_mode IN ('NORMAL', 'DISASTER')"),
        default="NORMAL",
        nullable=False,
    )
    severity: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("severity IN ('Low', 'Medium', 'High', 'Critical')"),
        default="Medium",
        nullable=False,
    )
    priority_score: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    merged_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    is_hazard: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # Direct photographic proof URLs
    before_image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    after_image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    sla_due_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    assigned_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    closed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    category: Mapped[Optional["Category"]] = relationship("Category", back_populates="tickets")
    ward: Mapped[Optional["Ward"]] = relationship("Ward", back_populates="tickets")
    assigned_agency: Mapped[Optional["Agency"]] = relationship("Agency", back_populates="tickets")
    assigned_officer: Mapped[Optional["MunicipalOfficer"]] = relationship("MunicipalOfficer", back_populates="assigned_tickets")
    reports: Mapped[List["Report"]] = relationship("Report", back_populates="ticket", cascade="all, delete-orphan")
    media: Mapped[List["Media"]] = relationship("Media", back_populates="ticket", cascade="all, delete-orphan")
    events: Mapped[List["TicketEvent"]] = relationship("TicketEvent", back_populates="ticket", cascade="all, delete-orphan")
    checkins: Mapped[List["FieldWorkerCheckin"]] = relationship("FieldWorkerCheckin", back_populates="ticket", cascade="all, delete-orphan")


class Report(Base):
    """
    Individual Citizen Submission deduplicated into a master Ticket.
    """
    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    ticket_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True
    )
    citizen_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    citizen_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    citizen_phone: Mapped[Optional[str]] = mapped_column(String(15), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Exact coordinates where citizen submitted report
    reported_location = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    gps_accuracy_meters: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    submitted_image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    distance_to_master_meters: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    ticket: Mapped["Ticket"] = relationship("Ticket", back_populates="reports")
    citizen: Mapped[Optional["User"]] = relationship("User", back_populates="reports")


class Media(Base):
    """
    Geotagged Photographic Proof.
    """
    __tablename__ = "media"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    ticket_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True
    )
    report_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("reports.id", ondelete="SET NULL"), nullable=True
    )
    uploaded_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    purpose: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("purpose IN ('CITIZEN_SUBMISSION', 'BEFORE_WORK', 'AFTER_WORK', 'QUALITY_AUDIT')"),
        nullable=False,
    )
    storage_path: Mapped[str] = mapped_column(Text, nullable=False)
    captured_location = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    ticket: Mapped["Ticket"] = relationship("Ticket", back_populates="media")


class TicketEvent(Base):
    """
    Immutable State Machine Audit Log.
    Tracks every status transition with actor ID and reasoning.
    """
    __tablename__ = "ticket_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ticket_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True
    )
    actor_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    from_stage: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    to_stage: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata_json = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    ticket: Mapped["Ticket"] = relationship("Ticket", back_populates="events")


class FieldWorkerCheckin(Base):
    """
    GPS-Verified Clock-In Record.
    Requires contractor crew to be within 50m of defect coordinates before starting work.
    """
    __tablename__ = "field_worker_checkins"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    ticket_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True
    )
    worker_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    worker_name: Mapped[str] = mapped_column(String(100), nullable=False)
    unit_id: Mapped[str] = mapped_column(String(50), nullable=False)  # 'GVMC-REPAIR-CREW-04'
    phone: Mapped[str] = mapped_column(String(15), nullable=False)
    
    checkin_location = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    distance_to_defect_meters: Mapped[float] = mapped_column(Float, nullable=False)
    is_within_geofence: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    checkin_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    checkout_time: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    after_work_photo_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    ticket: Mapped["Ticket"] = relationship("Ticket", back_populates="checkins")
