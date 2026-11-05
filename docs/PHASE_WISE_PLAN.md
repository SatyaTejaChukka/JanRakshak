# JanRakshak — Phase-Wise Development & Progress Tracking Plan

| Attribute | Details |
|:---|:---|
| **Project** | **JanRakshak** (Dual-Mode Civic & Disaster Response Platform) |
| **Document Version** | `1.0.0` (Living Development Tracker) |
| **Last Updated** | November 5, 2026 |
| **Current Project Stage** | **Phase 0: Environment & Project Scaffolding** |
| **Overall Progress** | `5%` (Documentation & Architecture Complete; Scaffolding Initiated) |

---

## 1. Executive Status Dashboard

### 1.1 Progress Summary by Phase

| Phase | Description | Status | Progress | Target Completion |
|:---|:---|:---:|:---:|:---|
| **Phase 0** | Environment, Repo & Project Scaffolding | 🟡 **IN PROGRESS** | `30%` | Sprint Hour 0 – 2 |
| **Phase 1** | Geospatial Database & PostGIS Seeding | ⚪ PENDING | `0%` | Sprint Hour 2 – 4 |
| **Phase 2** | Core Backend Engine & Spatial Deduplication | ⚪ PENDING | `0%` | Sprint Hour 4 – 9 |
| **Phase 3** | Emergency SOS, Twilio SMS & Hazard Navigation | ⚪ PENDING | `0%` | Sprint Hour 9 – 14 |
| **Phase 4** | Frontend Adaptive Dual-Theme & MapLibre UI | ⚪ PENDING | `0%` | Sprint Hour 10 – 17 |
| **Phase 5** | Multi-Role Portals & 5-Stage Verification Lifecycle | ⚪ PENDING | `0%` | Sprint Hour 17 – 21 |
| **Phase 6** | End-to-End Testing & Cyclone Michaung Pitch Simulation | ⚪ PENDING | `0%` | Sprint Hour 21 – 24 |

### 1.2 Visual Milestone Progress
```
[==------------------------------------------------------------------] 5%
Phase 0 [██████░░░░] 30% -> Setting up Monorepo, FastAPI skeleton, Vite React PWA
Phase 1 [░░░░░░░░░░]  0% -> PostGIS migrations & Visakhapatnam GeoJSON seeds
Phase 2 [░░░░░░░░░░]  0% -> 50m ST_DWithin clustering & ST_Contains ward router
Phase 3 [░░░░░░░░░░]  0% -> Elder SOS, Twilio SMS fallback & ORS avoid routing
Phase 4 [░░░░░░░░░░]  0% -> Tailwind dual theme, MapLibre GL, Web Speech SOS
Phase 5 [░░░░░░░░░░]  0% -> Volunteer <500m unmasking & Before/After photo proof
Phase 6 [░░░░░░░░░░]  0% -> Vizag cyclone demo simulation & pitch dry run
```

---

## 2. Tracking Protocol

To keep exact track of where we are at any moment:
* `[ ]` **Pending**: Task defined with requirements, ready to be picked up.
* `[/]` **In Progress**: Currently being coded, debugged, or verified.
* `[x]` **Completed**: Tested, verified, and passing acceptance criteria.

---

## 3. Detailed Phase-by-Phase Plan & Task Breakdown

### Phase 0: Environment & Project Scaffolding
> **Objective:** Establish the clean monorepo folder layout, configure Docker for local PostGIS 16 development, set up the FastAPI backend application boilerplate, and initialize the Vite React TypeScript PWA.

- [x] **0.1 Documentation Foundation**
  - [x] Create Product Requirements Document (`docs/PRD.md`)
  - [x] Create Technical Requirements Document (`docs/TRD.md`)
  - [x] Create Implementation Plan (`docs/IMPLEMENTATION_PLAN.md`)
  - [x] Create Living Phase-Wise Tracker (`docs/PHASE_WISE_PLAN.md`)
- [/] **0.2 Monorepo Structure & Configuration**
  - [ ] Initialize `backend/` and `frontend/` directories
  - [ ] Create root `.gitignore`, `.env.example`, and `README.md`
  - [ ] Create `docker-compose.yml` for PostgreSQL 16 + PostGIS 3.4
- [ ] **0.3 Backend Skeleton Setup**
  - [ ] Setup `backend/requirements.txt` (FastAPI, Uvicorn, SQLAlchemy, GeoAlchemy2, asyncpg, Pydantic v2)
  - [ ] Create `backend/app/main.py` with CORS middleware, health check endpoint (`GET /health`), and OpenAPI tags
  - [ ] Configure `backend/app/core/config.py` for Pydantic environment settings
- [ ] **0.4 Frontend PWA Skeleton Setup**
  - [ ] Initialize Vite + React 18 + TypeScript in `frontend/`
  - [ ] Install and configure Tailwind CSS 3.4 with custom theme tokens
  - [ ] Configure `public/manifest.json` for PWA installation

**Phase 0 Exit Gate:** `docker compose up` brings up PostGIS cleanly, `GET http://localhost:8000/health` returns `{"status": "ok"}`, and `npm run dev` serves the React frontend.

---

### Phase 1: Geospatial Database Foundation & PostGIS Seeding
> **Objective:** Stand up the PostgreSQL + PostGIS schema with all 21 production tables, spatial GiST indexes, and seed real-world administrative boundaries for Visakhapatnam (GVMC Zones and Wards 1 to 20 GeoJSON).

- [ ] **1.1 Database Engine & Async Session**
  - [ ] Configure async SQLAlchemy 2.0 engine in `backend/app/core/database.py`
  - [ ] Set up Alembic migration environment with GeoAlchemy2 spatial type support
- [ ] **1.2 Complete ORM & DDL Models**
  - [ ] Core Identity: `users`, `vulnerability_profiles`, `staff_scopes`
  - [ ] Administrative GIS: `jurisdictions`, `wards`, `agencies`, `routing_rules`
  - [ ] Incidents & Reports: `tickets`, `reports`, `media`, `ticket_events`, `ticket_votes`
  - [ ] Emergency & Hazards: `hazards`, `alerts`, `sos_requests`, `sos_responders`, `rescue_teams`
  - [ ] Edge & Sync: `notifications`, `offline_sync_log`, `sla_policies`
- [ ] **1.3 Spatial Seed Data**
  - [ ] Create GeoJSON boundary dataset for Visakhapatnam (Zone 1 to 5, Wards 1 to 20) in `backend/seeds/gvmc_wards.geojson`
  - [ ] Seed standard issue categories (`POTHOLE`, `FALLEN_TREE`, `WATERLOGGING_SEVERE`, `LIVE_WIRE`, `ELDER_SOS`)
  - [ ] Seed municipal agencies (`GVMC_CIVIL`, `GVMC_DRAINAGE`, `APEPDCL`, `NDRF_10`, `FIRE_SERVICES`)
  - [ ] Seed default SLA policies for Normal vs. Disaster modes
  - [ ] Create automated seeding script (`backend/seeds/seed_db.py`)

**Phase 1 Exit Gate:** All 21 tables created in PostgreSQL with spatial GiST indexes; executing `SELECT count(*) FROM wards;` returns seeded Visakhapatnam wards.

---

### Phase 2: Core Backend Engine & Spatial Deduplication
> **Objective:** Implement the core business logic that turns raw reports into deduplicated master tickets assigned to the correct ward engineer or highway authority.

- [ ] **2.1 Server-Driven Mode Subsystem**
  - [ ] Build `GET /api/v1/config/mode` returning mode, active alert headline, and dynamic action bar
  - [ ] Build `POST /api/v1/admin/mode/toggle` for District Collector disaster mode triggers
- [ ] **2.2 PostGIS Spatial Deduplication Engine**
  - [ ] Implement `dedup_engine.py`: searches active tickets within 50m radius (`ST_DWithin`) in the same category group
  - [ ] Implement dynamic priority score formula:
    $$P = W_{\text{cat}} \times M_{\text{mode}} \times \left(1 + \log_2(1 + N)\right) + V$$
- [ ] **2.3 Ward Boundary & Cross-Agency Auto-Routing**
  - [ ] Implement `routing_engine.py`: resolves ward via `ST_Contains(ward.boundary, Point)`
  - [ ] Implement state/national highway intersection check (auto-routes NH-16 to NHAI / R&B)
- [ ] **2.4 Ticket Intake & Feed APIs**
  - [ ] Build `POST /api/v1/tickets/report`: handles new report, triggers 50m dedup, merges or creates master ticket
  - [ ] Build `GET /api/v1/tickets/feed`: spatial bounding box query, pins SOS in Disaster Mode
  - [ ] Build `POST /api/v1/tickets/{id}/vote`: upvotes and citizen fix verification
  - [ ] Build `POST /api/v1/tickets/{id}/stage`: validates field worker check-in and before/after photos

**Phase 2 Exit Gate:** Unit tests pass for 50m deduplication (two reports 30m apart merge into one master ticket; report 70m away creates a new ticket).

---

### Phase 3: Emergency Dispatch & Hazard Navigation Services
> **Objective:** Deliver life-safety workflows: high-priority Elder SOS queue, offline 2G SMS webhook fallback, OpenRouteService dynamic hazard avoidance, and WebSocket real-time events.

- [ ] **3.1 Senior Citizen SOS Trigger API**
  - [ ] Build `POST /api/v1/sos/trigger`: captures location, fetches frozen vulnerability profile, and enqueues to NDRF
  - [ ] Implement proximity masking logic: masks address on public feeds, unlocks only for responders within 500m
- [ ] **3.2 Offline 2G SMS Webhook Fallback**
  - [ ] Build `POST /api/v1/sos/sms-webhook`: parses incoming Twilio SMS formatted as `SOS|USER_ID|LAT|LNG|VULN|BATTERY`
  - [ ] Injects emergency ticket into database and returns TwiML confirmation SMS
- [ ] **3.3 Dynamic Hazard Avoidance Navigation**
  - [ ] Build `GET /api/v1/hazards/active`: returns buffered polygon GeoJSON (`ST_Buffer`)
  - [ ] Build `POST /api/v1/navigation/route`: queries OpenRouteService with `avoid_polygons` and returns safe detours
- [ ] **3.4 WebSocket Real-Time Event Bus**
  - [ ] Build `WS /api/v1/ws/live`: pushes real-time events (`HAZARD_CREATED`, `SOS_ALERT`, `MODE_SWITCH`, `TICKET_UPDATED`) to connected clients

**Phase 3 Exit Gate:** Navigation route successfully detours around an active fallen tree polygon; sending mock SMS payload creates an active NDRF dispatch queue record.

---

### Phase 4: Frontend Adaptive UI & Interactive Mapping
> **Objective:** Implement the dual-mode citizen interface in React, dynamic theme switching, MapLibre GL mapping with hazard overlays, in-app camera capture, and voice SOS trigger.

- [ ] **4.1 Dynamic CSS Theming Engine**
  - [ ] Define CSS variables for Normal Mode (`#1A56DB` Blue) vs. Disaster Mode (`#DC2626` Red/Slate) in `theme.css`
  - [ ] Implement `ThemeModeContext.tsx` to switch `data-mode` dynamically without page reload
- [ ] **4.2 MapLibre GL Interactive Mapping**
  - [ ] Build `RouteMap.tsx`: renders OpenStreetMap tiles, user GPS pin, ticket pins, and hazard avoidance polygons
  - [ ] Render dynamic route polylines showing safe routes vs. avoided hazard zones
- [ ] **4.3 Citizen Report & Media Capture**
  - [ ] Build `CameraCapture.tsx`: enforces live camera capture with device GPS EXIF metadata (disables gallery upload)
  - [ ] Build `ReportForm.tsx`: mode-adaptive category selection and submission with offline IndexedDB queue
- [ ] **4.4 Accessible Elder SOS Component**
  - [ ] Build `SosButton.tsx`: oversized red button with 5-second cancel countdown
  - [ ] Integrate Web Speech API in `useSpeechSOS.ts`: triggers on voice keywords (*"Help"*, *"Bachao"*, *"Sahayam"*)
  - [ ] Build offline SMS fallback link generator (`sms:GATEWAY?body=SOS|...`)

**Phase 4 Exit Gate:** Toggling mode switches UI theme from Blue to High-Contrast Red instantly; voice command *"Bachao"* initiates the 5-second countdown.

---

### Phase 5: Multi-Role Portals & 5-Stage Verification Lifecycle
> **Objective:** Build dedicated role consoles for Community Volunteers (<500m unmasking), Ward Civil Engineers, Field Workers (before/after photo upload), and NDRF Emergency Dispatchers.

- [ ] **5.1 Community Volunteer Console**
  - [ ] Build `VolunteerFeed.tsx`: shows active SOS alerts within 500m
  - [ ] Build "I Can Help" check-in button: unlocks unmasked street address and displays safe walking route
  - [ ] Status updates: volunteer marks *"Reached Door"* and *"Resident Safe"*
- [ ] **5.2 Municipal Ward Officer Portal**
  - [ ] Build `WardInbox.tsx`: lists tickets filtered by logged-in engineer's ward and category
  - [ ] Build `CantResolveModal.tsx`: requires official written justification and escalates to Collector
- [ ] **5.3 Field Worker Mobile Console**
  - [ ] Build `WorkerCheckIn.tsx`: enforces GPS proximity check (<100m) and uploads mandatory **Before Photo**
  - [ ] Build `WorkerCompletion.tsx`: uploads mandatory **After Photo** to move ticket to `COMPLETED`
- [ ] **5.4 Public 5-Stage Timeline & Citizen Verification**
  - [ ] Build `StageTimeline.tsx`: visual tracker (Considered $\rightarrow$ Assigned $\rightarrow$ WIP $\rightarrow$ Completed $\rightarrow$ Verified)
  - [ ] Build `VerificationVote.tsx`: prompt for citizens to vote "Fixed" or "Not Fixed"
- [ ] **5.5 NDRF Emergency Command Board**
  - [ ] Build `DispatcherQueue.tsx`: priority-sorted queue with medical/mobility context, live battery, and assigned boat units

**Phase 5 Exit Gate:** Field worker cannot complete ticket without uploading an after-photo; volunteer >500m away sees masked data, which unmasks when within 500m upon check-in.

---

### Phase 6: End-to-End Testing & Cyclone Michaung Pitch Simulation
> **Objective:** Run a full-cycle simulation of a category-4 cyclone hitting Visakhapatnam, seed realistic data, and rehearse the 3-minute stage pitch for hackathon judges.

- [ ] **6.1 Seed Realistic Demo Scenario (Visakhapatnam)**
  - [ ] Seed Ward 18 (Waltair) routine potholes for Normal Mode demonstration
  - [ ] Seed Cyclone Michaung disaster alert covering GVMC coastal zones
  - [ ] Seed Madhurawada banyan tree roadblock on NH-16 (for 50m dedup and highway handoff demo)
  - [ ] Seed Beach Road flood hazard zone (for dynamic navigation avoidance detour demo)
  - [ ] Seed Grandma Kameswari Devi (82, wheelchair, ground floor) SOS alert in Pedda Waltair
- [ ] **6.2 Automated End-to-End Test Suite**
  - [ ] Test report creation $\rightarrow$ 50m merge $\rightarrow$ priority escalation
  - [ ] Test mode toggle $\rightarrow$ UI theme swap $\rightarrow$ WebSocket broadcast
  - [ ] Test SOS trigger $\rightarrow$ NDRF queue appearance $\rightarrow$ volunteer proximity unmasking
- [ ] **6.3 Deployment & Production Polish**
  - [ ] Deploy backend to Render / Google Cloud Run with warm-up script
  - [ ] Deploy frontend PWA to Vercel with HTTPS
- [ ] **6.4 Pitch Presentation Dry Run**
  - [ ] Rehearse 30-second elevator pitch
  - [ ] Rehearse 3-minute stage pitch script with live two-device demonstration

**Phase 6 Exit Gate:** Seamless 3-minute live pitch executed without errors: Normal pothole report $\rightarrow$ Collector mode switch $\rightarrow$ 50m tree merge $\rightarrow$ Flood detour navigation $\rightarrow$ 7-minute Elder SOS rescue.

---

## 4. Current Work in Progress & Immediate Next Steps

```
=================================================================================
CURRENT STAGE: Phase 0 (Environment, Repo & Project Scaffolding)
CURRENT FOCUS:
  1. Initialize monorepo directories: backend/ and frontend/
  2. Create docker-compose.yml with PostGIS 16 image
  3. Create backend/requirements.txt and main.py FastAPI app
  4. Create frontend/ with Vite React 18 + TypeScript + Tailwind CSS
=================================================================================
```

