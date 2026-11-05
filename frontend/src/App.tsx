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
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('CITIZEN');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('citizen_home_normal');
  const [isDisasterMode, setIsDisasterMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  // Data states
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
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
        if (data && data.length > 0) setTickets(data);
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

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    if (screen === 'citizen_home_disaster') {
      setIsDisasterMode(true);
    } else if (screen === 'citizen_home_normal') {
      setIsDisasterMode(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'GVMC_ADMIN') {
      setCurrentScreen('gvmc_admin_dashboard');
    } else if (role === 'NDRF_ADMIN') {
      setCurrentScreen('ndrf_dispatcher_dashboard');
    } else {
      setCurrentScreen(isDisasterMode ? 'citizen_home_disaster' : 'citizen_home_normal');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleDisasterMode = (enabled: boolean) => {
    setIsDisasterMode(enabled);
    JanRakshakAPI.toggleSystemMode(enabled).catch(() => {});
    if (currentRole === 'CITIZEN') {
      setCurrentScreen(enabled ? 'citizen_home_disaster' : 'citizen_home_normal');
    }
  };

  const handleAddNewTicket = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
    JanRakshakAPI.createTicket(newTicket).catch(() => {});
  };

  const handleUpdateTicketStage = (ticketId: string, stage: Ticket['currentStage']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, currentStage: stage } : t))
    );
    JanRakshakAPI.updateTicketStage(ticketId, stage).catch(() => {});
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
  };

  const handleApproveTicketResolution = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, currentStage: 'resolved' } : t))
    );
    JanRakshakAPI.auditPhotoProof(ticketId, 'APPROVE').catch(() => {});
  };

  const handleRejectTicketResolution = (ticketId: string, reason: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, currentStage: 'in_progress' } : t))
    );
    JanRakshakAPI.auditPhotoProof(ticketId, 'REJECT', reason).catch(() => {});
  };

  const handleSubmitVolunteerApplication = (application: VolunteerApplication) => {
    setVolunteerApplications((prev) => [application, ...prev]);
    JanRakshakAPI.submitVolunteerApplication(application).catch(() => {});
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
  };

  const handleRejectVolunteerApplication = (applicationId: string) => {
    setVolunteerApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'REJECTED' } : a))
    );
    JanRakshakAPI.rejectVolunteerApplication(applicationId).catch(() => {});
  };

  const handleAddDirectVolunteer = (volunteer: ActiveVolunteer) => {
    setActiveVolunteers((prev) => [volunteer, ...prev]);
    JanRakshakAPI.directOnboardVolunteer(volunteer).catch(() => {});
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
        <main className="flex-1 overflow-y-auto pb-12">
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
            <ElderSOSTrigger elderProfile={elderProfile} onNavigate={handleNavigate} />
          )}

          {currentScreen === 'volunteer_proximity' && (
            <VolunteerProximity elderProfile={elderProfile} onNavigate={handleNavigate} />
          )}

          {currentScreen === 'spatial_dedup_notice' && (
            <SpatialDedupNotice
              tickets={tickets}
              onNavigate={handleNavigate}
              onSelectTicket={setSelectedTicketId}
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
            />
          )}

          {currentScreen === 'district_collector_switcher' && (
            <DistrictCollectorSwitcher
              isDisasterMode={isDisasterMode}
              onToggleDisasterMode={handleToggleDisasterMode}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'hazard_navigation_map' && (
            <HazardNavigationMap hazards={hazards} onNavigate={handleNavigate} />
          )}

          {currentScreen === 'camera_defect_capture' && (
            <CitizenCameraDefectCapture
              existingTickets={tickets}
              onNavigate={handleNavigate}
              onAddNewTicket={handleAddNewTicket}
              onSelectTicket={setSelectedTicketId}
            />
          )}

          {currentScreen === 'elder_profile_setup' && (
            <ElderProfileSetup
              elderProfile={elderProfile}
              onUpdateProfile={setElderProfile}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'public_ticket_stepper' && (
            <PublicTicketStepper ticket={currentSelectedTicket} onNavigate={handleNavigate} />
          )}

          {currentScreen === 'cyclone_shelter_capacity' && (
            <CycloneReliefShelter
              shelters={shelters}
              onNavigate={handleNavigate}
              onUpdateOccupancy={handleUpdateOccupancy}
            />
          )}
        </main>
      </div>
    </div>
  );
}
