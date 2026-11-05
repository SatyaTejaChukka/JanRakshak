import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { ScreenId, ElderProfile } from '../types';
import {
  Users,
  ArrowLeft,
  Navigation,
  Shield,
  Phone,
  CheckCircle2,
  Clock,
  Radio,
  MapPin,
  HeartHandshake,
  AlertOctagon,
  Compass,
} from 'lucide-react';

interface VolunteerProximityProps {
  elderProfile: ElderProfile;
  onNavigate: (screen: ScreenId) => void;
  onGoBack?: () => void;
}

interface Volunteer {
  id: string;
  name: string;
  distanceMeters: number;
  etaMinutes: number;
  role: string;
  equipment: string;
  phone: string;
  status: 'En Route' | 'Arrived' | 'Standby';
  isVerified: boolean;
  coord: [number, number];
}

export const VolunteerProximity: React.FC<VolunteerProximityProps> = ({
  elderProfile,
  onNavigate,
  onGoBack,
}) => {
  // Elder Home Coordinates (Sai Sagar Enclave, Coastal Battery Road, Ward 14)
  const elderCoord: [number, number] = [17.7126, 83.3195];

  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    {
      id: 'VOL-01',
      name: 'K. Sai Kumar',
      distanceMeters: 140,
      etaMinutes: 3,
      role: 'Ward 14 Youth Wing Captain',
      equipment: 'Folding Stretcher & First Aid Trauma Pack',
      phone: '+91 98480 11990',
      status: 'En Route',
      isVerified: true,
      coord: [17.7138, 83.3204],
    },
    {
      id: 'VOL-02',
      name: 'P. Venkat & Team (2 members)',
      distanceMeters: 220,
      etaMinutes: 5,
      role: 'Fishermen Community Rescuer',
      equipment: 'Inflatable Raft & Life Jackets',
      phone: '+91 94401 88776',
      status: 'En Route',
      isVerified: true,
      coord: [17.7112, 83.3182],
    },
    {
      id: 'VOL-03',
      name: 'Dr. Archana M.',
      distanceMeters: 310,
      etaMinutes: 7,
      role: 'Resident Medical Officer (PHC)',
      equipment: 'Portable Oxygen Cylinder & BP Monitor',
      phone: '+91 91234 44332',
      status: 'En Route',
      isVerified: true,
      coord: [17.7145, 83.3175],
    },
    {
      id: 'VOL-04',
      name: 'T. Nagesh',
      distanceMeters: 450,
      etaMinutes: 10,
      role: 'Civil Defence Volunteer',
      equipment: 'High-Torque 4x4 Bolero for Evacuation',
      phone: '+91 97000 66554',
      status: 'Standby',
      isVerified: true,
      coord: [17.7155, 83.3225],
    },
  ]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: elderCoord,
        zoom: 16,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | JanRakshak Proximity Radar',
        maxZoom: 19,
      }).addTo(map);

      // Add 200m & 400m proximity safety rings
      L.circle(elderCoord, {
        radius: 200,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(map);

      L.circle(elderCoord, {
        radius: 400,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.04,
        weight: 1,
        dashArray: '6, 6',
      }).addTo(map);

      // Elder Home SOS Marker
      const elderIcon = L.divIcon({
        className: 'bg-transparent',
        html: `
          <div class="relative flex items-center justify-center w-10 h-10">
            <div class="absolute w-10 h-10 rounded-full bg-red-600/40 animate-ping"></div>
            <div class="relative w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-[10px]">
              SOS
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const em = L.marker(elderCoord, { icon: elderIcon, zIndexOffset: 1000 }).addTo(map);
      em.bindPopup(`
        <div class="p-2 space-y-1 text-slate-900 font-sans">
          <span class="text-[10px] font-mono font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">
            EMERGENCY EVACUATION TARGET
          </span>
          <h4 class="text-xs font-bold text-slate-900 mt-1">${elderProfile.fullName}</h4>
          <p class="text-[11px] text-slate-500">${elderProfile.address}</p>
          <div class="text-[10px] text-red-700 font-bold">Needs: ${elderProfile.criticalNeeds.join(', ')}</div>
        </div>
      `);

      // Volunteer Responders Markers & Approach Vectors
      volunteers.forEach((vol) => {
        const isArrived = vol.status === 'Arrived';
        const color = isArrived ? '#059669' : '#2563eb';

        const volIcon = L.divIcon({
          className: 'bg-transparent',
          html: `
            <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer">
              <div class="relative w-7 h-7 rounded-xl ${isArrived ? 'bg-emerald-600' : 'bg-blue-600'} text-white border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold transition-transform hover:scale-125">
                ${isArrived ? '✓' : '🏃'}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const vm = L.marker(vol.coord, { icon: volIcon }).addTo(map);
        vm.bindPopup(`
          <div class="p-2 space-y-1 text-slate-900 font-sans max-w-[200px]">
            <span class="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              ${vol.role}
            </span>
            <h4 class="text-xs font-bold text-slate-900">${vol.name}</h4>
            <p class="text-[11px] text-slate-500">${vol.equipment}</p>
            <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 font-mono">
              <span class="text-emerald-700 font-bold">${vol.distanceMeters}m away</span>
              <span class="text-slate-500">ETA: ${vol.etaMinutes}m</span>
            </div>
          </div>
        `);

        // Approach line connecting volunteer to elder's home
        L.polyline([vol.coord, elderCoord], {
          color: color,
          weight: 2.5,
          opacity: 0.65,
          dashArray: '6, 6',
        }).addTo(map);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleUpdateStatus = (id: string) => {
    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: v.status === 'En Route' ? 'Arrived' : 'En Route' } : v
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => (onGoBack ? onGoBack() : onNavigate('citizen_home_disaster'))}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 transition-colors w-fit active:scale-95 cursor-pointer shadow-2xs"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('hazard_navigation_map')}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 cursor-pointer transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Full AI Detour GIS</span>
          </button>
        </div>
      </div>

      {/* Hero Alert Header */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>CIVILIAN RESCUE CORPS · WARD 14 GEOGRAPHIC RADAR</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Emergency Elder Evacuation: {elderProfile.fullName}
            </h1>
            <p className="text-xs text-slate-300">
              Address: {elderProfile.address} ({elderProfile.floorLevel})
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 px-4 shrink-0 flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block font-mono">
                Active Responders
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400">4 En Route</span>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 block font-mono">Closest ETA</span>
              <span className="text-xl font-bold font-mono text-white">~3 Mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real Live Distance Map Widget */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Real-Time Geotagged Street Map & Responders
            </h2>
            <p className="text-xs text-slate-500">
              Real geographic coordinates around Ward 14 coastal battery corridor
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
            4 Responders Matched
          </span>
        </div>

        {/* Real Leaflet Map Container */}
        <div className="relative w-full h-80 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
          <div className="absolute top-2.5 left-2.5 z-[400] bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-mono font-bold text-slate-700 shadow-xs">
            Live OpenStreetMap Grid · Visakhapatnam
          </div>
        </div>

        {/* Responders List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {volunteers.map((vol) => (
            <div
              key={vol.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {vol.name}
                    {vol.isVerified && (
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-600 inline"
                        title="Verified Volunteer"
                      />
                    )}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      vol.status === 'Arrived'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {vol.status}
                  </span>
                </div>

                <span className="text-xs font-medium text-slate-600 block mt-0.5">{vol.role}</span>
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                  <span className="font-semibold text-slate-700">Gear:</span> {vol.equipment}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 text-xs">
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-slate-600 font-bold">{vol.distanceMeters}m</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-700 font-bold">{vol.etaMinutes} mins ETA</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${vol.phone}`}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                    title={`Call ${vol.name}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleUpdateStatus(vol.id)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                  >
                    {vol.status === 'En Route' ? 'Mark Arrived' : 'Reset'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
