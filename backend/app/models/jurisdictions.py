"""
Jurisdictions, Wards, and Agencies ORM models with PostGIS spatial geometry.
"""

from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry

from backend.app.models.base import Base


class Jurisdiction(Base):
    """
    Municipal Corporation, Highway Authority or Panchayati Raj Body.
    Enforces geographic bounding authority over wards and tickets.
    """
    __tablename__ = "jurisdictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)  # 'GVMC', 'NHAI_AP'
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    type: Mapped[str] = mapped_column(
        String(30),
        CheckConstraint("type IN ('MUNICIPAL_CORP', 'HIGHWAY_AUTHORITY', 'GRAM_PANCHAYAT')"),
        nullable=False,
    )
    # PostGIS MultiPolygon boundary for jurisdictional boundary containment
    boundary = mapped_column(Geometry(geometry_type="MULTIPOLYGON", srid=4326), nullable=False)
    active_mode: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("active_mode IN ('NORMAL', 'DISASTER')"),
        default="NORMAL",
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    wards: Mapped[List["Ward"]] = relationship("Ward", back_populates="jurisdiction", cascade="all, delete-orphan")


class Ward(Base):
    """
    Administrative Ward Polygon within a Municipal Jurisdiction.
    Powers automatic point-in-polygon assignment (ST_Contains).
    """
    __tablename__ = "wards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    jurisdiction_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("jurisdictions.id", ondelete="CASCADE"), nullable=False
    )
    ward_number: Mapped[int] = mapped_column(Integer, nullable=False)
    ward_name: Mapped[str] = mapped_column(String(100), nullable=False)  # 'Ward 14 (Madhurawada & Coastal)'
    zone_name: Mapped[str] = mapped_column(String(100), nullable=False)  # 'Zone 2'
    ward_engineer_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    ward_engineer_phone: Mapped[Optional[str]] = mapped_column(String(15), nullable=True)
    
    # Boundary polygon for ST_Contains point-in-polygon queries
    boundary = mapped_column(Geometry(geometry_type="MULTIPOLYGON", srid=4326), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    jurisdiction: Mapped["Jurisdiction"] = relationship("Jurisdiction", back_populates="wards")
    tickets: Mapped[List["Ticket"]] = relationship("Ticket", back_populates="ward")
    officers: Mapped[List["MunicipalOfficer"]] = relationship("MunicipalOfficer", back_populates="ward")


class Agency(Base):
    """
    Executive Department or Rescue Squad (e.g. GVMC Civil, APEPDCL, NDRF 10th Bn).
    """
    __tablename__ = "agencies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)  # 'GVMC_CIVIL', 'NDRF_10'
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    department_type: Mapped[str] = mapped_column(
        String(50),
        CheckConstraint("department_type IN ('CIVIL', 'ELECTRICAL', 'DISASTER_RESCUE', 'HIGHWAY', 'SANITATION')"),
        nullable=False,
    )
    emergency_helpline: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    categories: Mapped[List["Category"]] = relationship("Category", back_populates="default_agency")
    tickets: Mapped[List["Ticket"]] = relationship("Ticket", back_populates="assigned_agency")

