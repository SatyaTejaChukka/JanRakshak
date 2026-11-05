import React, { useState } from 'react';
import { ScreenId } from '../types';
import {
  Gauge,
  ArrowLeft,
  ShieldAlert,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Building2,
  FileCheck,
  Radio,
} from 'lucide-react';

interface DistrictCollectorSwitcherProps {
  isDisasterMode: boolean;
  onToggleDisasterMode: (enabled: boolean) => void;
  onNavigate: (screen: ScreenId) => void;
  onGoBack?: () => void;
}

export const DistrictCollectorSwitcher: React.FC<DistrictCollectorSwitcherProps> = ({
  isDisasterMode,
  onToggleDisasterMode,
  onNavigate,
  onGoBack,
}) => {
  const [officerPIN, setOfficerPIN] = useState('8891');
  const [pinEntered, setPinEntered] = useState('8891');
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [collectorLog, setCollectorLog] = useState([
    {
      timestamp: '08:00 AM Today',
      action: 'IMD Red Alert Cyclone Montha Protocol Triggered',
      officer: 'Dr. A. Mallikarjuna, IAS (District Collector & Magistrate)',
      scope: 'All 98 Coastal Wards of Visakhapatnam District',
    },
    {
      timestamp: 'Yesterday 06:30 PM',
      action: 'Cyclone Relief Shelters Pre-stocking Ordered',
      officer: 'Joint Collector (Disaster Mgmt)',
      scope: '18 Multipurpose Cyclone Centers',
    },
  ]);

  const handleModeSwitch = (newMode: boolean) => {
    onToggleDisasterMode(newMode);
    const newEntry = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: newMode
        ? 'DISASTER EMERGENCY OVERRIDE ENGAGED (NDRF & SDRF Integrated)'
        : 'Disaster Mode Disengaged. Reverted to Normal Civic Governance.',
      officer: 'Dr. A. Mallikarjuna, IAS (District Collector)',
      scope: 'District-wide JanRakshak Grid',
    };
    setCollectorLog([newEntry, ...collectorLog]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => (onGoBack ? onGoBack() : onNavigate(isDisasterMode ? 'citizen_home_disaster' : 'citizen_home_normal'))}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 transition-colors active:scale-95 cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
          EXECUTIVE JURISDICTION: VISAKHAPATNAM DISTRICT
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
          <div className="p-3 bg-slate-900 text-white rounded-xl shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>GOVERNMENT OF ANDHRA PRADESH</span>
              <span>·</span>
              <span>OFFICE OF THE DISTRICT MAGISTRATE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              District Collector Emergency Mode Switcher
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Statutory Disaster Management Act 2005 authority switch. Flipping this override changes all citizen client UIs into high-visibility Disaster Mode, activates NDRF dispatch integration, and unlocks priority evacuation routing.
            </p>
          </div>
        </div>

        {/* Master Toggle Console */}
        <div
          className={`p-6 rounded-2xl border-2 transition-all ${
            isDisasterMode
              ? 'bg-red-50/60 border-red-500 ring-2 ring-red-400/20'
              : 'bg-slate-50 border-slate-300'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                CURRENT SYSTEM PROTOCOL STATE
              </span>
              <h2
                className={`text-xl font-extrabold ${
                  isDisasterMode ? 'text-red-700' : 'text-slate-900'
                }`}
              >
                {isDisasterMode ? 'RED ALERT: DISASTER EMERGENCY MODE ACTIVE' : 'NORMAL CIVIC GOVERNANCE MODE'}
              </h2>
              <p className="text-xs text-slate-600 max-w-lg">
                {isDisasterMode
                  ? 'Citizens see red evacuation banners, shelter occupancies, elder SOS buttons, and hazardous safe-route maps.'
                  : 'Citizens see routine civic defect reporting (potholes, drains, streetlights) with 50m spatial deduplication.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleModeSwitch(!isDisasterMode)}
                className={`px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center gap-2 ${
                  isDisasterMode
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                }`}
              >
                {isDisasterMode ? (
                  <>
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>Revert to Normal Civic Mode</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-yellow-300" />
                    <span>Engage Disaster Emergency Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Statutory Directives and Checklist */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            District Collector Statutory Protocol Checklist:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">18 Cyclone Shelters Activated</span>
                <p className="text-slate-500 text-[11px] mt-0.5">Dry rations for 48 hours and diesel generator fuel certified.</p>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">NDRF 10th Battalion Staged</span>
                <p className="text-slate-500 text-[11px] mt-0.5">18 inflatable boats and cutting crews prepositioned in coastal wards.</p>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">Elder SOS Priority Enabled</span>
                <p className="text-slate-500 text-[11px] mt-0.5">Automated pairing with 42 verified proximity volunteers.</p>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">50m Spatial Deduplication</span>
                <p className="text-slate-500 text-[11px] mt-0.5">Municipal road crews receive consolidated single-ticket orders.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Executive Collectorate Audit Log:
          </h3>
          <div className="space-y-2">
            {collectorLog.map((log, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{log.officer}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{log.scope}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500 shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Nav Action */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => onNavigate('ndrf_dispatcher_dashboard')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
          >
            Go to NDRF Dispatcher War Room →
          </button>
          <button
            onClick={() => onNavigate('cyclone_shelter_capacity')}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg"
          >
            Review Cyclone Shelters →
          </button>
        </div>
      </div>
    </div>
  );
};
