import React, { useState } from 'react';
import { ScreenId, Ticket } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  Bell,
  BellOff,
  Share2,
  Check,
  MapPin,
  HardHat,
  Hub,
  Navigation,
  ThumbsUp,
  ThumbsDown,
  Info,
  Maximize2,
  ShieldCheck,
  Clock,
  Layers,
  Camera,
  AlertTriangle,
  Send,
  MessageSquare,
} from 'lucide-react';

interface PublicTicketStepperProps {
  ticket: Ticket;
  onNavigate: (screen: ScreenId) => void;
}

export const PublicTicketStepper: React.FC<PublicTicketStepperProps> = ({ ticket, onNavigate }) => {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteType, setVoteType] = useState<'yes' | 'no' | null>(null);
  const [yesVotes, setYesVotes] = useState(14);
  const [noVotes, setNoVotes] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleToggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `JanRakshak Ticket ${ticket.id}`,
          text: `Live status: ${ticket.title} at ${ticket.location}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleVote = (type: 'yes' | 'no') => {
    if (hasVoted) return;
    setHasVoted(true);
    setVoteType(type);
    if (type === 'yes') {
      setYesVotes((prev) => prev + 1);
    } else {
      setNoVotes((prev) => prev + 1);
    }
  };

  const handleToggleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const stageIndexMap: Record<string, number> = {
    submitted: 1,
    deduplicated: 1,
    assigned: 2,
    in_progress: 3,
    resolved: 4,
    closed: 5,
  };
  const activeStage = stageIndexMap[ticket.currentStage] || 3;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('citizen_home_normal')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Civic Portal</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
            PUBLIC SLA TRACKER
          </span>
          <button
            onClick={() => onNavigate('field_worker_checkin')}
            className="text-xs font-semibold text-slate-700 hover:bg-slate-100 bg-white border border-slate-200 px-2.5 py-1 rounded-md transition-colors hidden sm:inline-flex items-center gap-1 cursor-pointer"
          >
            <HardHat className="w-3.5 h-3.5 text-blue-600" />
            <span>Field Crew View</span>
          </button>
        </div>
      </div>

      {/* Interactive Top Action Sub-bar with Live Ticket Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="font-mono font-extrabold text-blue-700 text-sm tracking-tight truncate">
              {ticket.id}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleAlerts}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                alertsEnabled
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
              title={alertsEnabled ? 'Push Alerts Active' : 'Push Alerts Disabled'}
            >
              {alertsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>

            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Share Ticket"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Stage Status Badge */}
        <div className="flex items-center">
          <span className="bg-amber-50 text-amber-900 border border-amber-200 font-mono font-bold text-[11px] px-3 py-1 rounded-full flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {activeStage === 3
                ? 'WORK IN PROGRESS (STAGE 3 OF 5)'
                : activeStage === 4
                ? 'COMPLETED — AWAITING AUDIT (STAGE 4 OF 5)'
                : activeStage === 5
                ? 'RESOLVED & VERIFIED (STAGE 5 OF 5)'
                : `TRIAGED & ASSIGNED (STAGE ${activeStage} OF 5)`}
            </span>
          </span>
        </div>
      </div>

      {/* Incident Summary Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                ticket.severity === 'Critical'
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {ticket.severity.toUpperCase()} PRIORITY (SCORE 48.5)
            </span>
            <span className="text-xs text-slate-500 font-medium">Zone 2 · Ward 14</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {ticket.title}
          </h1>

          <div className="flex items-start gap-1.5 text-slate-600 text-xs mt-1">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>{ticket.location}</span>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-medium">
              Reported by {ticket.mergedCount * 5 || 15} citizens (Merged via PostGIS 50m radius)
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60 text-[11px]">
            <span>Logged: {ticket.reportedAt}</span>
            <span className="bg-blue-100 text-blue-800 font-mono font-bold px-2 py-0.5 rounded">
              RTK GPS Verified
            </span>
          </div>
        </div>

        {/* Assigned Squad Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <HardHat className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase text-slate-400 font-bold">Assigned Unit</p>
              <p className="text-xs font-bold text-slate-900 truncate">
                {ticket.assignedCrew?.workerName || 'APEPDCL Line Crew & GVMC Squad #4'}
              </p>
            </div>
          </div>

          <span className="bg-white border border-slate-200 text-emerald-800 font-mono font-bold text-xs px-3 py-1 rounded-full shrink-0 shadow-2xs">
            SLA: 45m Remaining
          </span>
        </div>
      </div>

      {/* Interactive Mini GIS Ward Map Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950">
          {/* Technical Vector GIS Grid Background */}
          <div className="w-full h-full bg-[#0B1120] relative flex items-center justify-center">
            {/* GIS Grid Mesh */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="50%" cy="50%" r="35" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
              <circle cx="50%" cy="50%" r="70" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />
            </svg>

            {/* Target Reticle Centered on Ticket Coordinates */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="w-4 h-4 rounded-full bg-blue-500/30 animate-ping absolute" />
              <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md relative z-10" />
              <span className="font-mono text-[10px] font-bold text-sky-300 bg-slate-950/85 px-2 py-0.5 rounded mt-1.5 border border-slate-800">
                {ticket.coordinates.latitude.toFixed(4)}° N, {ticket.coordinates.longitude.toFixed(4)}° E
              </span>
            </div>
          </div>

          {/* Map Overlay & Cluster Perimeter */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-3.5 pointer-events-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-slate-900 text-xs font-semibold shadow-md pointer-events-auto">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span>Cluster Perimeter: 40m Active Radius</span>
              </div>

              <button
                onClick={() => onNavigate('hazard_navigation_map')}
                className="bg-white text-blue-700 w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-slate-100 transition-colors cursor-pointer pointer-events-auto"
                title="Expand Full GIS Hazard Map"
                aria-label="Expand GIS Map"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Stage Action Ledger (Vertical Progress Timeline) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">5-Stage Action Ledger</h2>
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            High Accountability
          </span>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-7 flex flex-col gap-6 pt-1">
          {/* Timeline Connector Line */}
          <div className="absolute left-[11px] top-3 bottom-4 w-0.5 bg-slate-200" />

          {/* Stage 1: Considered & Clustered */}
          <div className="relative flex items-start gap-3">
            <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 w-full space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Stage 1 — Considered & Clustered</h3>
                <span className="text-[11px] font-mono text-slate-400">2:16 PM</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Auto-verified via RTK GPS. Merged {ticket.mergedCount * 5 || 15} duplicate community calls into Master Work Order #{ticket.id}.
              </p>
            </div>
          </div>

          {/* Stage 2: Assigned Staff */}
          <div className="relative flex items-start gap-3">
            <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 w-full space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Stage 2 — Assigned Staff</h3>
                <span className="text-[11px] font-mono text-slate-400">2:20 PM</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assigned to Er. K. Ramesh Naidu (APEPDCL & GVMC Civil Task Force). Target resolution SLA: 45 Mins.
              </p>
            </div>
          </div>

          {/* Stage 3: Work In Progress (ACTIVE) */}
          <div className="relative flex items-start gap-3">
            <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            </div>
            <div className="bg-blue-50/80 border border-blue-300 rounded-xl p-3.5 w-full space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-blue-900">Stage 3 — Work In Progress</h3>
                <span className="text-[11px] font-mono font-bold text-blue-700">2:45 PM (Active)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Crew checked in on-site with hydraulic chainsaws & crane tender. 11kV electrical grid isolation complete.
              </p>

              {/* Micro Geo-Proof Thumbnail (Real User/Crew Image Only) */}
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-blue-200 shadow-2xs">
                {ticket.afterImageUrl || ticket.beforeImageUrl ? (
                  <img
                    src={ticket.afterImageUrl || ticket.beforeImageUrl}
                    alt="Crew Check-in proof"
                    className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                    <Camera className="w-6 h-6" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-blue-900 block truncate">
                    Crew Check-In Verified
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    Lat {ticket.coordinates.latitude.toFixed(4)}° N, Lon {ticket.coordinates.longitude.toFixed(4)}° E
                  </span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
            </div>
          </div>

          {/* Stage 4: Completed (Upcoming) */}
          <div className="relative flex items-start gap-3 opacity-60">
            <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 w-full space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700">Stage 4 — Completed</h3>
                <span className="text-[11px] font-mono text-slate-400">Est. 3:30 PM</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Awaiting geo-tagged AFTER photo from crew inside 40m perimeter to prove road clearance.
              </p>
            </div>
          </div>

          {/* Stage 5: Citizen Peer Verified (Upcoming) */}
          <div className="relative flex items-start gap-3 opacity-60">
            <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 w-full space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700">Stage 5 — Citizen Peer Verified</h3>
                <span className="text-[11px] font-mono text-slate-400">Post Completion</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Community confirmation vote threshold unlocks formal municipal audit ledger archive.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Field Photo Evidence Comparison Card (Real User/Crew Images Only) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">Field Photo Evidence</h2>
          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
            Real Photographic Audit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Left: Before Work Proof */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center">
              {ticket.beforeImageUrl ? (
                <>
                  <img
                    src={ticket.beforeImageUrl}
                    alt="Citizen defect proof"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-slate-950/85 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs">
                    BEFORE PROOF
                  </span>
                  <span className="absolute bottom-2 left-2 bg-slate-950/85 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                    {ticket.reportedAt}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <Camera className="w-8 h-8 mb-1.5 text-slate-500 opacity-60" />
                  <span className="text-xs font-bold text-slate-300">No Photo Submitted</span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">GPS Geotagged coordinates only</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <span className="text-xs font-bold text-slate-900 block truncate">
                Citizen Defect Snapshot
              </span>
              <span className="text-[11px] text-slate-500 block">
                {ticket.beforeImageUrl ? 'Verified User Upload' : 'Geospatial GPS Coordinate Record'}
              </span>
            </div>
          </div>

          {/* Right: In-Progress / After Evidence */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center">
              {ticket.afterImageUrl ? (
                <>
                  <img
                    src={ticket.afterImageUrl}
                    alt="Field crew repair proof"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                    AFTER REPAIR
                  </span>
                  <span className="absolute bottom-2 left-2 bg-slate-950/85 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                    Verified Resolution
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 mb-1.5 text-slate-500 opacity-60" />
                  <span className="text-xs font-bold text-slate-300">Pending Repair Completion</span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">After-photo uploaded upon work finish</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <span className="text-xs font-bold text-slate-900 block truncate">
                Field Crew Resolution
              </span>
              <span className="text-[11px] text-slate-500 block">
                {ticket.afterImageUrl ? 'Sealed by GVMC Squad' : 'Crew dispatch in progress'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Citizen Verification & Peer Accountability Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              Did this resolve the issue on your street?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Peer voting is locked to verified neighborhood radius.
            </p>
          </div>
        </div>

        {/* Voting Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleVote('yes')}
            className={`h-11 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              voteType === 'yes'
                ? 'bg-emerald-600 text-white shadow-xs'
                : hasVoted
                ? 'bg-slate-100 text-slate-400 opacity-60'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Yes, Cleared ({yesVotes})</span>
          </button>

          <button
            type="button"
            onClick={() => handleVote('no')}
            className={`h-11 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              voteType === 'no'
                ? 'bg-red-600 text-white shadow-xs'
                : hasVoted
                ? 'bg-slate-100 text-slate-400 opacity-60'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>No, Blocked ({noVotes})</span>
          </button>
        </div>

        {/* Re-open Threshold Explanatory Note */}
        <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-600">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            If &gt;50% vote <strong className="text-slate-900 font-bold">Still Blocked</strong>, the ticket automatically re-opens to the municipal disaster war room ledger.
          </p>
        </div>
      </div>

      {/* Action Footer: Push Subscription & Updates */}
      <div className="pt-2 space-y-3">
        <button
          type="button"
          onClick={handleToggleSubscribe}
          className={`w-full h-12 rounded-xl font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
            isSubscribed
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubscribed ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Subscribed: SMS Live Dispatch Alerts Active for #{ticket.id}</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4" />
              <span>Subscribe to SMS / Push Updates for #{ticket.id}</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-400">
          Audited under Andhra Pradesh Right to Public Services & Citizen Charters.
        </p>
      </div>
    </div>
  );
};
