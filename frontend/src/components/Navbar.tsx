import React from 'react';
import { ScreenId } from '../types';
import {
  ShieldAlert,
  Flame,
  Radio,
  HardHat,
  Compass,
  Home,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  LifeBuoy,
  MapPin,
  Bell,
  Search,
} from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isDisasterMode: boolean;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  isDisasterMode,
  isSidebarOpen = true,
  onToggleSidebar,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left Zone: Sidebar Toggle + Wordmark */}
          <div className="flex items-center gap-3">
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
              onClick={() => onNavigate(isDisasterMode ? 'citizen_home_disaster' : 'citizen_home_normal')}
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

            {/* Jurisdiction / Mode Badges */}
            <div className="hidden md:flex items-center gap-1.5 ml-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-md font-mono font-bold tracking-wide border ${
                  isDisasterMode
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                {isDisasterMode ? '● CYCLONE RED ALERT' : 'CIVIC NORMAL'}
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>Zone 2 • Ward 14 Madhurawada</span>
              </span>
            </div>
          </div>

          {/* Center Zone: Quick Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('citizen_home_normal')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'citizen_home_normal'
                  ? 'text-blue-600 font-semibold underline underline-offset-4'
                  : ''
              }`}
            >
              Civic Portal
            </button>
            <button
              onClick={() => onNavigate('citizen_home_disaster')}
              className={`hover:text-red-600 transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'citizen_home_disaster'
                  ? 'text-red-600 font-semibold underline underline-offset-4'
                  : ''
              }`}
            >
              Disaster Hub
            </button>
            <button
              onClick={() => onNavigate('ndrf_dispatcher_dashboard')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'ndrf_dispatcher_dashboard'
                  ? 'text-slate-900 font-semibold underline underline-offset-4'
                  : ''
              }`}
            >
              NDRF War Room
            </button>
            <button
              onClick={() => onNavigate('hazard_navigation_map')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'hazard_navigation_map'
                  ? 'text-slate-900 font-semibold underline underline-offset-4'
                  : ''
              }`}
            >
              Hazard Map
            </button>
            <button
              onClick={() => onNavigate('district_collector_switcher')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'district_collector_switcher'
                  ? 'text-slate-900 font-semibold underline underline-offset-4'
                  : ''
              }`}
            >
              Collector Switch
            </button>
          </nav>

          {/* Right Zone: Global Mode Switcher + Mobile Hamburger */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Header Mode Toggle Button */}
            <button
              id="headerModeToggle"
              onClick={() => onNavigate(isDisasterMode ? 'citizen_home_normal' : 'citizen_home_disaster')}
              className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-xs ${
                isDisasterMode
                  ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                  : 'bg-red-600 text-white border-red-700 hover:bg-red-700'
              }`}
              title="Toggle Civic Normal / Disaster Emergency Mode"
            >
              {isDisasterMode ? (
                <>
                  <Home className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Normal Mode</span>
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Disaster Mode</span>
                </>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
              JanRakshak Navigation
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  onNavigate('citizen_home_normal');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center gap-2"
              >
                <Home className="w-3.5 h-3.5 text-blue-600" /> Civic Portal
              </button>
              <button
                onClick={() => {
                  onNavigate('citizen_home_disaster');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center gap-2"
              >
                <Flame className="w-3.5 h-3.5 text-red-600" /> Disaster Hub
              </button>
              <button
                onClick={() => {
                  onNavigate('elder_sos_trigger');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center gap-2 text-red-700 font-bold"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Elder SOS
              </button>
              <button
                onClick={() => {
                  onNavigate('hazard_navigation_map');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center gap-2"
              >
                <Compass className="w-3.5 h-3.5 text-blue-600" /> Hazard Map
              </button>
              <button
                onClick={() => {
                  onNavigate('ndrf_dispatcher_dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center gap-2"
              >
                <Radio className="w-3.5 h-3.5 text-amber-600" /> NDRF War Room
              </button>
              <button
                onClick={() => {
                  onNavigate('cyclone_shelter_capacity');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center gap-2"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-blue-600" /> Relief Shelters
              </button>
              <button
                onClick={() => {
                  onNavigate('field_worker_checkin');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center gap-2"
              >
                <HardHat className="w-3.5 h-3.5 text-emerald-600" /> Field Crew
              </button>
              <button
                onClick={() => {
                  onNavigate('district_collector_switcher');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center gap-2"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-slate-700" /> Collector
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
