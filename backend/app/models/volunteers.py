"""
Civilian Volunteer Corps, Public Applications, and Deployment ORM models.
"""

from typing import List, Optional
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    String,
    Integer,
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


class VolunteerApplication(Base):
    """
    Public Volunteer Interest Submission from Citizens via Disaster Portal.
    Awaits review and approval by NDRF 10th Battalion War Room officers.
    """
    __tablename__ = "volunteer_applications"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)  # 'APP-701'
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(15), nullable=False, index=True)
    govt_id_type: Mapped[str] = mapped_column(
        String(30),
        CheckConstraint("govt_id_type IN ('Aadhaar', 'Voter ID', 'Driving License')"),
        nullable=False,
    )
    govt_id_number: Mapped[str] = mapped_column(String(50), nullable=False)
    ward_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("wards.id", ondelete="SET NULL"), nullable=True
    )
    ward_name: Mapped[str] = mapped_column(String(100), nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    skills = mapped_column(JSONB, default=list, nullable=False)  # ['First Aid & CPR', 'Swimming & Water Rescue']
    equipment_available = mapped_column(JSONB, default=list, nullable=False)  # ['Inflatable Raft', '2x Life Jackets']
    availability: Mapped[str] = mapped_column(
        String(30),
        CheckConstraint("availability IN ('Immediate (24x7)', 'Daytime Only', 'Standby')"),
        default="Immediate (24x7)",
        nullable=False,
    )
    blood_group: Mapped[str] = mapped_column(String(10), nullable=False)
    status: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("status IN ('PENDING', 'APPROVED', 'REJECTED')"),
        default="PENDING",
        nullable=False,
        index=True,
    )
    reviewed_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    applied_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="volunteer_application")
    active_volunteer_record: Mapped[Optional["ActiveVolunteer"]] = relationship(
        "ActiveVolunteer", back_populates="application", uselist=False
    )


class ActiveVolunteer(Base, TimestampMixin):
    """
    Active Volunteer Corps Member.
    Vetted by NDRF 10th Bn officers or directly fast-tracked for coastal evacuations.
    """
    __tablename__ = "active_volunteers"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)  # 'VOL-01'
    application_id: Mapped[Optional[str]] = mapped_column(
        String(32), ForeignKey("volunteer_applications.id", ondelete="SET NULL"), unique=True, nullable=True
    )
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), unique=True, nullable=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(15), nullable=False)
    ward_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("wards.id", ondelete="SET NULL"), nullable=True
    )
    ward_name: Mapped[str] = mapped_column(String(100), nullable=False)
    
    # Real-time GPS location for <500m proximity rescue dispatch
    location = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=True)
    distance_meters: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    role: Mapped[str] = mapped_column(String(100), nullable=False)  # 'Fishermen Community Rescuer', 'Civil Defence'
    equipment: Mapped[str] = mapped_column(Text, nullable=False)
    skills = mapped_column(JSONB, default=list, nullable=False)
    status: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("status IN ('Available', 'En Route', 'On-Scene', 'Standby')"),
        default="Available",
        nullable=False,
        index=True,
    )
    is_verified_by_ndrf: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    assigned_incident_id: Mapped[Optional[str]] = mapped_column(
        String(32), ForeignKey("sos_requests.id", ondelete="SET NULL"), nullable=True, index=True
    )
    onboarded_by: Mapped[str] = mapped_column(
        String(30),
        CheckConstraint("onboarded_by IN ('PUBLIC_APPLICATION', 'NDRF_DIRECT_ENTRY')"),
        default="PUBLIC_APPLICATION",
        nullable=False,
    )

    # Relationships
    application: Mapped[Optional["VolunteerApplication"]] = relationship("VolunteerApplication", back_populates="active_volunteer_record")
    user: Mapped[Optional["User"]] = relationship("User", back_populates="active_volunteer_profile")
    deployments: Mapped[List["SOSResponder"]] = relationship("SOSResponder", back_populates="volunteer", cascade="all, delete-orphan")


class SOSResponder(Base):
    """
    Live assignment record linking an active volunteer to an emergency SOS dispatch.
    """
    __tablename__ = "sos_responders"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    sos_request_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("sos_requests.id", ondelete="CASCADE"), nullable=False, index=True
    )
    volunteer_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("active_volunteers.id", ondelete="CASCADE"), nullable=False, index=True
    )
    status: Mapped[str] = mapped_column(
        String(30),
        CheckConstraint("status IN ('EN_ROUTE', 'ON_SITE', 'COMPLETED', 'ABORTED')"),
        default="EN_ROUTE",
        nullable=False,
    )
    distance_meters_at_acceptance: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    dispatched_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    arrived_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    sos_request: Mapped["SOSRequest"] = relationship("SOSRequest", back_populates="responders")
    volunteer: Mapped["ActiveVolunteer"] = relationship("ActiveVolunteer", back_populates="deployments")

