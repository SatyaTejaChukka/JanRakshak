# JanRakshak (CivicPulse) — Desktop Web Application UX Architecture & Stitch Prompts

| Document Attribute | Details |
|:---|:---|
| **Author** | Senior UI/UX Designer & Senior Frontend Architect |
| **System** | **JanRakshak** (Dual-Mode Civic & Disaster Management Platform) |
| **Viewport Standard** | **Desktop Web: 1440 × 900 px** (Responsive from 1280px to 1920px Ultra-Wide) |
| **Design Standards** | WCAG 2.1 AAA (Disaster Mode), WCAG 2.1 AA (Normal Mode), GovTech Minimalist |
| **Aesthetic Rules** | **Strictly ZERO purple gradients**, **ZERO AI-clutter concepts**, **ZERO glowing cards**. Utilitarian, tactile, high-density public operations UI inspired by NASA Mission Control, UK Emergency Dashboard, and Singapore GovTech LifeSG. |

---

## 1. Frontend Codebase Audit & Transition to Desktop Web

### 1.1 Current Frontend Codebase Analysis
Review of `frontend/src`:
1. **Core Data & Logic:** `types.ts`, `seedData.ts`, and `logic.ts` provide solid models (13 screens, 5-stage tickets, Haversine 50m deduplication, shelter occupancy calculations).
2. **Current UI Artifacts:** The 13 existing components in `frontend/src/components/` were built primarily around mobile-style single-column layouts (`max-w-4xl`, mobile preview drawers).
3. **Inconsistencies to Rectify:**
   - **Branding:** Components use "JanSuraksha"; the official project name is **JanRakshak (CivicPulse)**.
   - **Forbidden Styles:** Some components contain purple text (`text-purple-700` in HazardNavigationMap) and three-color gradient ribbons (`from-red-600 via-rose-600 to-amber-600`).
   - **Web Layout Deficit:** Desktop web needs **persistent command navigation**, **multi-column triage panes (Queue + Map + Inspector)**, **high-density data tables with sorting/filtering**, and **split-screen GIS workspaces**.

---

## 2. Desktop Web Application Shell Architecture (1440 × 900 px)

The web application uses a unified, high-density desktop shell layout across both modes:

```
+-------------------------------------------------------------------------------------------------------------+
| TOP COMMAND HEADER (Height: 56px)                                                                            |
| [Emblem] JanRakshak (CivicPulse) | Mode Badge: [NORMAL CIVIC / DISASTER CYCLONE] | Telemetry | User Profile   |
+-------------------+---------------------------------------------------------+-------------------------------+
| LEFT NAVIGATION   | MAIN WORKSPACE CANVAS (Width: 840px - 1100px)           | RIGHT INSPECTOR / ACTION PANE |
| DRAWER            |                                                         | (Width: 340px - 380px)        |
| (Width: 240px)    | [Operational Map / Triage Data Grid / Analytics Charts] |                               |
|                   |                                                         | [Incident Detail / Photo Diff |
| • Civic Overview  |                                                         |  Assign Unit / Dispatch Boat  |
| • Ward Queue      |                                                         |  Before-After Verification]   |
| • Spatial Dedupe  |                                                         |                               |
| • Elder SOS (Red) |                                                         |                               |
| • Hazard GIS Map  |                                                         |                               |
| • Shelters Hub    |                                                         |                               |
| • Collector Switch|                                                         |                               |
+-------------------+---------------------------------------------------------+-------------------------------+
| STATUS BAR (Height: 28px): System Health 99.98% | Active PostGIS GiST Index | Connected War Room Sockets: 42|
+-------------------------------------------------------------------------------------------------------------+
```

---

## 3. Desktop Web Design Tokens

| Token Role | Normal Civic Web Mode | Disaster Emergency War Room Mode |
|:---|:---|:---|
| **Canvas Background** | `#F8FAFC` (Slate 50) | `#0B0F17` (Deep Obsidian Black) |
| **Panels & Surfaces** | `#FFFFFF` (Pure White) | `#161E2E` (Dark Slate Navy) |
| **Elevated Cards** | `#F1F5F9` (Slate 100) | `#1E293B` (Dark Slate Blue) |
| **Primary Brand** | `#1A56DB` (Deep Civic Blue) | `#DC2626` (Pure Signal Red) |
| **Warning / Hazard** | `#D97706` (Muted Amber) | `#F59E0B` (High-Vis Alert Amber) |
| **Success / Resolved** | `#0E9F6E` (GovTech Emerald) | `#10B981` (Luminous Field Green) |
| **Borders** | 1px solid `#E2E8F0` | 1.5px solid `#334155` |
| **Typography** | `Inter` / `Plus Jakarta Sans` | `Inter` + `JetBrains Mono` for tabular metrics |

---

## 4. Complete Desktop Web Application Stitch Prompts (1440 × 900 px)

*Copy and paste these standalone desktop web prompts into Stitch to generate professional, full-width desktop interfaces.*

---

### WEB-PAGE 01: Unified Civic Operations Web Portal (Normal Mode Desktop)
```text
Generate a high-density, professional desktop web dashboard (1440 x 900 px) for a Municipal Civic Operations and Citizen Grievance Portal in "Normal Civic Mode".

Layout Architecture:
- Viewport: 1440 x 900 px.
- Background: Clean slate (#F8FAFC) with pure white surfaces (#FFFFFF) and subtle 1px slate borders (#E2E8F0).
- Structure: Top Global Header (56px), Left Navigation Sidebar (240px), Main Content Area (840px), Right Context Drawer (360px).
- Zero purple gradients, zero glowing effects. Clean GovTech aesthetic (Inter font).

Top Global Header:
- Left: Municipal crest + bold text "JanRakshak (CivicPulse) • Greater Visakhapatnam Municipal Corporation".
- Center: Jurisdiction Selector dropdown "All Zones • Zone 2 (Madhurawada) Active".
- Right: Search input field (with keyboard shortcut indicator "Ctrl+K"), Notification bell with badge "4", and Ward Officer profile avatar (AE K. Rao).

Left Navigation Sidebar (240px):
- Section: MUNICIPAL SERVICES
  - "Civic Overview" (Active item: solid blue #1A56DB left indicator, soft blue background #EFF6FF, text #1A56DB).
  - "Ward Incident Queue" (Badge: 42 open).
  - "50m Spatial Deduplication".
  - "SLA Breach Monitor" (Badge: 3 critical).
- Section: DISASTER PREPAREDNESS
  - "Emergency Standby" (Inactive grey).
  - "Relief Shelters Directory".
- Section: ADMINISTRATION
  - "Collectorate Mode Switch".
  - "Audit Log & Verifications".

Main Content Area (840px):
- Header row: Title "Ward 14 Civic Health & Triage Workbench", subtitle "Showing live citizen defect reports, automated PostGIS ward routing, and SLA compliance".
- KPI Metric Cards (4 Columns):
  - Card 1: "Total Open Defects: 42" (Avg SLA: 3.4 days).
  - Card 2: "Deduplicated Clusters: 18" (Merged 84 duplicate calls • 80% noise cut).
  - Card 3: "Resolved This Week: 126" (94.2% on-time completion).
  - Card 4: "Citizen Fix Verification: 91%" (Based on 148 peer votes).
- Interactive Incident Data Grid:
  - Table Columns: Ticket ID | Category | Location | Merged Reports | Assigned Engineer | SLA Clock | Status
  - Row 1 (Selected): TKT-8902 | Pothole & Craters | Beach Road Circle | 6 reports | Ramesh Naidu | 1d 4h left | In Progress (Amber pill)
  - Row 2: TKT-8903 | Drainage Block | Sector 5, MVP Colony | 3 reports | M. Chenna Rao | 4h left | Assigned (Blue pill)
  - Row 3: TKT-8904 | Fallen Tree | Siripuram Junction | 1 report | Unassigned | 2h left | Submitted (Red pill)

Right Context Drawer (360px):
- Header: "Ticket Details: #TKT-8902 (Pothole & Craters)".
- Location: "Ward 14, Beach Road near RK Beach Circle, Visakhapatnam (17.7126° N, 83.3218° E)".
- 5-Stage Stepper Component:
  1. Submitted (Done)
  2. Deduplicated & Merged (Done - 6 calls clustered)
  3. Assigned (Done - GVMC-HW-04)
  4. In Progress (Active)
  5. Verified (Pending)
- Photo Comparison Card:
  - Split view: "Citizen Reported Photo" vs "Work-In-Progress Geo-Checkin".
- Quick Actions:
  - Primary button: Solid blue (#1A56DB, height 40px, bold white) "Reassign Ward Crew".
  - Secondary button: Outline "View on Interactive Ward Map".
```

---

### WEB-PAGE 02: Emergency Disaster War Room Console (Disaster Mode Desktop)
```text
Generate a mission-critical, ultra-high-contrast desktop War Room command dashboard (1440 x 900 px) for disaster management during a category-4 cyclone.

Layout Architecture:
- Viewport: 1440 x 900 px.
- Background: Deep obsidian black (#0B0F17) with dark slate-navy cards (#161E2E) and 1.5px solid borders (#334155).
- Structure: Top Alert Ribbon (56px), Left Emergency Navigation (240px), Center Operational Grid (820px), Right Emergency Dispatch Panel (380px).
- Zero purple gradients, zero frivolous animations. High-contrast WCAG 2.1 AAA compliant.

Top Alert Ribbon (Signal Red #DC2626):
- Left: Pulsing warning icon + "DISASTER EMERGENCY OVERRIDE ENGAGED • IMD CYCLONE RED ALERT".
- Center Telemetry: "Wind: 124 km/h | Surge: +3.8m | Rain: 182mm/6hr | Active Shelters: 18/18".
- Right: Dual-Mode Return Switch button "Exit to Normal Civic Mode" and Emergency War Room Clock "17:42:10 IST".

Left Emergency Navigation (240px):
- Background: #0F172A.
- Pinned Urgent Action: Massive Signal Red button (#DC2626, height 48px, bold white) "BROADCAST HAZARD WARNING".
- Navigation List:
  - "Tactical War Room" (Active item: solid red left indicator, #161E2E background, white text).
  - "Elder SOS Priority Queue" (Pulsing red dot, Badge: 12 critical).
  - "Hazard GIS Map" (Active roadblocks & waterlogging).
  - "NDRF Boat Fleet Tracker" (8 boats deployed).
  - "Cyclone Shelter Capacity" (78% full).
  - "Collectorate Override Logs".

Center Operational Grid (820px):
- Section 1: Active Roadblock & Life Safety Summary (3 Cards):
  - Card 1: "Critical SOS Distress: 12 Calls" (All 12 geofenced; 9 with civilian neighbours en route).
  - Card 2: "Confirmed Roadblocks: 19" (11 fallen banyan trees, 8 submerged underpasses).
  - Card 3: "Power Feeder Trips: 14 Grid Sectors" (APEPDCL automated safety cut active).
- Section 2: Live GIS Incident Feed:
  - High-density alert table:
    - #SOS-004 | Pedda Waltair | Elder Trapped (82, Wheelchair, Gr. Floor) | Volunteer Kiran on-site | NDRF Boat #4 Dispatched
    - #HAZ-101 | Beach Road Underpass | Deep Flood (0.8m) | Detour via VIP Road active | Auto-avoid active
    - #HAZ-102 | NH-16 Madhurawada | Fallen Banyan Tree | 15 reports merged | Crane unit deployed

Right Emergency Dispatch Panel (380px):
- Header: "Selected Life-Safety Incident: #SOS-004".
- Resident: "Kameswari Devi (82 Years) • High Drowning Risk".
- Medical Context: "Wheelchair dependent, cardiac condition, ground floor apartment with rising floodwater."
- Volunteer Status Card (Green border #10B981):
  - "Civilian Volunteer: Kiran (Ward 18)"
  - "Status: Reached Doorway at 17:41 IST • Resident assisted to dry 1st-floor landing."
- Rescue Unit Allocation:
  - Dropdown: "NDRF Inflatable Motor Boat #04 (Capt. Vikram)".
  - ETA: "14 minutes to doorstep".
  - Action Button: Full-width solid red (#DC2626, height 46px, bold white) "Confirm Boat Evacuation Dispatch".
```

---

### WEB-PAGE 03: NDRF Joint Tactical Command & Boat Dispatcher (Desktop 3-Column)
```text
Generate a full-screen desktop 3-column tactical dispatcher interface (1440 x 900 px) for NDRF boat teams and Fire Services during flash floods.

Layout Architecture:
- Viewport: 1440 x 900 px.
- Theme: Dark operational palette (Canvas #0F172A, Panels #1E293B, Slate dividers #334155).
- 3-Column Layout:
  - Column 1: Priority-Ranked Rescue Queue (360px)
  - Column 2: Interactive Tactical Vector Map (720px)
  - Column 3: Rescue Unit Fleet & Asset Allocation (360px)

Column 1: Priority-Ranked Rescue Queue (360px):
- Header: "Life-Safety SOS Queue (Sorted by Severity P-Score)".
- Search and filter bar: Filter by [All] [Bedridden] [Wheelchair] [Ground Floor].
- Queue Item 1 (Selected):
  - Left border: 4px solid #DC2626 (Critical).
  - Title: "Kameswari Devi (82) • Score: 198.5"
  - Badges: [ Wheelchair ] [ Ground Floor ] [ Battery: 18% ]
  - Location: "Pedda Waltair (Water Depth: 1.1m)"
  - Status: "Volunteer On-Site • Boat En Route"
- Queue Item 2:
  - Left border: 4px solid #F59E0B (High).
  - Title: "Family of 4 Trapped on Rooftop • Score: 145.0"
  - Badges: [ Infant ] [ Rooftop ]
  - Location: "Sector 3, MVP Colony"

Column 2: Interactive Tactical Vector Map (720px):
- Dark mode satellite/vector map of Visakhapatnam coastline.
- Map Markers:
  - Pulsing red target: #SOS-004 (Pedda Waltair) with 500m volunteer geofence circle.
  - Blue boat markers: 4 active NDRF inflatable motor boats with directional heading vectors.
  - Amber polygon zones: Flooded underpasses and washed-out roads.
  - Green line: Safe, navigable deep-water boat channel.
- Map Controls: Layer toggle [Weather Radar] [Depth Contours] [Shelters] [Volunteer Tracks].

Column 3: Rescue Unit Fleet & Asset Allocation (360px):
- Header: "Tactical Unit Allocation".
- Unit Card (Selected):
  - "NDRF 10th Bn IRB Boat #04"
  - Commander: "Inspector Vikram Singh"
  - Equipment: "40HP Outboard Engine, 6 PFDs, Stretcher, First Aid"
  - Location: "Beach Road Coastal Belt (1.2 km from target)"
  - Speed / ETA: "18 knots • ETA 6 mins"
- Communication Log:
  - "17:35 - SOS received via Web PWA"
  - "17:38 - Volunteer Kiran accepted (320m away)"
  - "17:41 - Volunteer reached doorstep"
  - "17:43 - Boat #04 diverted to location"
- Action Buttons:
  - Solid red button: "Mark Evacuation Complete"
  - Outline button: "Radio Tactical Frequency 156.8 MHz"
```

---

### WEB-PAGE 04: GIS Hazard Avoidance & Dynamic Routing Map Studio (Full-Screen Split View)
```text
Generate a full-screen desktop GIS Navigation & Hazard Studio (1440 x 900 px) that allows municipal operators to inspect active road hazards and test avoidance detours.

Layout Architecture:
- Viewport: 1440 x 900 px.
- Split-screen workspace: Left Control & Incident List (440px), Right Full-Height Interactive Map Canvas (1000px).
- Theme: Clean slate web interface (#F8FAFC canvas, white cards, dark map styling).

Left Control & Incident List (440px):
- Header: "Hazard Avoidance & Routing Studio".
- Mode Switcher: Showing [ Normal Mode Routing ] vs [ Disaster Detour Routing (Active) ].
- Route Simulation Box:
  - Origin Input: "RTC Complex, Dwaraka Nagar"
  - Destination Input: "Rushikonda IT SEZ, Beach Road"
  - Travel Profile: [ Heavy Rescue Truck ] [ Ambulance ] [ Two-Wheeler ] [ Civilian Car ]
  - Avoidance Checkbox: "[x] Enforce PostGIS Active Hazard Exclusion Polygons (avoid_polygons)"
- Route Analysis Card:
  - Standard Path: "Beach Road Corridor (Blocked - Fallen Tree & 0.8m Flood)"
  - Calculated Safe Detour: "Via VIP Road & NH-16 Inland Bypass"
  - Detour Delta: "+4.2 km • +8 minutes • 0 Hazards Encountered"
- Active Hazard List (Below simulation):
  - Hazard 1: "HAZ-101 • Fallen Banyan Tree on NH-16 • Buffer: 25m" (Total Block)
  - Hazard 2: "HAZ-102 • Beach Road Underpass Flood • Depth: 0.8m" (Auto-avoid)
  - Button: "+ Plot New Manual Hazard Polygon"

Right Full-Height Interactive Map Canvas (1000px):
- High-resolution vector map of Visakhapatnam.
- Active Route Rendered:
  - Solid green line: The safe calculated detour bypassing all hazards.
  - Red dashed line: The blocked direct path showing exactly where road failure occurs.
- Hazard Polygons:
  - Shaded red exclusion circles (25m buffer) around fallen tree with obstacle icon.
  - Shaded amber polygon around flooded underpass with water depth tag "0.8m".
- Floating Map HUD (Top-right):
  - Compass, Zoom controls, Layer switcher (OpenStreetMap / Satellite / Flood Depth).
  - Status Pill: "OpenRouteService API: Connected • 2 Active Exclusion Zones Injected".
```

---

### WEB-PAGE 05: Spatial Deduplication & Ward Boundary Workbench (Desktop)
```text
Generate a high-productivity desktop engineering workbench (1440 x 900 px) demonstrating 50-metre PostGIS spatial deduplication and municipal boundary matching.

Layout Architecture:
- Viewport: 1440 x 900 px.
- Dual-panel layout: Left Clustering Algorithm Inspector (500px), Right Boundary & Spatial Cluster Map (940px).
- Clean technical GovTech styling (#FFFFFF and #F8FAFC, 1px slate borders, JetBrains Mono for code/SQL snippets).

Left Clustering Algorithm Inspector (500px):
- Header: "Spatial Deduplication & Auto-Routing Engine".
- Live Status: "PostGIS 16 + PostGIS 3.4 • GiST Index Active • Cluster Radius: 50.0 metres".
- Metric Banner: "Duplicate Reduction Efficiency: 84.6% (128 raw submissions clustered into 21 master tickets)".
- Selected Cluster Card:
  - Master Ticket: "GVMC-2026-08421 (Fallen Tree on NH-16)"
  - Primary Location: "17.7812° N, 83.3791° E (GVMC Ward 14 • Madhurawada)"
  - Merged Reports Table (4 Rows):
    - Report #1 (Original): Citizen K. Satya (08:12 AM) • Photo Attached • Master Pin
    - Report #2: Citizen L. Padmavathi (08:16 AM) • 18m distance • Auto-Merged
    - Report #3: Citizen P. Anand (08:24 AM) • 32m distance • Auto-Merged
    - Report #4: Citizen M. Rao (08:31 AM) • 44m distance • Auto-Merged
- Mathematical Severity Score Calculation:
  - Formula Display: "P = W_cat(10) * M_mode(2.5) * (1 + log2(1 + 4)) = 83.0 (CRITICAL)"
- SQL Query Inspector (Code box):
  - Shows actual PostGIS SQL: "ST_DWithin(location, ST_Point(lng, lat)::geography, 50.0)"
  - Execution Time: "14.2 ms".

Right Boundary & Spatial Cluster Map (940px):
- Interactive boundary map showing official GVMC Ward 14 MultiPolygon boundary in subtle blue outline.
- National Highway 16 rendered with a 25m buffer corridor (showing cross-agency handoff to NHAI).
- 50-metre Cluster Visualization:
  - A 50m dotted circular perimeter drawn around the master ticket pin.
  - 4 report dots clustered within the perimeter, connecting to the central master ticket hub.
  - 1 isolated report 120m away shown outside the circle as a distinct independent ticket.
- Legend: [ Master Ticket Pin ] [ Merged Citizen Report ] [ 50m Clustering Radius ] [ Ward Boundary ].
```

---

### WEB-PAGE 06: Elder SOS & Vulnerable Evacuation Triage Center (Desktop)
```text
Generate a specialized healthcare and vulnerability triage desktop dashboard (1440 x 900 px) for managing senior citizens and bedridden patients during extreme weather.

Layout Architecture:
- Viewport: 1440 x 900 px.
- 3-Column medical command layout: Left Vulnerability Filter (280px), Center Patient Triage Table (760px), Right Care Context & Kin Dossier (400px).
- Theme: High-legibility healthcare / emergency interface (Slate #F8FAFC canvas, white cards, emergency badges).

Left Vulnerability Filter (280px):
- Title: "Evacuation Registry".
- Search input: "Search by resident name, Aadhaar, ward...".
- Risk Stratification Filters:
  - [x] Tier 1: Bedridden / Ventilator / Oxygen (8 residents) - Red badge
  - [x] Tier 2: Wheelchair / Ground Floor (19 residents) - Amber badge
  - [ ] Tier 3: Senior Living Alone (42 residents) - Blue badge
- Geofence Ward Selector: "All 98 Coastal Wards".

Center Patient Triage Table (760px):
- Header: "Vulnerable Residents in Cyclone Montha Inundation Zone".
- Table Columns: Registry ID | Resident Name | Age | Mobility / Medical Condition | Floor | Nearby Helpers | Evacuation Status
- Row 1 (Selected): ELD-4091 | Venkateswara Rao & Lakshmi | 79 | Oxygen Concentrator • Wheelchair | 3rd Floor (Lift dead) | 7 Volunteers | Dispatched (Boat #4)
- Row 2: ELD-4092 | Kameswari Devi | 82 | Bedridden • Cardiac Condition | Ground Floor (Surge risk) | 1 Volunteer on-site | Rescue in Progress
- Row 3: ELD-4093 | K. Appa Rao | 88 | Dialysis Patient • Insulin Dependent | Ground Floor | 3 Volunteers | Evacuated to AU Shelter
- Action bar below table: Batch SMS Alert trigger to all registered family contacts.

Right Care Context & Kin Dossier (400px):
- Header: "Resident Dossier: #ELD-4091".
- Patient Card:
  - Full Name: "Venkateswara Rao (79) & Smt. Lakshmi (74)"
  - Address: "Flat 302, Sai Sagar Enclave, Coastal Battery Road, Ward 14"
  - Mobility Challenge: "Lift non-operational due to grid blackout. Patient cannot descend staircase without evacuation chair."
- Family & Emergency Contacts:
  - Primary: "Dr. S. Ravi (Son) • +91 98490 88211 • Notified via SMS"
  - Secondary: "Smt. Anitha (Daughter) • +91 97010 33422"
- Volunteer Check-in Status:
  - "7 verified community responders located within 500 metres."
  - "Top responder: Kiran (AU Engineering Student, 280m away) has accepted request."
- Button: "Dispatch Evacuation Squad with Stair-Chair Equipment".
```

---

### WEB-PAGE 07: District Collector Executive Governance & Mode Override Console (Desktop)
```text
Generate an authoritative administrative command dashboard (1440 x 900 px) for the District Collector and Municipal Commissioner to govern disaster declarations.

Layout Architecture:
- Viewport: 1440 x 900 px.
- Executive GovTech style (Background #0F172A dark slate, card surfaces #1E293B, borders #334155).
- Structure: Top Executive Header (64px), Main 2-Column Split: Left Mode Switcher & Security Controls (540px), Right District Analytics & Cross-Agency Feeds (820px).

Top Executive Header (64px):
- Left: Emblem of Andhra Pradesh + "District Disaster Management Authority (DDMA) • Visakhapatnam".
- Center: "Executive Operating Mode Controller & Inter-Agency Gateway".
- Right: "Dr. A. Mallikarjuna, IAS (District Collector & Magistrate) • Verified PIN Authenticated".

Left Mode Switcher & Security Controls (540px):
- Card: "Platform Operating Mode Override"
  - Current Status Banner: "NORMAL CIVIC MODE ACTIVE (Routine governance)"
  - Dual-Lock Confirmation Slider:
    - Label: "Slide to Activate DISASTER EMERGENCY MODE"
    - Security Challenge: "Requires 4-Digit Collector Authorization PIN: [ * * * * ]"
    - Warning Callout: "Activating Disaster Mode will autonomously switch mobile PWA themes for 850,000 citizens to high-contrast emergency mode, suppress routine civic menus, and route tickets straight to NDRF/APEPDCL."
  - Scope Selector:
    - [x] Full District Override (All 98 Wards)
    - [ ] Coastal Surge Zone Only (Wards 1 to 24)
- Audit & Command Action Log:
  - "08:00 AM - IMD Cyclone Montha Red Alert ingested from Hyderabad Met Centre"
  - "07:30 AM - Cyclone Relief Shelters 1 to 18 ordered on standby"
  - "Yesterday - Mock Drill conducted across Beach Road wards"

Right District Analytics & Cross-Agency Feeds (820px):
- 4 Executive Metric Widgets:
  - Widget 1: "Triage Center Call Noise Reduction: 84.6%" (Saved 1,514 redundant calls).
  - Widget 2: "Auto-Routing Accuracy: 99.1%" (18 tickets auto-routed to NHAI / State R&B).
  - Widget 3: "Active Elder Distress Signals: 3" (All 3 matched with first-responders).
  - Widget 4: "Inter-Agency Units Deployed: 24" (8 NDRF Boats, 12 APEPDCL squads, 4 Cranes).
- Inter-Agency Handoff Monitor:
  - Table showing live dispatch status across GVMC, NDRF, APEPDCL, and NHAI.
```

---

### WEB-PAGE 08: Cyclone Shelter Capacity & Resource Logistics Hub (Desktop)
```text
Generate a high-efficiency desktop logistics and facility management screen (1440 x 900 px) for monitoring cyclone relief shelters across coastal zones.

Layout Architecture:
- Viewport: 1440 x 900 px.
- Theme: Clean civic slate (#F8FAFC canvas, white cards, border #E2E8F0).
- Structure: Top Summary Bar (60px), Left Shelter Directory (480px), Right Facility Deep-Dive & Supply Inspector (900px).

Top Summary Bar:
- Metrics in 4 columns:
  - "Active Shelters: 18 / 18 Operational"
  - "Total Evacuee Capacity: 14,200 Persons"
  - "Current Occupants: 9,840 (69.2% Overall Occupancy)"
  - "Critical Surging Shelters: 3 (>85% Full)"

Left Shelter Directory (480px):
- Search & filter: "Search shelters by name, ward, landmark...".
- List of Shelter Cards:
  - Card 1 (Selected):
    - Name: "AU Indoor Stadium Cyclone Relief Center"
    - Location: "Ward 14 (Coastal Belt) • 1.4 km from coast"
    - Capacity Bar: 810 / 1200 Occupants (68% - Yellow progress bar)
    - Status Pills: [ Generator OK ] [ Medical Post Active ] [ Safe Route Clear ]
  - Card 2:
    - Name: "GVMC High School Multipurpose Shelter"
    - Location: "Peda Waltair Hill Top • Ward 12"
    - Capacity Bar: 710 / 750 Occupants (95% - RED SURGE ALERT)
  - Card 3:
    - Name: "Bheemili Community Hall Shelter"
    - Location: "Bheemunipatnam Old Town"
    - Capacity Bar: 420 / 600 Occupants (70%)

Right Facility Deep-Dive & Supply Inspector (900px):
- Header: "AU Indoor Stadium Cyclone Relief Center (Facility ID: #SHL-01)".
- Live Resource & Utility Status (4 Grid Cards):
  - Card 1: "Potable Drinking Water: Abundant (40,000L RO Station active)"
  - Card 2: "Diesel Generators: 4 / 4 Operational (72hr fuel reserve)"
  - Card 3: "Medical Officer: Dr. B. Kameswari, MBBS (Disaster Med) on-site"
  - Card 4: "Evacuation Route: Clear & Elevated (No waterlogging on AU South Campus road)"
- Occupancy Management Widget:
  - Interactive Counter: "Current Occupants: 810 / 1200".
  - Quick adjustment buttons: [+10 Evacuees Arrived] [-5 Discharged].
- Specialized Demographics Breakdown:
  - Senior Citizens: 142 • Children / Infants: 98 • Pregnant Women: 14 • General: 556.
- Supply Requisition Action:
  - Button: "Request Additional Food Packets & Blankets from District Godown".
```

