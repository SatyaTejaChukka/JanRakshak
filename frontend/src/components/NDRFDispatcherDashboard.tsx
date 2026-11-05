import React, { useState } from 'react';
import { ScreenId, Ticket } from '../types';
import {
  ShieldAlert,
  ArrowLeft,
  Radio,
  Truck,
  Users,
  AlertTriangle,
  Send,
  CheckCircle2,
  PhoneCall,
  Clock,
  Compass,
  FileText,
  MapPin,
  Flame,
} from 'lucide-react';

interface NDRFDispatcherDashboardProps {
  tickets: Ticket[];
  onNavigate: (screen: ScreenId) => void;
}

interface DispatchUnit {
  id: string;
  name: string;
  type: 'Inflatable Motor Boat (IRB)' | 'Tree Clearing Crane Unit' | 'Emergency Medical Team' | 'Helicopter Air-Drop';
  status: 'Deployed' | 'Available' | 'Refueling';
  location: string;
  assignedIncident: string;
}

export const NDRFDispatcherDashboard: React.FC<NDRFDispatcherDashboardProps> = ({
  tickets,
  onNavigate,
}) => {
  const [units, setUnits] = useState<DispatchUnit[]>([
    {
      id: 'UNIT-B01',
      name: 'NDRF 10th Bn IRB Boat #04',
      type: 'Inflatable Motor Boat (IRB)',
      status: 'Deployed',
      location: 'Ward 14 Beach Coastal Belt',
      assignedIncident: 'Elder SOS Evacuation (ELD-4091)',
    },
    {
      id: 'UNIT-C02',
      name: 'Hydraulic Tree & Wire Cutter #02',
      type: 'Tree Clearing Crane Unit',
      status: 'Deployed',
      location: 'Siripuram Junction 11kV Feeder',
      assignedIncident: 'Fallen Gulmohar (TKT-8904)',
    },
    {
      id: 'UNIT-M01',
      name: 'Disaster Rapid Medical Unit #01',
      type: 'Emergency Medical Team',
      status: 'Available',
      location: 'AU Indoor Stadium Relief Hub',
      assignedIncident: 'Standby for triage',
    },
    {
      id: 'UNIT-H01',
      name: 'Coast Guard Chetak Helicopter #08',
      type: 'Helicopter Air-Drop',
      status: 'Available',
      location: 'INS Dega Airbase Runway 2',
      assignedIncident: 'Ready for offshore sorties',
    },
  ]);

  const [emergencyBroadcast, setEmergencyBroadcast] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyBroadcast) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setEmergencyBroadcast('');
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>NDRF 10TH BATTALION TACTICAL WAR ROOM · VISAKHAPATNAM</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('ndrf_volunteer_hub')}
            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Volunteer Command Hub</span>
          </button>
          <button
            onClick={() => onNavigate('district_collector_switcher')}
            className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 px-3 py-2 rounded-lg border border-slate-200"
          >
            Collector Override
          </button>
          <button
            onClick={() => onNavigate('hazard_navigation_map')}
            className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-200"
          >
            Live Hazard Map
          </button>
        </div>
      </div>

      {/* Main War Room Command Header */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-bold uppercase">
                NATIONAL DISASTER RESPONSE FORCE · 10TH BATTALION COMMAND
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">STATE EOC LINK ACTIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              War Room Emergency Dispatcher Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Coordinating inter-agency tactical rescue between NDRF, SDRF, Indian Coast Guard, GVMC Disaster Engineering, and APEPDCL High-Voltage line restoration.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Active SOS</span>
              <span className="text-2xl font-bold font-mono text-red-500">14 Alerts</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Units Deployed</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">18 Teams</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Evacuated</span>
              <span className="text-2xl font-bold font-mono text-blue-400">2,410</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Units & Active SOS Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tactical Units */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Tactical Resource Deployment Queue</h2>
              <p className="text-xs text-slate-500">Motorized rafts, medical corps, and heavy tree cutters</p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
              Total 4 Tracked Units
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-500">{unit.id}</span>
                    <h3 className="font-bold text-slate-900 text-sm">{unit.name}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      unit.status === 'Deployed'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {unit.status}
                  </span>
                </div>

                <div className="text-xs space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-slate-600">
                    <span className="text-slate-400">Type:</span> {unit.type}
                  </div>
                  <div className="text-slate-600">
                    <span className="text-slate-400">Location:</span> {unit.location}
                  </div>
                  <div className="text-slate-800 font-medium">
                    <span className="text-slate-400">Mission:</span> {unit.assignedIncident}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setUnits((prev) =>
                        prev.map((u) =>
                          u.id === unit.id
                            ? { ...u, status: u.status === 'Deployed' ? 'Available' : 'Deployed' }
                            : u
                        )
                      );
                    }}
                    className="flex-1 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg text-center cursor-pointer"
                  >
                    {unit.status === 'Deployed' ? 'Recall to Base' : 'Dispatch to Incident'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Broadcast Console */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-600" />
              <span>Broadcast Immediate Warning to Field Responders & Citizens</span>
            </h3>
            <form onSubmit={handleBroadcast} className="flex gap-2">
              <input
                type="text"
                value={emergencyBroadcast}
                onChange={(e) => setEmergencyBroadcast(e.target.value)}
                placeholder="Type emergency alert (e.g., High-tension wire snapped on Siripuram Road)..."
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-blue-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Alert</span>
              </button>
            </form>
            {broadcastSent && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Broadcast dispatched across Cell Broadcast Channel 4370 & App clients.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: High-Priority Incident Feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Critical Incident Prioritization</h3>
            <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              SEV-1 RED
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-red-200 bg-red-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-red-700">INCIDENT SOS-4091</span>
                <span className="text-red-600 font-semibold">Priority 1</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Elder Evacuation: Venkateswara Rao (Age 79)
              </h4>
              <p className="text-[11px] text-slate-600">
                Coastal Battery Road Flat 302. Lift disabled, Oxygen Concentrator required.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onNavigate('volunteer_proximity')}
                  className="px-2.5 py-1 bg-red-600 text-white rounded text-[11px] font-semibold"
                >
                  View Volunteer Team
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-amber-700">INCIDENT HAZ-102</span>
                <span className="text-amber-600 font-semibold">Feeder Down</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                11kV Snapped Feeder at Siripuram Junction
              </h4>
              <p className="text-[11px] text-slate-600">
                Live wire sparking on waterlogged pavement. APEPDCL isolate command sent.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onNavigate('hazard_navigation_map')}
                  className="px-2.5 py-1 bg-amber-600 text-white rounded text-[11px] font-semibold"
                >
                  Inspect On Map
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-blue-700">SHELTER SHL-01</span>
                <span className="text-blue-600 font-semibold">Capacity 68%</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                AU Indoor Stadium Cyclone Center
              </h4>
              <p className="text-[11px] text-slate-600">
                810 / 1200 Occupants. 4 Diesel Generators active, hot meal kitchen running.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onNavigate('cyclone_shelter_capacity')}
                  className="px-2.5 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold"
                >
                  Manage Shelter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
