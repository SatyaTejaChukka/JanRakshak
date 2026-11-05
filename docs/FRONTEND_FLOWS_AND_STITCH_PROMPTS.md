# JanRakshak — Frontend UX Flows & Stitch Design Prompts

| Document Attribute | Details |
|:---|:---|
| **Author** | Senior UI/UX Designer & Senior Frontend Engineer |
| **System** | **JanRakshak** (Dual-Mode Civic & Disaster Management Platform) |
| **Design Standards** | WCAG 2.1 AAA (Disaster Mode), WCAG 2.1 AA (Normal Mode), GovTech Minimalist |
| **Target Prototyping Tool** | **Google Stitch** (Screen & Flow Generation Prompts) |
| **Aesthetic Philosophy** | Strictly **zero purple gradients**, **zero AI-concept clutter**, **zero frivolous animations**. Utilitarian, tactile, human-centered public safety UI inspired by Apple Health Medical ID, GOV.UK, Singapore LifeSG, and NDMA Emergency Portals. |

---

## 1. Design System & Semantic Token Architecture

To ensure every generated screen feels cohesive, reliable, and accessible to rural citizens, elderly residents, and stressed field workers alike, all screens adhere to the following two strict design tokens:

### 1.1 Normal Mode Tokens (Calm Civic Care)
* **Backgrounds:** Canvas `#F8FAFC` (Slate 50), Surface/Cards `#FFFFFF` (Pure White), Elevated `#F1F5F9`.
* **Primary Brand:** `#1A56DB` (Deep Civic Blue — dependable, official, calming).
* **Secondary / Success:** `#0E9F6E` (Civic Green — verified fixes, SLA on-track).
* **Borders & Dividers:** 1px solid `#E2E8F0` (Subtle Slate 200).
* **Typography:**
  * Headers: `Inter`, semi-bold (600), `#0F172A` (Slate 900).
  * Body: `Inter`, regular (400) / medium (500), `#334155` (Slate 700).
  * Subtext / Meta: `#64748B` (Slate 500).
* **Interaction:** Rounded corners `8px` to `12px` (tactile, friendly). Minimum tap target `48 x 48px`.

### 1.2 Disaster Mode Tokens (High-Contrast Emergency)
* **Backgrounds:** Canvas `#0B0F17` (Deep Obsidian / Black), Surface/Cards `#161E2E` (Dark Slate Navy), Elevated `#1F293D`.
* **Primary Emergency:** `#DC2626` (Pure Signal Red — life safety, danger).
* **Warning / Alert:** `#F59E0B` (High-Vis Amber — roadblocks, flood warnings).
* **Borders & Dividers:** 1.5px solid `#334155` (High-contrast Slate).
* **Typography:**
  * Headers: `Inter` or `System Sans`, bold (700), `#FFFFFF` (Stark White).
  * Body: Medium (500), `#F1F5F9` (Slate 100), minimum font size 18px on critical screens.
  * Subtext: `#94A3B8` (Slate 400).
* **Interaction:** Sharp, functional corners `6px` to `8px`. Minimum tap target `64 x 64px`. Zero backdrop blur, zero CSS spring animations to guarantee 60fps on battery-saving devices.

---

## 2. End-to-End User Flow Architecture

```
                                [APP LAUNCH]
                                      |
                     Checks Geofence & Server Mode Flag
                                      |
                 +--------------------+--------------------+
                 |                                         |
        [NORMAL MODE ACTIVE]                      [DISASTER MODE ACTIVE]
                 |                                         |
     (Calm Blue GovTech UI)                     (High-Contrast Red/Black)
                 |                                         |
    +------------+------------+              +-------------+-------------+
    |                         |              |                           |
[Civic Report]          [Public Ward]   [Elder SOS]              [Roadblock / Flood]
    |                       |                |                           |
Photo Capture + GPS    SLA Tracking     1-Tap / Voice               Hazard Avoidance
50m PostGIS Dedup      Before/After     Offline 2G SMS              Navigation Detour
    |                       |                |                           |
Auto-Ward Engineer     Citizen Fix      NDRF Boat Queue             Commuter Detour
Resolution             Verification     Volunteer <500m             Map Update
```

### Flow 1: Routine Civic Report Flow (Normal Mode)
1. User taps "Report Issue" from Home.
2. Viewfinder opens (camera-only, GPS locked, gallery disabled).
3. GPS coordinates resolve ward badge automatically: *"GVMC Ward 14 • Madhurawada"*.
4. User selects issue category (*Pothole*, *Streetlight*, *Broken Footpath*, *Garbage*).
5. User taps "Submit Report".
6. **Branch A (Within 50m of existing ticket):** Modal appears: *"14 neighbours already reported this pothole. Your photo was attached to escalate priority."*
7. **Branch B (New incident):** Ticket #GVMC-8422 created; SLA timer (7 days) initialized; routes to Ward 14 Civil Engineer.

### Flow 2: Emergency Elder SOS & Proximity Rescue Flow (Disaster Mode)
1. Disaster Mode active $\rightarrow$ Home screen shows full-width pulsing Red SOS trigger.
2. Senior taps SOS button OR speaks *"Bachao / Sahayam"*.
3. Screen displays a 5-second cancel ring with loud audible haptic pulse.
4. If online: Dispatches GPS + pre-saved vulnerability context (Age 82, Wheelchair, Ground Floor) to NDRF Queue.
5. If offline (cyclone cellular failure): Triggers native SMS intent to Twilio Gateway.
6. Public Volunteer Feed displays masked card: *"Senior Citizen (82) • Wheelchair • Ground Floor • 280m away"*.
7. Nearby verified volunteer taps *"I Can Help"*.
8. Proximity check passes ($<500\text{ m}$) $\rightarrow$ exact door address and telephone number unlock.
9. Volunteer navigates safe pedestrian path, reaches home, taps *"Reached Door"*, providing immediate care until NDRF boat arrives.

### Flow 3: Hazard-Aware Commuter Navigation Flow
1. Commuter inputs destination (e.g., RTC Complex to Rushikonda).
2. Navigation engine checks active hazard polygons (fallen trees, live snapped wires, flooded underpasses).
3. Map displays initial path in red dashed lines through blocked highway, and solid green/amber detour via safe inland bypass.
4. Banner warns: *"Detour via VIP Road (+4 mins) avoids 0.8m deep water on Beach Road"*.
5. Turn-by-turn guidance adapts in real-time if a new hazard is reported along the path.

### Flow 4: Field Worker & 5-Stage Verification Flow
1. Ward Assistant Engineer / Crew arrives at reported site.
2. App validates field worker GPS is within 40m of ticket pin.
3. Worker taps *"Start Work"* $\rightarrow$ forces mandatory **"Before Work" Photo** capture. Ticket moves to `WORK_IN_PROGRESS`.
4. Work is completed $\rightarrow$ Worker taps *"Mark Resolved"* $\rightarrow$ forces mandatory **"After Work" Photo** capture. Ticket moves to `COMPLETED`.
5. All merged citizens receive push: *"Has this pothole been fixed? [Yes, Verified] / [No, Still Broken]"*.

---

## 3. Stitch Flow Prompts (Interactive Journeys & Transitions)

*Copy and paste these multi-screen flow prompts directly into Stitch to generate connected interactive user journeys.*

### Stitch Flow Prompt 1: Dual-Mode Emergency Transition Journey
```text
Design an interactive 3-screen mobile user flow showing an adaptive GovTech municipal application switching from routine civic care into emergency disaster mode.

Design Language & Aesthetic:
- Clean, utilitarian, human-centered public service interface.
- Absolutely NO purple gradients, NO sci-fi glowing neon cards, NO cluttered widgets.
- WCAG 2.1 AAA high-contrast standards. Minimum tap target 56px.
- Use Inter or clean system sans-serif typography.

Screen 1 (Normal Civic Mode):
- Background: Pure white (#FFFFFF) and soft slate (#F8FAFC).
- Header: Minimalist civic banner "Greater Visakhapatnam Municipal Corporation (GVMC)" with a user avatar, notification bell, and ward pill "Ward 18 • Waltair".
- Main Content: Calm blue (#1A56DB) action card "Report Civic Issue" with subtext "Potholes, streetlights, sanitation".
- Secondary Grid: 4 clean, tactile outline cards: "Road Defects", "Street Lighting", "Drainage", "Public Sanitation".
- Bottom Section: "Active Ward Updates" showing 2 resolved tickets with green "Verified Fixed" badges and before/after thumbnails.
- Bottom Navigation Bar: Home, Ward Map, My Reports, Profile.

Screen 2 (Transition / Ingest Warning Modal):
- Dark overlay behind an authoritative emergency broadcast modal.
- Border: 2px solid #DC2626 (Signal Red).
- Icon: Bold yellow warning triangle.
- Title: "IMD Severe Weather Alert: Cyclone Warning Active".
- Body text: "Collectorate has activated Disaster Response for GVMC Coastal Zones. Switching to Emergency Mode to prioritize life safety and rescue."
- Action Button: Full-width solid red button (#DC2626) "Acknowledge & Enter Emergency Mode".

Screen 3 (Disaster Emergency Mode):
- Background: Deep obsidian black (#0B0F17) with high-contrast slate-navy cards (#161E2E).
- Header: Stark red alert bar "DISASTER MODE ACTIVE • NDRF & GVMC WAR ROOM CONNECTED".
- Hero Action: Massive full-width Red SOS Button (#DC2626) with white bold text "EMERGENCY SOS: ELDER & VULNERABLE RESCUE", with subtext "One-tap alert with medical profile to NDRF & nearby neighbours".
- Secondary Emergency Grid (Oversized 64px tap buttons):
  - "Report Blocked Road / Fallen Tree" (Amber icon and border).
  - "Report Severe Waterlogging" (Blue-grey flood icon).
- Live Hazard Feed: High-contrast alert card: "Fallen Banyan Tree on NH-16 Madhurawada (220m away) • Avoid corridor".
- Stripped Navigation: All non-essential menus removed; bottom bar has only "Emergency Home", "Hazard Map", and "Call War Room 1077".
```

---

### Stitch Flow Prompt 2: Senior Citizen SOS to Community Rescue Flow
```text
Design a 3-screen mobile UX flow for a life-saving crowd-sourced community rescue interaction during a cyclone flood.

Design Language:
- Emergency high-contrast aesthetic (Deep charcoal #0B0F17, Signal Red #DC2626, Signal Amber #F59E0B, Pure White #FFFFFF).
- Large typography (min 18px body text), thumb-friendly layout, zero frivolous decorations.
- Privacy guardrail design: addresses masked until responder is verified within 500m.

Screen 1 (Elder SOS Trigger & Countdown):
- Full-screen emergency modal on senior citizen's phone.
- Giant circular pulsing red button (#DC2626) occupying 40% of screen height with text "SOS ACTIVE".
- Prominent 5-second countdown timer ring: "Alerting NDRF & Neighbours in 05s...".
- Big secondary button below: "CANCEL (False Alarm)" with thick outline.
- Voice indicator pill: Pulsing microphone icon "Listening for 'Bachao' or 'Help'".
- Context summary pill: "Profile Attached: Age 82 • Wheelchair • Ground Floor Flat".
- Offline safety note at bottom: "No internet? Encoded SMS fallback will send automatically."

Screen 2 (Nearby Community Volunteer Public Feed):
- Volunteer's phone screen within 500m radius of the senior citizen.
- Top banner: "1 Vulnerable Neighbour Needs Immediate Assistance Nearby".
- Pinned SOS Card:
  - High-contrast red left border (4px).
  - Pulsing beacon dot next to header: "URGENT: Stranded Senior Citizen".
  - Metadata badges: "Age 82" (Grey pill), "Wheelchair Bound" (Amber pill), "Ground Floor (Flood Risk)" (Red pill).
  - Distance indicator: "280 metres away from your location".
  - Privacy Notice: "Exact address masked for privacy until you accept."
  - Primary CTA Button: Full-width emerald green button (#0E9F6E) "I Can Help (Respond Now)".

Screen 3 (Volunteer Route & Doorstep Unmasking):
- View after volunteer taps "I Can Help".
- Top Card reveals unmasked details:
  - Name: "Kameswari Devi (82)"
  - Exact Address: "Flat G-2, Sai Residency, Beach Road, Pedda Waltair"
  - Medical Note: "Cannot walk; flood water rising at door threshold."
  - Direct Call Button: Green phone icon "Call Caregiver".
- Embedded MapLibre Map:
  - Shows volunteer position, walking path avoiding deep water, and target doorway marker.
  - Estimated walking time: "4 mins on foot (Safe high-ground path)".
- Floating Bottom Action Bar:
  - Solid green button: "I Have Reached the Resident".
  - Secondary button: "Handed over to NDRF Boat".
```

---

### Stitch Flow Prompt 3: 50-Metre Spatial Deduplication & Report Intake Flow
```text
Design an intuitive 3-step mobile report intake flow that solves municipal ticket duplication by clustering citizen reports within 50 metres.

Design Language:
- Utilitarian civic interface (Clean white #FFFFFF, Slate #F8FAFC, Civic Blue #1A56DB, Border Slate #E2E8F0).
- Highly legible, clear form controls, zero visual clutter.

Screen 1 (In-App Camera Capture & Ward Auto-Detect):
- Camera viewfinder view (taking photo of a fallen tree blocking a road).
- Floating top overlay pill: Live GPS coordinates "17.7812° N, 83.3791° E" and green badge "GPS Locked (±3m)".
- Municipal Ward Pill: "Auto-Detected: GVMC Ward 14 • Madhurawada".
- Bottom Camera Shutter: Large circular white shutter button, flash toggle, and cancel button.
- Note at bottom: "Live camera capture required for geo-verification. Gallery uploads disabled."

Screen 2 (Smart Deduplication Merge Notification):
- Modal bottom-sheet appearing immediately after photo capture when system detects an existing ticket 25m away.
- Header: Friendly informational icon with title: "Hazard Already Identified Nearby".
- Subtitle: "14 neighbours have already reported this Fallen Tree on NH-16 within 50 metres."
- Visual Comparison Card:
  - Split thumbnail: "Existing Master Report Photo" (taken 18 mins ago) vs "Your Photo".
- Impact Callout: "Instead of creating a duplicate ticket that slows down municipal teams, your report has been merged to elevate this issue's priority score to CRITICAL."
- Action Buttons:
  - Solid blue button (#1A56DB): "Endorse & Follow Updates (Affected Me Too)".
  - Text link: "No, this is a completely different issue".

Screen 3 (Master Ticket Tracking with 5-Stage Stepper):
- Public Master Ticket Detail View (#GVMC-2026-08421).
- Category: "Fallen Banyan Tree & Snapped Electric Wire".
- Location: "NH-16 near Rythu Bazar, Madhurawada".
- Priority Rank: Critical (Score: 48.5 • 15 Citizens Affected).
- Assigned Agency: "APEPDCL & GVMC Disaster Response Squad".
- 5-Stage Visual Stepper:
  1. Considered (Checkmark)
  2. Assigned Staff (Checkmark - AE K. Rao, ETA 45 mins)
  3. Work In Progress (Active pulsing blue ring)
  4. Completed (Upcoming grey)
  5. Verified (Upcoming grey)
- Action: "Receive SMS / Push status alerts for this repair".
```

---

## 4. Stitch Page-by-Page Design Prompts (Granular Screens)

*Copy and paste each standalone prompt into Stitch to design individual production-grade screens.*

---

### Page 01: Citizen Home — Normal Civic Mode
```text
Generate a clean, modern, accessible mobile home screen for a municipal citizen services application in "Normal Civic Mode".

Platform & Layout:
- Mobile viewport: 390 x 844 px (iPhone / Android modern standard).
- Clean white background (#FFFFFF) with neutral slate cards (#F8FAFC).
- High visual hierarchy, spacious padding (16px grid), zero purple gradients.

Header:
- Top bar with municipal crest and text: "Greater Visakhapatnam Municipal Corporation (GVMC)".
- Location badge: "Ward 18 • Waltair Main Road" with subtle chevron.
- Action icons on right: Notification bell (with subtle blue dot) and User profile avatar.

Hero Section (Civic Care Card):
- Soft blue background (#EFF6FF) with 1px border (#DBEAFE).
- Title: "Report a Civic Issue".
- Subtitle: "Potholes, broken streetlights, or drainage overflow in your ward."
- Primary Action: Prominent solid blue button (#1A56DB, min height 52px, text white, bold) "Snap Photo & Report".

Quick Category Grid (4 Cards, 2x2):
- Card 1: "Pothole & Roads" with road repair icon.
- Card 2: "Streetlights" with lamp icon.
- Card 3: "Drains & Water" with pipe/water icon.
- Card 4: "Sanitation & Trash" with waste bin icon.
- Cards have subtle 1px slate borders (#E2E8F0), 12px rounded corners, 48px min height.

Ward Status & Public SLA Widget:
- Card with title: "Ward 18 Civic Health".
- Metrics in 2 columns:
  - "Open Tickets: 8" (Average resolution time: 3.2 days).
  - "Resolved This Month: 42" (94% on-time SLA).
- Small text: "Next Municipal Ward Inspection: Friday, 10 AM".

Recent Activity Feed:
- Title: "Recent Ward Fixes".
- 1 Ticket Card:
  - Title: "Pothole fixed near Waltair Post Office".
  - Before/After mini thumbnail comparison.
  - Green pill badge: "Verified by 12 Residents".
  - Timestamp: "Resolved 4 hours ago".

Bottom Navigation Bar:
- 4 icons with labels: Home (Active Blue), Ward Map, My Complaints, Settings.
```

---

### Page 02: Citizen Home — Disaster Emergency Mode
```text
Generate an ultra-high-contrast, battery-saving mobile emergency home screen for a disaster response application in "Disaster Emergency Mode".

Platform & Layout:
- Mobile viewport: 390 x 844 px.
- Background: Deep obsidian black (#0B0F17).
- Cards: Dark navy-slate (#161E2E) with 1.5px solid border (#334155).
- High contrast, WCAG 2.1 AAA compliant, minimum tap target 64px, zero superfluous animations.

Top Alert Banner:
- Full-width Signal Red bar (#DC2626) with bold white text:
  "EMERGENCY MODE ACTIVE • IMD CYCLONE WARNING".
- Subtitle: "Ward 1 to 25 under flash flood advisory. War room active 24x7."

Hero Action: Massive Elder SOS Trigger:
- Oversized high-contrast card with deep red background (#7F1D1D) and 2px border (#EF4444).
- Prominent pulsing red icon of a hand reaching out.
- Title (22px bold white): "ELDER & VULNERABLE SOS".
- Description (15px, #FCA5A5): "One-tap emergency rescue alert to NDRF boat teams and verified nearby neighbours."
- CTA: Solid white button with red bold text (#DC2626, height 56px) "TRIGGER EMERGENCY SOS".
- Accessibility note below: "Or say 'Bachao' or 'Help' with voice recognition enabled."

Contextual Emergency Action Bar (2 Oversized Buttons, 1 Column):
- Button 1: "Report Blocked Road / Fallen Tree"
  - Height 64px, dark card with amber border (#F59E0B).
  - Amber warning icon on left, white bold text, chevron on right.
  - Helper text: "Routes detours around blocked streets".
- Button 2: "Report Severe Waterlogging"
  - Height 64px, dark card with cyan-blue border (#38BDF8).
  - Water level icon, white bold text, chevron on right.
  - Helper text: "Water > 1.5 ft blocking homes or vehicles".

Hyper-Local Hazard Broadcast Ticker:
- Dark card with amber icon:
  - "HAZARD ALERT (180m away): Live high-tension wire snapped near Sector 3 junction. APEPDCL team en route. Avoid Beach Road."
  - Timestamp: "Reported 8 mins ago • Confirmed by 6 citizens".

Minimalist Bottom Navigation:
- High contrast dark bar with 3 oversized items:
  1. "Emergency Home" (Active Red icon)
  2. "Hazard Route Map"
  3. "War Room Helpline: 1077"
```

---

### Page 03: Citizen Civic Report / Camera Capture Screen
```text
Generate an accessible, camera-first civic reporting screen designed for fast, tamper-proof reporting of municipal road defects.

Platform & Layout:
- Mobile viewport: 390 x 844 px.
- Dark interface around camera viewfinder (#0F172A).

Top Camera Header:
- Back arrow icon on left.
- Center title: "Capture Defect Photo".
- Right icon: Flash toggle.
- Geolocation Pill (Centered below title):
  - Green dot indicator with text: "GPS Locked: 17.7215° N, 83.3150° E (Accuracy: 3.5m)".
  - Municipal resolution badge: "GVMC Ward 18 • Waltair".

Center Viewfinder Area:
- 4:3 camera preview frame showing a large road pothole.
- Corner framing brackets (white outline).
- Timestamp and GPS watermark rendered in preview corner.
- Strict notice badge: "Live camera capture only. Photo must show defect clearly."

Bottom Controls Drawer:
- Background: Pure white (#FFFFFF) with rounded top corners (16px).
- Category Chips (Horizontal scroll):
  - Selected chip: "Pothole / Road Damage" (Solid blue #1A56DB, white text).
  - Other chips: "Fallen Tree", "Open Drain", "Streetlight Dark", "Garbage Dump" (Outline style).
- Brief Description Input:
  - Placeholder: "Add optional landmark (e.g., opposite SBI ATM)..."
  - Clean text field with 1px border (#CBD5E1).
- Submit Action:
  - Big circular camera shutter button or full-width button:
    Solid blue (#1A56DB, height 52px, text white, bold) "Submit Report".
- Offline Resilience Indicator:
  - Subtle footer text: "If offline, report will save locally and auto-upload when reconnected."
```

---

### Page 04: 50-Metre Deduplication "Merge Notice" Bottom Sheet
```text
Generate a clean, reassuring modal bottom-sheet that informs a citizen their report has been merged into an existing master ticket within 50 metres, eliminating duplicates while rewarding the user.

Platform & Layout:
- Mobile modal sheet overlaid on blurred map background.
- White card (#FFFFFF) with 16px rounded top corners, subtle drop shadow.

Top Grabber & Header:
- Pill-shaped handle bar at top center.
- Icon: Soft blue circular badge with double checkmark icon (#2563EB).
- Title (20px bold, #0F172A): "Issue Already Reported Nearby".
- Subtitle (14px, #475569): "Great news! 14 other citizens have already reported this hazard within 35 metres."

Visual Evidence Comparison:
- Side-by-side photo comparison cards:
  - Card 1: "Master Ticket Photo" (Uploaded 22 mins ago by Citizen 1).
  - Card 2: "Your Uploaded Photo" (Will be appended to ticket gallery).
- Label below: "Your photo adds valuable real-time evidence for municipal field crews."

Severity Escalation Banner:
- Amber tint background (#FEF3C7) with 1px border (#FDE68A).
- Text: "Priority Escalated to HIGH! Because 15 citizens reported this, the GVMC SLA has been accelerated from 48 hours to 4 hours."

Action Buttons:
- Primary Button: Solid blue (#1A56DB, height 52px, bold white) "Track This Ticket & Receive Updates".
- Secondary Outline Button: "View on Public Ward Map".
- Tertiary subtle link: "This is a completely different issue (Submit New)".
```

---

### Page 05: Senior Citizen & Vulnerable Resident Profile Setup
```text
Generate an accessible, high-legibility profile setup screen where elderly or differently-abled citizens register their emergency vulnerability profile for rapid disaster rescue.

Platform & Layout:
- Mobile viewport: 390 x 844 px.
- Clean white background (#FFFFFF) with high-contrast text (#0F172A).
- Font sizes at least 16px to 20px for high readability.

Header:
- Back arrow icon.
- Title: "Emergency Vulnerability Profile".
- Explanatory note: "This information is securely shared with NDRF rescue boat teams only during flood and cyclone emergencies."

Form Fields:

1. Age & Basic Info:
   - Label: "Resident Age"
   - Numeric input field: "82" (Big text, 24px bold).

2. Mobility Assistance (Single-select Large Cards, 2x2):
   - Option 1 (Selected): "Wheelchair User" (Icon + blue border #1A56DB).
   - Option 2: "Bedridden / Cannot Walk" (Icon + grey border).
   - Option 3: "Uses Walker / Cane" (Icon + grey border).
   - Option 4: "Independent Mobility" (Icon + grey border).

3. Flood Drowning Risk (Floor Level Selector):
   - Label: "Residence Floor Level"
   - Subtext: "Ground floor homes face highest flash flood risk."
   - Segmented buttons: [ Ground Floor (High Risk) ] [ 1st Floor ] [ 2nd Floor+ ]
   - "Ground Floor" is selected with an alert amber badge.

4. Critical Medical Needs (Checkboxes with high touch targets):
   - [x] Requires regular oxygen cylinder or concentrator.
   - [x] Dialysis patient or daily insulin-dependent.
   - [ ] Restricted vision or hearing impaired.

5. Emergency Family Contact:
   - Name input: "Ramesh Chukka (Son)"
   - Phone input: "+91 98480 12345"

Consent & Privacy Agreement:
- Checkbox: "I consent to attaching this medical profile to SOS alerts during declared disasters."
- Save Button: Full-width solid blue (#1A56DB, height 54px, bold white) "Save Emergency Profile".
```

---

### Page 06: Emergency Elder SOS Trigger Screen
```text
Generate an intense, foolproof, high-contrast emergency screen that appears when a trapped senior citizen activates SOS during a cyclone or flash flood.

Platform & Layout:
- Mobile viewport: 390 x 844 px.
- Deep solid black background (#000000).
- Pure high-contrast red (#DC2626), amber (#F59E0B), and white (#FFFFFF).

Top Status Bar:
- Large white text: "SOS TRANSMISSION PENDING".
- Battery indicator pill: "Battery: 22% • Power Saving Mode Active".
- Location: "GPS: Pedda Waltair, Visakhapatnam (±4m)".

Center Countdown Ring:
- Massive circular countdown progress ring (240px diameter) outlined in bright red (#DC2626).
- Inside ring:
  - Giant numeral: "04"
  - Subtitle: "Seconds until dispatch"
- Below ring:
  - Audible siren pulse icon.
  - Text: "Alerting NDRF Boat Command & Verified Neighbours".

Emergency Cancellation Button:
- Big grey button with thick white outline (#334155, height 60px):
  "CANCEL ALERT (False Alarm)".

Vulnerability Snapshot Card (Dark slate background #1E293B):
- Header: "Context Transmitted with Distress Signal:"
- 3 key badges:
  - "Age: 82 Years"
  - "Wheelchair Dependent"
  - "Ground Floor Flat (High Water Inflow)"
- Contact: "Son Ramesh notified via automated SMS".

Offline Connectivity Fallback Indicator:
- Amber alert banner at bottom:
  "Cellular Data Weak. Encoded SMS gateway fallback engaged. Signal will reach control room via 2G network."
```

---

### Page 07: Community Volunteer Proximity Rescue Feed & Unmasking Card
```text
Generate a clean, urgent mobile screen for a verified community responder showing nearby vulnerable residents needing immediate assistance during an emergency.

Platform & Layout:
- Mobile viewport: 390 x 844 px.
- Dark mode theme (#0B0F17 background, slate navy cards #1E293B).

Header:
- Title: "Community First-Response".
- Verification Badge: "Verified Volunteer: Kiran (Ward 18)".
- Radius filter pill: "Within 500 Metres (Walking Distance)".

Pinned Distress Card (Masked State — Before Accepting):
- Red border on left edge (4px solid #DC2626).
- Card Header:
  - Pulsing red beacon dot.
  - "STRANDED SENIOR CITIZEN • 280 METRES AWAY"
- Vulnerability Indicators (3 Pills):
  - Pill 1: "Female, 82 Years"
  - Pill 2: "Wheelchair Bound"
  - Pill 3: "Ground Floor Flat (Water Rising)"
- Privacy Protection Notice:
  - Subtle text with padlock icon: "Exact flat number and phone number masked for privacy until you accept."
- Primary Action:
  - Solid green button (#0E9F6E, height 52px, bold white) "I Can Help (Respond Now)".

Unmasked State Preview (Displayed once user taps "I Can Help"):
- Padlock opens, card expands:
  - Resident Name: "Kameswari Devi"
  - Unmasked Address: "Flat G-2, Sai Residency, Beach Road (near Aqua Sports)"
  - Landmark: "Blue gate, ground floor left door"
  - Phone action: Green pill button with phone icon "Call +91 98480 11223"
- Integrated Safe Route:
  - Mini map showing 4-minute walking path.
  - Detour callout: "Avoids waterlogged low-ground lane via 2nd Cross road."
- Action Bar:
  - Full-width button: "I Have Arrived at Doorway".
```

---

### Page 08: Dynamic Hazard-Aware Navigation & Detour Map
```text
Generate an interactive turn-by-turn navigation map screen showing a calculated route dynamically detouring around active flood and roadblock hazards.

Platform & Layout:
- Mobile viewport: 390 x 844 px.
- Map-centric full screen using clean vector styling (MapLibre / OpenStreetMap style).

Top Navigation Direction Card:
- Dark slate header floating over map (#1E293B, rounded 12px, drop shadow).
- Left: Green turn arrow icon (Turn right in 200m onto VIP Road).
- Right: ETA block: "22 mins • 11.4 km • Arrival: 5:45 PM".
- Red alert tag: "+4 mins detour (2 hazards avoided)".

Map Elements:
- Start Pin: Blue dot (RTC Complex).
- Destination Pin: Red flag (Rushikonda IT Park).
- Main Active Route: Vibrant green polyline indicating safe passage.
- Avoided Route: Faded red dashed line along original coastal highway showing where the road is blocked.
- Hazard Polygons Rendered on Map:
  - Hazard 1 (Red shaded circle with tree icon): "Fallen Banyan Tree on Beach Road (Total Roadblock)".
  - Hazard 2 (Amber shaded polygon with wave icon): "Severe Waterlogging (0.8m deep at Underpass)".
- Buffer zones clearly visible as subtle danger perimeters around the obstacles.

Travel Mode Selector (Floating at top-right):
- 3 icons: [ Car (Active) ] [ Two-Wheeler ] [ Walking ]
- Selecting Two-Wheeler re-calculates to avoid water deeper than 0.2m.

Bottom Floating Summary Sheet:
- Title: "Safe Hazard-Avoidance Routing".
- Card details: "Route verified by GVMC Disaster Cell & 18 live citizen hazard reports."
- Button: "Report New Obstacle on Route" (Amber outline button).
```

---

### Page 09: Public Ward Map & 5-Stage Ticket Detail View
```text
Generate a transparent, high-accountability public ticket detail screen showing the 5-stage resolution lifecycle with mandatory photo evidence and citizen voting.

Platform & Layout:
- Mobile viewport: 390 x 844 px.
- Clean white background (#FFFFFF) with slate cards (#F8FAFC).

Header:
- Back arrow icon.
- Title: "Ticket #GVMC-2026-08421".
- Status Badge: Solid amber pill "WORK IN PROGRESS".
- Share icon and Subscribe updates bell.

Incident Header:
- Title (20px bold): "Fallen Banyan Tree & Snapped Cable".
- Location: "NH-16 near Rythu Bazar, Madhurawada (Ward 14)".
- Reporter info: "Reported by 15 citizens • First logged at 2:15 PM".

5-Stage Visual Progress Stepper (Vertical or horizontal timeline):
1. Considered: Checkmark icon, "Auto-verified via GPS • Merged 15 duplicate calls". (2:16 PM)
2. Assigned Staff: Checkmark icon, "Assigned to AE K. Rao (APEPDCL & GVMC Civil)". (2:20 PM)
3. Work In Progress: Active pulsing blue circle, "Crew checked in on-site with chain-saws". (2:45 PM)
   - [View On-Site Before Photo thumbnail]
4. Completed: Grey upcoming circle, "Awaiting geo-tagged after photo from crew".
5. Citizen Verified: Grey upcoming circle, "Community peer vote".

Photo Evidence Slider:
- Split interactive slider comparing:
  - Left: "Before Work" (Photo of massive tree blocking highway).
  - Right: "In Progress" (Photo of crew cutting branches).

Citizen Verification Bar (Shown when completed):
- Background: Light slate box with text:
  "Did this resolve the issue on your street?"
- Two interactive vote buttons:
  - Button 1: "[Yes, Fixed & Cleared] (12 votes)"
  - Button 2: "[No, Still Blocked] (1 vote)"
- Explanatory note: "If >50% vote 'Still Blocked', ticket automatically re-opens."
```

---

### Page 10: Municipal Field Worker On-Site Check-In & Evidence Screen
```text
Generate a functional, rugged mobile application screen for a municipal field worker or road crew supervisor to perform mandatory on-site GPS check-ins and upload before/after proof.

Platform & Layout:
- Mobile viewport: 390 x 844 px.
- Rugged, high-contrast, outdoor-readable interface.
- Large buttons for gloved hands or wet screens (minimum 54px height).

Header:
- Top bar with yellow high-vis worker helmet icon.
- Title: "Field Crew Dispatch: Task #8421".
- Agency Badge: "GVMC Disaster Response Unit #4".

Location Verification Widget:
- Card with green border (#10B981):
  - GPS Distance Check: "You are 28 metres from reported hazard pin."
  - Status: "CHECK-IN PERMITTED (< 40m required)".
  - Mini radar graphic showing worker pin next to defect pin.

Step 1: Mandatory "Before Work" Evidence:
- If unsubmitted:
  - Big dotted box with camera icon: "Tap to capture mandatory BEFORE photo on-site".
- If submitted:
  - Thumbnail of snapped photo with green checkmark: "Before Photo Logged (2:45 PM)".

Work Progress Controls:
- Checkbox list of standard tasks:
  - [x] Traffic diverted / cones placed.
  - [x] Electric supply cut verified with APEPDCL.
  - [ ] Tree cut into movable logs.
  - [ ] Debris cleared from roadway.

Step 2: Mandatory "After Work" Evidence (Locked until tasks checked):
- Big solid orange button (#F97316, height 56px, bold white):
  "Capture Mandatory AFTER Photo to Complete".
- Notice: "App will verify camera GPS matches ticket location before closing task."

Can't Resolve Exception Link:
- Text link at bottom: "Cannot resolve? (Requires crane tender or highway clearance)".
```

---

### Page 11: NDRF & Disaster Command Center Dispatcher Dashboard (Desktop View)
```text
Generate a comprehensive, mission-critical desktop command center interface for NDRF and State Disaster Management dispatchers during a major cyclone.

Platform & Layout:
- Desktop viewport: 1440 x 900 px (Operational War Room Display).
- Dark operations theme (Background #0F172A, Panels #1E293B, Borders #334155).
- 3-Column command dashboard: Left Queue, Center Operational Map, Right Resource Panel.

Top Navigation Bar:
- Left: "NDRF 10TH BATTALION & GVMC EMERGENCY DISPATCH".
- Center Status: "CYCLONE MICHAUNG • CATEGORY 4 • RED ALERT ACTIVE".
- Right: Real-time clock "17:42:10 IST", War Room active officers (14 online), System health: 99.98%.

Left Column: Priority SOS Distress Queue (Width: 380px):
- Header: "Active Life-Safety Calls (12 Pending)" with sort by Priority Score.
- Ticket Card 1 (Selected):
  - Alert Tag: "CRITICAL #SOS-004 • Priority Score 198.5"
  - Name: "Kameswari Devi (82)"
  - Badges: [ Wheelchair ] [ Ground Floor ] [ Battery: 18% ]
  - Location: "Pedda Waltair (Water depth: 1.1m estimated)"
  - Responder status: "Civilian Volunteer Kiran en route (ETA 3 mins)"
- Ticket Card 2:
  - "HIGH #SOS-005 • Priority Score 145.0 • Family trapped on rooftop, MVP Colony".

Center Column: Full-Height GIS Operational Map (Width: 680px):
- MapLibre satellite/dark basemap of Visakhapatnam coastline.
- Weather radar overlay showing active rain bands.
- Pinned markers:
  - Pulsing red rings: Active SOS locations.
  - Amber polygon zones: Submerged underpasses and fallen trees.
  - Blue boat icons: Live NDRF rescue inflatable boats with GPS tracks.
- Selected incident highlighted with 500m volunteer response ring.

Right Column: Resource Allocation & Boat Dispatch (Width: 380px):
- Header: "Dispatch Rescue Squad".
- Assigned Team: "NDRF Inflatable Boat Team #4 (Capt. Vikram)".
- Team Status: "Available at Rushikonda Base (ETA 18 mins to Pedda Waltair)".
- Action: Big solid red button (#DC2626, height 48px, bold white) "Dispatch Rescue Team".
- Civilian Responder Feed: "Volunteer Kiran arrived at doorway at 17:41. Confirms resident safe on upper landing."
```

---

### Page 12: District Collector / Commissioner Emergency Mode Switcher & GIS Analytics
```text
Generate an authoritative administrative dashboard screen for a District Collector or Municipal Commissioner to declare Disaster Mode and audit municipal performance.

Platform & Layout:
- Desktop viewport: 1440 x 900 px.
- Clean, executive GovTech style (Slate #F8FAFC background, white cards, deep navy headers).

Top Executive Header:
- Left: "District Disaster Management Authority (DDMA) • Visakhapatnam".
- Center: "Executive Governance & Operating Mode Control".
- Right: "Signed in as: District Collector (A. Mallikarjuna, IAS)".

Disaster Mode Switcher Card (Top Center):
- Large, authoritative control banner:
  - Current Operating Mode: [ Normal Civic Mode (Active) ] / [ Disaster Emergency Mode ]
  - Interactive Dual-Lock Slider: "Slide to Declare Disaster Mode across GVMC".
  - Confirmation Modal trigger: "Requires confirmation code. Will broadcast push notification to 850,000 registered citizens and switch mobile PWA theme."
  - Scope selector: "Apply to All 98 Wards" or "Select Coastal Wards 1 to 24 only".

Analytics & Performance Metrics (4 Summary Cards):
- Metric 1: "Total Reports Today: 1,842" (Deduplication saved: 1,514 duplicate tickets • 82.2% reduction).
- Metric 2: "Average Ward Routing Speed: 14 ms" (100% automated via PostGIS polygon matching).
- Metric 3: "Active Elder SOS Signals: 3" (All 3 have civilian first-responders on-site).
- Metric 4: "Highway Handoffs: 18 tickets routed to NHAI / State R&B".

Ward Breakdown Table:
- Columns: Ward No | Zone | Primary Issue | Open / Merged | Assigned Nodal Officer | SLA Status
- Row 1: Ward 14 | Zone 2 | Fallen Tree (NH-16) | 1 / 15 Merged | AE K. Rao | In Progress (Within SLA)
- Row 2: Ward 18 | Zone 3 | Beach Road Flood | 1 / 28 Merged | NDRF Team 4 | Critical Escalation
```
