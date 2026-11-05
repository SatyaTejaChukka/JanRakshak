# JanRakshak — Implementation Plan

| Document Attribute | Details |
|:---|:---|
| **Project** | **JanRakshak** (CivicPulse) Dual-Mode Platform |
| **Document Version** | `1.0.0` (Production & Hackathon Execution Plan) |
| **Execution Window** | 24-Hour Hackathon Sprint / 4-Week Production Sprint |
| **Team Distribution** | 3 to 4 Engineers (Frontend Lead, Backend/GIS Lead, Full-Stack / Integrations) |
| **Target Deployment** | Supabase (PostGIS), Render / Cloud Run (FastAPI), Vercel (React PWA) |
| **Date** | November 2026 |

---

## 1. Implementation Strategy & Architecture Milestones

JanRakshak is designed to be built incrementally using a contract-first approach. Because both frontend and backend rely on strict geospatial calculations, development is divided into 7 distinct sequential phases:

```
+-------------------------------------------------------------------------------------------------------+
|  PHASE 0: Repo Scaffolding & Tooling (Hours 0 - 2)                                                    |
|  - Setup Monorepo (frontend/ & backend/), Docker Compose with PostGIS 16, Vite PWA, ESLint/Black      |
+-------------------------------------------------------------------------------------------------------+
                                                   |
                                                   v
+-------------------------------------------------------------------------------------------------------+
|  PHASE 1: Database & Geospatial Seeding (Hours 2 - 4)                                                 |
|  - PostGIS extensions, DDL schema creation, Visakhapatnam Wards (Zone 1-5 GeoJSON), Category Matrix   |
+-------------------------------------------------------------------------------------------------------+
                                                   |
                                                   v
+-------------------------------------------------------------------------------------------------------+
|  PHASE 2: Core Backend Engine & Deduplication (Hours 4 - 9)                                           |
|  - FastAPI app, 50m ST_DWithin clustering, ST_Contains ward routing, Dynamic priority formula         |
+-------------------------------------------------------------------------------------------------------+
                                                   |
                                                   v
+-------------------------------------------------------------------------------------------------------+
|  PHASE 3: Emergency Services & Hazard Navigation (Hours 9 - 14)                                       |
|  - SOS trigger API, Twilio offline SMS webhook, OpenRouteService avoid_polygons, WebSocket hub        |
+-------------------------------------------------------------------------------------------------------+
                                                   |
                                                   v
+-------------------------------------------------------------------------------------------------------+
|  PHASE 4: Frontend Dual-Theme & Map Implementation (Hours 10 - 17)                                    |
|  - Server-driven UI tokens (Blue vs Red), MapLibre GL JS vector maps, Web Speech voice trigger        |
+-------------------------------------------------------------------------------------------------------+
                                                   |
                                                   v
+-------------------------------------------------------------------------------------------------------+
|  PHASE 5: Role Portals & 5-Stage Verification (Hours 17 - 21)                                         |
|  - Citizen reporting with camera, Volunteer <500m proximity unmasking, Ward officer before/after proof|
+-------------------------------------------------------------------------------------------------------+
                                                   |
                                                   v
+-------------------------------------------------------------------------------------------------------+
|  PHASE 6: End-to-End Simulation & Pitch Polish (Hours 21 - 24)                                        |
|  - Cyclone Michaung scenario rehearsal, zero-lag demo scripts, deployment to Vercel and Cloud Run     |
+-------------------------------------------------------------------------------------------------------+
```

---

## 2. Work Breakdown Structure (WBS) & Deliverables

| Task ID | Component | Task Description & Deliverable | Primary File Target | Dependencies |
|:---|:---|:---|:---|:---|
| **WBS-01** | **Infra** | Initialize Monorepo, `docker-compose.yml`, Python virtualenv, and Vite React boilerplate. | `docker-compose.yml`, `package.json` | None |
| **WBS-02** | **Database** | Create PostGIS tables via Alembic migrations (all 21 tables, GiST indexes, foreign keys). | `backend/migrations/` | WBS-01 |
| **WBS-03** | **Database** | Seed Visakhapatnam administrative boundaries (GVMC Zones, Wards 1 to 20 GeoJSON) and default agencies. | `backend/seeds/gvmc_wards.geojson`, `seeds.py` | WBS-02 |
| **WBS-04** | **Backend** | Build Server-Driven Mode Controller (`GET /config/mode` & `POST /admin/mode/toggle`). | `backend/app/api/v1/config.py` | WBS-02 |
| **WBS-05** | **Backend** | Implement 50-metre spatial deduplication service (`ST_DWithin`) & priority scoring formula. | `backend/app/services/dedup_engine.py` | WBS-03 |
| **WBS-06** | **Backend** | Implement Ward Auto-Routing (`ST_Contains`) and Highway Handoff filter (NHAI/R&B). | `backend/app/services/routing_engine.py` | WBS-03 |
| **WBS-07** | **Backend** | Build Ticket Ingestion Endpoint (`POST /tickets/report`) with auto-merge and audit trail logging. | `backend/app/api/v1/tickets.py` | WBS-05, WBS-06 |
| **WBS-08** | **Backend** | Build Senior Citizen SOS Trigger API & Twilio Inbound SMS Webhook for 2G network fallback. | `backend/app/api/v1/sos.py` | WBS-02 |
| **WBS-09** | **Backend** | Implement Dynamic Hazard Avoidance Navigation API wrapping OpenRouteService `avoid_polygons`. | `backend/app/services/ors_service.py` | WBS-02 |
| **WBS-10** | **Backend** | Set up WebSocket event bus for real-time dispatch map, SOS alert broadcasts, and mode switching. | `backend/app/api/v1/websocket.py` | WBS-04 |
| **WBS-11** | **Frontend** | Implement CSS variable dual-theme engine (`data-mode="normal"` vs `"disaster"`) in Tailwind. | `frontend/src/styles/theme.css` | WBS-01 |
| **WBS-12** | **Frontend** | Build MapLibre GL JS interactive map component with dynamic hazard exclusion layers. | `frontend/src/components/navigation/RouteMap.tsx` | WBS-11 |
| **WBS-13** | **Frontend** | Build Citizen Camera Capture component with live GPS EXIF metadata attachment. | `frontend/src/components/tickets/CameraCapture.tsx` | WBS-11 |
| **WBS-14** | **Frontend** | Build High-Contrast Elder SOS button with 5-second countdown and Web Speech voice trigger. | `frontend/src/components/sos/SosButton.tsx` | WBS-11 |
| **WBS-15** | **Frontend** | Build Community Volunteer Proximity Console (<500m unmasking & "I Can Help" check-in). | `frontend/src/pages/VolunteerFeed.tsx` | WBS-12, WBS-14 |
| **WBS-16** | **Frontend** | Build 5-Stage Verification Timeline & Staff Before/After photo comparison screen. | `frontend/src/pages/TicketDetail.tsx` | WBS-07 |
| **WBS-17** | **Frontend** | Build NDRF Emergency Dispatch Command Board with priority-sorted rescue boat queues. | `frontend/src/pages/AdminDashboard.tsx` | WBS-08, WBS-10 |
| **WBS-18** | **QA & Demo** | Seed Cyclone Michaung test scenario (Madhurawada tree, Beach Road flood, Pedda Waltair SOS). | `backend/seeds/demo_scenario.py` | All |

---

## 3. 24-Hour Hackathon Sprint Schedule

```
+=======================================================================================================+
| HOURS 00:00 - 04:00 | SKELETON SETUP & SPATIAL FOUNDATION                                            |
+-------------------------------------------------------------------------------------------------------+
| Frontend Lead   : Setup React 18 + Vite PWA, configure Tailwind dual-theme CSS variables.            |
| Backend Lead    : Initialize FastAPI, configure asyncpg, run PostGIS migrations (all 21 tables).     |
| Full-Stack Lead : Prepare Visakhapatnam Wards GeoJSON (GVMC Zone 1-5) and OpenRouteService accounts.  |
+=======================================================================================================+
| HOURS 04:00 - 10:00 | CORE BUSINESS LOGIC & DEDUPLICATION                                             |
+-------------------------------------------------------------------------------------------------------+
| Frontend Lead   : Mount MapLibre GL JS, build Citizen Home layout with mode-adaptive action bars.     |
| Backend Lead    : Implement `ST_Contains` ward resolver, 50m `ST_DWithin` deduplication, and formula. |
| Full-Stack Lead : Implement Ticket Ingestion endpoint (`POST /tickets/report`) and Firebase Auth.     |
+=======================================================================================================+
| HOURS 10:00 - 16:00 | EMERGENCY SOS, MAPS & AVOIDANCE NAVIGATION                                      |
+-------------------------------------------------------------------------------------------------------+
| Frontend Lead   : Build One-Tap SOS button, voice recognition listener ("Bachao"), and offline SMS.  |
| Backend Lead    : Build OpenRouteService `avoid_polygons` wrapper and Twilio SMS inbound webhook.     |
| Full-Stack Lead : Implement WebSocket event bus (`/ws/live`) for real-time map updates.              |
+=======================================================================================================+
| HOURS 16:00 - 20:00 | ROLE CONSOLES & 5-STAGE VERIFICATION LIFECYCLE                                  |
+-------------------------------------------------------------------------------------------------------+
| Frontend Lead   : Build Volunteer View with 500m proximity unmasking and Before/After photo diff.    |
| Backend Lead    : Implement 5-stage lifecycle checks (mandatory before/after photo check-in rules).   |
| Full-Stack Lead : Build NDRF Dispatcher priority queue and Municipal Officer Ward management view.   |
+=======================================================================================================+
| HOURS 20:00 - 24:00 | DEMO SEEDING, PITCH REHEARSAL & DEPLOYMENT                                      |
+-------------------------------------------------------------------------------------------------------+
| All Team        : Seed Cyclone Michaung simulation data in Visakhapatnam.                             |
| All Team        : Deploy frontend to Vercel and backend to Render / Cloud Run.                        |
| All Team        : Conduct 3 dry runs of the 3-minute stage pitch and live device demonstration.      |
+=======================================================================================================+
```

---

## 4. Environment Configuration & Secrets Management

### 4.1 Backend Environment Template (`backend/.env`)
```bash
# Application Environment
ENVIRONMENT=development
PROJECT_NAME="JanRakshak API"
API_V1_STR=/api/v1
SECRET_KEY=generate_a_random_32_byte_secret_key_here

# PostgreSQL + PostGIS Database
DATABASE_URL=postgresql+asyncpg://postgres:secret_password@localhost:5432/janrakshak

# Supabase Storage S3 API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...
SUPABASE_STORAGE_BUCKET=janrakshak-evidence

# Firebase Admin SDK
FIREBASE_CREDENTIALS_PATH=./secrets/firebase_service_account.json

# Navigation & Geocoding
OPENROUTESERVICE_API_KEY=5b3ce3597851110001cf6248...

# Multimodal AI Validation
GEMINI_API_KEY=AIzaSy...

# Twilio Offline SMS Gateway
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
```

### 4.2 Frontend Environment Template (`frontend/.env`)
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/api/v1/ws/live
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=janrakshak.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=janrakshak
VITE_FIREBASE_STORAGE_BUCKET=janrakshak.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_MAP_TILE_SERVER=https://tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_TWILIO_GATEWAY_SMS_NUMBER=+1234567890
```

---

## 5. Quality Assurance & Acceptance Testing Checklist

### 5.1 Automated Test Suites

```
backend/tests/
├── test_dedup.py         # Tests 50m spatial deduplication with PostGIS
├── test_routing.py       # Tests ST_Contains ward polygon matching
├── test_sos_lifecycle.py # Tests SOS creation, SMS parsing, and volunteer unmasking
└── test_navigation.py    # Tests hazard avoid_polygons GeoJSON generation
```

### 5.2 Manual Acceptance Verification Matrix

| Scenario / Test Case | Input / Trigger Condition | Expected Result | Pass / Fail |
|:---|:---|:---|:---|
| **1. Normal Mode Ward Routing** | Submit Pothole photo at `(17.7215, 83.3150)`. | System matches Ward 18 (Waltair) and assigns to GVMC Civil Engineering with 7-day SLA. | [ ] |
| **2. Disaster Mode Switch** | Super Admin flips mode to `DISASTER`. | Mobile PWA changes to high-contrast red/black theme without browser reload; SOS button appears. | [ ] |
| **3. 50m De-duplication** | User B reports Fallen Tree 30m away from User A's reported tree. | Ticket merges into User A's master ticket; `affected_count` increments to 2; priority escalates. | [ ] |
| **4. Elder SOS Activation** | Senior taps SOS or speaks *"Bachao"*. | SOS appears on NDRF queue with medical context; nearby volunteers (<500m) receive alert. | [ ] |
| **5. 500m Privacy Masking** | Volunteer > 500m away views SOS. | Exact address is masked. When volunteer moves within 500m and taps "I Can Help", address unmasks. | [ ] |
| **6. Hazard Avoidance Routing** | Request route across road flagged with `FALLEN_TREE`. | OpenRouteService calculates detour around hazard; avoids blocked coordinates. | [ ] |
| **7. 5-Stage Verification** | Field worker marks ticket `COMPLETED`. | System rejects closure without geotagged After-Photo; upon upload, triggers citizen verification vote. | [ ] |

---

## 6. Pitch Demonstration Playbook (Scripted Sequence)

To maximize presentation impact before hackathon judges, follow this 3-minute sequence:

1. **Step 1: Normal Civic Mode (Pothole Report in Vizag)**  
   * Open the app on Mobile Device 1. Point out the calm civic blue theme.
   * Snap a pothole photo on Waltair Main Road. Show the system automatically resolving **GVMC Ward 18** and starting the 7-day SLA clock.

2. **Step 2: Emergency Cyclone Warning Trigger**  
   * On the Admin Laptop, trigger **Disaster Mode** for Visakhapatnam.
   * *Instant Reaction:* Without reloading, Mobile Device 1 flips to **High-Contrast Dark Red/Black Theme**.
   * Normal civic forms vanish; oversized buttons for "Road Blocked" and "Elder SOS" appear.

3. **Step 3: 50-Metre Spatial Deduplication in Action**  
   * Mobile Device 1 reports a *Fallen Tree* in Madhurawada $\rightarrow$ Master Ticket #8421 created.
   * Mobile Device 2 reports the *same tree* 25 metres away $\rightarrow$ Backend instantly merges it into #8421.
   * Point out the live affected citizen counter jumping to 2 and priority score escalating on the dashboard.

4. **Step 4: Hazard Avoidance Navigation**  
   * Open route navigation from RTC Complex to Rushikonda.
   * Initially, the route passes straight through the blocked highway.
   * Enable the Fallen Tree roadblock: the routing engine instantly re-paths the vehicle via a safe inland bypass, visually highlighting the avoided danger zone.

5. **Step 5: The Grand Finale: Elder SOS & Community Rescue**  
   * Speak *"Bachao!"* or tap the pulsing Red SOS button on Grandma's phone.
   * An emergency distress alert appears on the NDRF command board with Grandma's wheelchair and ground floor status.
   * On Mobile Device 2 (Volunteer 300m away), show the masked SOS pin.
   * Volunteer taps "I Can Help" $\rightarrow$ exact door address unlocks with safe walking route.
   * Volunteer reaches and marks "Resident Safe", demonstrating a **7-minute community-powered rescue**.

