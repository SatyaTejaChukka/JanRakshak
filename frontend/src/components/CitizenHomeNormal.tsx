import React, { useState } from 'react';
import { ScreenId, Ticket, UserProfile } from '../types';
import { isUserTicketOwner } from '../utils/logic';
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
  Activity,
  ShieldCheck,
  Check,
  UserCheck,
  Building2,
  Zap,
  Waves,
  Hammer,
  User,
  ClipboardList,
} from 'lucide-react';

interface CitizenHomeNormalProps {
  tickets: Ticket[];
  onNavigate: (screen: ScreenId, category?: Ticket['category']) => void;
  onSelectTicket: (ticketId: string) => void;
  currentUser?: UserProfile | null;
}

export const CitizenHomeNormal: React.FC<CitizenHomeNormalProps> = ({
  tickets,
  onNavigate,
  onSelectTicket,
  currentUser,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Strictly isolate data: only complaints filed by this specific authenticated citizen
  const myTickets = tickets.filter((t) => isUserTicketOwner(t, currentUser));

  const filteredTickets = myTickets.filter((t) => {
    const matchesCategory =
      activeFilter === 'all' ||
      (activeFilter === 'pothole' && t.category.includes('Pothole')) ||
      (activeFilter === 'drainage' && t.category.includes('Drainage')) ||
      (activeFilter === 'electrical' && (t.category.includes('Power') || t.category.includes('Tree')));
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate user-scoped civic stats
  const totalReports = myTickets.length;
  const resolvedReports = myTickets.filter((t) => t.currentStage === 'resolved').length;
  const inProgressReports = myTickets.filter((t) => t.currentStage === 'in_progress' || t.currentStage === 'assigned').length;
  const mergedClusterCount = myTickets.reduce((acc, t) => acc + (t.mergedCount || 1), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7 font-sans">
      {/* Broadcast Alert Ribbon: xpath: //div[@id='broadcastBanner'] */}
      <div
        id="broadcastBanner"
        onClick={() => onNavigate('citizen_home_disaster')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate('citizen_home_disaster')}
        className="w-full bg-gradient-to-r from-red-600 via-red-700 to-rose-700 text-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-red-500/60 glow-red"
        aria-label="IMD Severe Cyclone Warning Banner"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shrink-0 shadow-inner">
            <Flame className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-black tracking-wider uppercase bg-white/25 px-2 py-0.5 rounded-full border border-white/30">
                IMD Red Alert · Montha
              </span>
              <span className="text-xs text-red-100 font-mono hidden sm:inline">
                Landfall Projected: 4 Hours
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-1 tracking-tight">
              Severe Cyclonic Storm &apos;Montha&apos; Approaching Visakhapatnam Coast
            </h2>
            <p className="text-xs text-red-100 mt-0.5 leading-relaxed max-w-2xl">
              110–130 km/h gusts with +3.8m storm surge. 18 reinforced multi-purpose cyclone shelters operational.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-white text-red-700 hover:bg-red-50 font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-transform active:scale-95 self-end sm:self-center">
          <span>Open Disaster Hub</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Hero Quick Action Bar & Snap Report Button */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle Background Geometric Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/5 via-indigo-500/5 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold uppercase border border-blue-200">
                Ward 14 Civic Governance
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                PostGIS 50m Spatial Deduplication
              </span>
              <span>·</span>
              <span className="text-slate-600">RTK GPS Precision Geotagging</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Spot a Civic Defect? Report with Instant AI Spatial Check
            </h1>

            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Snap a single photo. Our 50-meter spatial engine checks duplicate filings automatically, merging upvotes to fast-track municipal road and drain repairs within 48 hours.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            {/* snapReportBtn: xpath: //button[@id='snapReportBtn'] */}
            <button
              id="snapReportBtn"
              onClick={() => onNavigate('camera_defect_capture')}
              className="px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-md shadow-blue-500/25 transition-all flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Snap & Report Defect</span>
            </button>

            {/* trackReportBtn: xpath: //button[@id='trackReportBtn'] */}
            <button
              id="trackReportBtn"
              onClick={() => {
                if (myTickets.length > 0) {
                  onSelectTicket(myTickets[0].id);
                } else {
                  onSelectTicket('');
                }
                onNavigate('public_ticket_stepper');
              }}
              className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-2xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {myTickets.length > 0
                  ? `Track My Reports (${myTickets.length})`
                  : 'Track My Reports (0)'}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Category Triggers Grid */}
        <div className="mt-7 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('camera_defect_capture', 'Pothole & Craters')}
            className="p-3.5 text-left rounded-2xl bg-slate-50/80 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 transition-all group cursor-pointer active:scale-95"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Potholes & Cracks
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Road craters, sinkholes</p>
          </button>

          <button
            onClick={() => onNavigate('camera_defect_capture', 'Drainage Block')}
            className="p-3.5 text-left rounded-2xl bg-slate-50/80 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 transition-all group cursor-pointer active:scale-95"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Drainage Silt Choke
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Overflowing storm drains</p>
          </button>

          <button
            onClick={() => onNavigate('camera_defect_capture', 'Fallen Tree & Power Line')}
            className="p-3.5 text-left rounded-2xl bg-slate-50/80 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 transition-all group cursor-pointer active:scale-95"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Snapped Power Line
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Fallen feeder poles & lines</p>
          </button>

          <button
            onClick={() => onNavigate('spatial_dedup_notice')}
            className="p-3.5 text-left rounded-2xl bg-slate-50/80 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 transition-all group cursor-pointer active:scale-95"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                50m Spatial Merge
              </span>
              <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Inspect cluster deduplication</p>
          </button>
        </div>
      </div>

      {/* Ward 14 Live Operational Telemetry Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Total Reports</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{totalReports}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <span className="text-emerald-600 font-bold">{resolvedReports} Resolved</span>
            <span>· {inProgressReports} In Progress</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Deduplicated</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
            {mergedClusterCount}
          </div>
          <div className="text-[11px] text-slate-500">
            Clustered via <span className="font-bold text-slate-700">50m PostGIS buffer</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">On-Time SLA</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">94.2%</div>
          <div className="text-[11px] text-slate-500">
            Municipal standard: <span className="font-bold text-slate-700">&lt; 48 Hours</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Ward Field Crews</span>
            <Hammer className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700 font-mono">7 Active</div>
          <div className="text-[11px] text-slate-500">
            Equipped with <span className="font-bold text-slate-700">GPS geofenced proof</span>
          </div>
        </div>
      </div>

      {/* User-Scoped Civic Tickets Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-xl text-xs font-bold font-mono bg-blue-600 text-white shadow-xs flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>My Filed Reports ({myTickets.length})</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Showing only reports filed under <strong className="text-slate-700">{currentUser?.fullName || 'Your Account'}</strong> ({currentUser?.mobileNumber || ''}) with real-time 5-stage SLA tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ticket ID, ward, road..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 w-44 sm:w-60 shadow-2xs"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold font-mono">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('pothole')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'pothole' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Potholes
              </button>
              <button
                onClick={() => setActiveFilter('drainage')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'drainage' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Drains
              </button>
              <button
                onClick={() => setActiveFilter('electrical')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'electrical' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Power
              </button>
            </div>
          </div>
        </div>

        {/* Ticket List Cards */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {myTickets.length === 0 ? 'No Complaints Filed by You Yet' : 'No Matching Reports Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {myTickets.length === 0
                ? 'You have not submitted any civic complaints yet. Tap Snap & Report to log road craters or drainage issues with GPS proof.'
                : 'Try selecting a different category filter or clearing your search keywords.'}
            </p>
            {myTickets.length === 0 && (
              <button
                onClick={() => onNavigate('camera_defect_capture')}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Snap & Report Defect</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {t.id}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{t.reportedAt}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {t.title}
                  </h3>

                  <div className="flex items-start gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 text-xs leading-tight">{t.location}</span>
                  </div>

                  {/* Spatial merge notification if >1 citizen */}
                  {t.mergedCount > 1 && (
                    <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t.mergedCount} Reports Merged (50m cluster)</span>
                      </span>
                      <button
                        onClick={() => onNavigate('spatial_dedup_notice')}
                        className="text-blue-700 underline font-bold hover:text-blue-900 cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  )}
                </div>

                {/* 5-Stage Mini Stepper Strip */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                      Status
                    </span>
                    <span className="font-bold text-slate-800 capitalize bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {t.currentStage.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Visual 5-Stage Mini Bar */}
                  <div className="grid grid-cols-5 gap-1">
                    {['submitted', 'deduplicated', 'assigned', 'in_progress', 'resolved'].map((stage, idx) => {
                      const stages = ['submitted', 'deduplicated', 'assigned', 'in_progress', 'resolved'];
                      const currentIdx = stages.indexOf(t.currentStage);
                      const isCompleted = idx <= currentIdx;
                      return (
                        <div
                          key={stage}
                          className={`h-1.5 rounded-full transition-colors ${
                            isCompleted
                              ? t.currentStage === 'resolved'
                                ? 'bg-emerald-500'
                                : 'bg-blue-600'
                              : 'bg-slate-200'
                          }`}
                          title={stage.replace('_', ' ')}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">
                      SLA: {t.targetSlaHours || 48} Hours
                    </span>

                    <button
                      onClick={() => {
                        onSelectTicket(t.id);
                        onNavigate('public_ticket_stepper');
                      }}
                      className="px-3 py-1 text-xs font-bold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 rounded-lg transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <span>Track 5-Stages</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Senior Citizens & Special Assistance Strip */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>SPECIAL ASSISTANCE REGISTRY · VISAKHAPATNAM</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Register Bedridden or Wheelchair Elders Before Disasters
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Prioritize power backup for oxygen concentrators, cold-chain insulin storage, and coordinate high-floor evacuation with 42 verified community volunteers.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('elder_profile_setup')}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
          >
            <span>Elder Profile Setup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('elder_sos_trigger')}
            className="px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 glow-red"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Emergency Elder SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
