"""
User Accounts, RBAC Roles, and Municipal Officers ORM models.
"""

from typing import List, Optional
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geography

from backend.app.models.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    """
    Unified User Model powering Citizens, Municipal Admins, NDRF Officers, and Field Crew.
    """
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    firebase_uid: Mapped[Optional[str]] = mapped_column(String(128), unique=True, nullable=True)
    phone: Mapped[str] = mapped_column(String(15), unique=True, nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    role: Mapped[str] = mapped_column(
        String(30),
        CheckConstraint("role IN ('CITIZEN', 'VULNERABLE', 'GVMC_ADMIN', 'NDRF_ADMIN', 'FIELD_WORKER', 'SUPER_ADMIN')"),
        default="CITIZEN",
        nullable=False,
        index=True,
    )
    preferred_language: Mapped[str] = mapped_column(
        String(5),
        CheckConstraint("preferred_language IN ('te', 'en', 'hi')"),
        default="te",
        nullable=False,
    )
    fcm_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    # Last Known GPS Location for proximity push notifications
    last_location = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=True)
    last_location_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    vulnerability_profile: Mapped[Optional["VulnerabilityProfile"]] = relationship(
        "VulnerabilityProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    reports: Mapped[List["Report"]] = relationship("Report", back_populates="citizen")
    officer_profile: Mapped[Optional["MunicipalOfficer"]] = relationship(
        "MunicipalOfficer", back_populates="user", uselist=False
    )
    volunteer_application: Mapped[Optional["VolunteerApplication"]] = relationship(
        "VolunteerApplication", back_populates="user", uselist=False
    )
    active_volunteer_profile: Mapped[Optional["ActiveVolunteer"]] = relationship(
        "ActiveVolunteer", back_populates="user", uselist=False
    )


class MunicipalOfficer(Base):
    """
    Municipal Ward Engineers, Sanitation Inspectors, and Electrical Linesmen.
    Tracks live active workload count for balanced ticket assignments.
    """
    __tablename__ = "municipal_officers"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)  # 'OFF-01', 'OFF-02'
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    department: Mapped[str] = mapped_column(
        String(50),
        CheckConstraint("department IN ('Road Infrastructure', 'Drainage & Stormwater', 'Electrical (APEPDCL)', 'Sanitation & Health')"),
        nullable=False,
        index=True,
    )
    ward_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("wards.id", ondelete="SET NULL"), nullable=True, index=True
    )
    ward_display: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    designation: Mapped[str] = mapped_column(String(100), nullable=False)  # 'Assistant Engineer (Civil)'
    phone: Mapped[str] = mapped_column(String(15), nullable=False)
    active_workload_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("status IN ('On Duty', 'On Site', 'Off Duty')"),
        default="On Duty",
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="officer_profile")
    ward: Mapped[Optional["Ward"]] = relationship("Ward", back_populates="officers")
    assigned_tickets: Mapped[List["Ticket"]] = relationship("Ticket", back_populates="assigned_officer")

