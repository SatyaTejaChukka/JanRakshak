import React, { useState } from 'react';
import { ScreenId, UserRole, UserProfile } from '../types';
import {
  ShieldAlert,
  Flame,
  Radio,
  Compass,
  Home,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  LifeBuoy,
  Bell,
  User,
  Building2,
  Users,
  Layers,
  HeartHandshake,
  AlertOctagon,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isDisasterMode: boolean;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  currentUser?: UserProfile | null;
  onOpenAccount?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  isDisasterMode,
  currentRole,
  onSelectRole,
  isSidebarOpen = true,
  onToggleSidebar,
  currentUser,
  onOpenAccount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getScreenMeta = (screen: ScreenId) => {
    switch (screen) {
      case 'citizen_home_normal':
        return { section: 'Civic Governance', title: 'Citizen Portal & Defect Feed' };
      case 'citizen_home_disaster':
        return { section: 'Emergency Response', title: 'Cyclone Montha Disaster Hub' };
      case 'gvmc_admin_dashboard':
        return { section: 'GVMC Zone 2 Works', title: 'Admin Command Console' };
      case 'ndrf_dispatcher_dashboard':
        return { section: 'NDRF 10th Battalion', title: 'Tactical War Room' };
      case 'camera_defect_capture':
        return { section: 'Civic Defect Intake', title: 'Camera & RTK Geotagging' };
      case 'public_ticket_stepper':
        return { section: 'Transparency Audit', title: '5-Stage Public SLA Stepper' };
      case 'spatial_dedup_notice':
        return { section: 'Geospatial Intelligence', title: '50m PostGIS Cluster Radar' };
      case 'cyclone_shelter_capacity':
        return { section: 'Evacuation Logistics', title: 'Relief Shelter Capacities' };
      case 'elder_sos_trigger':
        return { section: 'Life Safety Priority', title: 'Emergency Elder SOS Dispatch' };
      case 'volunteer_proximity':
        return { section: 'Community Mobilization', title: '500m Volunteer Proximity Radar' };
      case 'volunteer_interest_form':
        return { section: 'Civilian Corps', title: 'Disaster Volunteer Registration' };
      case 'ndrf_volunteer_hub':
        return { section: 'NDRF Command', title: 'Volunteer Force Management' };
      case 'field_worker_checkin':
        return { section: 'Municipal Field Crew', title: 'Geofenced Check-In & Proof' };
      case 'hazard_navigation_map':
        return { section: 'Safe Evacuation GIS', title: 'Dynamic Hazard Avoidance' };
      case 'district_collector_switcher':
        return { section: 'District Magistracy', title: 'Executive Mode Override' };
      case 'elder_profile_setup':
        return { section: 'Vulnerability Registry', title: 'Elder & Medical Profile' };
      default:
        return { section: 'JanRakshak', title: 'Operations Dashboard' };
    }
  };

  const screenMeta = getScreenMeta(currentScreen);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left Zone: Sidebar Toggle + Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="hidden lg:flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label={isSidebarOpen ? 'Collapse navigation sidebar' : 'Expand navigation sidebar'}
                title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-5 h-5" />
                ) : (
                  <PanelLeft className="w-5 h-5" />
                )}
              </button>
            )}

            <button
              onClick={() => {
                if (currentRole === 'GVMC_ADMIN') {
                  onNavigate('gvmc_admin_dashboard');
                } else if (currentRole === 'NDRF_ADMIN') {
                  onNavigate('ndrf_dispatcher_dashboard');
                } else {
                  onNavigate(isDisasterMode ? 'citizen_home_disaster' : 'citizen_home_normal');
                }
              }}
              className="text-left flex items-center gap-2.5 group cursor-pointer focus:outline-none"
              aria-label="JanRakshak Home"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white transition-colors ${
                  isDisasterMode ? 'bg-red-600' : 'bg-blue-600'
                }`}
              >
                {isDisasterMode ? <Flame className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                  JanRakshak
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                  CIVIC & DISASTER PLATFORM
                </span>
              </div>
            </button>
          </div>

          {/* Center Zone: Active Workspace Context Breadcrumb */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <span className="uppercase tracking-wider">{screenMeta.section}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-600 font-semibold">{screenMeta.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                  {screenMeta.title}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isDisasterMode ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                  }`}
                  title={isDisasterMode ? 'Disaster Red Alert Active' : 'Normal Civic Operations'}
                />
              </div>
            </div>
          </div>

          {/* Right Zone: Account Profile + Role Selector + Notifications + Mode Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            {/* User Account Button (Requirement 1) */}
            {onOpenAccount && (
              <button
                type="button"
                onClick={onOpenAccount}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title={currentUser ? `Logged in: ${currentUser.fullName}` : 'Open / Create Citizen Account'}
              >
                <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="hidden md:inline font-bold">
                  {currentUser ? currentUser.fullName.split(' ')[0] : 'Open Account'}
                </span>
                {currentUser && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Aadhaar Verified" />
                )}
              </button>
            )}

            {/* Quick Emergency SOS Button in Header */}
            {currentRole === 'CITIZEN' && (
              <button
                type="button"
                onClick={() => onNavigate('elder_sos_trigger')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
                title="Trigger Emergency Elder SOS"
              >
                <AlertOctagon className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
                <span>Emergency SOS</span>
              </button>
            )}

            {/* Notifications Advisory Bell with Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                  showNotifications
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="System Advisories & Alerts"
                aria-label="View system notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      Civic & Disaster Advisories
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 font-mono cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-red-600" />
                          <span>IMD Cyclone Alert</span>
                        </span>
                        <span className="text-[10px] font-mono text-red-600">LIVE</span>
                      </div>
                      <p className="text-[11px] text-red-800 leading-snug">
                        Severe Cyclone Montha landfall in 4h. 18 cyclone shelters operational with diesel generators.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-blue-600" />
                          <span>50m Deduplication Active</span>
                        </span>
                        <span className="text-[10px] font-mono text-blue-600">PostGIS</span>
                      </div>
                      <p className="text-[11px] text-blue-800 leading-snug">
                        Spatial radius ST_DWithin clustering duplicate reports on RK Beach road.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1">
                          <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Volunteer Corps</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-600">Mobilized</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-snug">
                        Community First Responders deployed for coastal evacuation sweeps.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RBAC Role Selector Pill */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onSelectRole('CITIZEN')}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentRole === 'CITIZEN'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to General Public / Citizen View"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectRole('GVMC_ADMIN')}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentRole === 'GVMC_ADMIN'
                    ? 'bg-white text-blue-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to GVMC Municipal Works Admin"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-700" />
                <span className="hidden sm:inline">GVMC</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectRole('NDRF_ADMIN')}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentRole === 'NDRF_ADMIN'
                    ? 'bg-white text-amber-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to NDRF 10th Bn Tactical Command"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">NDRF</span>
              </button>
            </div>

            {/* Header Mode Toggle Button */}
            <button
              id="headerModeToggle"
              onClick={() => onNavigate(isDisasterMode ? 'citizen_home_normal' : 'citizen_home_disaster')}
              className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isDisasterMode
                  ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                  : 'bg-red-600 text-white border-red-700 hover:bg-red-700'
              }`}
              title="Toggle Civic Normal / Disaster Emergency Mode"
            >
              {isDisasterMode ? (
                <>
                  <Home className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Normal Mode</span>
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Disaster Mode</span>
                </>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 flex flex-col gap-2.5">
            {onOpenAccount && (
              <div className="px-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenAccount();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>{currentUser ? `Account: ${currentUser.fullName}` : 'Open Citizen Account'}</span>
                  </div>
                  {currentUser && (
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-mono">
                      Verified
                    </span>
                  )}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Switch User Role</span>
              <span className="font-mono text-slate-500">Active: {currentRole}</span>
            </div>

            <div className="grid grid-cols-3 gap-1 px-1">
              <button
                onClick={() => {
                  onSelectRole('CITIZEN');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-semibold flex items-center justify-center gap-1 cursor-pointer ${
                  currentRole === 'CITIZEN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Citizen
              </button>
              <button
                onClick={() => {
                  onSelectRole('GVMC_ADMIN');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-semibold flex items-center justify-center gap-1 cursor-pointer ${
                  currentRole === 'GVMC_ADMIN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> GVMC
              </button>
              <button
                onClick={() => {
                  onSelectRole('NDRF_ADMIN');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-semibold flex items-center justify-center gap-1 cursor-pointer ${
                  currentRole === 'NDRF_ADMIN' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> NDRF
              </button>
            </div>

            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 pt-2 border-t border-slate-100">
              Navigation
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  onNavigate('citizen_home_normal');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-blue-600" /> Civic Portal
              </button>
              <button
                onClick={() => {
                  onNavigate('citizen_home_disaster');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-red-600" /> Disaster Hub
              </button>
              <button
                onClick={() => {
                  onNavigate('hazard_navigation_map');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-600" /> Evacuation Route
              </button>
              <button
                onClick={() => {
                  onNavigate('elder_sos_trigger');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center gap-2 text-red-700 font-bold cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Elder SOS
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
