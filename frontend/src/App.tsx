/**
 * JanRakshak — Dual-Mode Civic & Disaster Management Platform
 * Unified Desktop & Mobile Web Application Shell with RBAC
 */

import React, { useState, useEffect } from 'react';
import {
  ScreenId,
  UserRole,
  Ticket,
  ElderProfile,
  Shelter,
  HazardIncident,
  VolunteerApplication,
  ActiveVolunteer,
  MunicipalOfficer,
  ToastNotification,
} from './types';
import {
  INITIAL_TICKETS,
  INITIAL_ELDER_PROFILE,
  INITIAL_SHELTERS,
  INITIAL_HAZARDS,
  INITIAL_VOLUNTEER_APPLICATIONS,
  INITIAL_ACTIVE_VOLUNTEERS,
  INITIAL_MUNICIPAL_OFFICERS,
} from './data/seedData';
import { Navbar } from './components/Navbar';
import { CitizenHomeNormal } from './components/CitizenHomeNormal';
import { CitizenHomeDisaster } from './components/CitizenHomeDisaster';
import { ElderSOSTrigger } from './components/ElderSOSTrigger';
import { VolunteerProximity } from './components/VolunteerProximity';
import { SpatialDedupNotice } from './components/SpatialDedupNotice';
import { NDRFDispatcherDashboard } from './components/NDRFDispatcherDashboard';
import { FieldWorkerCheckin } from './components/FieldWorkerCheckin';
import { DistrictCollectorSwitcher } from './components/DistrictCollectorSwitcher';
import { HazardNavigationMap } from './components/HazardNavigationMap';
import { CitizenCameraDefectCapture } from './components/CitizenCameraDefectCapture';
import { ElderProfileSetup } from './components/ElderProfileSetup';
import { PublicTicketStepper } from './components/PublicTicketStepper';
import { CycloneReliefShelter } from './components/CycloneReliefShelter';
import { GVMCAdminDashboard } from './components/GVMCAdminDashboard';
import { NDRFVolunteerManagement } from './components/NDRFVolunteerManagement';
import { VolunteerInterestForm } from './components/VolunteerInterestForm';
import { JanRakshakAPI } from './services/api';
import {
  Home,
  Camera,
  Layers,
  CheckCircle2,
  HardHat,
  Flame,
  AlertOctagon,
  Users,
  HeartHandshake,
  LifeBuoy,
  Radio,
  Compass,
  ShieldCheck,
  Activity,
  Wind,
  Waves,
  Building2,
  User,
  ShieldAlert,
  X,
  Info,
  Check,
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('CITIZEN');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('citizen_home_normal');
  const [isDisasterMode, setIsDisasterMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  // Data states
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    return INITIAL_TICKETS.map((t) => {
      try {
        const storedBefore = localStorage.getItem(`janrakshak_photo_before_${t.id}`);
        const storedAfter = localStorage.getItem(`janrakshak_photo_after_${t.id}`);
        return {
          ...t,
          beforeImageUrl: storedBefore || t.beforeImageUrl,
          afterImageUrl: storedAfter || t.afterImageUrl,
        };
      } catch {
        return t;
      }
    });
  });
  const [elderProfile, setElderProfile] = useState<ElderProfile>(INITIAL_ELDER_PROFILE);
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [hazards, setHazards] = useState<HazardIncident[]>(INITIAL_HAZARDS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TKT-8902');
  const [volunteerApplications, setVolunteerApplications] = useState<VolunteerApplication[]>(
    INITIAL_VOLUNTEER_APPLICATIONS
  );
  const [activeVolunteers, setActiveVolunteers] = useState<ActiveVolunteer[]>(
    INITIAL_ACTIVE_VOLUNTEERS
  );
  const [municipalOfficers, setMunicipalOfficers] = useState<MunicipalOfficer[]>(
    INITIAL_MUNICIPAL_OFFICERS
  );

  // Synchronize state with backend API on mount
  useEffect(() => {
    JanRakshakAPI.getTickets()
      .then((data) => {
        if (data && data.length > 0) {
          const hydrated = data.map((t) => {
            try {
              const storedBefore = localStorage.getItem(`janrakshak_photo_before_${t.id}`);
              const storedAfter = localStorage.getItem(`janrakshak_photo_after_${t.id}`);
              return {
                ...t,
                beforeImageUrl: storedBefore || t.beforeImageUrl,
                afterImageUrl: storedAfter || t.afterImageUrl,
              };
            } catch {
              return t;
            }
          });
          setTickets(hydrated);
        }
      })
      .catch(() => {});

    JanRakshakAPI.getShelters()
      .then((data) => {
        if (data && data.length > 0) setShelters(data);
      })
      .catch(() => {});

    JanRakshakAPI.getOfficers()
      .then((data) => {
        if (data && data.length > 0) setMunicipalOfficers(data);
      })
      .catch(() => {});

    JanRakshakAPI.getActiveVolunteers()
      .then((data) => {
        if (data && data.length > 0) setActiveVolunteers(data);
      })
      .catch(() => {});

    JanRakshakAPI.getVolunteerApplications()
      .then((data) => {
        if (data && data.length > 0) setVolunteerApplications(data);
      })
      .catch(() => {});
  }, []);

  // Navigation History Stack & Intake Category State
  const [navigationHistory, setNavigationHistory] = useState<ScreenId[]>([]);
  const [activeCategoryForIntake, setActiveCategoryForIntake] = useState<Ticket['category'] | undefined>(undefined);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (type: 'success' | 'alert' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastNotification = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigate = (screen: ScreenId, category?: Ticket['category']) => {
    if (category) {
      setActiveCategoryForIntake(category);
    }
    if (currentScreen !== screen) {
      setNavigationHistory((prev) => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
    if (screen === 'citizen_home_disaster') {
      setIsDisasterMode(true);
    } else if (screen === 'citizen_home_normal') {
      setIsDisasterMode(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 0) {
      const prev = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory((h) => h.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      if (currentRole === 'GVMC_ADMIN') {
        setCurrentScreen('gvmc_admin_dashboard');
      } else if (currentRole === 'NDRF_ADMIN') {
        setCurrentScreen('ndrf_dispatcher_dashboard');
      } else {
        setCurrentScreen(isDisasterMode ? 'citizen_home_disaster' : 'citizen_home_normal');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    setNavigationHistory([]);
    if (role === 'GVMC_ADMIN') {
      setCurrentScreen('gvmc_admin_dashboard');
      showToast('info', 'Switched Persona', 'GVMC Zone 2 Municipal Works Console');
    } else if (role === 'NDRF_ADMIN') {
      setCurrentScreen('ndrf_dispatcher_dashboard');
      showToast('info', 'Switched Persona', 'NDRF 10th Battalion Tactical War Room');
    } else {
      setCurrentScreen(isDisasterMode ? 'citizen_home_disaster' : 'citizen_home_normal');
      showToast('info', 'Switched Persona', 'Citizen Public Portal');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleDisasterMode = (enabled: boolean) => {
    setIsDisasterMode(enabled);
    JanRakshakAPI.toggleSystemMode(enabled).catch(() => {});
    showToast(
      enabled ? 'alert' : 'info',
      enabled ? 'DISASTER RED ALERT ENGAGED' : 'NORMAL CIVIC RESTORED',
      enabled ? 'IMD Cyclone protocol online. Coastal shelters active.' : 'Reverted to standard municipal works.'
    );
    if (currentRole === 'CITIZEN') {
      setCurrentScreen(enabled ? 'citizen_home_disaster' : 'citizen_home_normal');
    }
  };

  const handleAddNewTicket = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
    if (newTicket.beforeImageUrl) {
      try {
        localStorage.setItem(`janrakshak_photo_before_${newTicket.id}`, newTicket.beforeImageUrl);
      } catch {}
    }
    JanRakshakAPI.createTicket(newTicket).catch(() => {});
    showToast('success', 'Ticket Dispatched to GVMC', `${newTicket.id} logged with GPS lock & photo proof.`);
  };

  const handleUpdateTicketPhoto = (ticketId: string, photoUrl: string, type: 'before' | 'after') => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              [type === 'before' ? 'beforeImageUrl' : 'afterImageUrl']: photoUrl,
            }
          : t
      )
    );
    try {
      localStorage.setItem(`janrakshak_photo_${type}_${ticketId}`, photoUrl);
    } catch {}
    showToast(
      'success',
      'Photo Evidence Saved',
      `Photographic proof attached to work order ${ticketId}.`
    );
  };

  const handleUpdateTicketStage = (ticketId: string, stage: Ticket['currentStage']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, currentStage: stage } : t))
    );
    JanRakshakAPI.updateTicketStage(ticketId, stage).catch(() => {});
    showToast('info', 'Work Order Stage Updated', `Ticket ${ticketId} advanced to ${stage.replace('_', ' ')}.`);
  };

  const handleAssignOfficerToTicket = (ticketId: string, officer: MunicipalOfficer) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              currentStage: 'assigned',
              assignedCrew: {
                workerName: officer.name,
                unitId: officer.id,
                phone: officer.phone,
                checkedInTime: 'Assigned Just Now',
              },
            }
          : t
      )
    );
    setMunicipalOfficers((prev) =>
      prev.map((o) =>
        o.id === officer.id
          ? { ...o, activeWorkloadCount: o.activeWorkloadCount + 1 }
          : o
      )
    );
    JanRakshakAPI.assignOfficer(ticketId, officer.id).catch(() => {});
    showToast('success', 'Section Engineer Assigned', `${officer.name} assigned with 48h resolution SLA.`);
  };

  const handleApproveTicketResolution = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, currentStage: 'resolved' } : t))
    );
    JanRakshakAPI.auditPhotoProof(ticketId, 'APPROVE').catch(() => {});
    showToast('success', 'Resolution Verified', `Photo proof approved. Ticket ${ticketId} resolved.`);
  };

  const handleRejectTicketResolution = (ticketId: string, reason: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, currentStage: 'in_progress' } : t))
    );
    JanRakshakAPI.auditPhotoProof(ticketId, 'REJECT', reason).catch(() => {});
    showToast('alert', 'Resolution Rejected', `Audit: ${reason}. Returned to field crew.`);
  };

  const handleSubmitVolunteerApplication = (application: VolunteerApplication) => {
    setVolunteerApplications((prev) => [application, ...prev]);
    JanRakshakAPI.submitVolunteerApplication(application).catch(() => {});
    showToast('success', 'Application Logged', 'Credential verification underway with NDRF 10th Bn.');
  };

  const handleApproveVolunteerApplication = (applicationId: string) => {
    const app = volunteerApplications.find((a) => a.id === applicationId);
    if (!app) return;

    setVolunteerApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'APPROVED' } : a))
    );

    const newVolunteer: ActiveVolunteer = {
      id: `VOL-${String(activeVolunteers.length + 1).padStart(2, '0')}`,
      name: app.fullName,
      phone: app.phone,
      ward: app.ward,
      role: 'Community Disaster First Responder',
      equipment: app.equipmentAvailable.join(', ') || 'First Aid Kit & Torch',
      skills: app.skills,
      status: 'Available',
      isVerifiedByNDRF: true,
      onboardedBy: 'PUBLIC_APPLICATION',
      distanceMeters: Math.floor(100 + Math.random() * 350),
    };

    setActiveVolunteers((prev) => [newVolunteer, ...prev]);
    JanRakshakAPI.approveVolunteerApplication(applicationId).catch(() => {});
    showToast('success', 'Volunteer Approved', `${app.fullName} credentialed into coastal rescue grid.`);
  };

  const handleRejectVolunteerApplication = (applicationId: string) => {
    setVolunteerApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'REJECTED' } : a))
    );
    JanRakshakAPI.rejectVolunteerApplication(applicationId).catch(() => {});
    showToast('info', 'Application Rejected', 'Application archived.');
  };

  const handleAddDirectVolunteer = (volunteer: ActiveVolunteer) => {
    setActiveVolunteers((prev) => [volunteer, ...prev]);
    JanRakshakAPI.directOnboardVolunteer(volunteer).catch(() => {});
    showToast('success', 'Direct Responder Added', `${volunteer.name} added to live command roster.`);
  };

  const handleUpdateVolunteerStatus = (
    volunteerId: string,
    status: ActiveVolunteer['status'],
    incidentId?: string
  ) => {
    setActiveVolunteers((prev) =>
      prev.map((v) =>
        v.id === volunteerId
          ? {
              ...v,
              status,
              assignedIncidentId: incidentId !== undefined ? incidentId : v.assignedIncidentId,
            }
          : v
      )
    );
    if (incidentId) {
      JanRakshakAPI.dispatchVolunteer(volunteerId, incidentId, status).catch(() => {});
    }
  };

  const handleUpdateOccupancy = (shelterId: string, delta: number) => {
    setShelters((prev) =>
      prev.map((s) =>
        s.id === shelterId
          ? {
              ...s,
              currentOccupants: Math.min(s.totalCapacity, Math.max(0, s.currentOccupants + delta)),
            }
          : s
      )
    );
    JanRakshakAPI.updateShelterOccupancy(shelterId, delta).catch(() => {});
  };

  const currentSelectedTicket =
    tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  // Dynamic Navigation Groups based on User Role
  const getNavigationGroups = () => {
    if (currentRole === 'GVMC_ADMIN') {
      return [
        {
          title: 'MUNICIPAL WORKS OPERATIONS',
          items: [
            { id: 'gvmc_admin_dashboard' as ScreenId, label: 'GVMC Admin Console', icon: Building2, count: `${tickets.length} Orders` },
            { id: 'spatial_dedup_notice' as ScreenId, label: '50m Dedupe Engine', icon: Layers, count: '18 Clustered' },
            { id: 'field_worker_checkin' as ScreenId, label: 'Crew Field Check-In', icon: HardHat, count: 'Crew 4' },
            { id: 'public_ticket_stepper' as ScreenId, label: 'Public SLA Stepper', icon: CheckCircle2, count: null },
            { id: 'camera_defect_capture' as ScreenId, label: 'Manual Defect Intake', icon: Camera, count: null },
          ],
        },
        {
          title: 'WARD GIS & EMERGENCIES',
          items: [
            { id: 'hazard_navigation_map' as ScreenId, label: 'Hazard Detour GIS', icon: Compass, count: 'Live' },
            { id: 'cyclone_shelter_capacity' as ScreenId, label: 'Relief Shelters Status', icon: LifeBuoy, count: '18 Active' },
            { id: 'district_collector_switcher' as ScreenId, label: 'Collector Override', icon: ShieldCheck, count: 'IAS' },
          ],
        },
      ];
    }

    if (currentRole === 'NDRF_ADMIN') {
      const pendingCount = volunteerApplications.filter((a) => a.status === 'PENDING').length;
      return [
        {
          title: 'TACTICAL COMMAND & WAR ROOM',
          items: [
            { id: 'ndrf_dispatcher_dashboard' as ScreenId, label: 'NDRF War Room Console', icon: Radio, count: '10th Bn' },
            { id: 'ndrf_volunteer_hub' as ScreenId, label: 'Volunteer Command Hub', icon: Users, count: `${pendingCount} Pending` },
            { id: 'elder_sos_trigger' as ScreenId, label: 'Emergency Elder SOS', icon: AlertOctagon, count: 'URGENT' },
            { id: 'volunteer_proximity' as ScreenId, label: 'Live Responder Radar', icon: HeartHandshake, count: `${activeVolunteers.length} Active` },
          ],
        },
        {
          title: 'EVACUATION & LOGISTICS',
          items: [
            { id: 'cyclone_shelter_capacity' as ScreenId, label: 'Relief Shelter Log', icon: LifeBuoy, count: '18 Active' },
            { id: 'hazard_navigation_map' as ScreenId, label: 'Hazard Detour GIS', icon: Compass, count: 'Live' },
            { id: 'elder_profile_setup' as ScreenId, label: 'Vulnerability Registry', icon: ShieldCheck, count: null },
            { id: 'district_collector_switcher' as ScreenId, label: 'Collector Override', icon: ShieldCheck, count: 'IAS' },
          ],
        },
      ];
    }

    // Default: CITIZEN
    return [
      {
        title: 'CIVIC GOVERNANCE',
        items: [
          { id: 'citizen_home_normal' as ScreenId, label: 'Civic Portal Home', icon: Home, count: null },
          { id: 'camera_defect_capture' as ScreenId, label: 'Report Road Defect', icon: Camera, count: null },
          { id: 'public_ticket_stepper' as ScreenId, label: 'Track My Report (SLA)', icon: CheckCircle2, count: null },
          { id: 'spatial_dedup_notice' as ScreenId, label: '50m Spatial Dedupe', icon: Layers, count: '18m' },
        ],
      },
      {
        title: 'DISASTER & LIFE SAFETY',
        items: [
          { id: 'citizen_home_disaster' as ScreenId, label: 'Disaster Hub', icon: Flame, count: 'RED' },
          { id: 'volunteer_interest_form' as ScreenId, label: 'Join Volunteer Corps', icon: HeartHandshake, count: 'Open' },
          { id: 'elder_sos_trigger' as ScreenId, label: 'Emergency Elder SOS', icon: AlertOctagon, count: 'URGENT' },
          { id: 'volunteer_proximity' as ScreenId, label: 'Volunteer Radar', icon: Users, count: '<500m' },
          { id: 'cyclone_shelter_capacity' as ScreenId, label: 'Relief Shelters', icon: LifeBuoy, count: '18 Active' },
          { id: 'elder_profile_setup' as ScreenId, label: 'Vulnerability Registry', icon: User, count: null },
        ],
      },
      {
        title: 'TACTICAL COMMAND & GIS',
        items: [
          { id: 'hazard_navigation_map' as ScreenId, label: 'Hazard Detour Map', icon: Compass, count: 'Avoid' },
          { id: 'district_collector_switcher' as ScreenId, label: 'Collector Override', icon: ShieldCheck, count: 'IAS' },
        ],
      },
    ];
  };

  const navigationGroups = getNavigationGroups();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Universal Top Navigation Header */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        isDisasterMode={isDisasterMode}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Real-Time Operational Telemetry Strip */}
      <div
        className={`px-4 sm:px-6 py-2 border-b text-xs flex flex-wrap items-center justify-between gap-3 transition-colors ${
          isDisasterMode
            ? 'bg-red-900 text-red-100 border-red-800'
            : currentRole === 'GVMC_ADMIN'
            ? 'bg-blue-950 text-blue-100 border-blue-900'
            : currentRole === 'NDRF_ADMIN'
            ? 'bg-slate-950 text-amber-200 border-slate-800'
            : 'bg-slate-900 text-slate-200 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold font-mono uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>
              {currentRole === 'GVMC_ADMIN'
                ? 'GVMC WORKS SYSTEM:'
                : currentRole === 'NDRF_ADMIN'
                ? 'NDRF 10TH BATTALION COMMAND:'
                : 'OPERATIONAL STATUS:'}
            </span>
          </span>
          <span className="font-medium">
            {currentRole === 'GVMC_ADMIN'
              ? 'Zone 2 Works Dept · 42 Open Civic Defects · 94.2% On-Time SLA · PostGIS Deduplication Active'
              : currentRole === 'NDRF_ADMIN'
              ? 'Tactical War Room · Motorized Boats Deployed · Coastal Sweeps in Progress · 4 Responders Dispatched'
              : isDisasterMode
              ? 'IMD Cyclone Red Alert · 18 Coastal Shelters Active · Citizen Mobilization Online'
              : 'GVMC Ward 14 · Visakhapatnam Smart City Operations Center'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          {isDisasterMode ? (
            <>
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-yellow-300" /> 124 km/h Gusts
              </span>
              <span className="flex items-center gap-1">
                <Waves className="w-3.5 h-3.5 text-cyan-300" /> +3.8m Surge
              </span>
            </>
          ) : (
            <span className="text-slate-400">PostGIS ST_DWithin(50m) Active</span>
          )}
          <span className="bg-white/10 px-2 py-0.5 rounded font-bold">
            ROLE: {currentRole}
          </span>
        </div>
      </div>

      {/* Main Container: Collapsible Desktop Sidebar + Content Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Collapsible Left Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-200 shrink-0 select-none ${
            isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden border-r-0'
          }`}
          aria-label="Desktop application navigation"
        >
          {/* Active Role Card in Sidebar */}
          <div className="p-3.5 m-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  currentRole === 'GVMC_ADMIN'
                    ? 'bg-blue-600 text-white'
                    : currentRole === 'NDRF_ADMIN'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-700 text-white'
                }`}
              >
                {currentRole === 'GVMC_ADMIN' ? (
                  <Building2 className="w-4 h-4" />
                ) : currentRole === 'NDRF_ADMIN' ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-bold text-slate-800">
                  {currentRole === 'GVMC_ADMIN'
                    ? 'GVMC Works Admin'
                    : currentRole === 'NDRF_ADMIN'
                    ? 'NDRF Officer'
                    : 'Citizen Public'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Current Persona</div>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
              Active
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-6">
            {navigationGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="text-[10px] font-bold font-mono text-slate-400 tracking-wider px-2.5 mb-1.5 uppercase">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  const isSos = item.id === 'elder_sos_trigger';

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? isDisasterMode || isSos
                            ? 'bg-red-600 text-white font-bold shadow-xs'
                            : 'bg-blue-600 text-white font-bold shadow-xs'
                          : isSos
                          ? 'text-red-700 hover:bg-red-50 bg-red-50/60 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.count && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : isSos
                              ? 'bg-red-200 text-red-900 font-bold'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500">
            <div className="font-semibold text-slate-700">JanRakshak Web Console</div>
            <div className="text-[10px] text-slate-400 font-mono">v1.0.0 · Visakhapatnam GVMC & NDRF</div>
          </div>
        </aside>

        {/* Screen Router Viewport */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-12">
          {/* Floating GovTech Toast Alerts Container */}
          {toasts.length > 0 && (
            <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
              {toasts.map((t) => (
                <div
                  key={t.id}
                  className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-top-2 ${
                    t.type === 'success'
                      ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
                      : t.type === 'alert'
                      ? 'bg-red-950/95 border-red-500/60 text-red-100'
                      : 'bg-slate-900/90 border-blue-500/50 text-slate-100'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {t.type === 'success' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : t.type === 'alert' ? (
                      <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-400" />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <span className="font-bold block tracking-wide">{t.title}</span>
                    <span className="opacity-90 leading-tight block mt-0.5 text-[11px]">{t.message}</span>
                  </div>
                  <button
                    onClick={() => removeToast(t.id)}
                    className="p-1 text-slate-400 hover:text-white shrink-0 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* GVMC Admin Dashboard */}
          {currentScreen === 'gvmc_admin_dashboard' && (
            <GVMCAdminDashboard
              tickets={tickets}
              officers={municipalOfficers}
              onNavigate={handleNavigate}
              onAssignOfficer={handleAssignOfficerToTicket}
              onApproveResolution={handleApproveTicketResolution}
              onRejectResolution={handleRejectTicketResolution}
            />
          )}

          {/* NDRF Volunteer Hub */}
          {currentScreen === 'ndrf_volunteer_hub' && (
            <NDRFVolunteerManagement
              applications={volunteerApplications}
              activeVolunteers={activeVolunteers}
              onNavigate={handleNavigate}
              onApproveApplication={handleApproveVolunteerApplication}
              onRejectApplication={handleRejectVolunteerApplication}
              onAddDirectVolunteer={handleAddDirectVolunteer}
              onUpdateVolunteerStatus={handleUpdateVolunteerStatus}
            />
          )}

          {/* Public Volunteer Interest Form */}
          {currentScreen === 'volunteer_interest_form' && (
            <VolunteerInterestForm
              onNavigate={handleNavigate}
              onSubmitApplication={handleSubmitVolunteerApplication}
              onGoBack={handleGoBack}
            />
          )}

          {/* Existing screens */}
          {currentScreen === 'citizen_home_normal' && (
            <CitizenHomeNormal
              tickets={tickets}
              onNavigate={handleNavigate}
              onSelectTicket={setSelectedTicketId}
            />
          )}

          {currentScreen === 'citizen_home_disaster' && (
            <CitizenHomeDisaster onNavigate={handleNavigate} />
          )}

          {currentScreen === 'elder_sos_trigger' && (
            <ElderSOSTrigger
              elderProfile={elderProfile}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'volunteer_proximity' && (
            <VolunteerProximity
              elderProfile={elderProfile}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'spatial_dedup_notice' && (
            <SpatialDedupNotice
              tickets={tickets}
              onNavigate={handleNavigate}
              onSelectTicket={setSelectedTicketId}
              selectedTicketId={selectedTicketId}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'ndrf_dispatcher_dashboard' && (
            <NDRFDispatcherDashboard tickets={tickets} onNavigate={handleNavigate} />
          )}

          {currentScreen === 'field_worker_checkin' && (
            <FieldWorkerCheckin
              tickets={tickets}
              onNavigate={handleNavigate}
              onUpdateTicketStage={handleUpdateTicketStage}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'district_collector_switcher' && (
            <DistrictCollectorSwitcher
              isDisasterMode={isDisasterMode}
              onToggleDisasterMode={handleToggleDisasterMode}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'hazard_navigation_map' && (
            <HazardNavigationMap
              hazards={hazards}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'camera_defect_capture' && (
            <CitizenCameraDefectCapture
              existingTickets={tickets}
              onNavigate={handleNavigate}
              onAddNewTicket={handleAddNewTicket}
              onSelectTicket={setSelectedTicketId}
              initialCategory={activeCategoryForIntake}
              onGoBack={handleGoBack}
              onUpdateTicketPhoto={handleUpdateTicketPhoto}
            />
          )}

          {currentScreen === 'elder_profile_setup' && (
            <ElderProfileSetup
              elderProfile={elderProfile}
              onUpdateProfile={setElderProfile}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'public_ticket_stepper' && (
            <PublicTicketStepper
              ticket={currentSelectedTicket}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
              onUpdateTicketPhoto={handleUpdateTicketPhoto}
            />
          )}

          {currentScreen === 'cyclone_shelter_capacity' && (
            <CycloneReliefShelter
              shelters={shelters}
              onNavigate={handleNavigate}
              onUpdateOccupancy={handleUpdateOccupancy}
              onGoBack={handleGoBack}
            />
          )}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar (High contrast GovTech Touch Targets) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl flex items-center justify-around py-1.5 px-1">
        {currentRole === 'CITIZEN' && (
          <>
            <button
              onClick={() => handleNavigate(isDisasterMode ? 'citizen_home_disaster' : 'citizen_home_normal')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'citizen_home_normal' || currentScreen === 'citizen_home_disaster'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-600'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavigate('camera_defect_capture')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'camera_defect_capture' ? 'text-blue-600 font-bold' : 'text-slate-600'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Report</span>
            </button>

            <button
              onClick={() => handleNavigate('public_ticket_stepper')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'public_ticket_stepper' ? 'text-blue-600 font-bold' : 'text-slate-600'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Track SLA</span>
            </button>

            <button
              onClick={() => handleNavigate('cyclone_shelter_capacity')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'cyclone_shelter_capacity' ? 'text-blue-600 font-bold' : 'text-slate-600'
              }`}
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Shelters</span>
            </button>

            <button
              onClick={() => handleNavigate('elder_sos_trigger')}
              className="flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2.5 rounded-lg text-red-600 bg-red-50 border border-red-200 active:scale-95 transition-transform cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4 text-red-600 animate-pulse" />
              <span>SOS Alert</span>
            </button>
          </>
        )}

        {currentRole === 'GVMC_ADMIN' && (
          <>
            <button
              onClick={() => handleNavigate('gvmc_admin_dashboard')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'gvmc_admin_dashboard' ? 'text-blue-600 font-bold' : 'text-slate-600'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Console</span>
            </button>

            <button
              onClick={() => handleNavigate('spatial_dedup_notice')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'spatial_dedup_notice' ? 'text-blue-600 font-bold' : 'text-slate-600'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>50m Dedupe</span>
            </button>

            <button
              onClick={() => handleNavigate('field_worker_checkin')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'field_worker_checkin' ? 'text-blue-600 font-bold' : 'text-slate-600'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>Field Crew</span>
            </button>

            <button
              onClick={() => handleNavigate('hazard_navigation_map')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'hazard_navigation_map' ? 'text-blue-600 font-bold' : 'text-slate-600'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Detour GIS</span>
            </button>

            <button
              onClick={() => handleNavigate('public_ticket_stepper')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'public_ticket_stepper' ? 'text-blue-600 font-bold' : 'text-slate-600'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>SLA Audit</span>
            </button>
          </>
        )}

        {currentRole === 'NDRF_ADMIN' && (
          <>
            <button
              onClick={() => handleNavigate('ndrf_dispatcher_dashboard')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'ndrf_dispatcher_dashboard' ? 'text-amber-700 font-bold' : 'text-slate-600'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>War Room</span>
            </button>

            <button
              onClick={() => handleNavigate('ndrf_volunteer_hub')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'ndrf_volunteer_hub' ? 'text-amber-700 font-bold' : 'text-slate-600'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Volunteers</span>
            </button>

            <button
              onClick={() => handleNavigate('volunteer_proximity')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'volunteer_proximity' ? 'text-amber-700 font-bold' : 'text-slate-600'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Radar</span>
            </button>

            <button
              onClick={() => handleNavigate('cyclone_shelter_capacity')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentScreen === 'cyclone_shelter_capacity' ? 'text-amber-700 font-bold' : 'text-slate-600'
              }`}
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Shelters</span>
            </button>

            <button
              onClick={() => handleNavigate('elder_sos_trigger')}
              className="flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2.5 rounded-lg text-red-600 bg-red-50 border border-red-200 active:scale-95 transition-transform cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4 text-red-600 animate-pulse" />
              <span>SOS Alert</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
}
