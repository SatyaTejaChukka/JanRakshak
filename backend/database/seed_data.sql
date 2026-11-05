-- ==============================================================================
-- JanRakshak Initial Seed Data
-- Jurisdiction: Greater Visakhapatnam Municipal Corporation (GVMC) & NDRF 10th Bn
-- Coords: Visakhapatnam Coastal Area (Lat 17.72~17.78, Lon 83.31~83.38)
-- ==============================================================================

-- 1. Insert GVMC Jurisdiction
INSERT INTO jurisdictions (id, code, name, type, boundary, active_mode)
VALUES (
    1,
    'GVMC',
    'Greater Visakhapatnam Municipal Corporation',
    'MUNICIPAL_CORP',
    ST_Multi(ST_GeomFromText('POLYGON((83.25 17.65, 83.42 17.65, 83.42 17.85, 83.25 17.85, 83.25 17.65))', 4326)),
    'NORMAL'
) ON CONFLICT (code) DO NOTHING;

-- 2. Insert Wards
INSERT INTO wards (id, jurisdiction_id, ward_number, ward_name, zone_name, ward_engineer_name, ward_engineer_phone, boundary)
VALUES 
(
    14,
    1,
    14,
    'Ward 14 (Madhurawada & Coastal)',
    'Zone 2',
    'Er. K. Ramesh Naidu',
    '+91 94401 55672',
    ST_Multi(ST_GeomFromText('POLYGON((83.33 17.76, 83.37 17.76, 83.37 17.82, 83.33 17.82, 83.33 17.76))', 4326))
),
(
    12,
    1,
    12,
    'Ward 12 (Peda Waltair & Lawson’s Bay)',
    'Zone 2',
    'M. Chenna Rao',
    '+91 98850 11223',
    ST_Multi(ST_GeomFromText('POLYGON((83.31 17.72, 83.35 17.72, 83.35 17.76, 83.31 17.76, 83.31 17.72))', 4326))
),
(
    18,
    1,
    18,
    'Ward 18 (AU South Campus & Siripuram)',
    'Zone 2',
    'Smt. D. Sunitha Kumari',
    '+91 94411 77889',
    ST_Multi(ST_GeomFromText('POLYGON((83.29 17.71, 83.33 17.71, 83.33 17.74, 83.29 17.74, 83.29 17.71))', 4326))
) ON CONFLICT (jurisdiction_id, ward_number) DO NOTHING;

-- 3. Insert Agencies
INSERT INTO agencies (id, code, name, department_type, emergency_helpline)
VALUES
(1, 'GVMC_CIVIL', 'GVMC Engineering & Road Works', 'CIVIL', '1800 425 0001'),
(2, 'GVMC_DRAINAGE', 'GVMC Stormwater Drainage & Sanitation', 'SANITATION', '1800 425 0002'),
(3, 'APEPDCL', 'AP Eastern Power Distribution Company', 'ELECTRICAL', '1912'),
(4, 'NDRF_10', 'National Disaster Response Force (10th Battalion)', 'DISASTER_RESCUE', '1078')
ON CONFLICT (code) DO NOTHING;

-- 4. Insert Categories
INSERT INTO categories (id, code, name, group_code, base_weight, is_hazard, default_agency_id)
VALUES
(1, 'POTHOLE', 'Pothole & Craters', 'ROAD', 4, false, 1),
(2, 'DRAINAGE_BLOCK', 'Drainage Block', 'DRAINAGE', 5, false, 2),
(3, 'FALLEN_TREE_WIRE', 'Fallen Tree & Power Line', 'ELECTRICAL', 8, true, 3),
(4, 'STREETLIGHT_OUTAGE', 'Streetlight Outage', 'ELECTRICAL', 2, false, 3),
(5, 'STRUCTURAL_CRACK', 'Structural Crack', 'ROAD', 6, false, 1),
(6, 'ELDER_SOS', 'Elder Emergency Evacuation', 'LIFE_SAFETY', 10, true, 4)
ON CONFLICT (code) DO NOTHING;

-- 5. Insert Mode-Adaptive SLA Policies
INSERT INTO sla_policies (category_id, operating_mode, target_resolution_hours, escalation_tier_hours)
VALUES
(1, 'NORMAL', 48, 72),
(1, 'DISASTER', 6, 12),
(2, 'NORMAL', 24, 36),
(2, 'DISASTER', 4, 8),
(3, 'NORMAL', 12, 24),
(3, 'DISASTER', 2, 4),
(6, 'DISASTER', 1, 2)
ON CONFLICT (category_id, operating_mode) DO NOTHING;

-- 6. Insert Municipal Officers
INSERT INTO municipal_officers (id, name, department, ward_id, ward_display, designation, phone, active_workload_count, status)
VALUES
('OFF-01', 'Er. K. Ramesh Naidu', 'Road Infrastructure', 14, 'Ward 14 (Madhurawada & Coastal)', 'Assistant Engineer (Civil)', '+91 94401 55672', 3, 'On Site'),
('OFF-02', 'M. Chenna Rao', 'Drainage & Stormwater', 12, 'Ward 12 & 14', 'Sanitation & Drainage Inspector', '+91 98850 11223', 2, 'On Duty'),
('OFF-03', 'V. Satyanarayana', 'Electrical (APEPDCL)', 14, 'Zone 2 (Feeder Grid)', 'Section Officer (Lines & Distribution)', '+91 99890 22334', 4, 'On Site'),
('OFF-04', 'Smt. D. Sunitha Kumari', 'Sanitation & Health', 18, 'Ward 18 (Waltair)', 'Ward Executive Officer', '+91 94411 77889', 1, 'On Duty')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Cyclone Relief Shelters
INSERT INTO relief_shelters (id, name, location_address, coordinates, ward_id, distance_km, total_capacity, current_occupants, amenities, medical_officer_name, contact_number, water_supply_status, generator_status, safe_route_status)
VALUES
(
    'SHELTER-01',
    'Andhra University Indoor Sports Complex Hub',
    'AU South Campus, Siripuram, Visakhapatnam',
    ST_SetSRID(ST_MakePoint(83.3218, 17.7294), 4326)::geography,
    18,
    1.2,
    1200,
    780,
    '["125kVA Backup Diesel Generator", "RO Purified Water Plant (5000L)", "40-Bed Dedicated Medical Triage", "Special Senior Care Wing"]'::jsonb,
    'Dr. K. S. Rao, MD',
    '+91 891 2844000',
    'Abundant',
    'Operational',
    'Clear & Elevated'
),
(
    'SHELTER-02',
    'GVMC High School Multi-Purpose Cyclone Shelter',
    'Sector 4, MVP Colony, Visakhapatnam',
    ST_SetSRID(ST_MakePoint(83.3340, 17.7380), 4326)::geography,
    14,
    2.1,
    850,
    620,
    '["Solar Hybrid Inverter", "Emergency Community Kitchen", "Wheelchair Ramps", "Child Nutrition Corner"]'::jsonb,
    'Dr. L. Prabhavathi, MBBS',
    '+91 891 2568811',
    'Abundant',
    'Operational',
    'Caution - Waterlogged'
),
(
    'SHELTER-03',
    'Swarna Bharathi Indoor Stadium',
    'Resapuvanipalem, Visakhapatnam',
    ST_SetSRID(ST_MakePoint(83.3050, 17.7280), 4326)::geography,
    12,
    3.8,
    1400,
    760,
    '["High-Output Backup Power", "Mobile Tanker Water Supply", "SDRF First Aid Staging", "Ham Radio Comms Post"]'::jsonb,
    'Dr. V. Ramanamurthy',
    '+91 891 2755222',
    'Moderate',
    'Operational',
    'Clear & Elevated'
)
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Tactical Dispatch Units
INSERT INTO tactical_dispatch_units (id, name, type, status, location_name, current_location, assigned_incident_desc)
VALUES
('UNIT-B01', 'NDRF 10th Bn IRB Boat #04', 'Inflatable Motor Boat (IRB)', 'Deployed', 'Ward 14 Beach Coastal Belt', ST_SetSRID(ST_MakePoint(83.342, 17.741), 4326)::geography, 'Elder SOS Evacuation (ELD-4091)'),
('UNIT-C02', 'Hydraulic Tree & Wire Cutter #02', 'Tree Clearing Crane Unit', 'Deployed', 'Siripuram Junction 11kV Feeder', ST_SetSRID(ST_MakePoint(83.322, 17.729), 4326)::geography, 'Fallen Gulmohar (TKT-8904)'),
('UNIT-M01', 'Disaster Rapid Medical Unit #01', 'Emergency Medical Team', 'Available', 'AU Indoor Stadium Relief Hub', ST_SetSRID(ST_MakePoint(83.321, 17.729), 4326)::geography, 'Standby for triage'),
('UNIT-H01', 'Coast Guard Chetak Helicopter #08', 'Helicopter Air-Drop', 'Available', 'INS Dega Airbase Runway 2', ST_SetSRID(ST_MakePoint(83.220, 17.720), 4326)::geography, 'Ready for offshore sorties')
ON CONFLICT (id) DO NOTHING;

-- 9. Insert Vulnerability Profile (Elderly)
INSERT INTO vulnerability_profiles (id, full_name, age, ward_id, ward_name, address, location, floor_level, evacuation_difficulty, critical_needs, has_power_backup)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'Smt. K. Venkatalakshmi',
    76,
    14,
    'Ward 14 (Coastal Belt)',
    'Door 4-12/A, Sea Breeze Enclave, Near Coastal Battery Road, Visakhapatnam',
    ST_SetSRID(ST_MakePoint(83.3392, 17.7391), 4326)::geography,
    'Ground Floor (Surge Threat)',
    'High',
    '["Wheelchair Bound", "Continuous Oxygen Support (5L/min)", "Cardiac Medication Schedule"]'::jsonb,
    false
) ON CONFLICT (id) DO NOTHING;

-- 10. Insert Emergency Contacts
INSERT INTO emergency_contacts (profile_id, name, relation, phone, priority_order)
VALUES
('d0000000-0000-0000-0000-000000000001', 'Chukka Satya Teja', 'Grandson (Local Guardian)', '+91 98480 12345', 1),
('d0000000-0000-0000-0000-000000000001', 'Smt. K. Sarojini', 'Daughter', '+91 94401 98765', 2),
('d0000000-0000-0000-0000-000000000001', 'Ward 14 Emergency Volunteer Desk', 'Community Helpdesk', '+91 891 2500014', 3);

-- 11. Insert Master Tickets
INSERT INTO tickets (id, ticket_number, category_id, category_name, location, address_text, ward_id, assigned_officer_id, stage, operating_mode, severity, merged_count, is_hazard, before_image_url, after_image_url)
VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'TKT-8902',
    1,
    'Pothole & Craters',
    ST_SetSRID(ST_MakePoint(83.3421, 17.7412), 4326)::geography,
    'Opposite Lawson’s Bay Colony Arch, Beach Road',
    14,
    'OFF-01',
    'in_progress',
    'NORMAL',
    'Critical',
    3,
    false,
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584463699047-9f79e39bf0b9?auto=format&fit=crop&w=600&q=80'
),
(
    'a0000000-0000-0000-0000-000000000002',
    'TKT-8904',
    3,
    'Fallen Tree & Power Line',
    ST_SetSRID(ST_MakePoint(83.3225, 17.7291), 4326)::geography,
    'Siripuram Junction to AU In-Gate Feeder Road',
    18,
    'OFF-03',
    'assigned',
    'DISASTER',
    'High',
    1,
    true,
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    NULL
);

-- 12. Insert Volunteer Applications
INSERT INTO volunteer_applications (id, full_name, phone, govt_id_type, govt_id_number, ward_id, ward_name, address, skills, equipment_available, availability, blood_group, status, reviewed_by)
VALUES
(
    'APP-701',
    'K. Sai Kumar',
    '+91 98480 11990',
    'Aadhaar',
    'XXXX-XXXX-4912',
    14,
    'Ward 14 (Coastal Belt)',
    'Near Fishermen Colony, Beach Road, Visakhapatnam',
    '["First Aid & CPR", "Swimming & Water Rescue"]'::jsonb,
    '["Inflatable Raft", "2x Life Jackets"]'::jsonb,
    'Immediate (24x7)',
    'O+',
    'APPROVED',
    'Capt. Vikram Singh (NDRF 10th Bn)'
),
(
    'APP-702',
    'G. Tarun Varma',
    '+91 94401 77221',
    'Driving License',
    'AP31-2018-9941',
    12,
    'Ward 12 (Peda Waltair)',
    'Plot 42, Lawson’s Bay Colony, Visakhapatnam',
    '["4x4 Off-Road Driving", "Chainsaw & Tree Clearing"]'::jsonb,
    '["Mahindra Thar 4x4 with Winch", "Electric Chainsaw"]'::jsonb,
    'Immediate (24x7)',
    'B+',
    'PENDING',
    NULL
),
(
    'APP-703',
    'S. Divya Bharathi',
    '+91 91234 88310',
    'Aadhaar',
    'XXXX-XXXX-8824',
    18,
    'Ward 18 (AU South Campus)',
    'Staff Quarters Q-12, Andhra University',
    '["First Aid & CPR", "Medical / Nursing Support"]'::jsonb,
    '["Trauma First Aid Kit", "Portable Pulse Oximeter & BP Monitor"]'::jsonb,
    'Daytime Only',
    'A+',
    'PENDING',
    NULL
);

-- 13. Insert Active Volunteers
INSERT INTO active_volunteers (id, application_id, name, phone, ward_id, ward_name, location, distance_meters, role, equipment, skills, status, is_verified_by_ndrf, onboarded_by)
VALUES
(
    'VOL-01',
    'APP-701',
    'K. Sai Kumar',
    '+91 98480 11990',
    14,
    'Ward 14',
    ST_SetSRID(ST_MakePoint(83.3400, 17.7400), 4326)::geography,
    140,
    'Ward 14 Youth Wing Captain',
    'Folding Stretcher & First Aid Trauma Pack',
    '["First Aid & CPR", "Swimming & Water Rescue"]'::jsonb,
    'En Route',
    true,
    'PUBLIC_APPLICATION'
),
(
    'VOL-02',
    NULL,
    'P. Venkat & Team (2 members)',
    '+91 94401 88776',
    14,
    'Ward 14',
    ST_SetSRID(ST_MakePoint(83.3410, 17.7420), 4326)::geography,
    220,
    'Fishermen Community Rescuer',
    'Inflatable Raft & Life Jackets',
    '["Swimming & Water Rescue"]'::jsonb,
    'En Route',
    true,
    'NDRF_DIRECT_ENTRY'
),
(
    'VOL-03',
    NULL,
    'Dr. Archana M.',
    '+91 91234 44332',
    18,
    'Ward 18',
    ST_SetSRID(ST_MakePoint(83.3250, 17.7310), 4326)::geography,
    310,
    'Resident Medical Officer (PHC)',
    'Portable Oxygen Cylinder & BP Monitor',
    '["Medical / Nursing Support", "First Aid & CPR"]'::jsonb,
    'On-Scene',
    true,
    'NDRF_DIRECT_ENTRY'
),
(
    'VOL-04',
    NULL,
    'T. Nagesh',
    '+91 97000 66554',
    12,
    'Ward 12',
    ST_SetSRID(ST_MakePoint(83.3300, 17.7350), 4326)::geography,
    450,
    'Civil Defence Volunteer',
    'High-Torque 4x4 Bolero for Evacuation',
    '["4x4 Off-Road Driving"]'::jsonb,
    'Available',
    true,
    'NDRF_DIRECT_ENTRY'
)
ON CONFLICT (id) DO NOTHING;
