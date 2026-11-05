# JanRakshak — Technical Requirements Document (TRD)

| Document Attribute | Details |
|:---|:---|
| **System Name** | **JanRakshak** (CivicPulse) Technical Architecture |
| **Document Version** | `1.0.0` (Production & Hackathon Baseline) |
| **Status** | Approved for Development |
| **Primary Frameworks** | React 18 (PWA), Python FastAPI 0.110+, PostgreSQL 16 + PostGIS 3.4 |
| **Target Infrastructure** | Supabase, Render / Google Cloud Run, Vercel |
| **Author** | Principal Systems Architect |
| **Date** | November 2026 |

---

## 1. System Architecture & High-Level Design

JanRakshak follows an asynchronous, cloud-native 3-tier architecture with a central geospatial engine.

```
+----------------------------------------------------------------------------------------------------+
|                                           CLIENT TIER                                              |
|  +---------------------------+  +---------------------------+  +--------------------------------+  |
|  | Citizen & Vulnerable PWA  |  | Community Volunteer View  |  | Staff / Dispatcher Dashboard   |  |
|  | (React 18 + Vite + TS)    |  | (MapLibre GL + Geofire)   |  | (TanStack Table + Charts)      |  |
|  +---------------------------+  +---------------------------+  +--------------------------------+  |
|                                                |                                                   |
|                                                +-------------------+                               |
|                                                                    v                               |
|                                                       [Service Worker / IndexedDB]                 |
|                                                       (Offline Queue & Cache)                      |
+----------------------------------------------------------------------------------------------------+
                                      |                       ^
                      HTTPS / REST    |                       | WebSocket Live Events
                                      v                       |
+----------------------------------------------------------------------------------------------------+
|                                      API & APPLICATION TIER                                        |
|                                       (Python FastAPI 0.110+)                                      |
|                                                                                                    |
|  +------------------+  +------------------+  +------------------+  +----------------------------+  |
|  | Auth & Security  |  | Deduplication    |  | Ward Auto-Router |  | Mode Controller            |  |
|  | (Firebase JWT)   |  | (50m Radius)     |  | (ST_Contains)    |  | (Server-Driven Tokens)     |  |
|  +------------------+  +------------------+  +------------------+  +----------------------------+  |
|  +------------------+  +------------------+  +------------------+  +----------------------------+  |
|  | Elder SOS Engine |  | Hazard Avoidance |  | Stage Lifecycle  |  | Notification Hub           |  |
|  | (NDRF Priority)  |  | (ORS Avoidance)  |  | (5-Stage Proof)  |  | (FCM & Twilio SMS)         |  |
|  +------------------+  +------------------+  +------------------+  +----------------------------+  |
+----------------------------------------------------------------------------------------------------+
                   |                            |                            |
                   v                            v                            v
+-------------------------------+  +--------------------------+  +-----------------------------------+
|      DATABASE TIER            |  |     AI & SPATIAL ENGINE  |  |     EXTERNAL INTEGRATIONS         |
| PostgreSQL 16 + PostGIS 3.4   |  | Google Gemini 1.5 Flash  |  | Firebase Cloud Messaging (FCM)    |
| (GiST spatial indexes)        |  | (Multimodal Vision Proof)|  | Twilio SMS Webhook Gateway        |
| Supabase S3 Object Storage    |  | OpenRouteService (ORS)   |  | OpenStreetMap Tile Servers (OSM)  |
| (Signed Before/After URLs)    |  | (Direction API Avoidance)|  | IMD Alert Ingestion Feeds         |
+-------------------------------+  +--------------------------+  +-----------------------------------+
```

---

## 2. Technology Stack & Technical Justifications

| Tier / Component | Technology Choice | Version | Justification & Selection Criteria |
|:---|:---|:---|:---|
| **Frontend Framework** | **React + Vite + TypeScript** | `React 18.3`, `Vite 5.2` | Single codebase for PWA across Android, iOS, and Desktop. Instant build speed, high type safety. |
| **Styling & Theming** | **Tailwind CSS + CSS Variables** | `Tailwind 3.4` | Enables instant zero-overhead theme switching (`data-mode="normal"` vs `data-mode="disaster"`). |
| **Map Rendering** | **MapLibre GL JS** | `MapLibre 4.1` | Hardware-accelerated WebGL vector mapping; open-source, no Mapbox token limits or commercial tracking. |
| **Backend Framework** | **Python FastAPI** | `FastAPI 0.110+` | Native asynchronous I/O (`async`/`await`), automatic OpenAPI docs (`/docs`), Pydantic v2 data validation. |
| **Database & GIS** | **PostgreSQL + PostGIS** | `PG 16`, `PostGIS 3.4` | Industry-standard spatial operations (`ST_DWithin`, `ST_Contains`, `ST_Buffer`) with GiST indexing. |
| **ORM / Query Engine** | **SQLAlchemy + GeoAlchemy2** | `SQLAlchemy 2.0 Async` | Full async ORM with native support for PostGIS Geometry and Geography data types. |
| **Object Storage** | **Supabase Storage (S3)** | Latest | Pre-signed upload URLs for geotagged before-and-after photo evidence without loading API server memory. |
| **Authentication** | **Firebase Auth** | `v10.11+` | Seamless Phone OTP sign-in with SMS verification; backend verifies cryptographically signed Firebase JWTs. |
| **Push Notifications** | **Firebase Cloud Messaging** | `FCM v1` | Instant device notifications for 2 km radius hazard alerts and mode transitions. |
| **Navigation & Routing**| **OpenRouteService API** | `v2 API` | Provides out-of-the-box `avoid_polygons` parameter to compute multi-modal routes avoiding flood/hazard zones. |
| **Multimodal AI** | **Google Gemini 1.5 Flash** | Latest | Zero-shot image classification to verify complaint photo authenticity and summarize SOS medical triage notes. |
| **Telephony / SMS** | **Twilio Programmable SMS** | Latest | Inbound HTTP webhook to translate 2G SMS distress messages into real-time database tickets during net blackouts. |

---

## 3. Detailed Database Schema (PostgreSQL 16 + PostGIS 3.4)

The database schema consists of **21 specialized tables** organized around the central `tickets` entity.

### 3.1 DDL Schema Definitions

```sql
-- Enable PostGIS and UUID Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS: User Accounts & Roles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(30) DEFAULT 'CITIZEN' CHECK (role IN (
        'CITIZEN', 'VULNERABLE', 'RESPONDER', 'WARD_OFFICER', 'FIELD_WORKER', 'DISPATCHER', 'SUPER_ADMIN'
    )),
    preferred_language VARCHAR(5) DEFAULT 'te' CHECK (preferred_language IN ('te', 'en', 'hi')),
    fcm_token TEXT,
    last_location GEOGRAPHY(Point, 4326),
    last_location_at TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_last_location ON users USING GIST (last_location);
CREATE INDEX idx_users_role ON users (role);

-- 2. VULNERABILITY_PROFILES: Senior & Differently-Abled Metadata
CREATE TABLE vulnerability_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age INT NOT NULL CHECK (age >= 0),
    mobility_status VARCHAR(50) NOT NULL CHECK (mobility_status IN ('WHEELCHAIR', 'BEDRIDDEN', 'WALKER', 'INDEPENDENT')),
    medical_notes TEXT,
    floor_level INT DEFAULT 0, -- 0 = Ground Floor (Severe drowning risk)
    has_power_backup BOOLEAN DEFAULT FALSE,
    trusted_contact_name VARCHAR(100),
    trusted_contact_phone VARCHAR(15),
    consent_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 3. JURISDICTIONS: Municipal Bodies & Authorities
CREATE TABLE jurisdictions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,     -- 'GVMC', 'VMC', 'GHMC', 'NHAI_AP'
    name VARCHAR(150) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('MUNICIPAL_CORP', 'HIGHWAY_AUTHORITY', 'GRAM_PANCHAYAT')),
    boundary GEOMETRY(MultiPolygon, 4326) NOT NULL,
    active_mode VARCHAR(20) DEFAULT 'NORMAL' CHECK (active_mode IN ('NORMAL', 'DISASTER')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_jurisdictions_boundary ON jurisdictions USING GIST (boundary);

-- 4. WARDS: Administrative Ward Polygons
CREATE TABLE wards (
    id SERIAL PRIMARY KEY,
    jurisdiction_id INT REFERENCES jurisdictions(id) ON DELETE CASCADE,
    ward_number INT NOT NULL,
    zone_name VARCHAR(100) NOT NULL,       -- 'Zone 2 Madhurawada'
    ward_engineer_name VARCHAR(100),
    ward_engineer_phone VARCHAR(15),
    boundary GEOMETRY(MultiPolygon, 4326) NOT NULL,
    UNIQUE (jurisdiction_id, ward_number)
);
CREATE INDEX idx_wards_boundary ON wards USING GIST (boundary);

-- 5. AGENCIES: Departments & Rescue Squads
CREATE TABLE agencies (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,     -- 'GVMC_CIVIL', 'APEPDCL', 'NDRF_10', 'FIRE_SERVICES'
    name VARCHAR(150) NOT NULL,
    department_type VARCHAR(50) NOT NULL CHECK (department_type IN ('CIVIL', 'ELECTRICAL', 'DISASTER_RESCUE', 'HIGHWAY', 'SANITATION')),
    emergency_helpline VARCHAR(20)
);

-- 6. CATEGORIES: Issue Classification Matrix
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,     -- 'POTHOLE', 'FALLEN_TREE', 'WATERLOGGING_SEVERE', 'LIVE_WIRE', 'ELDER_SOS'
    name VARCHAR(100) NOT NULL,
    group_code VARCHAR(30) NOT NULL,      -- 'ROAD', 'ELECTRICAL', 'DRAINAGE', 'LIFE_SAFETY'
    base_weight INT DEFAULT 1 CHECK (base_weight BETWEEN 1 AND 10),
    is_hazard BOOLEAN DEFAULT FALSE,
    disaster_only BOOLEAN DEFAULT FALSE,
    default_agency_id INT REFERENCES agencies(id)
);

-- 7. SLA_POLICIES: SLA Targets by Mode
CREATE TABLE sla_policies (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    operating_mode VARCHAR(20) NOT NULL CHECK (operating_mode IN ('NORMAL', 'DISASTER')),
    target_resolution_hours INT NOT NULL,
    escalation_tier_hours INT NOT NULL,
    UNIQUE (category_id, operating_mode)
);

-- 8. ROUTING_RULES: Cross-Agency Dispatch Matrix
CREATE TABLE routing_rules (
    id SERIAL PRIMARY KEY,
    jurisdiction_id INT REFERENCES jurisdictions(id),
    category_id INT REFERENCES categories(id),
    is_national_highway BOOLEAN DEFAULT FALSE,
    assigned_agency_id INT REFERENCES agencies(id),
    priority_level INT DEFAULT 1
);

-- 9. TICKETS: Master Aggregated Incident Tickets
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(32) UNIQUE NOT NULL,
    category_id INT REFERENCES categories(id),
    category_group VARCHAR(30) NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    ward_id INT REFERENCES wards(id),
    assigned_agency_id INT REFERENCES agencies(id),
    assigned_officer_id UUID REFERENCES users(id),
    stage VARCHAR(30) DEFAULT 'CONSIDERED' CHECK (stage IN (
        'CONSIDERED', 'ASSIGNED_STAFF', 'WORK_IN_PROGRESS', 'COMPLETED', 'CANT_RESOLVE'
    )),
    operating_mode VARCHAR(20) DEFAULT 'NORMAL' CHECK (operating_mode IN ('NORMAL', 'DISASTER')),
    priority_score FLOAT DEFAULT 1.0,
    affected_count INT DEFAULT 1,
    is_hazard BOOLEAN DEFAULT FALSE,
    sla_due_at TIMESTAMPTZ,
    cant_resolve_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);
CREATE INDEX idx_tickets_location ON tickets USING GIST (location);
CREATE INDEX idx_tickets_stage_priority ON tickets (stage, priority_score DESC);
CREATE INDEX idx_tickets_ward ON tickets (ward_id, stage);

-- 10. REPORTS: Individual Citizen Submissions
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    client_submission_id VARCHAR(64) UNIQUE,
    description TEXT,
    reported_location GEOGRAPHY(Point, 4326) NOT NULL,
    gps_accuracy_meters FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_reports_ticket_id ON reports (ticket_id);

-- 11. MEDIA: Geotagged Photographic Proof
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES users(id),
    purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('REPORT', 'BEFORE_WORK', 'AFTER_WORK')),
    storage_path TEXT NOT NULL,
    captured_location GEOGRAPHY(Point, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_media_ticket ON media (ticket_id, purpose);

-- 12. TICKET_EVENTS: Immutable Audit Trail
CREATE TABLE ticket_events (
    id BIGSERIAL PRIMARY KEY,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    from_stage VARCHAR(30),
    to_stage VARCHAR(30),
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ticket_events ON ticket_events (ticket_id, created_at ASC);

-- 13. TICKET_VOTES: Upvotes & Citizen Verification
CREATE TABLE ticket_votes (
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vote_type VARCHAR(20) NOT NULL CHECK (vote_type IN ('AFFECTED_ME', 'FIX_VERIFIED', 'FIX_REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (ticket_id, user_id, vote_type)
);

-- 14. HAZARDS: Navigation Roadblock Exclusion Zones
CREATE TABLE hazards (
    id SERIAL PRIMARY KEY,
    ticket_id UUID UNIQUE REFERENCES tickets(id) ON DELETE CASCADE,
    polygon GEOMETRY(Polygon, 4326) NOT NULL,
    severity VARCHAR(30) NOT NULL CHECK (severity IN ('PARTIAL_BLOCK', 'TOTAL_BLOCK', 'DEEP_WATER', 'ELECTRICAL_HAZARD')),
    blocks_pedestrians BOOLEAN DEFAULT FALSE,
    blocks_two_wheelers BOOLEAN DEFAULT TRUE,
    blocks_four_wheelers BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_hazards_polygon ON hazards USING GIST (polygon);
CREATE INDEX idx_hazards_active ON hazards (is_active);

-- 15. ALERTS: Weather & Disaster Geo-Broadcasts
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    external_source VARCHAR(50),
    alert_level VARCHAR(20) NOT NULL CHECK (alert_level IN ('YELLOW', 'ORANGE', 'RED')),
    hazard_type VARCHAR(50) NOT NULL,
    headline VARCHAR(200) NOT NULL,
    description TEXT,
    affected_area GEOMETRY(MultiPolygon, 4326) NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_alerts_affected_area ON alerts USING GIST (affected_area);

-- 16. SOS_REQUESTS: Life-Safety Emergency Signals
CREATE TABLE sos_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID UNIQUE REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    channel VARCHAR(20) DEFAULT 'APP' CHECK (channel IN ('APP', 'VOICE_TRIGGER', 'OFFLINE_SMS')),
    vulnerability_snapshot JSONB NOT NULL,
    battery_percentage INT CHECK (battery_percentage BETWEEN 0 AND 100),
    live_location GEOGRAPHY(Point, 4326) NOT NULL,
    assigned_rescue_team_id INT,
    status VARCHAR(30) DEFAULT 'DISPATCHED' CHECK (status IN (
        'DISPATCHED', 'RESPONDER_EN_ROUTE', 'REACHED', 'EVACUATED', 'CANCELLED'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_sos_location ON sos_requests USING GIST (live_location);
CREATE INDEX idx_sos_status ON sos_requests (status);

-- 17. SOS_RESPONDERS: Volunteer Check-In Records
CREATE TABLE sos_responders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sos_request_id UUID REFERENCES sos_requests(id) ON DELETE CASCADE,
    responder_id UUID REFERENCES users(id),
    status VARCHAR(30) DEFAULT 'EN_ROUTE' CHECK (status IN ('EN_ROUTE', 'ON_SITE', 'COMPLETED', 'ABORTED')),
    distance_meters_at_acceptance FLOAT,
    accepted_at TIMESTAMPTZ DEFAULT NOW(),
    arrived_at TIMESTAMPTZ,
    UNIQUE (sos_request_id, responder_id)
);

-- 18. RESCUE_TEAMS: Official NDRF & Fire Squads
CREATE TABLE rescue_teams (
    id SERIAL PRIMARY KEY,
    agency_id INT REFERENCES agencies(id),
    team_code VARCHAR(50) UNIQUE NOT NULL,
    leader_name VARCHAR(100),
    contact_phone VARCHAR(15),
    vehicle_type VARCHAR(50) CHECK (vehicle_type IN ('INFLATABLE_BOAT', 'RESCUE_TRUCK', 'AMBULANCE')),
    current_location GEOGRAPHY(Point, 4326),
    is_available BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. STAFF_SCOPES: Field Worker Jurisdictions
CREATE TABLE staff_scopes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agency_id INT REFERENCES agencies(id),
    ward_id INT REFERENCES wards(id),
    role_title VARCHAR(100)
);

-- 20. NOTIFICATIONS: Broadcast Log
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('FCM_PUSH', 'SMS', 'IN_APP')),
    delivery_status VARCHAR(20) DEFAULT 'SENT',
    sent_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications (user_id, sent_at DESC);

-- 21. OFFLINE_SYNC_LOG: Edge Sync Prevention
CREATE TABLE offline_sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_device_id VARCHAR(100) NOT NULL,
    client_submission_id VARCHAR(64) UNIQUE NOT NULL,
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    processed_status VARCHAR(20) NOT NULL
);
```

---

## 4. Core Algorithms & SQL Queries

### 4.1 PostGIS 50-Metre Deduplication Engine
```sql
-- Search for active candidate tickets within 50 metres in the same category group
SELECT t.id, t.ticket_number, t.affected_count, t.priority_score
FROM tickets t
WHERE t.stage NOT IN ('COMPLETED', 'CANT_RESOLVE')
  AND t.category_group = :incoming_category_group
  AND t.created_at >= NOW() - INTERVAL '24 HOURS'
  AND ST_DWithin(t.location, ST_SetSRID(ST_Point(:lng, :lat), 4326)::geography, 50.0)
ORDER BY ST_Distance(t.location, ST_SetSRID(ST_Point(:lng, :lat), 4326)::geography) ASC
LIMIT 1;
```

### 4.2 Polygon-Based Ward & Zone Resolution
```sql
-- Mathematically resolve administrative ward and zone from GPS pin
SELECT w.id AS ward_id, w.ward_number, w.zone_name, w.jurisdiction_id
FROM wards w
WHERE ST_Contains(w.boundary, ST_SetSRID(ST_Point(:lng, :lat), 4326))
LIMIT 1;
```

### 4.3 2 km Hazard Radius Push Target Query
```sql
-- Query FCM tokens of citizens within 2 km of a newly detected road hazard
SELECT u.id, u.fcm_token
FROM users u
WHERE u.fcm_token IS NOT NULL
  AND u.last_location IS NOT NULL
  AND ST_DWithin(u.last_location, ST_SetSRID(ST_Point(:hazard_lng, :hazard_lat), 4326)::geography, 2000.0);
```

### 4.4 Hazard Buffer Polygon Generation
```sql
-- Generates a 25-metre geographic avoidance buffer around a roadblock coordinate
INSERT INTO hazards (ticket_id, polygon, severity)
VALUES (
    :ticket_id,
    ST_Transform(
        ST_Buffer(
            ST_Transform(ST_SetSRID(ST_Point(:lng, :lat), 4326), 3857),
            25 -- 25 metre radius buffer
        ),
        4326
    ),
    :severity
);
```

---

## 5. REST & WebSocket API Specification

### 5.1 Endpoint Routing Overview

| Module | HTTP Method | Route Path | Authorization |
|:---|:---|:---|:---|
| **System** | `GET` | `/api/v1/config/mode` | Public |
| **System** | `POST` | `/api/v1/admin/mode/toggle` | `SUPER_ADMIN` |
| **Auth** | `POST` | `/api/v1/auth/sync` | Authenticated |
| **Profiles** | `GET`, `PUT` | `/api/v1/users/vulnerability-profile` | Authenticated |
| **Tickets** | `POST` | `/api/v1/tickets/report` | Authenticated |
| **Tickets** | `GET` | `/api/v1/tickets/feed` | Public |
| **Tickets** | `POST` | `/api/v1/tickets/{id}/stage` | `FIELD_WORKER`, `WARD_OFFICER` |
| **Tickets** | `POST` | `/api/v1/tickets/{id}/vote` | Authenticated |
| **SOS** | `POST` | `/api/v1/sos/trigger` | Authenticated |
| **SOS** | `POST` | `/api/v1/sos/sms-webhook` | Twilio Signature |
| **SOS** | `POST` | `/api/v1/sos/{id}/respond` | `RESPONDER` |
| **Navigation**| `POST` | `/api/v1/navigation/route` | Public |
| **Hazards** | `GET` | `/api/v1/hazards/active` | Public |
| **Realtime** | `WS` | `/api/v1/ws/live` | Authenticated |

### 5.2 SMS Webhook Protocol (Offline 2G Fallback)
When cellular internet fails, the client triggers an SMS intent:
* **Target:** Twilio Central Gateway Number
* **Format:** `SOS|<USER_ID>|<LAT>|<LNG>|<VULNERABILITY_CODE>|<BATTERY_PCT>`
* **Sample Payload:** `SOS|7f8b3c10|17.7215|83.3150|WHEELCHAIR_GFLOOR|24`
* **Backend Processing:**
  1. Webhook endpoint parses string tokens.
  2. Creates a record in `tickets` (`category_code='ELDER_SOS'`, `operating_mode='DISASTER'`).
  3. Inserts record into `sos_requests` with `channel='OFFLINE_SMS'`.
  4. Returns Twilio TwiML confirmation SMS to resident.

---

## 6. Security, Privacy & Access Control (RBAC)

### 6.1 RBAC Enforcement Matrix

```python
# FastAPI Dependency Guard Implementation
from fastapi import Depends, HTTPException, status
from app.core.security import get_current_user

def require_roles(allowed_roles: list[str]):
    def role_checker(current_user = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Required roles {allowed_roles}"
            )
        return current_user
    return role_checker
```

### 6.2 Proximity Privacy Guardrails (Senior PII Protection)
To protect elderly residents from exploitation during chaos:
1. `GET /api/v1/sos/feed` returns cryptographically masked strings (`"Elderly Resident (82), Ground Floor, Wheelchair"`).
2. The endpoint `POST /api/v1/sos/{id}/respond` executes a spatial check:
   $$D = \text{ST\_Distance}(\text{responder\_gps}, \text{senior\_gps}) \le 500\text{ metres}$$
3. If $D \le 500\text{ m}$ AND responder is authenticated with verified identity, the unmasked street address, door number, and telephone number are returned in the response payload.

---

## 7. Observability, Deployment & Infrastructure

### 7.1 Dockerized Service Deployment
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:secret@db:5432/janrakshak
      - FIREBASE_CREDENTIALS=/secrets/firebase.json
      - OPENROUTESERVICE_KEY=${ORS_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - db
  db:
    image: postgis/postgis:16-3.4
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=janrakshak
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secret
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

