import React, { useState } from 'react';
import { ScreenId, Ticket } from '../types';
import {
  Camera,
  ArrowLeft,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  FileCheck,
} from 'lucide-react';
import { checkSpatialDeduplication } from '../utils/logic';

interface CitizenCameraDefectCaptureProps {
  existingTickets: Ticket[];
  onNavigate: (screen: ScreenId) => void;
  onAddNewTicket: (newTicket: Ticket) => void;
  onSelectTicket: (ticketId: string) => void;
}

export const CitizenCameraDefectCapture: React.FC<CitizenCameraDefectCaptureProps> = ({
  existingTickets,
  onNavigate,
  onAddNewTicket,
  onSelectTicket,
}) => {
  const [captureMode, setCaptureMode] = useState<'camera' | 'upload'>('upload');
  const [photoTaken, setPhotoTaken] = useState(true);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [category, setCategory] = useState<Ticket['category']>('Pothole & Craters');
  const [defectTitle, setDefectTitle] = useState('Severe 4ft Road Crater with Exposed Sub-base');
  const [locationName, setLocationName] = useState('Beach Road near RK Beach Circle, Ward 14, Visakhapatnam');
  const [isNearDuplicate, setIsNearDuplicate] = useState(true);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Simulated GPS position
  const simulatedCoords = { latitude: 17.7126, longitude: 83.3218 };

  const handleRunSpatialCheck = () => {
    setAnalyzingAI(true);
    setTimeout(() => {
      setAnalyzingAI(false);
      const mappedReports = existingTickets.map((t) => ({
        id: t.id,
        location: t.coordinates,
        category: t.category,
      }));
      const result = checkSpatialDeduplication(simulatedCoords, category, mappedReports);
      setIsNearDuplicate(result.isDuplicate);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNearDuplicate) {
      // Directs citizen to spatial deduplication merge notice
      onNavigate('spatial_dedup_notice');
    } else {
      const newTicket: Ticket = {
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        category,
        title: defectTitle,
        location: locationName,
        coordinates: simulatedCoords,
        reportedAt: 'Just now',
        currentStage: 'submitted',
        citizenName: 'You (Verified Citizen)',
        citizenPhone: '+91 98480 12345',
        mergedCount: 1,
        severity: 'High',
      };
      onAddNewTicket(newTicket);
      onSelectTicket(newTicket.id);
      setSubmissionSuccess(true);
      setTimeout(() => {
        onNavigate('public_ticket_stepper');
      }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('citizen_home_normal')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          aria-label="Back to Civic Home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Civic Portal</span>
        </button>

        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
          GPS GEOTAGGED: 17.7126° N, 83.3218° E
        </span>
      </div>

      {/* Main Defect Capture Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-600 font-bold uppercase font-mono">
              <Camera className="w-4 h-4" />
              <span>AI COMPUTER VISION & GEOTAG CAPTURE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Citizen Defect Inspection & Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Submit a photo of the road defect or drainage hazard. Computer vision calculates dimensions and runs an instant 50m PostGIS spatial deduplication check.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setCaptureMode('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                captureMode === 'upload'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Photo Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setCaptureMode('camera')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                captureMode === 'camera'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>Camera View</span>
            </button>
          </div>
        </div>

        {/* Viewport: Either Camera Viewfinder or Drag & Drop Uploader */}
        {captureMode === 'camera' ? (
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-300">
            <div className="h-64 sm:h-72 w-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-8 border border-white/40 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between text-[10px] font-mono text-white/70">
                  <span>[AI DETECT: ROAD CAVITY]</span>
                  <span>DEPTH ~12 CM</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-white/70">
                  <span>LAT: 17.7126 LONG: 83.3218</span>
                  <span>CONFIDENCE: 94%</span>
                </div>
              </div>

              <div className="text-center p-6 space-y-2">
                <div className="w-16 h-16 rounded-full bg-blue-600/30 border border-blue-400 flex items-center justify-center mx-auto text-white">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-white font-bold text-base">Live Camera Inspection View</h3>
                <p className="text-xs text-slate-300 max-w-sm">
                  4-Foot Wide Asphalt Crater · Sub-base Layer Exposed
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <span>Sensor: 48MP Wide (EXIF Geotag Enabled)</span>
              <button
                type="button"
                onClick={handleRunSpatialCheck}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{analyzingAI ? 'Analyzing...' : 'Re-run AI Analysis'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/70 transition-colors p-8 text-center space-y-3 cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">
                Drag and drop your geotagged defect photo here
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Supports JPG, PNG, or WEBP. Embedded GPS EXIF coordinates will automatically resolve to your municipal ward.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>beach_road_crater_01.jpg (Exif GPS: 17.7126, 83.3218)</span>
            </div>
          </div>
        )}

        {/* Defect Metadata Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Defect Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Ticket['category'])}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-blue-600"
              >
                <option value="Pothole & Craters">Pothole & Craters</option>
                <option value="Drainage Block">Drainage Block & Overflow</option>
                <option value="Fallen Tree & Power Line">Fallen Tree & Power Line</option>
                <option value="Streetlight Outage">Streetlight Outage</option>
                <option value="Structural Crack">Structural Crack</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Location Details:
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Defect Description:
            </label>
            <input
              type="text"
              value={defectTitle}
              onChange={(e) => setDefectTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-blue-600"
            />
          </div>

          {/* Spatial Deduplication Engine Notification */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <Layers className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-blue-900">
              <div className="font-bold flex items-center gap-1.5">
                <span>50m Spatial Cluster Found (TKT-8902)</span>
                <span className="font-mono bg-blue-200/80 px-1.5 py-0.2 rounded text-[10px]">
                  18m Distance
                </span>
              </div>
              <p className="text-blue-800">
                An active ticket already exists at this exact junction. Submitting will merge your photo as supporting evidence and upvote the priority level for the municipal road gang.
              </p>
            </div>
          </div>

          {/* Submission Trigger */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit Photo & View 50m Spatial Merge Notice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('public_ticket_stepper')}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel & Track Existing Tickets
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
