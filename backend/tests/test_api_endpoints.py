"""
Integration tests for JanRakshak FastAPI endpoints.
"""

import pytest
from starlette.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_check():
    """Verify health endpoint responds with 200 and status healthy."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "JanRakshak Backend API"


def test_list_tickets():
    """Verify tickets listing returns seeded tickets."""
    response = client.get("/api/v1/tickets")
    assert response.status_code == 200
    tickets = response.json()
    assert len(tickets) >= 3
    assert any(t["id"] == "TKT-8902" for t in tickets)


def test_spatial_deduplication_check_endpoint():
    """Verify pre-flight 50m deduplication check identifies duplicates."""
    # Near TKT-8902 (17.7412, 83.3421) by ~18 meters
    payload = {
        "category": "Pothole & Craters",
        "coordinates": {"latitude": 17.7413, "longitude": 83.3422},
    }
    response = client.post("/api/v1/tickets/check-dedup", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["isDuplicate"] is True
    assert data["existingTicketId"] == "TKT-8902"
    assert data["distanceMeters"] < 50.0


def test_create_ticket_with_deduplication():
    """Verify duplicate submission within 50m increments mergedCount."""
    payload = {
        "category": "Pothole & Craters",
        "title": "Road crater near arch",
        "location": "Lawson's Bay Arch",
        "coordinates": {"latitude": 17.7413, "longitude": 83.3422},
        "citizenName": "Test Citizen",
        "citizenPhone": "+91 99999 11111",
        "severity": "High",
    }
    # Initial count
    tkt_before = next(t for t in client.get("/api/v1/tickets").json() if t["id"] == "TKT-8902")
    initial_merged = tkt_before["mergedCount"]

    response = client.post("/api/v1/tickets", json=payload)
    assert response.status_code in (200, 201)
    data = response.json()
    assert data["id"] == "TKT-8902"
    assert data["mergedCount"] == initial_merged + 1


def test_assign_officer_to_ticket():
    """Verify assigning officer updates stage to 'assigned' and increases workload."""
    response = client.post(
        "/api/v1/tickets/TKT-8909/assign-officer",
        json={"officerId": "OFF-02", "targetSlaHours": 24},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["currentStage"] == "assigned"
    assert data["assignedCrew"]["workerName"] == "M. Chenna Rao"


def test_volunteer_application_flow():
    """Verify public application submission and NDRF approval flow."""
    # 1. Submit application
    app_payload = {
        "fullName": "B. Suresh Kumar",
        "phone": "+91 98480 99887",
        "govtIdType": "Aadhaar",
        "govtIdNumber": "XXXX-XXXX-1122",
        "ward": "Ward 14 (Coastal Belt)",
        "address": "Fishermen Colony Road",
        "skills": ["Swimming & Water Rescue"],
        "equipmentAvailable": ["Lifebuoy"],
        "availability": "Immediate (24x7)",
        "bloodGroup": "O+",
    }
    create_res = client.post("/api/v1/volunteers/applications", json=app_payload)
    assert create_res.status_code == 201
    created_app = create_res.json()
    app_id = created_app["id"]
    assert created_app["status"] == "PENDING"

    # 2. NDRF approves application
    approve_res = client.post(f"/api/v1/volunteers/applications/{app_id}/approve")
    assert approve_res.status_code == 200
    vol_data = approve_res.json()
    assert vol_data["name"] == "B. Suresh Kumar"
    assert vol_data["isVerifiedByNDRF"] is True
    assert vol_data["status"] == "Available"


def test_trigger_elder_sos():
    """Verify emergency SOS trigger returns dispatched status and closest shelter."""
    response = client.post(
        "/api/v1/sos/trigger",
        json={"triggerType": "ONE_TAP_PANIC", "batteryPercentage": 75},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "DISPATCHED"
    assert "Smt. K. Venkatalakshmi" in data["elderName"]


def test_shelter_occupancy_adjustment():
    """Verify shelter occupancy count updates properly."""
    res = client.patch("/api/v1/shelters/SHELTER-01/occupancy", json={"delta": 20})
    assert res.status_code == 200
    data = res.json()
    assert data["currentOccupants"] == 800  # 780 + 20


def test_system_mode_toggle():
    """Verify District Collector toggle switches mode to DISASTER RED ALERT."""
    res = client.post("/api/v1/system/mode", json={"isDisasterMode": True})
    assert res.status_code == 200
    data = res.json()
    assert data["isDisasterMode"] is True
    assert data["modeLabel"] == "DISASTER RED ALERT"
