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
  LogOut,
  Languages,
  CheckCircle2,
  HardHat,
  Camera,
} from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isDisasterMode: boolean;
  currentRole: UserRole;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  currentUser?: UserProfile | null;
  officialSession?: {
    role: UserRole;
    name: string;
    id: string;
    designation: string;
  } | null;
  onOpenAccount?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  isDisasterMode,
  currentRole,
  isSidebarOpen = true,
  onToggleSidebar,
  currentUser,
  officialSession,
  onOpenAccount,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'TE'>('EN');

  const getScreenMeta = (screen: ScreenId) => {
    switch (screen) {
      case 'citizen_home_normal':
        return { section: 'Civic Governance', title: currentLang === 'TE' ? 'పౌర వేదిక & సమస్యల నివేదిక' : 'Citizen Portal & Defect Feed' };
      case 'citizen_home_disaster':
        return { section: 'Emergency Response', title: currentLang === 'TE' ? 'తుఫాను మొంథా అత్యవసర కేంద్రం' : 'Cyclone Montha Disaster Hub' };
      case 'gvmc_admin_dashboard':
        return { section: 'GVMC Zone 2 Works', title: 'Admin Command Console' };
      case 'ndrf_dispatcher_dashboard':
        return { section: 'NDRF 10th Battalion', title: 'Tactical War Room' };
      case 'camera_defect_capture':
        return { section: 'Civic Defect Intake', title: currentLang === 'TE' ? 'కెమెరా జియోట్యాగ్ నివేదన' : 'Camera & RTK Geotagging' };
      case 'public_ticket_stepper':
        return { section: 'Transparency Audit', title: currentLang === 'TE' ? '5-దశల ప్రజా పురోగతి' : '5-Stage Public SLA Stepper' };
      case 'spatial_dedup_notice':
        return { section: 'Geospatial Intelligence', title: '50m PostGIS Cluster Radar' };
      case 'cyclone_shelter_capacity':
        return { section: 'Evacuation Logistics', title: currentLang === 'TE' ? 'పునరావాస కేంద్రాల సామర్థ్యం' : 'Relief Shelter Capacities' };
      case 'elder_sos_trigger':
        return { section: 'Life Safety Priority', title: currentLang === 'TE' ? 'వృద్ధుల అత్యవసర SOS' : 'Emergency Elder SOS Dispatch' };
      case 'volunteer_proximity':
        return { section: 'Community Mobilization', title: '500m Volunteer Proximity Radar' };
      case 'volunteer_interest_form':
        return { section: 'Civilian Corps', title: currentLang === 'TE' ? 'వాలంటీర్ నమోదు' : 'Disaster Volunteer Registration' };
      case 'ndrf_volunteer_hub':
        return { section: 'NDRF Command', title: 'Volunteer Force Management' };
      case 'field_worker_checkin':
        return { section: 'Municipal Field Crew', title: 'Geofenced Check-In & Proof' };
      case 'hazard_navigation_map':
        return { section: 'Safe Evacuation GIS', title: currentLang === 'TE' ? 'సురక్షిత తరలింపు మ్యాప్' : 'Dynamic Hazard Avoidance' };
      case 'district_collector_switcher':
        return { section: 'District Magistracy', title: 'Executive Mode Override' };
      case 'elder_profile_setup':
        return { section: 'Vulnerability Registry', title: currentLang === 'TE' ? 'వృద్ధుల ఆరోగ్య వివరాలు' : 'Elder & Medical Profile' };
      default:
        return { section: 'JanRakshak', title: 'Operations Dashboard' };
    }
  };

  const screenMeta = getScreenMeta(currentScreen);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-colors">
      {/* GovTech National Tricolor Accent Ribbon */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-500 via-slate-100 to-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left Zone: Sidebar Toggle + Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="hidden lg:flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
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
              <div className="relative">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm transition-transform group-hover:scale-105 ${
                    isDisasterMode
                      ? 'bg-gradient-to-br from-red-600 to-red-700 shadow-red-500/20 glow-red'
                      : currentRole === 'GVMC_ADMIN'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-blue-500/20'
                      : currentRole === 'NDRF_ADMIN'
                      ? 'bg-gradient-to-br from-amber-600 to-amber-700 shadow-amber-500/20'
                      : 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/20'
                  }`}
                >
                  {isDisasterMode ? (
                    <Flame className="w-5 h-5 text-white animate-pulse" />
                  ) : currentRole === 'GVMC_ADMIN' ? (
                    <Building2 className="w-5 h-5 text-white" />
                  ) : currentRole === 'NDRF_ADMIN' ? (
                    <ShieldAlert className="w-5 h-5 text-white" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-white" />
                  )}
                </div>
                {/* Status Dot */}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    isDisasterMode
                      ? 'bg-red-500 animate-ping'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight">
                    JanRakshak
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200 uppercase hidden sm:inline">
                    AP GovTech
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono font-medium tracking-wide">
                  {currentRole === 'CITIZEN' ? 'CIVIC & DISASTER SUITE' : currentRole === 'GVMC_ADMIN' ? 'GVMC WORKS TERMINAL' : 'NDRF TACTICAL COMMAND'}
                </span>
              </div>
            </button>
          </div>

          {/* Center Zone: Active Workspace Context Breadcrumb */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <span className="uppercase tracking-wider font-bold text-slate-500">{screenMeta.section}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-700 font-semibold truncate max-w-[200px]">{screenMeta.title}</span>
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

          {/* Right Zone: Controls, Notifications, Identity, Mode Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher Pill (EN / తెలుగు) */}
            <button
              type="button"
              onClick={() => setCurrentLang(currentLang === 'EN' ? 'TE' : 'EN')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-all cursor-pointer shadow-2xs"
              title="Toggle Telugu / English Language"
            >
              <Languages className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentLang === 'EN' ? 'తెలుగు' : 'English'}</span>
            </button>

            {/* Quick Emergency SOS Button in Header (Citizens only) */}
            {currentRole === 'CITIZEN' && (
              <button
                type="button"
                onClick={() => onNavigate('elder_sos_trigger')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer border border-red-500"
                title="Trigger Emergency Elder SOS"
              >
                <AlertOctagon className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
                <span>{currentLang === 'TE' ? 'అత్యవసర SOS' : 'Emergency SOS'}</span>
              </button>
            )}

            {/* Notifications Advisory Bell with Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer border relative ${
                  showNotifications
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="System Advisories & Alerts"
                aria-label="View system notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      Live GovTech Advisories
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
                        <span className="text-[10px] font-mono bg-red-200 text-red-800 px-1 rounded">RED</span>
                      </div>
                      <p className="text-[11px] text-red-800 leading-snug">
                        Severe Cyclone Montha landfall in 4h. 18 cyclone shelters operational with power backup.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-blue-600" />
                          <span>50m Spatial Deduplication</span>
                        </span>
                        <span className="text-[10px] font-mono bg-blue-200 text-blue-800 px-1 rounded">ACTIVE</span>
                      </div>
                      <p className="text-[11px] text-blue-800 leading-snug">
                        PostGIS ST_DWithin clustering duplicate road reports automatically into single work orders.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1">
                          <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Civilian Volunteer Corps</span>
                        </span>
                        <span className="text-[10px] font-mono bg-emerald-200 text-emerald-800 px-1 rounded">ONLINE</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-snug">
                        42 local community first responders mobilised in Ward 14 coastal sector.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Context-Aware Identity / Account Badges */}
            {currentRole === 'CITIZEN' ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={onOpenAccount}
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-50/90 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="View JanRakshak Citizen Account & Aadhaar Status"
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline max-w-[120px] truncate font-bold">
                    {currentUser?.fullName || 'Citizen Account'}
                  </span>
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-md font-mono font-bold flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>Aadhaar</span>
                  </span>
                </button>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-slate-200 hover:border-red-200"
                    title="Sign Out of Citizen Portal"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              /* Authorized Official Personnel Terminal Header Zone */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono border border-slate-800 shadow-2xs">
                  {currentRole === 'GVMC_ADMIN' ? (
                    <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  )}
                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-bold text-white max-w-[120px] sm:max-w-[170px] truncate" title={officialSession?.name}>
                      {officialSession?.name || (currentRole === 'GVMC_ADMIN' ? 'GVMC Officer' : 'NDRF Commander')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      {officialSession?.id || (currentRole === 'GVMC_ADMIN' ? 'GVMC WORKS' : 'NDRF 10TH BN')}
                    </span>
                  </div>
                </div>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-2.5 py-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                    title="Exit Government Officer Terminal"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Exit</span>
                  </button>
                )}
              </div>
            )}

            {/* Header Mode Toggle Button (Strictly for Citizens to switch Civic vs Disaster Hub) */}
            {currentRole === 'CITIZEN' && (
              <button
                id="headerModeToggle"
                onClick={() => onNavigate(isDisasterMode ? 'citizen_home_normal' : 'citizen_home_disaster')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                  isDisasterMode
                    ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500'
                    : 'bg-red-600 text-white border-red-700 hover:bg-red-500'
                }`}
                title="Toggle Civic Normal / Disaster Emergency Mode"
              >
                {isDisasterMode ? (
                  <>
                    <Home className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">{currentLang === 'TE' ? 'సాధారణ పౌర వేదిక' : 'Normal Civic'}</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
                    <span className="hidden xl:inline">{currentLang === 'TE' ? 'విపత్తు వేదిక' : 'Disaster Hub'}</span>
                  </>
                )}
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 flex flex-col gap-2.5">
            {onOpenAccount && currentRole === 'CITIZEN' && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs">{currentUser?.fullName || 'Citizen Account'}</div>
                  <div className="text-[10px] text-blue-700 font-mono">
                    {currentUser?.aadhaarNumber ? `Aadhaar: ${currentUser.aadhaarNumber}` : 'Pre-verified Citizen'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    onOpenAccount();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  Manage
                </button>
              </div>
            )}

            {currentRole !== 'CITIZEN' && officialSession && (
              <div className="p-3 mb-1 rounded-xl bg-slate-900 border border-slate-800 text-white flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-bold text-xs text-white truncate">{officialSession.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{officialSession.designation} ({officialSession.id})</div>
                </div>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded shrink-0">
                  {officialSession.role === 'GVMC_ADMIN' ? 'GVMC' : 'NDRF'}
                </span>
              </div>
            )}

            {/* Role-Specific Mobile Menu Buttons */}
            {currentRole === 'CITIZEN' && (
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    onNavigate('citizen_home_normal');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-semibold text-slate-700"
                >
                  <Home className="w-3.5 h-3.5 text-blue-600" /> Civic Home
                </button>
                <button
                  onClick={() => {
                    onNavigate('camera_defect_capture');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-semibold text-slate-700"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-600" /> Snap Defect
                </button>
                <button
                  onClick={() => {
                    onNavigate('public_ticket_stepper');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-semibold text-slate-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 5-Stage SLA
                </button>
                <button
                  onClick={() => {
                    onNavigate('spatial_dedup_notice');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-semibold text-slate-700"
                >
                  <Layers className="w-3.5 h-3.5 text-blue-600" /> 50m Radar
                </button>
                <button
                  onClick={() => {
                    onNavigate('hazard_navigation_map');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-semibold text-slate-700"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-600" /> Evacuation Route
                </button>
                <button
                  onClick={() => {
                    onNavigate('elder_sos_trigger');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 text-red-700 font-bold cursor-pointer"
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-red-600" /> Elder SOS
                </button>
              </div>
            )}

            {currentRole === 'GVMC_ADMIN' && (
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    onNavigate('gvmc_admin_dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-bold text-blue-700"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> Works Console
                </button>
                <button
                  onClick={() => {
                    onNavigate('public_ticket_stepper');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-semibold text-slate-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SLA Audit
                </button>
                <button
                  onClick={() => {
                    onNavigate('hazard_navigation_map');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-semibold text-slate-700"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-600" /> Detour GIS
                </button>
                <button
                  onClick={() => {
                    onNavigate('field_worker_checkin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-semibold text-slate-700"
                >
                  <HardHat className="w-3.5 h-3.5 text-amber-600" /> Field Crew
                </button>
              </div>
            )}

            {currentRole === 'NDRF_ADMIN' && (
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    onNavigate('ndrf_dispatcher_dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-bold text-amber-700"
                >
                  <Radio className="w-3.5 h-3.5 text-amber-600" /> War Room
                </button>
                <button
                  onClick={() => {
                    onNavigate('ndrf_volunteer_hub');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-semibold text-slate-700"
                >
                  <Users className="w-3.5 h-3.5 text-blue-600" /> Volunteers
                </button>
                <button
                  onClick={() => {
                    onNavigate('volunteer_proximity');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-semibold text-slate-700"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" /> Radar
                </button>
                <button
                  onClick={() => {
                    onNavigate('cyclone_shelter_capacity');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-semibold text-slate-700"
                >
                  <LifeBuoy className="w-3.5 h-3.5 text-cyan-600" /> Shelters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
