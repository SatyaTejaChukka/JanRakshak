import React from 'react';
import { ScreenId, Ticket } from '../types';
import {
  Camera,
  AlertTriangle,
  Flame,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Layers,
  Sparkles,
  PhoneCall,
  Search,
} from 'lucide-react';

interface CitizenHomeNormalProps {
  tickets: Ticket[];
  onNavigate: (screen: ScreenId) => void;
  onSelectTicket: (ticketId: string) => void;
}

export const CitizenHomeNormal: React.FC<CitizenHomeNormalProps> = ({
  tickets,
  onNavigate,
  onSelectTicket,
}) => {
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const filteredTickets = tickets.filter((t) => {
    const matchesCategory =
      activeFilter === 'all' ||
      (activeFilter === 'pothole' && t.category.includes('Pothole')) ||
      (activeFilter === 'drainage' && t.category.includes('Drainage')) ||
      (activeFilter === 'electrical' && t.category.includes('Power'));
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Broadcast Banner: xpath: //div[@id='broadcastBanner'] */}
      <div
        id="broadcastBanner"
        onClick={() => onNavigate('citizen_home_disaster')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate('citizen_home_disaster')}
        className="w-full bg-red-700 text-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-red-600"
        aria-label="IMD Severe Cyclone Warning Banner"
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg shrink-0">
            <Flame className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded">
                IMD Red Alert
              </span>
              <span className="text-xs text-red-100 font-mono">Issued 08:00 AM Today</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              Severe Cyclonic Storm &apos;Montha&apos; Approaching Visakhapatnam Coast
            </h2>
            <p className="text-xs sm:text-sm text-red-100 mt-0.5">
              Wind speeds 110-130 km/h with extreme tidal surge. 18 Multipurpose Shelters activated across coastal wards.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs sm:text-sm font-semibold underline underline-offset-2">Open Disaster Mode</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Hero Quick Action Bar & Snap Report Button */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Ward 14 Civic Governance</span>
              <span>·</span>
              <span>GPS Precision Geotagging</span>
              <span>·</span>
              <span>Computer Vision Verified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Spot a Civic Defect? Report with Instant AI Spatial Check
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Take a single photograph. Our 50-meter spatial engine detects duplicate filings automatically, merging upvotes to fast-track municipal road and drain repairs within 48 hours.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            {/* snapReportBtn: xpath: //button[@id='snapReportBtn'] */}
            <button
              id="snapReportBtn"
              onClick={() => onNavigate('camera_defect_capture')}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Snap & Report Defect</span>
            </button>

            {/* enterEmergencyModeBtn: xpath: //button[@id='enterEmergencyModeBtn'] */}
            <button
              id="enterEmergencyModeBtn"
              onClick={() => onNavigate('citizen_home_disaster')}
              className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm rounded-xl border border-red-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-red-600" />
              <span>Emergency Mode</span>
            </button>
          </div>
        </div>

        {/* Quick category triggers as buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('camera_defect_capture')}
            className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Pothole & Road Cracks</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Road craters, trench sinkholes</p>
          </button>

          <button
            onClick={() => onNavigate('camera_defect_capture')}
            className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Drainage Silt Choke</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Overflowing storm drains</p>
          </button>

          <button
            onClick={() => onNavigate('camera_defect_capture')}
            className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Snapped Power Line</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Fallen feeder poles & lines</p>
          </button>

          <button
            onClick={() => onNavigate('spatial_dedup_notice')}
            className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">50m Spatial Merge Test</span>
              <Layers className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Inspect cluster deduplication</p>
          </button>
        </div>
      </div>

      {/* Active Public Civic Tickets Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Public Civic Tickets & Ward Progress</h2>
            <p className="text-xs text-slate-500">Live 5-stage tracking with field-crew verification stamps</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ticket, ward, defect..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-blue-600 w-48 sm:w-64"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('pothole')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeFilter === 'pothole' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Potholes
              </button>
              <button
                onClick={() => setActiveFilter('drainage')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeFilter === 'drainage' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Drains
              </button>
            </div>
          </div>
        </div>

        {/* Ticket List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono font-bold text-slate-700">{t.id}</span>
                  <span className="text-[11px]">{t.reportedAt}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{t.title}</h3>

                <div className="flex items-start gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 text-xs">{t.location}</span>
                </div>

                {/* Spatial merge notification if >1 citizen */}
                {t.mergedCount > 1 && (
                  <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg text-[11px] text-blue-800 flex items-center justify-between">
                    <span className="font-semibold">{t.mergedCount} Citizen Reports Merged (50m cluster)</span>
                    <button
                      onClick={() => onNavigate('spatial_dedup_notice')}
                      className="text-blue-600 underline font-medium hover:text-blue-800"
                    >
                      View Merge
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Status</span>
                  <span className="text-xs font-semibold text-slate-800 capitalize">
                    {t.currentStage.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectTicket(t.id);
                      onNavigate('public_ticket_stepper');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Track 5-Stages</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Elder Vulnerability & Quick Link Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-blue-300">
            <span>Special Assistance Registry</span>
            <span>·</span>
            <span>Senior Citizens & Special Medical Needs</span>
          </div>
          <h3 className="text-lg font-bold">Register Bedridden or Wheelchair Elders Before Disasters</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Prioritize power backup for oxygen machines, insulin cold storage, and coordinate high-floor evacuation with 7 localized verified community volunteers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('elder_profile_setup')}
            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Elder Profile Setup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('elder_sos_trigger')}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Emergency Elder SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
