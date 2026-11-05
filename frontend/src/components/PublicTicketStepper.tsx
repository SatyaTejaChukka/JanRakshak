import React from 'react';
import { ScreenId, Ticket } from '../types';
import { TICKET_STAGES, getStageProgress } from '../utils/logic';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  HardHat,
  Camera,
  Layers,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface PublicTicketStepperProps {
  ticket: Ticket;
  onNavigate: (screen: ScreenId) => void;
}

export const PublicTicketStepper: React.FC<PublicTicketStepperProps> = ({ ticket, onNavigate }) => {
  const currentStageIndex = TICKET_STAGES.findIndex((s) => s.id === ticket.currentStage);
  const activeIndex = currentStageIndex === -1 ? 0 : currentStageIndex;
  const progressPercent = getStageProgress(ticket.currentStage);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header */}
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
          PUBLIC TRANSPARENCY AUDIT TRAIL
        </span>
      </div>

      {/* Main Ticket Summary Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="font-bold text-blue-600">{ticket.id}</span>
              <span>·</span>
              <span>GVMC WARD 14 ROAD INFRASTRUCTURE</span>
              <span>·</span>
              <span>{ticket.reportedAt}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{ticket.title}</h1>
            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{ticket.location}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">Resolution Progress</span>
            <span className="text-2xl font-black font-mono text-blue-600">{progressPercent}%</span>
          </div>
        </div>

        {/* 5-Stage Stepper Visualization */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            5-Stage SLA & Verification Stepper:
          </h2>

          <div className="space-y-4">
            {TICKET_STAGES.map((stage, idx) => {
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;
              const isUpcoming = idx > activeIndex;

              return (
                <div
                  key={stage.id}
                  className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                    isCurrent
                      ? 'bg-blue-50/70 border-blue-400 shadow-xs ring-1 ring-blue-300'
                      : isPast
                      ? 'bg-slate-50/60 border-slate-200'
                      : 'bg-white border-slate-100 opacity-60'
                  }`}
                >
                  {/* Step Number or Check */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : stage.step}
                  </div>

                  {/* Step info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3
                        className={`text-sm font-bold ${
                          isCurrent ? 'text-blue-900' : isPast ? 'text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        {stage.step}. {stage.title}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500">
                        {isPast ? 'COMPLETED & VERIFIED' : isCurrent ? 'CURRENT ACTIVE STEP' : 'PENDING'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{stage.description}</p>

                    {/* Step specific artifacts */}
                    {stage.id === 'deduplicated' && ticket.mergedCount > 1 && (
                      <div className="mt-2 text-xs text-blue-800 bg-white p-2 rounded border border-blue-200 flex items-center justify-between">
                        <span>Cluster: 6 Nearby Citizen Filings Merged into this ticket</span>
                        <button
                          onClick={() => onNavigate('spatial_dedup_notice')}
                          className="font-semibold underline hover:text-blue-900"
                        >
                          View Spatial Notice
                        </button>
                      </div>
                    )}

                    {stage.id === 'assigned' && ticket.assignedCrew && (
                      <div className="mt-2 text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                        <span className="font-bold text-slate-900">
                          Assigned Field Team: {ticket.assignedCrew.workerName}
                        </span>{' '}
                        · Unit ID: <span className="font-mono">{ticket.assignedCrew.unitId}</span> · Phone:{' '}
                        <span className="font-mono">{ticket.assignedCrew.phone}</span>
                      </div>
                    )}

                    {stage.id === 'in_progress' && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => onNavigate('field_worker_checkin')}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded"
                        >
                          Inspect Field Worker Geofence Check-In →
                        </button>
                      </div>
                    )}

                    {stage.id === 'resolved' && isPast && (
                      <div className="mt-2 text-xs text-emerald-800 bg-emerald-100/70 p-2 rounded border border-emerald-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Dual photographic proof archived with municipal auditor. Defect closed!</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action button strip */}
        <div className="pt-4 flex flex-wrap gap-3 border-t border-slate-100">
          <button
            onClick={() => onNavigate('field_worker_checkin')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <HardHat className="w-4 h-4" />
            <span>Field Worker Check-In Console</span>
          </button>
          <button
            onClick={() => onNavigate('spatial_dedup_notice')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>50m Spatial Merge Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
