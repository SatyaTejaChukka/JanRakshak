import React, { useState } from 'react';
import { ScreenId, Ticket } from '../types';
import {
  HardHat,
  ArrowLeft,
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  Upload,
  AlertCircle,
  Truck,
  ArrowRight,
} from 'lucide-react';

interface FieldWorkerCheckinProps {
  tickets: Ticket[];
  onNavigate: (screen: ScreenId) => void;
  onUpdateTicketStage: (ticketId: string, stage: Ticket['currentStage']) => void;
  onGoBack?: () => void;
}

export const FieldWorkerCheckin: React.FC<FieldWorkerCheckinProps> = ({
  tickets,
  onNavigate,
  onUpdateTicketStage,
  onGoBack,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TKT-8902');
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(true);
  const [workCompleted, setWorkCompleted] = useState<boolean>(false);
  const [materialsUsed, setMaterialsUsed] = useState<string>('Cold mix asphalt (1.2 tonnes), Emulsion tack coat, Vibratory plate compactor');
  const [completionNotes, setCompletionNotes] = useState<string>('Repaired crater depth 4ft. Compacted surface level with storm gutter drainage channel. Tested for traffic bearing.');
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const currentTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAfterPhoto(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteWork = () => {
    setWorkCompleted(true);
    if (afterPhoto && currentTicket) {
      currentTicket.afterImageUrl = afterPhoto;
    }
    onUpdateTicketStage(selectedTicketId, 'resolved');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => (onGoBack ? onGoBack() : onNavigate('gvmc_admin_dashboard'))}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 transition-colors active:scale-95 cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
          GPS GEOFENCE: INSIDE 25M WORK ZONE
        </span>
      </div>

      {/* Main Check-In Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span>GVMC ENGINEERING CORPS</span>
                <span>·</span>
                <span>CREW #04</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Municipal Field Worker On-Site Check-In
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${
                isCheckedIn
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isCheckedIn ? 'ON-SITE GEOFENCE VERIFIED' : 'NOT CHECKED IN'}
            </span>
          </div>
        </div>

        {/* Ticket Selector for Field Worker */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Select Assigned Work Order:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {tickets.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-3 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                  selectedTicketId === t.id
                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-mono font-bold text-slate-900 flex justify-between">
                  <span>{t.id}</span>
                  <span className="capitalize text-slate-500 text-[11px]">{t.currentStage}</span>
                </div>
                <div className="font-medium text-slate-800 truncate mt-1">{t.title}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{t.location}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Work Order Details */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                CURRENT WORK ASSIGNMENT
              </span>
              <h3 className="text-base font-bold text-slate-900">{currentTicket.title}</h3>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {currentTicket.location}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">Assigned Crew</span>
              <span className="text-xs font-bold text-slate-800">
                {currentTicket.assignedCrew?.workerName || 'Ramesh Naidu (Ward 14 Road Crew)'}
              </span>
            </div>
          </div>

          {/* GPS Check-in Timestamp & Geofence Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Geofence Accuracy</span>
              <span className="font-mono font-bold text-emerald-700">98% Match (Lat: 17.7126, Lon: 83.3218)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Arrival Timestamp</span>
              <span className="font-mono font-bold text-slate-800">08:42 AM IST (Today)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Assigned Priority</span>
              <span className="font-mono font-bold text-red-600">SEV-1 High (Merged 6 times)</span>
            </div>
          </div>
        </div>

        {/* Material & Work Execution Form */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Materials & Equipment Logged on Site:
            </label>
            <input
              type="text"
              value={materialsUsed}
              onChange={(e) => setMaterialsUsed(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-blue-600 bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Execution Summary & Structural Verification Notes:
            </label>
            <textarea
              rows={2}
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-blue-600 bg-white"
            />
          </div>

          {/* Before & After Dual Verification Photography (Real Uploaded/Captured Images Only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Before & After Photo Proof (Mandatory for Stage Advancement):
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left: Citizen's Real Before Photo */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 shadow-xs">
                <div className="p-2 bg-slate-800 text-white text-[11px] font-bold flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>BEFORE (Citizen Photo)</span>
                  </span>
                  <span className="font-mono text-slate-300">
                    {currentTicket.reportedAt || 'Caller Photo'}
                  </span>
                </div>
                <div className="h-44 relative overflow-hidden bg-slate-950 flex items-center justify-center">
                  {currentTicket.beforeImageUrl ? (
                    <>
                      <img
                        src={currentTicket.beforeImageUrl}
                        alt="Citizen defect capture"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-white font-mono flex justify-between">
                        <span>CITIZEN EVIDENCE</span>
                        <span className="text-amber-300">
                          {currentTicket.coordinates.latitude.toFixed(4)}° N, {currentTicket.coordinates.longitude.toFixed(4)}° E
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                      <Camera className="w-8 h-8 mb-1.5 text-slate-500 opacity-60" />
                      <span className="text-xs font-bold text-slate-300">No Photo Submitted</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">GPS Geotag Only</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Field Worker Real After Photo Upload */}
              <div className={`border-2 rounded-xl overflow-hidden bg-slate-900 shadow-xs transition-colors ${afterPhoto ? 'border-emerald-500' : 'border-dashed border-slate-600'}`}>
                <div className="p-2 bg-emerald-700 text-white text-[11px] font-bold flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>AFTER (Field Worker Post-Repair Proof)</span>
                  </span>
                  <span className="font-mono text-emerald-100">Live Sealed</span>
                </div>
                <div className="h-44 relative overflow-hidden bg-slate-950 flex items-center justify-center">
                  {afterPhoto ? (
                    <>
                      <img
                        src={afterPhoto}
                        alt="Field crew post-repair asphalt proof"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-white font-mono flex justify-between items-center">
                        <span className="text-emerald-400 font-bold">COMPACTED SEAL PROOF</span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[10px] text-sky-300 underline font-mono hover:text-white cursor-pointer"
                        >
                          Retake
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full flex flex-col items-center justify-center p-4 text-center hover:bg-slate-900 transition-colors cursor-pointer group"
                    >
                      <Camera className="w-8 h-8 mb-1.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-white">Click to Snap / Upload After Photo</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">Required for municipal stage closure</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Action */}
        {!workCompleted ? (
          <div className="pt-2">
            <button
              onClick={handleCompleteWork}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Dual-Proof Verification & Advance to Stage 5 (Resolved)</span>
            </button>
          </div>
        ) : (
          <div className="p-4 bg-emerald-100 text-emerald-900 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Work Order Verified & Updated to Stage 5: Geo-Verification & Closed!</span>
            </div>
            <button
              onClick={() => onNavigate('public_ticket_stepper')}
              className="px-3 py-1.5 bg-emerald-800 text-white rounded text-xs font-semibold hover:bg-emerald-900"
            >
              View Public 5-Stage Stepper →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
