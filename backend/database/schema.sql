-- ==============================================================================
-- JanRakshak Database Schema DDL
-- Platform: PostgreSQL 16 + PostGIS 3.4 Extension
-- Spatial Reference System: EPSG:4326 (WGS 84)
-- ==============================================================================

-- 1. Enable Spatial and Cryptographic Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- DOMAIN 1: JURISDICTIONS, WARDS & AGENCIES
-- ==============================================================================

-- 1. Jurisdictions (Municipal Corporations & Highway Authorities)
CREATE TABLE IF NOT EXISTS jurisdictions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,       -- 'GVMC', 'VMC', 'GHMC', 'NHAI_AP'
    name VARCHAR(150) NOT NULL,             -- 'Greater Visakhapatnam Municipal Corporation'
    type VARCHAR(30) NOT NULL CHECK (type IN ('MUNICIPAL_CORP', 'HIGHWAY_AUTHORITY', 'GRAM_PANCHAYAT')),
    boundary GEOMETRY(MultiPolygon, 4326) NOT NULL,
    active_mode VARCHAR(20) DEFAULT 'NORMAL' CHECK (active_mode IN ('NORMAL', 'DISASTER')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_jurisdictions_boundary ON jurisdictions USING GIST (boundary);

-- 2. Wards (Administrative Ward Polygons for Point-in-Polygon Routing)
CREATE TABLE IF NOT EXISTS wards (
    id SERIAL PRIMARY KEY,
    jurisdiction_id INT REFERENCES jurisdictions(id) ON DELETE CASCADE,
    ward_number INT NOT NULL,
    ward_name VARCHAR(100) NOT NULL,        -- 'Ward 14 (Madhurawada & Coastal)'
    zone_name VARCHAR(100) NOT NULL,        -- 'Zone 2'
    ward_engineer_name VARCHAR(100),
    ward_engineer_phone VARCHAR(15),
    boundary GEOMETRY(MultiPolygon, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (jurisdiction_id, ward_number)
);
CREATE INDEX IF NOT EXISTS idx_wards_boundary ON wards USING GIST (boundary);
CREATE INDEX IF NOT EXISTS idx_wards_jurisdiction ON wards (jurisdiction_id);

-- 3. Agencies (Executive Departments & Squads)
CREATE TABLE IF NOT EXISTS agencies (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,       -- 'GVMC_CIVIL', 'APEPDCL', 'NDRF_10', 'FIRE_SERVICES'
    name VARCHAR(150) NOT NULL,
    department_type VARCHAR(50) NOT NULL CHECK (department_type IN ('CIVIL', 'ELECTRICAL', 'DISASTER_RESCUE', 'HIGHWAY', 'SANITATION')),
    emergency_helpline VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- DOMAIN 2: IDENTITY, RBAC & MUNICIPAL OFFICERS
-- ==============================================================================

-- 4. Users (Unified Identity for Citizens, Admins, NDRF & Field Workers)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE,
    phone VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120),
    role VARCHAR(30) DEFAULT 'CITIZEN' CHECK (role IN (
        'CITIZEN', 'VULNERABLE', 'GVMC_ADMIN', 'NDRF_ADMIN', 'FIELD_WORKER', 'SUPER_ADMIN'
    )),
    preferred_language VARCHAR(5) DEFAULT 'te' CHECK (preferred_language IN ('te', 'en', 'hi')),
    fcm_token TEXT,
    last_location GEOGRAPHY(Point, 4326),
    last_location_at TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_last_location ON users USING GIST (last_location);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);

-- 5. Municipal Officers (GVMC Ward Engineers & Section Officers Workload)
CREATE TABLE IF NOT EXISTS municipal_officers (
    id VARCHAR(32) PRIMARY KEY,              -- 'OFF-01', 'OFF-02'
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL CHECK (department IN (
        'Road Infrastructure', 'Drainage & Stormwater', 'Electrical (APEPDCL)', 'Sanitation & Health'
    )),
    ward_id INT REFERENCES wards(id) ON DELETE SET NULL,
    ward_display VARCHAR(100),              -- 'Ward 14 (Madhurawada & Coastal)'
    designation VARCHAR(100) NOT NULL,      -- 'Assistant Engineer (Civil)'
    phone VARCHAR(15) NOT NULL,
    active_workload_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'On Duty' CHECK (status IN ('On Duty', 'On Site', 'Off Duty')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_municipal_officers_ward ON municipal_officers (ward_id);
CREATE INDEX IF NOT EXISTS idx_municipal_officers_dept ON municipal_officers (department);

-- ==============================================================================
-- DOMAIN 3: CIVIC DEFECTS & 50M SPATIAL DEDUPLICATION
-- ==============================================================================

-- 6. Issue Categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,       -- 'POTHOLE', 'DRAINAGE_BLOCK', 'FALLEN_TREE_WIRE', 'STREETLIGHT_OUTAGE', 'STRUCTURAL_CRACK', 'ELDER_SOS'
    name VARCHAR(100) NOT NULL,
    group_code VARCHAR(30) NOT NULL,        -- 'ROAD', 'DRAINAGE', 'ELECTRICAL', 'LIFE_SAFETY'
    base_weight INT DEFAULT 1 CHECK (base_weight BETWEEN 1 AND 10),
    is_hazard BOOLEAN DEFAULT FALSE,
    disaster_only BOOLEAN DEFAULT FALSE,
    default_agency_id INT REFERENCES agencies(id)
);

-- 7. SLA Policies (Mode-Adaptive)
CREATE TABLE IF NOT EXISTS sla_policies (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    operating_mode VARCHAR(20) NOT NULL CHECK (operating_mode IN ('NORMAL', 'DISASTER')),
    target_resolution_hours INT NOT NULL,
    escalation_tier_hours INT NOT NULL,
    UNIQUE (category_id, operating_mode)
);

-- 8. Tickets (Master Aggregated Work Orders)
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(32) UNIQUE NOT NULL, -- 'TKT-8902'
    category_id INT REFERENCES categories(id),
    category_name VARCHAR(100) NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    address_text TEXT NOT NULL,
    ward_id INT REFERENCES wards(id) ON DELETE SET NULL,
    assigned_agency_id INT REFERENCES agencies(id) ON DELETE SET NULL,
    assigned_officer_id VARCHAR(32) REFERENCES municipal_officers(id) ON DELETE SET NULL,
    stage VARCHAR(30) DEFAULT 'submitted' CHECK (stage IN (
        'submitted', 'deduplicated', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected'
    )),
    operating_mode VARCHAR(20) DEFAULT 'NORMAL' CHECK (operating_mode IN ('NORMAL', 'DISASTER')),
    severity VARCHAR(20) DEFAULT 'Medium' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    priority_score FLOAT DEFAULT 1.0,
    merged_count INT DEFAULT 1,
    is_hazard BOOLEAN DEFAULT FALSE,
    before_image_url TEXT,
    after_image_url TEXT,
    sla_due_at TIMESTAMPTZ,
    assigned_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tickets_location ON tickets USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_tickets_stage ON tickets (stage);
CREATE INDEX IF NOT EXISTS idx_tickets_ward ON tickets (ward_id, stage);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_officer ON tickets (assigned_officer_id);

-- 9. Reports (Individual Citizen Submissions Clustered via ST_DWithin 50m)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    citizen_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    citizen_name VARCHAR(100),
    citizen_phone VARCHAR(15),
    description TEXT,
    reported_location GEOGRAPHY(Point, 4326) NOT NULL,
    gps_accuracy_meters FLOAT,
    submitted_image_url TEXT,
    distance_to_master_meters FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reports_ticket_id ON reports (ticket_id);
CREATE INDEX IF NOT EXISTS idx_reports_location ON reports USING GIST (reported_location);

-- 10. Media (Geotagged Proof Documents)
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('CITIZEN_SUBMISSION', 'BEFORE_WORK', 'AFTER_WORK', 'QUALITY_AUDIT')),
    storage_path TEXT NOT NULL,
    captured_location GEOGRAPHY(Point, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_media_ticket ON media (ticket_id, purpose);

-- 11. Ticket Events (Immutable Audit Log & Stage History)
CREATE TABLE IF NOT EXISTS ticket_events (
    id BIGSERIAL PRIMARY KEY,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,        -- 'CREATED', 'DEDUPLICATED', 'OFFICER_ASSIGNED', 'CREW_CHECKIN', 'RESOLVED', 'AUDIT_APPROVED', 'AUDIT_REJECTED'
    from_stage VARCHAR(30),
    to_stage VARCHAR(30),
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ticket_events ON ticket_events (ticket_id, created_at ASC);

-- 12. Field Worker Check-Ins (GPS Verified Geofence Clock-In)
CREATE TABLE IF NOT EXISTS field_worker_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    worker_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    worker_name VARCHAR(100) NOT NULL,
    unit_id VARCHAR(50) NOT NULL,           -- 'GVMC-REPAIR-CREW-04'
    phone VARCHAR(15) NOT NULL,
    checkin_location GEOGRAPHY(Point, 4326) NOT NULL,
    distance_to_defect_meters FLOAT NOT NULL,
    is_within_geofence BOOLEAN NOT NULL DEFAULT TRUE,
    checkin_time TIMESTAMPTZ DEFAULT NOW(),
    checkout_time TIMESTAMPTZ,
    after_work_photo_url TEXT
);
CREATE INDEX IF NOT EXISTS idx_field_checkins_ticket ON field_worker_checkins (ticket_id);

-- ==============================================================================
-- DOMAIN 4: DISASTER & EMERGENCY LIFE-SAFETY
-- ==============================================================================

-- 13. Vulnerability Profiles (Elderly & High-Need Registry)
CREATE TABLE IF NOT EXISTS vulnerability_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL CHECK (age >= 0),
    ward_id INT REFERENCES wards(id) ON DELETE SET NULL,
    ward_name VARCHAR(100),
    address TEXT NOT NULL,
    location GEOGRAPHY(Point, 4326),
    floor_level VARCHAR(20) DEFAULT 'Ground Floor',
    evacuation_difficulty VARCHAR(20) DEFAULT 'High' CHECK (evacuation_difficulty IN ('Low', 'Medium', 'High')),
    critical_needs JSONB DEFAULT '[]'::jsonb, -- ['Oxygen Concentrator', 'Wheelchair', 'Dialysis Twice Weekly']
    has_power_backup BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vulnerability_location ON vulnerability_profiles USING GIST (location);

-- 14. Emergency Contacts (Chain of Kin for Offline SMS)
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id SERIAL PRIMARY KEY,
    profile_id UUID REFERENCES vulnerability_profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    relation VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    priority_order INT DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_profile ON emergency_contacts (profile_id);

-- 15. Cyclone Relief Shelters
CREATE TABLE IF NOT EXISTS relief_shelters (
    id VARCHAR(32) PRIMARY KEY,              -- 'SHELTER-01'
    name VARCHAR(150) NOT NULL,
    location_address TEXT NOT NULL,
    coordinates GEOGRAPHY(Point, 4326) NOT NULL,
    ward_id INT REFERENCES wards(id) ON DELETE SET NULL,
    distance_km FLOAT DEFAULT 0.0,
    total_capacity INT NOT NULL,
    current_occupants INT DEFAULT 0,
    amenities JSONB DEFAULT '[]'::jsonb,
    medical_officer_name VARCHAR(100),
    contact_number VARCHAR(15) NOT NULL,
    water_supply_status VARCHAR(20) DEFAULT 'Abundant' CHECK (water_supply_status IN ('Abundant', 'Moderate', 'Critical')),
    generator_status VARCHAR(20) DEFAULT 'Operational' CHECK (generator_status IN ('Operational', 'Standby', 'Offline')),
    safe_route_status VARCHAR(30) DEFAULT 'Clear & Elevated' CHECK (safe_route_status IN ('Clear & Elevated', 'Caution - Waterlogged', 'Inaccessible')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_relief_shelters_coord ON relief_shelters USING GIST (coordinates);

-- 16. Tactical Dispatch Units (NDRF 10th Bn & Coast Guard)
CREATE TABLE IF NOT EXISTS tactical_dispatch_units (
    id VARCHAR(32) PRIMARY KEY,              -- 'UNIT-B01', 'UNIT-C02'
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'Inflatable Motor Boat (IRB)', 'Tree Clearing Crane Unit', 'Emergency Medical Team', 'Helicopter Air-Drop'
    )),
    status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Deployed', 'Available', 'Refueling', 'Maintenance')),
    location_name VARCHAR(150) NOT NULL,
    current_location GEOGRAPHY(Point, 4326),
    assigned_incident_desc TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Emergency SOS Requests (Distress Signals)
CREATE TABLE IF NOT EXISTS sos_requests (
    id VARCHAR(32) PRIMARY KEY,              -- 'ELD-4091'
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    profile_id UUID REFERENCES vulnerability_profiles(id) ON DELETE SET NULL,
    channel VARCHAR(20) DEFAULT 'ONE_TAP_PANIC' CHECK (channel IN ('VOICE_TRIGGER', 'ONE_TAP_PANIC', '2G_SMS', 'MANUAL_DISPATCH')),
    location GEOGRAPHY(Point, 4326) NOT NULL,
    address_text TEXT NOT NULL,
    ward_id INT REFERENCES wards(id) ON DELETE SET NULL,
    battery_percentage INT,
    assigned_unit_id VARCHAR(32) REFERENCES tactical_dispatch_units(id) ON DELETE SET NULL,
    destination_shelter_id VARCHAR(32) REFERENCES relief_shelters(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'TRIGGERED' CHECK (status IN (
        'TRIGGERED', 'ACKNOWLEDGED', 'VOLUNTEER_EN_ROUTE', 'RESCUE_IN_PROGRESS', 'EVACUATED_TO_SHELTER', 'CANCELLED'
    )),
    priority VARCHAR(20) DEFAULT 'CRITICAL' CHECK (priority IN ('HIGH', 'CRITICAL', 'EXTREME')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_sos_requests_location ON sos_requests USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_sos_requests_status ON sos_requests (status);

-- 18. Hazards (Roadblock Polygons for Safe Route Avoidance)
CREATE TABLE IF NOT EXISTS hazards (
    id VARCHAR(32) PRIMARY KEY,              -- 'HAZ-01'
    ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'Road Waterlogging', 'Fallen High-Tension Wire', 'Uprooted Banyan Tree', 'Embankment Breach', 'Debris Barrier'
    )),
    polygon GEOMETRY(Polygon, 4326) NOT NULL,
    center_point GEOGRAPHY(Point, 4326) NOT NULL,
    severity VARCHAR(20) DEFAULT 'High' CHECK (severity IN ('Moderate', 'High', 'Extreme')),
    recommended_action TEXT NOT NULL,
    is_evacuation_route_impacted BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    cleared_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_hazards_polygon ON hazards USING GIST (polygon);
CREATE INDEX IF NOT EXISTS idx_hazards_center ON hazards USING GIST (center_point);
CREATE INDEX IF NOT EXISTS idx_hazards_active ON hazards (is_active);

-- 19. Alerts (IMD Weather & Coastal Surge Warning Polygons)
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    source VARCHAR(50) DEFAULT 'IMD Cyclone Warning Centre Visakhapatnam',
    alert_level VARCHAR(20) NOT NULL CHECK (alert_level IN ('YELLOW', 'ORANGE', 'RED')),
    headline VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    affected_polygon GEOMETRY(MultiPolygon, 4326) NOT NULL,
    projected_surge_meters FLOAT,
    max_wind_gust_kmh INT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_alerts_polygon ON alerts USING GIST (affected_polygon);

-- ==============================================================================
-- DOMAIN 5: CIVILIAN VOLUNTEER CORPS & COMMUNITY MOBILIZATION
-- ==============================================================================

-- 20. Volunteer Applications (Submitted via Disaster Portal Form)
CREATE TABLE IF NOT EXISTS volunteer_applications (
    id VARCHAR(32) PRIMARY KEY,              -- 'APP-701'
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    govt_id_type VARCHAR(30) NOT NULL CHECK (govt_id_type IN ('Aadhaar', 'Voter ID', 'Driving License')),
    govt_id_number VARCHAR(50) NOT NULL,
    ward_id INT REFERENCES wards(id) ON DELETE SET NULL,
    ward_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    equipment_available JSONB NOT NULL DEFAULT '[]'::jsonb,
    availability VARCHAR(30) NOT NULL CHECK (availability IN ('Immediate (24x7)', 'Daytime Only', 'Standby')),
    blood_group VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_by VARCHAR(100),
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_vol_apps_status ON volunteer_applications (status);
CREATE INDEX IF NOT EXISTS idx_vol_apps_phone ON volunteer_applications (phone);

-- 21. Active Volunteers (Corps Roster Vetted by NDRF / Fast-Track)
CREATE TABLE IF NOT EXISTS active_volunteers (
    id VARCHAR(32) PRIMARY KEY,              -- 'VOL-01'
    application_id VARCHAR(32) REFERENCES volunteer_applications(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    ward_id INT REFERENCES wards(id) ON DELETE SET NULL,
    ward_name VARCHAR(100) NOT NULL,
    location GEOGRAPHY(Point, 4326),
    distance_meters INT,
    role VARCHAR(100) NOT NULL,              -- 'Fishermen Community Rescuer', 'Civil Defence Volunteer'
    equipment TEXT NOT NULL,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'En Route', 'On-Scene', 'Standby')),
    is_verified_by_ndrf BOOLEAN DEFAULT TRUE,
    assigned_incident_id VARCHAR(32) REFERENCES sos_requests(id) ON DELETE SET NULL,
    onboarded_by VARCHAR(30) DEFAULT 'PUBLIC_APPLICATION' CHECK (onboarded_by IN ('PUBLIC_APPLICATION', 'NDRF_DIRECT_ENTRY')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_active_vol_location ON active_volunteers USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_active_vol_status ON active_volunteers (status);
CREATE INDEX IF NOT EXISTS idx_active_vol_incident ON active_volunteers (assigned_incident_id);

-- 22. SOS Responders (Deployment & Dispatch Link Records)
CREATE TABLE IF NOT EXISTS sos_responders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sos_request_id VARCHAR(32) REFERENCES sos_requests(id) ON DELETE CASCADE,
    volunteer_id VARCHAR(32) REFERENCES active_volunteers(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'EN_ROUTE' CHECK (status IN ('EN_ROUTE', 'ON_SITE', 'COMPLETED', 'ABORTED')),
    distance_meters_at_acceptance INT,
    dispatched_at TIMESTAMPTZ DEFAULT NOW(),
    arrived_at TIMESTAMPTZ,
    UNIQUE (sos_request_id, volunteer_id)
);
CREATE INDEX IF NOT EXISTS idx_sos_responders_req ON sos_responders (sos_request_id);
CREATE INDEX IF NOT EXISTS idx_sos_responders_vol ON sos_responders (volunteer_id);

