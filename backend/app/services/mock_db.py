"""
JanRakshak State Store (In-Memory Pre-Seeded Store).
Provides high-availability operational state for API endpoints.
"""

from typing import List, Dict, Any, Optional
import copy

INITIAL_TICKETS: List[Dict[str, Any]] = [
    {
        "id": "TKT-8902",
        "category": "Pothole & Craters",
        "title": "Severe 15cm Crater on Beach Road",
        "location": "Opposite Lawson’s Bay Colony Arch, Beach Road",
        "coordinates": {"latitude": 17.7412, "longitude": 83.3421},
        "reportedAt": "10:42 AM Today",
        "currentStage": "in_progress",
        "citizenName": "Chukka Satya Teja",
        "citizenPhone": "+91 98480 12345",
        "mergedCount": 3,
        "severity": "Critical",
        "assignedCrew": {
            "workerName": "Srinivas Rao (GVMC Crew 4)",
            "unitId": "GVMC-REPAIR-CREW-04",
            "phone": "+91 94401 23456",
            "checkedInTime": "11:15 AM (On Site)",
        },
        "beforeImageUrl": None,
        "afterImageUrl": None,
    },
    {
        "id": "TKT-8904",
        "category": "Fallen Tree & Power Line",
        "title": "Uprooted Gulmohar & Snapped 11kV Wire",
        "location": "Siripuram Junction to AU In-Gate Feeder Road",
        "coordinates": {"latitude": 17.7291, "longitude": 83.3225},
        "reportedAt": "08:15 AM Today",
        "currentStage": "assigned",
        "citizenName": "K. Venkata Rao",
        "citizenPhone": "+91 94402 33445",
        "mergedCount": 5,
        "severity": "High",
        "assignedCrew": {
            "workerName": "Er. V. Satyanarayana (APEPDCL Line Inspector)",
            "unitId": "APEPDCL-ZONE2-EMERGENCY",
            "phone": "+91 99890 22334",
            "checkedInTime": "08:45 AM (En Route)",
        },
        "beforeImageUrl": None,
        "afterImageUrl": None,
    },
    {
        "id": "TKT-8909",
        "category": "Drainage Block",
        "title": "Overflown Stormwater Culvert Flooding Roadway",
        "location": "Sector 4, MVP Colony Main Canal Road",
        "coordinates": {"latitude": 17.7384, "longitude": 83.3341},
        "reportedAt": "09:05 AM Today",
        "currentStage": "submitted",
        "citizenName": "P. Ramana",
        "citizenPhone": "+91 98850 67890",
        "mergedCount": 2,
        "severity": "High",
        "beforeImageUrl": None,
        "afterImageUrl": None,
    },
]

INITIAL_ELDER_PROFILE: Dict[str, Any] = {
    "id": "ELD-4091",
    "fullName": "Smt. K. Venkatalakshmi",
    "age": 76,
    "ward": "Ward 14 (Coastal Belt)",
    "address": "Door 4-12/A, Sea Breeze Enclave, Near Coastal Battery Road, Visakhapatnam",
    "criticalNeeds": [
        "Wheelchair Bound",
        "Continuous Oxygen Support (5L/min)",
        "Cardiac Medication Schedule",
    ],
    "emergencyContacts": [
        {"name": "Chukka Satya Teja", "relation": "Grandson (Local Guardian)", "phone": "+91 98480 12345"},
        {"name": "Smt. K. Sarojini", "relation": "Daughter", "phone": "+91 94401 98765"},
        {"name": "Ward 14 Emergency Volunteer Desk", "relation": "Community Helpdesk", "phone": "+91 891 2500014"},
    ],
    "floorLevel": "Ground Floor (Surge Threat)",
    "evacuationDifficulty": "High",
    "proximityVolunteerCount": 4,
}

INITIAL_SHELTERS: List[Dict[str, Any]] = [
    {
        "id": "SHELTER-01",
        "name": "Andhra University Indoor Sports Complex Hub",
        "location": "AU South Campus, Siripuram, Visakhapatnam",
        "distanceKm": 1.2,
        "totalCapacity": 1200,
        "currentOccupants": 780,
        "amenities": [
            "125kVA Backup Diesel Generator",
            "RO Purified Water Plant (5000L)",
            "40-Bed Dedicated Medical Triage",
            "Special Senior Care Wing",
        ],
        "medicalOfficer": "Dr. K. S. Rao, MD (Civil Surgeon)",
        "contactNumber": "+91 891 2844000",
        "waterSupplyStatus": "Abundant",
        "generatorStatus": "Operational",
        "safeRouteStatus": "Clear & Elevated",
    },
    {
        "id": "SHELTER-02",
        "name": "GVMC High School Multi-Purpose Cyclone Shelter",
        "location": "Sector 4, MVP Colony, Visakhapatnam",
        "distanceKm": 2.1,
        "totalCapacity": 850,
        "currentOccupants": 620,
        "amenities": [
            "Solar Hybrid Inverter",
            "Emergency Community Kitchen",
            "Wheelchair Ramps",
            "Child Nutrition Corner",
        ],
        "medicalOfficer": "Dr. L. Prabhavathi, MBBS",
        "contactNumber": "+91 891 2568811",
        "waterSupplyStatus": "Abundant",
        "generatorStatus": "Operational",
        "safeRouteStatus": "Caution - Waterlogged",
    },
    {
        "id": "SHELTER-03",
        "name": "Swarna Bharathi Indoor Stadium",
        "location": "Resapuvanipalem, Visakhapatnam",
        "distanceKm": 3.8,
        "totalCapacity": 1400,
        "currentOccupants": 760,
        "amenities": [
            "High-Output Backup Power",
            "Mobile Tanker Water Supply",
            "SDRF First Aid Staging",
            "Ham Radio Comms Post",
        ],
        "medicalOfficer": "Dr. V. Ramanamurthy",
        "contactNumber": "+91 891 2755222",
        "waterSupplyStatus": "Moderate",
        "generatorStatus": "Operational",
        "safeRouteStatus": "Clear & Elevated",
    },
]

INITIAL_HAZARDS: List[Dict[str, Any]] = [
    {
        "id": "HAZ-01",
        "type": "Road Waterlogging",
        "coordinates": {"x": 38, "y": 48},
        "severity": "Extreme",
        "reportedAt": "08:10 AM",
        "recommendedAction": "Avoid Beach Road Lawson's Bay stretch. Sea surge overflowing boundary wall.",
        "isEvacuationRouteImpacted": True,
    },
    {
        "id": "HAZ-02",
        "type": "Fallen High-Tension Wire",
        "coordinates": {"x": 58, "y": 62},
        "severity": "Extreme",
        "reportedAt": "08:24 AM",
        "recommendedAction": "11kV Wire live on Siripuram feeder road. APEPDCL cutting power grid.",
        "isEvacuationRouteImpacted": True,
    },
    {
        "id": "HAZ-03",
        "type": "Uprooted Banyan Tree",
        "coordinates": {"x": 72, "y": 35},
        "severity": "High",
        "reportedAt": "07:50 AM",
        "recommendedAction": "Single lane blocked. NDRF chain saw team clearing trunk.",
        "isEvacuationRouteImpacted": False,
    },
]

INITIAL_VOLUNTEER_APPLICATIONS: List[Dict[str, Any]] = [
    {
        "id": "APP-701",
        "fullName": "K. Sai Kumar",
        "phone": "+91 98480 11990",
        "govtIdType": "Aadhaar",
        "govtIdNumber": "XXXX-XXXX-4912",
        "ward": "Ward 14 (Coastal Belt)",
        "address": "Near Fishermen Colony, Beach Road, Visakhapatnam",
        "skills": ["First Aid & CPR", "Swimming & Water Rescue"],
        "equipmentAvailable": ["Inflatable Raft", "2x Life Jackets"],
        "availability": "Immediate (24x7)",
        "bloodGroup": "O+",
        "status": "APPROVED",
        "appliedAt": "07:45 AM Today",
        "reviewedBy": "Capt. Vikram Singh (NDRF 10th Bn)",
    },
    {
        "id": "APP-702",
        "fullName": "G. Tarun Varma",
        "phone": "+91 94401 77221",
        "govtIdType": "Driving License",
        "govtIdNumber": "AP31-2018-9941",
        "ward": "Ward 12 (Peda Waltair)",
        "address": "Plot 42, Lawson’s Bay Colony, Visakhapatnam",
        "skills": ["4x4 Off-Road Driving", "Chainsaw & Tree Clearing"],
        "equipmentAvailable": ["Mahindra Thar 4x4 with Winch", "Electric Chainsaw"],
        "availability": "Immediate (24x7)",
        "bloodGroup": "B+",
        "status": "PENDING",
        "appliedAt": "08:12 AM Today",
    },
    {
        "id": "APP-703",
        "fullName": "S. Divya Bharathi",
        "phone": "+91 91234 88310",
        "govtIdType": "Aadhaar",
        "govtIdNumber": "XXXX-XXXX-8824",
        "ward": "Ward 18 (AU South Campus)",
        "address": "Staff Quarters Q-12, Andhra University",
        "skills": ["First Aid & CPR", "Medical / Nursing Support"],
        "equipmentAvailable": ["Trauma First Aid Kit", "Portable Pulse Oximeter & BP Monitor"],
        "availability": "Daytime Only",
        "bloodGroup": "A+",
        "status": "PENDING",
        "appliedAt": "08:25 AM Today",
    },
]

INITIAL_ACTIVE_VOLUNTEERS: List[Dict[str, Any]] = [
    {
        "id": "VOL-01",
        "name": "K. Sai Kumar",
        "phone": "+91 98480 11990",
        "ward": "Ward 14",
        "distanceMeters": 140,
        "role": "Ward 14 Youth Wing Captain",
        "equipment": "Folding Stretcher & First Aid Trauma Pack",
        "skills": ["First Aid & CPR", "Swimming & Water Rescue"],
        "status": "En Route",
        "isVerifiedByNDRF": True,
        "assignedIncidentId": "ELD-4091",
        "onboardedBy": "PUBLIC_APPLICATION",
    },
    {
        "id": "VOL-02",
        "name": "P. Venkat & Team (2 members)",
        "phone": "+91 94401 88776",
        "ward": "Ward 14",
        "distanceMeters": 220,
        "role": "Fishermen Community Rescuer",
        "equipment": "Inflatable Raft & Life Jackets",
        "skills": ["Swimming & Water Rescue"],
        "status": "En Route",
        "isVerifiedByNDRF": True,
        "assignedIncidentId": "ELD-4091",
        "onboardedBy": "NDRF_DIRECT_ENTRY",
    },
    {
        "id": "VOL-03",
        "name": "Dr. Archana M.",
        "phone": "+91 91234 44332",
        "ward": "Ward 18",
        "distanceMeters": 310,
        "role": "Resident Medical Officer (PHC)",
        "equipment": "Portable Oxygen Cylinder & BP Monitor",
        "skills": ["Medical / Nursing Support", "First Aid & CPR"],
        "status": "On-Scene",
        "isVerifiedByNDRF": True,
        "assignedIncidentId": "ELD-4091",
        "onboardedBy": "NDRF_DIRECT_ENTRY",
    },
    {
        "id": "VOL-04",
        "name": "T. Nagesh",
        "phone": "+91 97000 66554",
        "ward": "Ward 12",
        "distanceMeters": 450,
        "role": "Civil Defence Volunteer",
        "equipment": "High-Torque 4x4 Bolero for Evacuation",
        "skills": ["4x4 Off-Road Driving"],
        "status": "Available",
        "isVerifiedByNDRF": True,
        "onboardedBy": "NDRF_DIRECT_ENTRY",
    },
]

INITIAL_MUNICIPAL_OFFICERS: List[Dict[str, Any]] = [
    {
        "id": "OFF-01",
        "name": "Er. K. Ramesh Naidu",
        "department": "Road Infrastructure",
        "ward": "Ward 14 (Madhurawada & Coastal)",
        "designation": "Assistant Engineer (Civil)",
        "phone": "+91 94401 55672",
        "activeWorkloadCount": 3,
        "status": "On Site",
    },
    {
        "id": "OFF-02",
        "name": "M. Chenna Rao",
        "department": "Drainage & Stormwater",
        "ward": "Ward 12 & 14",
        "designation": "Sanitation & Drainage Inspector",
        "phone": "+91 98850 11223",
        "activeWorkloadCount": 2,
        "status": "On Duty",
    },
    {
        "id": "OFF-03",
        "name": "V. Satyanarayana",
        "department": "Electrical (APEPDCL)",
        "ward": "Zone 2 (Feeder Grid)",
        "designation": "Section Officer (Lines & Distribution)",
        "phone": "+91 99890 22334",
        "activeWorkloadCount": 4,
        "status": "On Site",
    },
    {
        "id": "OFF-04",
        "name": "Smt. D. Sunitha Kumari",
        "department": "Sanitation & Health",
        "ward": "Ward 18 (Waltair)",
        "designation": "Ward Executive Officer",
        "phone": "+91 94411 77889",
        "activeWorkloadCount": 1,
        "status": "On Duty",
    },
]


class MockDBStore:
    """Thread-safe state repository for the JanRakshak system."""

    def __init__(self):
        self.tickets = copy.deepcopy(INITIAL_TICKETS)
        self.elder_profile = copy.deepcopy(INITIAL_ELDER_PROFILE)
        self.shelters = copy.deepcopy(INITIAL_SHELTERS)
        self.hazards = copy.deepcopy(INITIAL_HAZARDS)
        self.volunteer_applications = copy.deepcopy(INITIAL_VOLUNTEER_APPLICATIONS)
        self.active_volunteers = copy.deepcopy(INITIAL_ACTIVE_VOLUNTEERS)
        self.municipal_officers = copy.deepcopy(INITIAL_MUNICIPAL_OFFICERS)
        self.is_disaster_mode = False


db_store = MockDBStore()
