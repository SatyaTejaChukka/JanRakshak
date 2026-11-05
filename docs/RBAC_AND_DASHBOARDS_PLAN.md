# JanRakshak — Role-Based Access Control (RBAC) & Dashboard Architecture Plan

| Attribute | Details |
|:---|:---|
| **System** | **JanRakshak** (Dual-Mode Civic & Disaster Management Platform) |
| **Document Version** | `1.0.0` (RBAC & Dedicated Dashboards Specification) |
| **Date** | November 5, 2026 |
| **Primary Personas** | 1. General Public (Citizens)<br>2. GVMC Admins (Municipal Engineers & Department Officers)<br>3. NDRF Admins (Disaster Commanders & Tactical Dispatchers) |

---

## 1. Executive Summary & Problem Context

In a dual-mode civic and disaster management platform, a one-size-fits-all dashboard creates confusion and operational bottlenecks:
* **The General Public** needs an intuitive, clutter-free experience: reporting potholes in normal mode, accessing the disaster hub in emergencies, triggering Elder SOS, and submitting a **Volunteer Interest Form** to offer their skills and equipment during cyclones.
* **GVMC Admins (Municipal Corporation)** require an administrative console to triage civic defects, monitor ward SLA clocks, assign tasks to ward engineers and road crews, handle highway hand-offs (NHAI/R&B), and review Before/After photo proof before closing tickets.
* **NDRF Admins (National Disaster Response Force & State Fire Services)** need a high-urgency tactical command center: prioritizing life-safety SOS calls, allocating rescue boats, and **managing community volunteers** (reviewing public volunteer applications, manually enrolling vetted volunteers, and dispatching volunteers to nearby distress locations).

---

## 2. Role-Based Access Control (RBAC) Matrix

| Capability / Feature | General Public (`CITIZEN`) | GVMC Municipal Admin (`GVMC_ADMIN`) | NDRF Disaster Admin (`NDRF_ADMIN`) | Approved Volunteer (`VOLUNTEER`) |
|:---|:---:|:---:|:---:|:---:|
| **Normal Civic Home & Map** | ✅ Full Access | ✅ Full Access | 👁 View Only | ✅ Full Access |
| **Report Road / Civic Defect** | ✅ Yes | ✅ Yes (Internal) | ❌ No | ✅ Yes |
| **50m Deduplication Clustering** | 👁 View & Endorse | ✅ Manage Clusters | ❌ No | 👁 View |
| **Submit Volunteer Interest** | ✅ **Yes (Public Form)** | ❌ No | ❌ No | ℹ Already Registered |
| **Assign Issues to Officers/Crews**| ❌ No | ✅ **Full Control** | ❌ No | ❌ No |
| **Review Before/After Photos** | 🗳 Peer Vote | ✅ **Approve / Reopen**| ❌ No | 🗳 Peer Vote |
| **SLA Breach Monitoring** | ❌ No | ✅ **Full Control** | ❌ No | ❌ No |
| **Disaster Hub & Elder SOS** | ✅ Trigger & View | 👁 Monitored | ✅ **Primary Triage** | 👁 Monitored |
| **Review Volunteer Applications** | ❌ No | ❌ No | ✅ **Approve / Reject** | ❌ No |
| **Manual Volunteer Onboarding** | ❌ No | ❌ No | ✅ **Direct Entry** | ❌ No |
| **Deploy & Dispatch Volunteers** | ❌ No | ❌ No | ✅ **Dispatch Control** | ❌ No |
| **Rescue Boat Fleet Dispatch** | ❌ No | ❌ No | ✅ **Full Control** | ❌ No |
| **Cyclone Shelter Capacity Hub** | 👁 View Occupancy | 👁 Municipal Support | ✅ **Tactical Logistics**| 👁 View Safe Route |
| **District Mode Override** | ❌ No | 👁 View Status | 👁 View Status | ❌ No |

---

## 3. Dedicated Dashboard Specifications

### 3.1 Dashboard 1: General Public Portal
* **Default View:** 
  * Normal Mode: Clean Civic Care portal with defect reporting, ward status, and recent verified fixes.
  * Disaster Mode: High-contrast emergency hub with big Elder SOS trigger, flood warnings, and shelter finder.
* **New Core Feature — Public Volunteer Interest Form:**
  * Located prominently in the Disaster Portal: *"Join the Community First-Response Corps"*.
  * Captures citizen readiness:
    1. Full Name, Phone, Aadhaar / Govt ID (for NDRF verification).
    2. Municipal Ward & Landmark Address (for proximity matching).
    3. Specialized Skills: [First Aid Certified], [Swimming / Water Rescue], [Chainsaw Operator], [4x4 Off-Road Driving], [Doctor / Nurse], [Ham Radio Operator].
    4. Emergency Equipment Available: [Inflatable Raft / Boat], [Life Jackets (count)], [4x4 High-Clearance Vehicle], [Generator], [Medical Trauma Kit].
    5. Availability: [Immediate On-Call (24x7)], [Daytime Only], [Emergency Weekend].
  * Submitting generates a `VOLUNTEER_APPLICATION` sent directly to the NDRF Admin queue with status `PENDING_REVIEW`.

---

### 3.2 Dashboard 2: GVMC Municipal Admin Dashboard
* **Primary Objective:** Municipal operational governance, engineer dispatching, and contractor accountability.
* **Core Components:**
  1. **Executive SLA & Civic Health Metrics:**
     * Total Open Issues, Average SLA (e.g., 3.2 days), 50m Deduplication Noise Reduction (84%), Reopen Rate after citizen verification.
  2. **Interactive Municipal Issue Triage Table:**
     * Multi-filter: Ward (1–98), Category (Potholes, Drains, Power, Sanitation), Urgency (Critical, High, Medium), SLA Status (On-Time, Near Breach, Breached).
     * Action: **"Assign Officer / Crew"** modal:
       * Lists available Ward Engineers and Road Gangs with active workload counts.
       * Sets target SLA resolution time (24h, 48h, 7 days).
  3. **Photo Evidence & Verification Inspector:**
     * Side-by-side inspection of citizen report vs. on-site Before Photo vs. completed After Photo.
     * Actions: `Approve & Close Ticket` or `Reject & Re-open with Notes to Crew`.
  4. **Cross-Agency Handoff Monitor:**
     * Dedicated tab for National Highway (NH-16) and State R&B arterial roads, tracking handover acknowledgments from NHAI.

---

### 3.3 Dashboard 3: NDRF & Disaster Command Dashboard
* **Primary Objective:** Life-safety triage, boat fleet allocation, and volunteer corps governance.
* **Core Components:**
  1. **Tactical Rescue Command Pane (3-Column View):**
     * Column 1: Priority-Ranked Elder SOS Queue (sorted by P-Score, water depth, mobility level).
     * Column 2: Coastal GIS Vector Map (active boat tracks, live flood depth contours, volunteer beacons).
     * Column 3: Rescue Boat Allocation (deploying inflatable motor boats, ambulances, evacuation vans).
  2. **New Core Subsystem — NDRF Volunteer Management Hub:**
     * **Tab A: Pending Volunteer Applications (From Public Form):**
       * Review citizen applications with skills, equipment, and ward location.
       * One-click actions: `[Approve & Induct as Volunteer]` or `[Reject / Request More Details]`.
     * **Tab B: Direct Volunteer Onboarding Form (Manual Entry by NDRF):**
       * Allows NDRF officers to manually enroll trusted civil defense volunteers, ex-servicemen, or trained local fishermen teams.
       * Captures assigned volunteer ID, equipment serial numbers, and emergency call sign.
     * **Tab C: Active Volunteer Roster & Live Deployment:**
       * Roster showing verified volunteers with status: `Available`, `En Route (<500m)`, `On-Scene`, `Resting`.
       * Dispatch action: Link volunteer directly to a nearby Elder SOS ticket or relief shelter.

---

## 4. Frontend Data Models & Type Extensions

```typescript
// New Types to be added to frontend/src/types.ts

export type UserRole = 'CITIZEN' | 'GVMC_ADMIN' | 'NDRF_ADMIN' | 'VOLUNTEER';

export interface VolunteerApplication {
  id: string;
  fullName: string;
  phone: string;
  govtIdType: 'Aadhaar' | 'Voter ID' | 'Driving License';
  govtIdNumber: string;
  ward: string;
  address: string;
  skills: Array<'First Aid' | 'Swimming & Water Rescue' | 'Chainsaw & Tree Clearing' | '4x4 Off-Road Driving' | 'Medical / Nursing' | 'Ham Radio'>;
  equipmentAvailable: string[]; // e.g. "Inflatable Raft", "2x Life Jackets", "Portable Generator"
  availability: 'Immediate (24x7)' | 'Daytime Only' | 'Standby';
  bloodGroup: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface ActiveVolunteer {
  id: string;
  name: string;
  phone: string;
  ward: string;
  distanceMeters?: number;
  role: string;
  equipment: string;
  skills: string[];
  status: 'Available' | 'En Route' | 'On-Scene' | 'Standby';
  isVerifiedByNDRF: boolean;
  assignedIncidentId?: string;
  onboardedBy: 'PUBLIC_APPLICATION' | 'NDRF_DIRECT_ENTRY';
}

export interface MunicipalOfficer {
  id: string;
  name: string;
  department: 'Road Infrastructure' | 'Drainage & Stormwater' | 'Electrical (APEPDCL)' | 'Sanitation & Health';
  ward: string;
  designation: string; // e.g., "Assistant Engineer (Civil)"
  phone: string;
  activeWorkloadCount: number;
  status: 'On Duty' | 'On Site' | 'Off Duty';
}
```

---

## 5. UI Architecture & Navigation Experience

### 5.1 Universal Role Switcher in Web Header
To enable immediate evaluation and presentation during hackathons:
* A prominent **Role Switcher** is added to the top navigation header:
  `[ Current Role: 👤 Citizen ▼ ]`
  Options:
  1. `👤 General Public / Citizen`
  2. `🏛️ GVMC Municipal Admin`
  3. `🛡️ NDRF Tactical Officer`
* Selecting a role dynamically updates:
  * The active navigation drawer / sidebar items.
  * The default landing screen.
  * The permission-gated action buttons.

### 5.2 Navigation Structure per Role

```
ROLE: GENERAL PUBLIC
├── Civic Portal Home (Normal Mode)
├── Report Road Defect (Camera & Upload)
├── Public SLA Stepper (Track issue resolution)
├── Disaster Emergency Hub (Disaster Mode)
├── Emergency Elder SOS Trigger
├── Join Volunteer Corps (Public Interest Form) ⭐ NEW
└── View Cyclone Relief Shelters

ROLE: GVMC MUNICIPAL ADMIN ⭐ NEW
├── Municipal Executive Dashboard (SLA Metrics & Triage)
├── Issue Triage & Officer Assignment Workbench
├── 50m Spatial Deduplication Visualizer
├── Field Worker Check-In & Before/After Proof Review
└── Cross-Agency Highway (NHAI) Escalations

ROLE: NDRF DISASTER ADMIN ⭐ NEW
├── Tactical War Room & Radar Overview
├── Priority Elder SOS Dispatch Queue
├── Volunteer Management Hub (Review Applications & Direct Entry) ⭐ NEW
├── Inflatable Rescue Boat Fleet Tracker
└── Shelter Evacuation & Logistics Command
```

---

## 6. Implementation Checklist & Deliverables

1. [ ] **Update `frontend/src/types.ts`:** Add `UserRole`, `VolunteerApplication`, `ActiveVolunteer`, and `MunicipalOfficer`.
2. [ ] **Update `frontend/src/data/seedData.ts`:** Seed mock volunteer applications, vetted volunteers, and GVMC ward engineers.
3. [ ] **Build `VolunteerInterestForm.tsx`:** Clean, accessible public form in the Disaster portal.
4. [ ] **Build `GVMCAdminDashboard.tsx`:** High-density municipal triage console with officer assignment modal.
5. [ ] **Build `NDRFVolunteerManagement.tsx`:** 3-tab hub for NDRF admins (Application Reviews, Direct Entry, Active Deployments).
6. [ ] **Integrate into `App.tsx` & `Navbar.tsx`:** Add universal role switcher with role-gated navigation and views.
7. [ ] **Verify Build & Tests:** Ensure TypeScript compiles cleanly and unit tests pass.

