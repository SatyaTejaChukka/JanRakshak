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


def test_aadhaar_otp_generation_and_verification():
    """Verify simulated UIDAI OTP generation, SMS payload, and verification."""
    # 1. Generate OTP
    gen_res = client.post(
        "/api/v1/auth/aadhaar/generate-otp",
        json={
            "aadhaar_number": "4921 8842 1092",
            "mobile_number": "9848012345",
            "full_name": "K. Satyanarayana",
            "ward": "Ward 14 (Madhurawada & Coastal Belt)",
        },
    )
    assert gen_res.status_code == 200
    gen_data = gen_res.json()
    assert gen_data["otp_sent"] is True
    assert gen_data["masked_aadhaar"] == "XXXX-XXXX-1092"
    assert "UIDAI" in gen_data["simulated_sms"]
    client_id = gen_data["client_id"]
    debug_otp = gen_data["debug_otp"]

    # 2. Verify with dynamic OTP
    verify_res = client.post(
        "/api/v1/auth/aadhaar/verify-otp",
        json={
            "client_id": client_id,
            "otp": debug_otp,
            "full_name": "K. Satyanarayana",
        },
    )
    assert verify_res.status_code == 200
    verify_data = verify_res.json()
    assert verify_data["verified"] is True
    assert verify_data["citizen"]["fullName"] == "K. Satyanarayana"
    assert verify_data["citizen"]["isVerified"] is True

    # 3. Verify universal master test code 123456 override
    gen_res2 = client.post(
        "/api/v1/auth/aadhaar/generate-otp",
        json={"aadhaar_number": "8841 2091 5562", "mobile_number": "9123456789"},
    )
    client_id2 = gen_res2.json()["client_id"]
    master_verify_res = client.post(
        "/api/v1/auth/aadhaar/verify-otp",
        json={"client_id": client_id2, "otp": "123456"},
    )
    assert master_verify_res.status_code == 200
    assert master_verify_res.json()["verified"] is True


def test_citizen_registration_and_login_by_mobile_persistence():
    """Ensure citizens who register with their phone number are recognized and logged in under their real identity."""
    test_mobile = "9988776655"
    test_name = "Ravi Teja"
    test_aadhaar = "9988 7766 5544"
    test_ward = "Ward 18 (AU South Campus & Siripuram)"

    # 1. Registration flow
    reg_otp_res = client.post(
        "/api/v1/auth/aadhaar/generate-otp",
        json={
            "full_name": test_name,
            "mobile_number": test_mobile,
            "aadhaar_number": test_aadhaar,
            "ward": test_ward,
        },
    )
    assert reg_otp_res.status_code == 200
    reg_otp_data = reg_otp_res.json()
    reg_otp = reg_otp_data["debug_otp"]
    reg_client_id = reg_otp_data["client_id"]

    reg_verify_res = client.post(
        "/api/v1/auth/aadhaar/verify-otp",
        json={
            "client_id": reg_client_id,
            "otp": reg_otp,
            "full_name": test_name,
            "mobile_number": test_mobile,
            "ward": test_ward,
        },
    )
    assert reg_verify_res.status_code == 200
    citizen = reg_verify_res.json()["citizen"]
    assert citizen["fullName"] == test_name
    assert citizen["mobileNumber"] == f"+91 {test_mobile}"
    assert citizen["aadhaarNumber"] == "XXXX-XXXX-5544"
    assert citizen["ward"] == test_ward

    # 2. Lookup endpoint check
    lookup_res = client.get(f"/api/v1/auth/aadhaar/lookup/{test_mobile}")
    assert lookup_res.status_code == 200
    lookup_data = lookup_res.json()
    assert lookup_data["registered"] is True
    assert lookup_data["citizen"]["fullName"] == test_name

    # 3. Subsequent Login flow with ONLY mobile number (no full_name entered on Login tab)
    login_otp_res = client.post(
        "/api/v1/auth/aadhaar/generate-otp",
        json={
            "mobile_number": test_mobile,
        },
    )
    assert login_otp_res.status_code == 200
    login_otp_data = login_otp_res.json()
    login_client_id = login_otp_data["client_id"]
    login_otp = login_otp_data["debug_otp"]
    assert test_name in login_otp_data["simulated_sms"]

    # Verify login OTP without passing full_name
    login_verify_res = client.post(
        "/api/v1/auth/aadhaar/verify-otp",
        json={
            "client_id": login_client_id,
            "otp": login_otp,
            "mobile_number": test_mobile,
        },
    )
    assert login_verify_res.status_code == 200
    logged_in_citizen = login_verify_res.json()["citizen"]
    # CRITICAL: Must be Ravi Teja, NOT K. Satyanarayana!
    assert logged_in_citizen["fullName"] == test_name
    assert logged_in_citizen["mobileNumber"] == f"+91 {test_mobile}"
    assert logged_in_citizen["aadhaarNumber"] == "XXXX-XXXX-5544"
    assert logged_in_citizen["ward"] == test_ward


def test_official_registration_and_login():
    """Verify that registering a new official administrator preserves their exact name."""
    test_name = "Dr. Satya Teja Chukka"
    test_badge = "GVMC-ADM-999"
    test_email = "satya.teja@gvmc.gov.in"
    test_pin = "8899"

    # 1. Register new official
    reg_res = client.post(
        "/api/v1/auth/official/register",
        json={
            "name": test_name,
            "department": "GVMC_ADMIN",
            "badge_id": test_badge,
            "email": test_email,
            "designation": "Superintending Engineer & Zonal Administrator",
            "pin": test_pin,
        },
    )
    assert reg_res.status_code == 200
    reg_data = reg_res.json()
    assert reg_data["success"] is True
    assert reg_data["officer"]["name"] == test_name
    assert reg_data["officer"]["id"] == test_badge

    # 2. Lookup registered official
    lookup_res = client.get(f"/api/v1/auth/official/lookup/{test_badge}")
    assert lookup_res.status_code == 200
    lookup_data = lookup_res.json()
    assert lookup_data["registered"] is True
    assert lookup_data["officer"]["name"] == test_name

    # 3. Login with registered badge ID and PIN
    login_res = client.post(
        "/api/v1/auth/official/login",
        json={
            "department": "GVMC_ADMIN",
            "identifier": test_badge,
            "pin": test_pin,
        },
    )
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert login_data["success"] is True
    # CRITICAL: Must be Dr. Satya Teja Chukka, NOT Ramesh Naidu!
    assert login_data["officer"]["name"] == test_name
    assert login_data["officer"]["id"] == test_badge


