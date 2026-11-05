/**
 * JanRakshak — Dual-Mode Civic & Disaster Management Platform
 * Unified Desktop & Mobile Web Application Shell
 */

import React, { useState } from 'react';
import { ScreenId, Ticket, ElderProfile, Shelter, HazardIncident } from './types';
import {
  INITIAL_TICKETS,
  INITIAL_ELDER_PROFILE,
  INITIAL_SHELTERS,
  INITIAL_HAZARDS,
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
  ChevronRight,
  Activity,
  Wind,
  Waves,
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('citizen_home_normal');
  const [isDisasterMode, setIsDisasterMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [elderProfile, setElderProfile] = useState<ElderProfile>(INITIAL_ELDER_PROFILE);
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [hazards, setHazards] = useState<HazardIncident[]>(INITIAL_HAZARDS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TKT-8902');

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    // If navigating to disaster screen directly, sync isDisasterMode
    if (screen === 'citizen_home_disaster') {
      setIsDisasterMode(true);
    } else if (screen === 'citizen_home_normal') {
      setIsDisasterMode(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleDisasterMode = (enabled: boolean) => {
    setIsDisasterMode(enabled);
    setCurrentScreen(enabled ? 'citizen_home_disaster' : 'citizen_home_normal');
  };

  const handleAddNewTicket = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
  };

  const handleUpdateTicketStage = (ticketId: string, stage: Ticket['currentStage']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, currentStage: stage } : t))
    );
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
  };

  const currentSelectedTicket =
    tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const navigationGroups = [
    {
      title: 'CIVIC GOVERNANCE',
      items: [
        { id: 'citizen_home_normal' as ScreenId, label: 'Civic Portal Home', icon: Home, count: null },
        { id: 'camera_defect_capture' as ScreenId, label: 'Report Road Defect', icon: Camera, count: null },
        { id: 'spatial_dedup_notice' as ScreenId, label: '50m Spatial Dedupe', icon: Layers, count: '18m' },
        { id: 'public_ticket_stepper' as ScreenId, label: 'Public SLA Stepper', icon: CheckCircle2, count: null },
        { id: 'field_worker_checkin' as ScreenId, label: 'Field Crew Check-In', icon: HardHat, count: 'Crew 4' },
      ],
    },
    {
      title: 'DISASTER & LIFE SAFETY',
      items: [
        { id: 'citizen_home_disaster' as ScreenId, label: 'Disaster Hub', icon: Flame, count: 'RED' },
        { id: 'elder_sos_trigger' as ScreenId, label: 'Emergency Elder SOS', icon: AlertOctagon, count: 'URGENT' },
        { id: 'volunteer_proximity' as ScreenId, label: 'Volunteer Radar', icon: Users, count: '<500m' },
        { id: 'elder_profile_setup' as ScreenId, label: 'Vulnerability Registry', icon: HeartHandshake, count: null },
        { id: 'cyclone_shelter_capacity' as ScreenId, label: 'Relief Shelters', icon: LifeBuoy, count: '18 Active' },
      ],
    },
    {
      title: 'TACTICAL COMMAND & GIS',
      items: [
        { id: 'ndrf_dispatcher_dashboard' as ScreenId, label: 'NDRF War Room', icon: Radio, count: '10th Bn' },
        { id: 'hazard_navigation_map' as ScreenId, label: 'Hazard Detour Map', icon: Compass, count: 'Avoid' },
        { id: 'district_collector_switcher' as ScreenId, label: 'Collector Override', icon: ShieldCheck, count: 'IAS' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Universal Top Navigation Header */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        isDisasterMode={isDisasterMode}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Real-Time Operational Telemetry Strip */}
      <div
        className={`px-4 sm:px-6 py-2 border-b text-xs flex flex-wrap items-center justify-between gap-3 transition-colors ${
          isDisasterMode
            ? 'bg-red-900 text-red-100 border-red-800'
            : 'bg-slate-900 text-slate-200 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold font-mono uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>OPERATIONAL STATUS:</span>
          </span>
          <span className="font-medium">
            {isDisasterMode
              ? 'IMD Cyclone Red Alert · 18 Coastal Shelters Active · NDRF War Room Dispatched'
              : 'GVMC Ward 14 · 42 Open Defects · 94.2% On-Time SLA · PostGIS Deduplication Online'}
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
            {isDisasterMode ? 'DISASTER MODE' : 'CIVIC CARE'}
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
            <div className="text-[10px] text-slate-400 font-mono">v1.0.0 · Visakhapatnam GVMC</div>
          </div>
        </aside>

        {/* Screen Router Viewport */}
        <main className="flex-1 overflow-y-auto pb-12">
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
