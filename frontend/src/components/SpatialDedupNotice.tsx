import React, { useState } from 'react';
import { ScreenId, Ticket } from '../types';
import {
  Layers,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  GitMerge,
  ArrowRight,
  ShieldCheck,
  Eye,
  ThumbsUp,
  Share2,
} from 'lucide-react';

interface SpatialDedupNoticeProps {
  tickets: Ticket[];
  onNavigate: (screen: ScreenId) => void;
  onSelectTicket: (ticketId: string) => void;
  selectedTicketId?: string;
}

export const SpatialDedupNotice: React.FC<SpatialDedupNoticeProps> = ({
  tickets,
  onNavigate,
  onSelectTicket,
  selectedTicketId,
}) => {
  const [upvoted, setUpvoted] = useState(false);
  const primaryTicket =
    (selectedTicketId ? tickets.find((t) => t.id === selectedTicketId) : null) ||
    tickets[0] || {
      id: 'TKT-8902',
      category: 'Pothole & Craters',
      title: 'Severe 4ft Crater on Beach Road Junction',
      location: 'Ward 14, Beach Road near RK Beach Circle, Visakhapatnam',
      coordinates: { latitude: 17.7126, longitude: 83.3218 },
      reportedAt: '12 Mins Ago',
      currentStage: 'in_progress',
      citizenName: 'K. Satyanarayana',
      mergedCount: 6,
    };

  const nearbyDuplicates = [
    {
      subId: 'SUB-9401',
      reporter: 'A. Ramanathan',
      time: '9 mins ago',
      distance: '18 meters away',
      notes: 'Deep road sinkhole damaging auto-rickshaws at speed bump',
    },
    {
      subId: 'SUB-9404',
      reporter: 'S. Neeraja',
      time: '6 mins ago',
      distance: '29 meters away',
      notes: 'Water accumulated inside crater, two-wheelers skidding',
    },
    {
      subId: 'SUB-9408',
      reporter: 'M. Jagadeesh',
      time: 'Just now',
      distance: '11 meters away',
      notes: 'Needs immediate gravel and asphalt patch work',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('citizen_home_normal')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 transition-colors"
          aria-label="Back to Civic Home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Civic Portal</span>
        </button>
        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
          ALGORITHM: 50M HAVERSINE SPATIAL DEDUP
        </span>
      </div>

      {/* Main Deduction Notice Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl shrink-0">
            <GitMerge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
                Duplicate Detected & Merged
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Zero duplicate tickets assigned to field teams</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              50-Meter Spatial Deduplication Merge Notice
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your defect submission was automatically identified within <strong>18 meters</strong> of an existing verified civic incident. To avoid split municipal crew deployments, your filing has been consolidated into the active master ticket.
            </p>
          </div>
        </div>

        {/* Master Ticket Box */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              CONSOLIDATED MASTER TICKET
            </span>
            <span className="text-xs font-semibold font-mono px-2 py-0.5 rounded bg-blue-600 text-white">
              {primaryTicket.id}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900">{primaryTicket.title}</h3>

          <div className="flex items-start gap-2 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{primaryTicket.location}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Primary Citizen</span>
              <span className="font-semibold text-slate-800">{primaryTicket.citizenName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Total Endorsements</span>
              <span className="font-semibold text-blue-700 font-mono">
                {primaryTicket.mergedCount + (upvoted ? 1 : 0)} Citizens Merged
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Current Status</span>
              <span className="font-semibold text-emerald-700 capitalize">
                {primaryTicket.currentStage.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Spatial Radius</span>
              <span className="font-semibold text-slate-700 font-mono">50m Ring</span>
            </div>
          </div>
        </div>

        {/* Merged Incident Reports Stream */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Reports Consolidated in this 50m Spatial Cluster:
          </h4>
          <div className="space-y-2">
            {nearbyDuplicates.map((dup, i) => (
              <div
                key={i}
                className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700">{dup.subId}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-medium text-slate-800">{dup.reporter}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({dup.time})</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{dup.notes}</p>
                </div>
                <div className="shrink-0 font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded self-start sm:self-auto border border-blue-100">
                  {dup.distance}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Upvote & Notification Subscription */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-blue-900">
            <span className="font-bold block">Consolidation boosts Ward Priority!</span>
            Each merged citizen report adds weighted priority to the GVMC zonal maintenance schedule.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setUpvoted(!upvoted)}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                upvoted
                  ? 'bg-blue-600 text-white'
                  : 'bg-white hover:bg-slate-100 text-blue-700 border border-blue-300'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{upvoted ? 'Upvoted (+1 Priority)' : 'Upvote Master Ticket'}</span>
            </button>
            <button
              onClick={() => {
                onSelectTicket(primaryTicket.id);
                onNavigate('public_ticket_stepper');
              }}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Track 5-Stage Stepper</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
