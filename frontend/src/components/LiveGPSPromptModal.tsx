import React, { useState } from 'react';
import {
  MapPin,
  LocateFixed,
  ShieldCheck,
  Compass,
  AlertTriangle,
  X,
  CheckCircle2,
  Navigation,
  RefreshCw,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { LiveGPSLocation, GPSFixStatus } from '../types';

interface LiveGPSPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  gpsStatus: GPSFixStatus;
  liveLocation: LiveGPSLocation | null;
  onRequestGPS: () => void;
  onSetManualLocation: (lat: number, lng: number) => void;
}

export const LiveGPSPromptModal: React.FC<LiveGPSPromptModalProps> = ({
  isOpen,
  onClose,
  gpsStatus,
  liveLocation,
  onRequestGPS,
  onSetManualLocation,
}) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLat, setManualLat] = useState(
    liveLocation ? liveLocation.latitude.toString() : '17.7215'
  );
  const [manualLng, setManualLng] = useState(
    liveLocation ? liveLocation.longitude.toString() : '83.3150'
  );

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onSetManualLocation(lat, lng);
      setShowManualInput(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-5 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/30 shadow-inner">
                <LocateFixed className="w-6 h-6 text-cyan-300 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full border border-white/30 text-blue-100">
                  REAL-TIME GEO-DEFENSE
                </span>
                <h3 className="text-lg font-black tracking-tight text-white mt-1">
                  Enable Live Device GPS
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Dismiss GPS modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-blue-100/90 mt-2 leading-relaxed">
            JanRakshak requires your active device location to provide real-time evacuation routing,
            life-saving SOS dispatch, and shelter proximity in real-world conditions.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Status Display */}
          {gpsStatus === 'LOCKED' && liveLocation ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>High-Precision GPS Fix Locked</span>
                </div>
                <span className="text-[11px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  ±{Math.round(liveLocation.accuracy)}m ACCURACY
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-500 uppercase block">Latitude</span>
                  <span className="font-bold text-slate-800">{liveLocation.latitude.toFixed(6)}° N</span>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-500 uppercase block">Longitude</span>
                  <span className="font-bold text-slate-800">{liveLocation.longitude.toFixed(6)}° E</span>
                </div>
              </div>
              <p className="text-[11px] text-emerald-700 leading-snug">
                Your device position is being continuously tracked via satellite GNSS. All rescue routing
                and emergency broadcasts are synchronized with your real coordinates.
              </p>
            </div>
          ) : gpsStatus === 'REQUESTING' ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0"></div>
              <div>
                <h4 className="text-xs font-bold text-blue-900">Acquiring Satellite GPS Fix...</h4>
                <p className="text-[11px] text-blue-700 leading-snug">
                  Please tap &quot;Allow&quot; on your browser or device location prompt.
                </p>
              </div>
            </div>
          ) : gpsStatus === 'DENIED' ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Browser Location Permission Blocked</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                To enable live real-world tracking, click the <strong>lock / site settings icon (🔒)</strong> in your browser address bar and set <strong>Location</strong> to <strong>Allow</strong>, then tap Retry below.
              </p>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Compass className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Why Live GPS is Essential:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Live Safe Detours:</strong> Reroutes around submerged roads in real time</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Rescue Deployment:</strong> Directs NDRF boats to your exact location</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Shelter Proximity:</strong> Pinpoints closest operational cyclone center</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Geotagged Proof:</strong> Submits tamper-proof civic defect coordinates</span>
                </div>
              </div>
            </div>
          )}

          {/* Manual Input Toggle Form */}
          {showManualInput && (
            <form onSubmit={handleManualSubmit} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Custom Real-World Coordinates</span>
                <span className="text-[10px] text-slate-500 font-normal">Decimal Degrees</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-blue-600 bg-white"
                    placeholder="17.7215"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-blue-600 bg-white"
                    placeholder="83.3150"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowManualInput(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Apply Coordinates
                </button>
              </div>
            </form>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            {gpsStatus === 'LOCKED' ? (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Continue with Live GPS Fix</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onRequestGPS}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <LocateFixed className="w-4 h-4 text-cyan-300 animate-pulse" />
                <span>{gpsStatus === 'DENIED' ? 'Retry GPS Authorization' : 'Enable Device GPS Location'}</span>
              </button>
            )}

            {!showManualInput && (
              <button
                type="button"
                onClick={() => setShowManualInput(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors text-center whitespace-nowrap cursor-pointer"
              >
                Manual Input
              </button>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <Radio className="w-3 h-3 text-blue-500" />
            <span>W3C Geolocation API • Continuous GNSS Watch</span>
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-[11px] underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

