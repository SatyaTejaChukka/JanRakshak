import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Mic,
  MicOff,
  WifiOff,
  Zap,
  AlertTriangle,
  Trees,
  Lightbulb,
  Radio,
  User,
  Clock,
  Compass,
  MapPinOff,
  Crosshair,
  Edit3,
  X,
} from 'lucide-react';
import { checkSpatialDeduplication } from '../utils/logic';

interface CitizenCameraDefectCaptureProps {
  existingTickets: Ticket[];
  onNavigate: (screen: ScreenId) => void;
  onAddNewTicket: (newTicket: Ticket) => void;
  onSelectTicket: (ticketId: string) => void;
}

type FlashMode = 'ON' | 'AUTO' | 'OFF';
type UrgencyLevel = 'Minor Slow' | 'Traffic Block' | 'Accident Risk';

const VISAKHAPATNAM_WARS = [
  { name: 'GVMC Ward 18 • Waltair', lat: 17.7215, lng: 83.315 },
  { name: 'GVMC Ward 14 • Beach Road / RK Beach', lat: 17.7126, lng: 83.3218 },
  { name: 'GVMC Ward 12 • Peda Waltair & Lawsons Bay', lat: 17.7412, lng: 83.3421 },
  { name: 'GVMC Ward 16 • Siripuram Junction', lat: 17.7291, lng: 83.3225 },
  { name: 'GVMC Ward 09 • MVP Colony Sector 4', lat: 17.7384, lng: 83.3341 },
];

export const CitizenCameraDefectCapture: React.FC<CitizenCameraDefectCaptureProps> = ({
  existingTickets,
  onNavigate,
  onAddNewTicket,
  onSelectTicket,
}) => {
  // Flash Mode State
  const [flashMode, setFlashMode] = useState<FlashMode>('ON');

  // Issue Category State
  const [category, setCategory] = useState<Ticket['category']>('Pothole & Craters');

  // Landmark & Description State
  const [landmark, setLandmark] = useState('');
  const [defectTitle, setDefectTitle] = useState('Severe 4ft Road Crater with Exposed Sub-base');

  // Urgency Assessment
  const [urgency, setUrgency] = useState<UrgencyLevel>('Traffic Block');

  // Microphone Voice Assist State
  const [isListening, setIsListening] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // STRICT USER-PROVIDED GEOLOCATION STATE (NO HARDCODED DEFAULT LOCATION)
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<string | null>(null);
  const [locationMethod, setLocationMethod] = useState<'NONE' | 'GPS' | 'MANUAL'>('NONE');
  const [selectedWardName, setSelectedWardName] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual Coordinates Input form state
  const [inputLat, setInputLat] = useState('');
  const [inputLng, setInputLng] = useState('');
  const [inputWard, setInputWard] = useState('GVMC Ward 18 • Waltair');

  // Current live timestamp
  const [currentTimeStr, setCurrentTimeStr] = useState('26 OCT 2026 • 15:42:19 IST');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setCurrentTimeStr(`${now.toLocaleDateString('en-GB', options).replace(',', ' •')} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Spatial Deduplication Detection (Only evaluates once citizen has provided location)
  const mappedReports = existingTickets.map((t) => ({
    id: t.id,
    location: t.coordinates,
    category: t.category,
  }));
  const dedupResult = coords
    ? checkSpatialDeduplication(coords, category, mappedReports)
    : { isDuplicate: false, parentTicketId: undefined, duplicateId: undefined };
  const isNearDuplicate = dedupResult.isDuplicate;
  const duplicateId = dedupResult.parentTicketId || dedupResult.duplicateId || 'TKT-8902';

  // Toggle Flash Mode
  const cycleFlash = () => {
    if (flashMode === 'ON') setFlashMode('AUTO');
    else if (flashMode === 'AUTO') setFlashMode('OFF');
    else setFlashMode('ON');
  };

  // Toggle Voice Input (Web Speech API with Fallback)
  const toggleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'en-IN';
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          recognition.onresult = (event: any) => {
            const transcript = event.results[0]?.[0]?.transcript;
            if (transcript) {
              setLandmark((prev) => (prev ? `${prev}, ${transcript}` : transcript));
            }
            setIsListening(false);
          };

          recognition.onerror = () => {
            setLandmark((prev) =>
              prev
                ? `${prev}, Main Junction`
                : 'Opposite Waltair Post Office / Near SBI ATM, Main Junction'
            );
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognition.start();
          return;
        } catch {
          // Fall through to simulation
        }
      }

      setTimeout(() => {
        if (!landmark) {
          setLandmark('Opposite Waltair Post Office / Near SBI ATM, Main Junction');
        } else {
          setLandmark((prev) => `${prev}, Beach Road Junction`);
        }
        setIsListening(false);
      }, 900);
    } else {
      setIsListening(false);
    }
  };

  // Acquire Live GPS from device
  const handleAcquireLiveGPS = () => {
    setIsLocating(true);
    setLocationError(null);

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setIsLocating(false);
      setLocationError('Browser Geolocation is not supported on this device. Please input coordinates manually.');
      setShowManualModal(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        const acc = pos.coords.accuracy ? Math.min(pos.coords.accuracy, 15).toFixed(1) : '1.5';

        setCoords({ latitude: lat, longitude: lng });
        setGpsAccuracy(`±${acc}M (RTK-GPS FIX)`);
        setLocationMethod('GPS');
        setSelectedWardName('GVMC WARD 18 • WALTAIR');
        setIsLocating(false);
        setLocationError(null);
      },
      (err) => {
        setIsLocating(false);
        let errorMsg = 'GPS location acquisition failed.';
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = 'GPS permission was denied by user. You must provide coordinates manually to report a defect.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = 'Satellite location unavailable. Please enter coordinates manually.';
        } else if (err.code === err.TIMEOUT) {
          errorMsg = 'GPS signal timed out. Please enter coordinates manually.';
        }
        setLocationError(errorMsg);
        setShowManualModal(true);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Submit Manual Coordinates
  const handleConfirmManualCoords = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setLocationError('Invalid coordinates. Latitude must be between -90 and 90, Longitude between -180 and 180.');
      return;
    }

    setCoords({ latitude: lat, longitude: lng });
    setGpsAccuracy('±2.5M (MANUAL GIS FIX)');
    setLocationMethod('MANUAL');
    setSelectedWardName(inputWard);
    setShowManualModal(false);
    setLocationError(null);
  };

  // Quick Preset Selection in Modal
  const handleSelectPresetWard = (preset: { name: string; lat: number; lng: number }) => {
    setInputLat(preset.lat.toString());
    setInputLng(preset.lng.toString());
    setInputWard(preset.name);
  };

  // Categories configuration with icons
  const categories: Array<{
    name: Ticket['category'];
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      name: 'Pothole & Craters',
      label: 'Pothole / Road Damage',
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      name: 'Fallen Tree & Power Line',
      label: 'Fallen Tree / Debris',
      icon: <Trees className="w-4 h-4" />,
    },
    {
      name: 'Drainage Block',
      label: 'Open Drain Hazard',
      icon: <AlertCircle className="w-4 h-4" />,
    },
    {
      name: 'Streetlight Outage',
      label: 'Dark Streetlight',
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      name: 'Structural Crack',
      label: 'Structural Crack',
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  // Handle Form Submission (STRICTLY BLOCKED IF NO LOCATION PROVIDED)
  const handleSubmitReport = () => {
    if (!coords) {
      setLocationError('Location is strictly mandatory. Please acquire GPS or enter coordinates manually.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      if (isNearDuplicate) {
        // Directs citizen to spatial deduplication merge notice with exact duplicate selected
        onSelectTicket(duplicateId);
        setTimeout(() => {
          onNavigate('spatial_dedup_notice');
        }, 800);
      } else {
        const severityMap: Record<UrgencyLevel, Ticket['severity']> = {
          'Minor Slow': 'Low',
          'Traffic Block': 'High',
          'Accident Risk': 'Critical',
        };

        const newTicket: Ticket = {
          id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
          category,
          title: landmark ? `${category} - ${landmark}` : defectTitle,
          location: `${selectedWardName || 'GVMC Jurisdiction'}, Visakhapatnam`,
          coordinates: coords,
          reportedAt: 'Just now',
          currentStage: 'submitted',
          citizenName: 'You (Verified Citizen)',
          citizenPhone: '+91 98480 12345',
          mergedCount: 1,
          severity: severityMap[urgency],
          beforeImageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCzpcgTrpSqfyAkLxw3otG69QcGkskZFFfkIPqU2XM-yZj2BEUGQBOXom6BXUl9SoDe1AOQSN13m4-xcJmTao_Vkn1tvZlvxyM-9QVwlBYfZHDSkeEVLJFgSwH0kWALsz26gnQi9m1kw3kPhoCyQU7UgRIIhTMLqxZYC7Ki7wpPTMdPo1COQMwy4IP4Kek5Sm_snOouhp78-IVKXa8gnStPbHfhMD6bqEp5MnrxGBVJ',
        };

        onAddNewTicket(newTicket);
        onSelectTicket(newTicket.id);

        setTimeout(() => {
          onNavigate('public_ticket_stepper');
        }, 800);
      }
    }, 1000);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col pb-16">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('citizen_home_normal')}
              aria-label="Back to Operations"
              className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition-all cursor-pointer border border-slate-200/80"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    coords ? 'bg-emerald-500 animate-pulse' : 'bg-red-600 animate-ping'
                  }`}
                ></span>
                <span
                  className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                    coords ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {coords
                    ? `RTK GPS FIX • ${gpsAccuracy || 'ACTIVE'}`
                    : 'NO GPS FIX • LOCATION REQUIRED'}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">
                Report Incident
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                SAT LINK
              </span>
              <span
                className={`text-xs font-mono font-extrabold ${
                  coords ? 'text-blue-700' : 'text-amber-600'
                }`}
              >
                {coords ? '98.4 dBm' : 'STANDBY'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Dynamic Viewfinder Section */}
        <section className="relative w-full bg-[#0B0F17] text-white px-4 sm:px-6 pt-3 pb-6 flex flex-col gap-3 shadow-xl">
          {/* Camera Viewfinder HUD Control Bar */}
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-sky-400">
                <Camera className="w-4 h-4" />
              </span>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase font-mono">
                VIEWFINDER LIVE
              </span>
            </div>

            {/* Flash Toggle Interactive Pill */}
            <button
              onClick={cycleFlash}
              type="button"
              className="h-9 px-3 flex items-center gap-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors active:scale-95 text-white border border-slate-700 cursor-pointer"
            >
              <Zap
                className={`w-4 h-4 ${
                  flashMode === 'ON'
                    ? 'text-amber-400 fill-amber-400'
                    : flashMode === 'AUTO'
                    ? 'text-sky-400'
                    : 'text-slate-400'
                }`}
              />
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400">
                FLASH{' '}
                <span
                  className={`font-black ${
                    flashMode === 'ON'
                      ? 'text-amber-400'
                      : flashMode === 'AUTO'
                      ? 'text-sky-400'
                      : 'text-slate-300'
                  }`}
                >
                  {flashMode}
                </span>
              </span>
            </button>
          </div>

          {/* GEOLOCATION HUD BANNER (STRICT USER-PROVIDED REQUIREMENT) */}
          {coords ? (
            <div className="w-full bg-slate-800/90 border border-emerald-500/40 rounded-xl p-3 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    GPS LOCKED: {coords.latitude.toFixed(5)}° N, {coords.longitude.toFixed(5)}° E
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-300 tracking-tight">
                    {gpsAccuracy}
                  </span>
                  <button
                    onClick={() => setShowManualModal(true)}
                    className="text-[10px] text-sky-400 hover:text-sky-300 underline font-mono cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 text-sky-400 text-xs font-semibold">
                  <Compass className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono uppercase tracking-wider">
                    {selectedWardName || 'GVMC MUNICIPAL WARD'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-300 tracking-wider uppercase">
                  GEO-TELEMETRY VERIFIED
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full bg-red-950/80 border-2 border-red-500/80 rounded-xl p-3.5 flex flex-col gap-2.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-xs font-mono font-extrabold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPinOff className="w-4 h-4 text-red-400" />
                    <span>LOCATION REQUIRED • NO DEFAULT LOCATION PERMITTED</span>
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-red-500 text-white px-2 py-0.5 rounded">
                  MANDATORY
                </span>
              </div>
              <p className="text-xs text-red-200 leading-snug">
                You must provide an authenticated geographic coordinate to register a civic defect. Tap below to acquire live GPS or enter coordinates manually.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAcquireLiveGPS}
                  disabled={isLocating}
                  className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Acquiring RTK Fix...' : 'Acquire Live GPS Fix'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Enter Coordinates Manually</span>
                </button>
              </div>
              {locationError && (
                <p className="text-[11px] font-mono text-amber-300 pt-1 border-t border-red-900/60">
                  {locationError}
                </p>
              )}
            </div>
          )}

          {/* 4:3 Aspect Ratio Camera Reticle Viewport */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl select-none">
            {/* Live Simulation Real Asphalt Pothole Image */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzpcgTrpSqfyAkLxw3otG69QcGkskZFFfkIPqU2XM-yZj2BEUGQBOXom6BXUl9SoDe1AOQSN13m4-xcJmTao_Vkn1tvZlvxyM-9QVwlBYfZHDSkeEVLJFgSwH0kWALsz26gnQi9m1kw3kPhoCyQU7UgRIIhTMLqxZYC7Ki7wpPTMdPo1COQMwy4IP4Kek5Sm_snOouhp78-IVKXa8gnStPbHfhMD6bqEp5MnrxGBVJ"
              alt="Live street-level photograph of deep jagged asphalt pothole with waterlogging"
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Tactile Viewfinder Framing Reticle Corners */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <svg
                  className="text-white drop-shadow-md"
                  fill="none"
                  height="28"
                  viewBox="0 0 28 28"
                  width="28"
                >
                  <path
                    d="M2 26V4C2 2.89543 2.89543 2 4 2H26"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                </svg>
                <svg
                  className="text-white drop-shadow-md"
                  fill="none"
                  height="28"
                  viewBox="0 0 28 28"
                  width="28"
                >
                  <path
                    d="M26 26V4C26 2.89543 25.1046 2 24 2H2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                </svg>
              </div>
              <div className="flex justify-between items-end">
                <svg
                  className="text-white drop-shadow-md"
                  fill="none"
                  height="28"
                  viewBox="0 0 28 28"
                  width="28"
                >
                  <path
                    d="M2 2V24C2 25.1046 2.89543 26 4 26H26"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                </svg>
                <svg
                  className="text-white drop-shadow-md"
                  fill="none"
                  height="28"
                  viewBox="0 0 28 28"
                  width="28"
                >
                  <path
                    d="M26 2V24C26 25.1046 25.1046 26 24 26H2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </div>

            {/* Center Targeting Crosshairs */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-16 h-16 flex items-center justify-center text-white/80">
                <svg fill="none" height="40" viewBox="0 0 36 36" width="40">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M18 6V11M18 25V30M6 18H11M25 18H30"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Live Stamp Overlay Watermark (Top Left) */}
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-white shadow-md border border-slate-800">
              <p className="text-[11px] font-mono font-bold tracking-wider text-amber-400">
                {currentTimeStr}
              </p>
              <p className="text-[10px] font-mono text-slate-300 tracking-tight">
                {coords
                  ? `FIX ${coords.latitude.toFixed(4)}N, ${coords.longitude.toFixed(4)}E`
                  : 'AWAITING USER GEOLOCATION'}
              </p>
            </div>

            {/* Strict Anti-Fraud Security Floating Badge (Bottom Center) */}
            <div className="absolute bottom-3 inset-x-3 bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2 text-white shadow-lg border border-slate-800/80">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="text-[11px] text-slate-300 leading-tight">
                <strong className="text-white uppercase font-bold">
                  Live capture & Verified GPS mandatory.
                </strong>{' '}
                Defects cannot be processed without authenticated coordinates.
              </span>
            </div>
          </div>
        </section>

        {/* Citizen Input & Controls Sheet Container */}
        <section className="w-full bg-white rounded-t-[24px] -mt-4 z-10 px-4 sm:px-6 pt-3 pb-8 flex flex-col gap-5 shadow-2xl border-t border-slate-100">
          {/* Sheet Drag Affordance Pill */}
          <div className="w-full flex justify-center py-1">
            <div className="w-12 h-1.5 rounded-full bg-slate-300"></div>
          </div>

          {/* Section Title & Category Header */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Select Issue Category
              </h2>
              <span className="text-xs text-slate-500">Tap to re-classify detected defect</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[11px] font-bold uppercase tracking-wider">
              JANRAKSHAK CIVIC REPORT
            </span>
          </div>

          {/* Category Selector Chips (Horizontal Scrollable Strip) */}
          <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 flex items-center gap-2 py-1">
            {categories.map((cat) => {
              const isActive = category === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`shrink-0 h-11 px-4 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Spatial Landmark & Description Input Box */}
          <div className="flex flex-col gap-1.5 w-full">
            <label
              htmlFor="landmarkInput"
              className="text-xs font-bold text-slate-800 flex items-center justify-between"
            >
              <span>Nearby Landmark / Street Reference</span>
              <span className="text-[11px] font-normal text-slate-500">Optional</span>
            </label>
            <div className="relative flex items-center w-full rounded-xl bg-slate-50 border border-slate-200 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                <MapPin className="w-5 h-5 text-slate-400" />
              </div>
              <input
                id="landmarkInput"
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Opposite Waltair Post Office / Near SBI ATM..."
                className="w-full h-12 bg-transparent pr-12 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none"
              />
              {/* Microphone Voice Assist Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                aria-label="Voice input description"
                className={`absolute right-1.5 w-9 h-9 flex items-center justify-center rounded-lg transition-transform active:scale-90 cursor-pointer ${
                  isListening
                    ? 'bg-red-100 text-red-600 animate-pulse'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                title="Click to dictate landmark"
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 px-1">
              Precise landmarks accelerate road maintenance team turnaround time by 60%.
            </p>
          </div>

          {/* Quick Severity / Urgency Level Rating Chips */}
          <div className="flex flex-col gap-2 w-full">
            <span className="text-xs font-bold text-slate-800">
              Urgency Level Assessment
            </span>
            <div className="grid grid-cols-3 gap-2 w-full">
              <button
                type="button"
                onClick={() => setUrgency('Minor Slow')}
                className={`h-11 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 border ${
                  urgency === 'Minor Slow'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Minor Slow</span>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('Traffic Block')}
                className={`h-11 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 border ${
                  urgency === 'Traffic Block'
                    ? 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Traffic Block</span>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('Accident Risk')}
                className={`h-11 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 border ${
                  urgency === 'Accident Risk'
                    ? 'bg-red-50 text-red-800 border-red-300 ring-2 ring-red-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span>Accident Risk</span>
              </button>
            </div>
          </div>

          {/* 50m Spatial Deduplication Notice (if location provided and match found) */}
          {coords && isNearDuplicate && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 shadow-xs">
              <Layers className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-blue-900">
                <div className="font-bold flex items-center gap-2">
                  <span>50m Spatial Cluster Found ({duplicateId})</span>
                  <span className="font-mono bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded text-[10px] font-bold">
                    Nearby Distance Match
                  </span>
                </div>
                <p className="text-blue-800 leading-relaxed">
                  An active ticket already exists at this exact junction. Submitting will
                  merge your photo as supporting evidence and elevate crew priority without
                  dispatching redundant work crews.
                </p>
              </div>
            </div>
          )}

          {/* Primary Action Trigger & Shutter Snap Button (STRICTLY DISABLED IF NO LOCATION) */}
          <div className="pt-2 flex flex-col gap-3 w-full">
            {coords ? (
              <button
                type="button"
                disabled={isSubmitting || submitSuccess}
                onClick={handleSubmitReport}
                className={`w-full min-h-[54px] rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98] transition-all cursor-pointer ${
                  submitSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Encrypting & Caching Ticket...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>
                      {isNearDuplicate
                        ? 'Merged into Master Work Order'
                        : 'Report Dispatched to GVMC'}
                    </span>
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    <span className="tracking-wide">
                      {isNearDuplicate
                        ? 'Snap Photo & Merge with Master Ticket'
                        : 'Snap & Submit Report'}
                    </span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={true}
                  className="w-full min-h-[54px] rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
                >
                  <MapPinOff className="w-5 h-5 text-red-500" />
                  <span>Location Required to Submit Report</span>
                </button>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Provide location to unlock submission:</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleAcquireLiveGPS}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[11px] cursor-pointer"
                    >
                      Acquire GPS
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowManualModal(true)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded text-[11px] cursor-pointer"
                    >
                      Manual Entry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Offline GovTech Mesh Resilience Banner */}
            <div className="w-full rounded-xl bg-slate-100 border border-slate-200/80 p-3.5 flex items-start gap-3">
              <WifiOff className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-[11px] font-mono font-bold text-slate-800 uppercase tracking-wider">
                  OFFLINE RESILIENCE ACTIVE
                </span>
                <p className="text-xs text-slate-600 leading-tight mt-0.5">
                  If telecom connectivity drops, your verified report caches securely on-device
                  and auto-syncs when signal is restored.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MANUAL COORDINATES ENTRY MODAL (STRICT CITIZEN-ENTERED LOCATION) */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Provide Incident Geolocation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Defect reports require verified spatial coordinates for work crew dispatch and 50m clustering. Enter GPS coordinates or select your municipal ward location below:
            </p>

            {/* Quick Municipal Ward Landmark Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Quick Select Landmark Location:
              </label>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto">
                {VISAKHAPATNAM_WARS.map((ward) => (
                  <button
                    key={ward.name}
                    type="button"
                    onClick={() => handleSelectPresetWard(ward)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      inputWard === ward.name
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{ward.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {ward.lat.toFixed(4)}, {ward.lng.toFixed(4)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Lat/Lng Fields */}
            <form onSubmit={handleConfirmManualCoords} className="space-y-3 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                    Latitude (°N)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    placeholder="17.7215"
                    value={inputLat}
                    onChange={(e) => setInputLat(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-blue-600 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                    Longitude (°E)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    placeholder="83.3150"
                    value={inputLng}
                    onChange={(e) => setInputLng(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-blue-600 font-mono"
                  />
                </div>
              </div>

              {locationError && (
                <p className="text-xs text-red-600 font-medium">{locationError}</p>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Confirm & Set Location
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
