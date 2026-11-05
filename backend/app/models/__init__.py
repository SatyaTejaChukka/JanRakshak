"""
JanRakshak SQLAlchemy 2.0 ORM Models Registry.
"""

from backend.app.models.base import Base, TimestampMixin
from backend.app.models.jurisdictions import Jurisdiction, Ward, Agency
from backend.app.models.users import User, MunicipalOfficer
from backend.app.models.tickets import (
    Category,
    SLAPolicy,
    Ticket,
    Report,
    Media,
    TicketEvent,
    FieldWorkerCheckin,
)
from backend.app.models.disaster import (
    VulnerabilityProfile,
    EmergencyContact,
    ReliefShelter,
    TacticalDispatchUnit,
    SOSRequest,
    Hazard,
    Alert,
)
from backend.app.models.volunteers import (
    VolunteerApplication,
    ActiveVolunteer,
    SOSResponder,
)

__all__ = [
    "Base",
    "TimestampMixin",
    "Jurisdiction",
    "Ward",
    "Agency",
    "User",
    "MunicipalOfficer",
    "Category",
    "SLAPolicy",
    "Ticket",
    "Report",
    "Media",
    "TicketEvent",
    "FieldWorkerCheckin",
    "VulnerabilityProfile",
    "EmergencyContact",
    "ReliefShelter",
    "TacticalDispatchUnit",
    "SOSRequest",
    "Hazard",
    "Alert",
    "VolunteerApplication",
    "ActiveVolunteer",
    "SOSResponder",
]
