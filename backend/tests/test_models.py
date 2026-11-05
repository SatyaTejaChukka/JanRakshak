"""
Unit tests verifying SQLAlchemy ORM model table definitions, columns, and relationships.
"""

import pytest
from backend.app.models import (
    Base,
    Jurisdiction,
    Ward,
    Agency,
    User,
    MunicipalOfficer,
    Category,
    SLAPolicy,
    Ticket,
    Report,
    Media,
    TicketEvent,
    FieldWorkerCheckin,
    VulnerabilityProfile,
    EmergencyContact,
    ReliefShelter,
    TacticalDispatchUnit,
    SOSRequest,
    Hazard,
    Alert,
    VolunteerApplication,
    ActiveVolunteer,
    SOSResponder,
)


def test_models_registry_completeness():
    """Verify all 22 required domain entities are registered under Base.metadata."""
    table_names = set(Base.metadata.tables.keys())
    expected_tables = {
        "jurisdictions",
        "wards",
        "agencies",
        "users",
        "municipal_officers",
        "categories",
        "sla_policies",
        "tickets",
        "reports",
        "media",
        "ticket_events",
        "field_worker_checkins",
        "vulnerability_profiles",
        "emergency_contacts",
        "relief_shelters",
        "tactical_dispatch_units",
        "sos_requests",
        "hazards",
        "alerts",
        "volunteer_applications",
        "active_volunteers",
        "sos_responders",
    }
    assert expected_tables.issubset(table_names), f"Missing tables: {expected_tables - table_names}"


def test_spatial_columns_configured():
    """Verify spatial geometry and geography columns exist with proper SRID (4326)."""
    # Tickets location
    ticket_table = Base.metadata.tables["tickets"]
    assert "location" in ticket_table.columns
    loc_type = str(ticket_table.columns["location"].type).lower().replace(" ", "")
    assert loc_type == "geography(point,4326)"

    # Wards boundary
    ward_table = Base.metadata.tables["wards"]
    assert "boundary" in ward_table.columns
    boundary_type = str(ward_table.columns["boundary"].type).lower().replace(" ", "")
    assert boundary_type == "geometry(multipolygon,4326)"

    # Hazards polygon
    hazard_table = Base.metadata.tables["hazards"]
    assert "polygon" in hazard_table.columns
    polygon_type = str(hazard_table.columns["polygon"].type).lower().replace(" ", "")
    assert polygon_type == "geometry(polygon,4326)"


def test_relationships_bidirectional():
    """Verify foreign key relationships have matching back_populates."""
    # User <-> Reports
    assert hasattr(User, "reports")
    assert hasattr(Report, "citizen")

    # Ticket <-> Reports
    assert hasattr(Ticket, "reports")
    assert hasattr(Report, "ticket")

    # MunicipalOfficer <-> Ticket
    assert hasattr(MunicipalOfficer, "assigned_tickets")
    assert hasattr(Ticket, "assigned_officer")

    # VolunteerApplication <-> ActiveVolunteer
    assert hasattr(VolunteerApplication, "active_volunteer_record")
    assert hasattr(ActiveVolunteer, "application")

    # SOSRequest <-> SOSResponder
    assert hasattr(SOSRequest, "responders")
    assert hasattr(SOSResponder, "sos_request")


if __name__ == "__main__":
    test_models_registry_completeness()
    test_spatial_columns_configured()
    test_relationships_bidirectional()
    print("All SQLAlchemy ORM schema & relationship validation checks passed successfully!")
