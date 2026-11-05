# JanRakshak — Product Requirements Document (PRD)

| Document Attribute | Details |
|:---|:---|
| **Product Name** | **JanRakshak** |
| **Document Version** | `1.0.0` (Production & Hackathon Baseline) |
| **Status** | Approved for Implementation |
| **Target Launch Region** | Visakhapatnam Metropolitan Region (GVMC, APEPDCL, NDRF 10th Battalion) |
| **Primary Beneficiaries** | Urban Citizens, Senior Citizens, Ward Engineers, NDRF & State Fire Rescue Forces |
| **Author** | System Architecture Team |
| **Date** | November 2026 |

---

## 1. Executive Summary & Vision

### 1.1 Problem Context
During routine operations, Indian urban local bodies (ULBs) like the Greater Visakhapatnam Municipal Corporation (GVMC) operate citizen complaint platforms (Smart Vizag app, toll-free 1800-4250-0009 from 6:00 AM to 8:00 PM) for routine civic issues such as potholes, damaged footpaths, and clogged drains. 

However, when coastal cities are hit by tropical cyclones (e.g., Cyclone Hudhud, Cyclone Michaung) or intense monsoon cloudbursts:
1. **Administrative Disconnect:** Municipal systems are disconnected from emergency rescue bodies (National Disaster Response Force [NDRF], State Disaster Response Force [SDRF], and Fire Services).
2. **Control-Room Paralysis:** Hundreds of citizens call helplines to report the exact same uprooted tree or flooded underpass, paralyzing triage operators with 80%+ duplicate reports.
3. **Vulnerable Citizen Mortality:** Senior citizens, differently-abled persons, and patients trapped on flooded ground floors cannot navigate complex civic complaint forms while floodwaters rise against jammed doors.
4. **Blind Navigation:** Commuters and rescue vehicles blindly navigate into flooded roads, fallen high-voltage cables, or washed-out culverts because standard commercial navigation engines lack live hazard incident feeds.
5. **Erosion of Public Trust:** Civic tickets are frequently closed arbitrarily without photo proof or citizen verification, leading to duplicate complaints and community frustration.

### 1.2 Product Vision
**JanRakshak** is a unified, dual-mode community response platform that serves as a routine municipal maintenance tracker on normal days and autonomously transforms into a high-contrast emergency rescue lifeline during cyclones and floods. 

By operating on a single installable Progressive Web App (PWA) codebase with server-driven interface transitions, JanRakshak guarantees **year-round citizen adoption**, ensuring communities never have to download or learn an unfamiliar emergency app in the middle of a disaster.

---

## 2. Target Personas & Stakeholders

| Persona Code | Name & Archetype | Context & Pain Points | Primary Jobs to be Done |
|:---|:---|:---|:---|
| **P-1** | **Ravi (Urban Commuter & Resident)** | Drives across Visakhapatnam daily; frustrated by recurring potholes and unannounced waterlogged underpasses during monsoons. | 1. Snap photo of road defect with zero manual ward selection.<br>2. Receive real-time driving detours around active flood zones. |
| **P-2** | **Kameswari Devi (82-Year-Old Senior Citizen)** | Lives on the ground floor in Pedda Waltair; uses a wheelchair; lives with elderly spouse; low tech literacy. | 1. Trigger urgent distress with one tap or voice command.<br>2. Transmit medical and floor-level context without filling forms. |
| **P-3** | **Kiran (Verified Community Volunteer)** | 24-year-old student living in MVP Colony; physically fit; willing to help neighbours during floods before boats arrive. | 1. View hyper-local SOS alerts within 500m.<br>2. Receive safe walking route to reach trapped elder's doorway. |
| **P-4** | **Suresh (GVMC Assistant Engineer - Ward 14)** | Responsible for civil works across Ward 14; inundated with chaotic phone calls and misrouted complaints from other wards. | 1. Receive only validated, ward-filtered tickets.<br>2. Upload geotagged work-in-progress and completion proof. |
| **P-5** | **Inspector Vikram (NDRF 10th Battalion Commander)** | Stationed with rescue inflatable boats; needs exact GPS coordinates, water depth, and medical triage data to allocate limited boats. | 1. High-priority dispatch queue sorted by life-safety severity.<br>2. Real-time updates if a civilian neighbour is already on-site. |
| **P-6** | **District Collector / Disaster Commissioner** | Manages the District Emergency Operations Centre (EOC); requires single-pane-of-glass situational awareness. | 1. Switch the entire city or specific wards into Disaster Mode.<br>2. Track SLA compliance and cross-agency highway escalations. |

---

## 3. Product Goals & Measurable Objectives (OKRs)

```
+-----------------------------------------------------------------------------------------+
| Objective 1: Eliminate Triage Paralysis During Disasters                                |
|   KR 1.1: Deduplicate 80% to 90% of overlapping disaster reports within a 50m radius.  |
|   KR 1.2: Reduce municipal ward ticket assignment time from hours to <20 milliseconds.  |
+-----------------------------------------------------------------------------------------+
| Objective 2: Accelerate Life-Saving Response for Vulnerable Residents                   |
|   KR 2.1: Enable senior citizen SOS triggering in <= 2 taps or 1 voice command.         |
|   KR 2.2: Cut emergency first-responder arrival from 2-4 hours to 7-15 minutes via      |
|           crowd-sourced verified neighbours within 500 metres.                           |
+-----------------------------------------------------------------------------------------+
| Objective 3: Protect Public Safety via Dynamic Routing                                  |
|   KR 3.1: Deliver automated hazard exclusion polygons to 100% of route requests.       |
|   KR 3.2: Broadcast push hazard warnings to citizens within a 2 km radius in < 3 secs.  |
+-----------------------------------------------------------------------------------------+
| Objective 4: Ensure Complete Accountability in Routine Civic Care                       |
|   KR 4.1: Enforce 100% geotagged "Before" and "After" photo verification for closures.  |
|   KR 4.2: Enable citizen peer verification voting to prevent corrupt ticket closures.   |
+-----------------------------------------------------------------------------------------+
```

---

## 4. Functional Requirements (FR)

### Module 1: Adaptive Dual-Theme UI Architecture
* **FR-1.1 (Server-Driven Mode Resolution):** The client application must fetch active operating mode flags (`NORMAL` vs. `DISASTER`) based on the user's current GPS coordinates on launch and via WebSocket/FCM push updates.
* **FR-1.2 (Normal Civic Mode Theme):**
  * Primary Palette: Calm Blue (`#1A56DB`), Emerald Green (`#0E9F6E`), White surface (`#FFFFFF`).
  * Visible Navigation: Routine Civic Categories (Potholes, Streetlights, Garbage, Drainage), Public Ward Map, SLA Tracker, Upvote Feed.
* **FR-1.3 (Disaster Emergency Mode Theme):**
  * Primary Palette: High-Contrast Emergency Red (`#DC2626`), Alert Amber (`#F59E0B`), Slate Black surface (`#0F172A`).
  * Contrast Ratio: Minimum 7:1 (WCAG AAA) across all interactive elements.
  * Battery Conservation: Auto-suppresses heavy CSS transitions, backdrop blurs, and background video/animations.
  * Contextual Action Bar: Replaces multi-step civic forms with oversized (min 64px tap height) one-tap buttons:
    1. **"Road Blocked / Tree Fallen"**
    2. **"Severe Waterlogging / Flash Flood"**
    3. **"Elderly / Vulnerable Resident SOS"**

### Module 2: Geo-Fenced Municipal & Agency Auto-Routing
* **FR-2.1 (Boundary Resolution):** The system must accept client GPS coordinates `(lat, lng)` and execute PostGIS `ST_Contains` matching against stored administrative boundaries.
* **FR-2.2 (Hierarchical Assignment):** Automatically resolves:
  1. Jurisdiction: GVMC vs. VMC vs. GHMC vs. Local Gram Panchayat.
  2. Zone: e.g., Zone 2 (Madhurawada).
  3. Ward: e.g., Ward 14.
* **FR-2.3 (Departmental Dispatch):** Auto-assigns the ticket to the designated nodal officer (Civil Engineer, Sanitation Inspector, Electrical Officer) based on issue category.
* **FR-2.4 (Cross-Agency Highway Hand-Off):** If coordinates intersect with a 25-metre buffer along state highways or national highways (NH-16), the ticket must bypass municipal staff and route directly to the **State Roads & Buildings (R&B)** or **National Highways Authority of India (NHAI)** nodal desk.

### Module 3: 50-Metre Spatial Deduplication & Aggregation
* **FR-3.1 (Spatial Radius Search):** Incoming reports must be checked against open tickets within a 50-metre radius using PostGIS `ST_DWithin` on geography.
* **FR-3.2 (Category Compatibility):** Reports belonging to the same category group (e.g., `FALLEN_TREE` or `DRAIN_OVERFLOW`) submitted within an active time window (24h in Disaster, 14 days in Normal) must automatically merge into the existing master ticket.
* **FR-3.3 (Aggregation Mechanics):**
  * New reporter photo is appended to the master ticket gallery.
  * `affected_count` is incremented by 1.
  * Reporter is automatically subscribed to ticket status notifications.
* **FR-3.4 (Severity Escalation Formula):** Dynamic priority score recalculated upon each merge:
  $$P = W_{\text{cat}} \times M_{\text{mode}} \times \left(1 + \log_2(1 + N)\right) + V$$
  * Where $W_{\text{cat}} \in [1, 10]$, $M_{\text{mode}} \in \{1.0, 2.5\}$, $N$ is count of merged citizen reports, and $V = 50$ if linked to a trapped vulnerable resident.

### Module 4: Senior Citizen & Vulnerable Resident SOS Module
* **FR-4.1 (One-Tap SOS):** Oversized red button triggers emergency distress with a 5-second cancel countdown to avoid accidental presses.
* **FR-4.2 (Voice-Activated SOS):** Client listens via Web Speech API for emergency triggers in English, Telugu, and Hindi (*"Help"*, *"Bachao"*, *"Sahayam"*).
* **FR-4.3 (Pre-Filled Vulnerability Profile):** Onboarding allows storing:
  * Age, mobility status (Wheelchair, Bedridden, Walker, Independent).
  * Medical dependencies (Oxygen, Dialysis, Insulin).
  * Floor level (Ground Floor = High Drowning Risk).
  * Primary emergency contact.
* **FR-4.4 (Offline SMS Fallback):** When cellular data is unavailable, the PWA generates an SMS intent:
  * `sms:GATEWAY_NUMBER?body=SOS|USER_ID|LAT|LNG|VULN_CODE|BATTERY_PCT`
* **FR-4.5 (NDRF Priority Queue):** SOS tickets bypass municipal queues and appear directly on the NDRF/Fire Services Dispatch board sorted by priority.

### Module 5: Crowd-Sourced Community Rescue Network
* **FR-5.1 (Public SOS Feed):** Stranded senior tickets are pinned to the top of the feed for users within a 500-metre radius with a pulsing alert beacon.
* **FR-5.2 (Proximity Privacy Guardrail):**
  * Public feed shows only: *"Senior Citizen (82), Wheelchair, Ground Floor, 280m away"*.
  * Exact street address, door number, and telephone number are strictly masked.
* **FR-5.3 ("I Can Help" Check-In):** A verified user within 500m can tap *"I Can Help"*. The system:
  1. Unlocks the exact door address and telephone number to this volunteer only.
  2. Streams volunteer's distance and ETA to the NDRF control room.
  3. Displays a navigable walking route to the volunteer.
* **FR-5.4 (Hand-Off & Completion):** Volunteer can update status to *"Reached Door"* or *"Safe with Volunteer"*, providing immediate relief while official rescue boats are en route.

### Module 6: Dynamic Hazard Broadcasts & Navigation
* **FR-6.1 (2 km Radius Broadcasts):** When a confirmed hazard (fallen tree, snapped wire, bridge washout, deep flood) is logged, all users within 2 km receive an instant push alert.
* **FR-6.2 (Active Hazard Polygon Generation):** Each confirmed road hazard generates a buffered polygon (`ST_Buffer(location, 25m)`).
* **FR-6.3 (Dynamic Avoidance Routing):** Route queries pass active hazard polygons as exclusion zones (`avoid_polygons`) to OpenRouteService.
* **FR-6.4 (Multi-Modal Pathing):**
  * Pedestrian: Navigates narrow alleys, avoids water $>0.3\text{m}$.
  * Two-Wheeler: Avoids water $>0.2\text{m}$.
  * Rescue Vehicle: Prioritizes cleared high-capacity corridors.

### Module 7: Transparent 5-Stage Verification Lifecycle
* **FR-7.1 (Stage Progression):**
  1. `CONSIDERED`: Geo-validated and deduplicated; published on public map.
  2. `ASSIGNED_STAFF`: Linked to named officer/unit with SLA countdown.
  3. `WORK_IN_PROGRESS`: Requires GPS check-in on-site (<100m) and mandatory **Before Photo**.
  4. `COMPLETED`: Requires GPS check-in on-site and mandatory **After Photo**.
  5. `CANT_RESOLVE`: Requires official written justification; escalates to Municipal Commissioner.
* **FR-7.2 (Citizen Verification Voting):** Upon `COMPLETED`, all reporters on that master ticket are prompted: *"Has this been fixed?"*.
  * If $>50\%$ vote "Not Fixed" within 48 hours, ticket automatically reopens to `WORK_IN_PROGRESS`.

---

## 5. Non-Functional Requirements (NFR)

| Dimension | Specification & Requirement |
|:---|:---|
| **Performance** | • PostGIS deduplication and ward resolution query execution: **< 20 ms**.<br>• End-to-end API response time for report submission: **< 350 ms**.<br>• Dynamic hazard route calculation: **< 600 ms**.<br>• Frontend initial paint in Disaster Mode: **< 1.0 second**. |
| **Scalability** | • Must sustain **10,000 concurrent active users** per ward during cyclone alerts.<br>• Read throughput supported via spatial connection pooling and caching. |
| **Availability** | • 99.95% uptime during declared disaster periods.<br>• PWA service workers ensure full offline accessibility for local caching. |
| **Security & Privacy** | • Phone OTP authentication verified via Firebase Authentication JWTs.<br>• End-to-end TLS 1.3 encryption for all REST and WebSocket channels.<br>• Strict masking of vulnerable resident PII; accessible only within 500m geofence. |
| **Accessibility** | • WCAG 2.1 AA in Normal Mode; WCAG 2.1 AAA in Disaster Mode.<br>• Minimum tap target size: 48x48px (Normal Mode), 64x64px (Disaster Mode).<br>• Full multi-language localization: English (`en`), Telugu (`te`), and Hindi (`hi`). |
| **Data Integrity** | • Geotagged camera capture only; gallery file upload disabled to prevent fake reports.<br>• Idempotent submission keys (`client_submission_id`) to prevent duplicate queueing. |

---

## 6. Success Metrics & Key Performance Indicators (KPIs)

```
                    JANRAKSHAK SUCCESS SCORECARD
====================================================================
1. Operational Efficiency:
   - Duplicate Ticket Reduction: >= 85%
   - Automated Ward Routing Accuracy: >= 98%
   - Control Room Call Volume Reduction: >= 70%

2. Citizen Life Safety:
   - Elder SOS Alert-to-Responder Handshake: <= 5 minutes
   - Civilian First-Responder Arrival Time: <= 12 minutes (vs 2-4 hrs boat)
   - Zero Commuter Incidents in Broadcast Hazard Geofences

3. Public Accountability:
   - Before/After Photo Compliance: 100% of closed tickets
   - Citizen Re-Open Rate: < 10% after fix verification
====================================================================
```

---

## 7. Assumptions, Dependencies & Risk Mitigation

| Risk / Dependency | Impact | Mitigation Strategy |
|:---|:---|:---|
| **Cellular Internet Blackout during Cyclone** | High | PWA offline storage (IndexedDB) holds reports; automatic fallback generates native SMS intent to Twilio GSM Gateway. |
| **Prank Distress Calls / Fake Reports** | Medium | Phone OTP registration mandatory; live camera capture required with EXIF GPS matching; priority scales only with multi-citizen clustering. |
| **OpenRouteService Rate Limits on Free Tier** | Medium | Cache active hazard avoidance polygons in memory; cluster route waypoints; fallback to local turf.js bounding box detours. |
| **Volunteer Safety in Deep Flood Zones** | High | System prevents civilian responder routing into zones flagged with water depth $>0.5\text{m}$ or live fallen electric wires; NDRF boats exclusively assigned to deep-water zones. |

