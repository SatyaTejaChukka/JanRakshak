import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { ScreenId, Ticket, HazardIncident, Shelter } from '../types';
import {
  calculateHaversineDistance,
  computeSafeRoute,
  ComputedRoute,
  RouteCoordinate,
  isTicketRoadBlocking,
} from '../utils/routingEngine';
import {
  Compass,
  ArrowLeft,
  AlertTriangle,
  Shield,
  Layers,
  MapPin,
  CheckCircle2,
  Navigation,
  Flame,
  Radio,
  RefreshCw,
  LocateFixed,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Info,
  Sliders,
  ExternalLink,
  LifeBuoy,
  PlusCircle,
  X,
  Volume2,
} from 'lucide-react';

interface HazardNavigationMapProps {
  tickets?: Ticket[];
  hazards?: HazardIncident[];
  shelters?: Shelter[];
  targetShelterId?: string;
  onNavigate: (screen: ScreenId) => void;
  onGoBack?: () => void;
}

// Preset origin locations across Visakhapatnam for rapid citizen testing
const ORIGIN_PRESETS: Array<{ name: string; coord: RouteCoordinate; description: string }> = [
  {
    name: 'Coastal Ward 14 (RK Beach / Battery)',
    coord: { latitude: 17.7126, longitude: 83.3195 },
    description: 'High-risk low-lying surge zone',
  },
  {
    name: 'Siripuram Junction',
    coord: { latitude: 17.7265, longitude: 83.3155 },
    description: 'Central transit arterial intersection',
  },
  {
    name: 'Peda Waltair Hill Top',
    coord: { latitude: 17.738, longitude: 83.336 },
    description: 'Elevated residential ridge',
  },
  {
    name: 'Maharanipeta (Collectorate)',
    coord: { latitude: 17.7082, longitude: 83.3075 },
    description: 'Administrative & Medical Hub',
  },
  {
    name: 'Sector 5, MVP Colony',
    coord: { latitude: 17.7412, longitude: 83.3341 },
    description: 'Dense municipal corridor',
  },
];

export const HazardNavigationMap: React.FC<HazardNavigationMapProps> = ({
  tickets = [],
  hazards = [],
  shelters = [],
  targetShelterId,
  onNavigate,
  onGoBack,
}) => {
  // Leaflet Map & Layer References
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // User Current Location / Origin (Defaults to Coastal Ward 14 Visakhapatnam)
  const [origin, setOrigin] = useState<RouteCoordinate>({
    latitude: 17.7126,
    longitude: 83.3195,
  });
  const [originLabel, setOriginLabel] = useState<string>('Coastal Ward 14 (RK Beach)');
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Selected Destination (Default to AU Indoor Stadium or passed targetShelterId)
  const defaultShelter =
    shelters.find((s) => s.id === targetShelterId) ||
    shelters[0] || {
      id: 'SHL-01',
      name: 'AU Indoor Stadium Cyclone Relief Center',
      location: 'Andhra University South Campus, Visakhapatnam',
      distanceKm: 1.4,
      totalCapacity: 1200,
      currentOccupants: 810,
      coordinates: { latitude: 17.7295, longitude: 83.3225 },
      amenities: ['Generators', 'Community Kitchen', '24/7 Medical Post'],
      medicalOfficer: 'Dr. B. Kameswari',
      contactNumber: '+91 891 2754401',
      waterSupplyStatus: 'Abundant',
      generatorStatus: 'Operational',
      safeRouteStatus: 'Clear & Elevated',
    };

  const [selectedShelterId, setSelectedShelterId] = useState<string>(defaultShelter.id);
  const [customDestination, setCustomDestination] = useState<{
    name: string;
    coord: RouteCoordinate;
  } | null>(null);

  // Active target destination coordinates
  const destinationCoord: RouteCoordinate = customDestination
    ? customDestination.coord
    : shelters.find((s) => s.id === selectedShelterId)?.coordinates || {
        latitude: 17.7295,
        longitude: 83.3225,
      };

  const destinationName: string = customDestination
    ? customDestination.name
    : shelters.find((s) => s.id === selectedShelterId)?.name || 'AU Indoor Stadium Relief Center';

  // Roadblock Avoidance & Layers Toggle State
  const [avoidRoadblocks, setAvoidRoadblocks] = useState<boolean>(true);
  const [showTicketsLayer, setShowTicketsLayer] = useState<boolean>(true);
  const [showSheltersLayer, setShowSheltersLayer] = useState<boolean>(true);
  const [showHazardsLayer, setShowHazardsLayer] = useState<boolean>(true);
  const [mapTheme, setMapTheme] = useState<'standard' | 'dark' | 'voyager'>('voyager');

  // Simulated Roadblock Injection State (User can tap map to test dynamic reroute)
  const [isAddRoadblockMode, setIsAddRoadblockMode] = useState<boolean>(false);
  const [simulatedBlockers, setSimulatedBlockers] = useState<Ticket[]>([]);

  // Computed Route & Navigation State
  const [computedRoute, setComputedRoute] = useState<ComputedRoute | null>(null);
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const [isStepsOpen, setIsStepsOpen] = useState<boolean>(false);
  const [selectedTicketDetail, setSelectedTicketDetail] = useState<Ticket | null>(null);

  // All combined active tickets (persisted tickets + simulated user blockers)
  const activeTicketsList = [...tickets, ...simulatedBlockers];

  // -------------------------------------------------------------
  // Map Initialization Effect
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [origin.latitude, origin.longitude],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Base Tile Layer
      const tileUrls = {
        standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      };

      const tileLayer = L.tileLayer(tileUrls[mapTheme], {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO | JanRakshak Civic GIS',
        maxZoom: 19,
      }).addTo(map);

      (map as any)._tileLayer = tileLayer;

      // Layer groups for dynamic clearing and redraws
      const routeGroup = L.layerGroup().addTo(map);
      const markersGroup = L.layerGroup().addTo(map);

      routeLayerGroupRef.current = routeGroup;
      markersLayerGroupRef.current = markersGroup;
      mapRef.current = map;

      // Click on map listener: supports custom destination or simulated roadblock
      map.on('click', (e: L.LeafletMouseEvent) => {
        const clickedLat = e.latlng.lat;
        const clickedLng = e.latlng.lng;

        // Custom Destination
        setCustomDestination({
          name: `Custom Location (${clickedLat.toFixed(4)}, ${clickedLng.toFixed(4)})`,
          coord: { latitude: clickedLat, longitude: clickedLng },
        });
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when theme changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if ((map as any)._tileLayer) {
      map.removeLayer((map as any)._tileLayer);
    }
    const tileUrls = {
      standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    };
    const newLayer = L.tileLayer(tileUrls[mapTheme], {
      attribution: '&copy; OpenStreetMap contributors | JanRakshak Civic GIS',
      maxZoom: 19,
    }).addTo(map);
    (map as any)._tileLayer = newLayer;
  }, [mapTheme]);

  // -------------------------------------------------------------
  // Live GPS Coordinate Acquisition
  // -------------------------------------------------------------
  const handleAcquireLiveGPS = () => {
    setIsLocating(true);
    setLocationNotice(null);

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setLocationNotice('Browser geolocation not supported on this device.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const liveLat = position.coords.latitude;
        const liveLng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);

        setOrigin({ latitude: liveLat, longitude: liveLng });
        setOriginLabel(`Live GPS Position (±${accuracy}m accuracy)`);
        setIsGpsActive(true);
        setGpsAccuracy(accuracy);
        setIsLocating(false);

        if (mapRef.current) {
          mapRef.current.flyTo([liveLat, liveLng], 15, { duration: 1.2 });
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Could not acquire GPS. Reverting to Coastal Ward 14.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied by browser. Please enable GPS in browser settings.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'GPS signal request timed out. Retrying with network location.';
        }
        setLocationNotice(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 0,
      }
    );
  };

  // -------------------------------------------------------------
  // Route Recalculation Engine
  // -------------------------------------------------------------
  const recalculateRoute = async () => {
    setIsRouting(true);
    try {
      const result = await computeSafeRoute(
        origin,
        destinationCoord,
        activeTicketsList,
        hazards,
        avoidRoadblocks
      );
      setComputedRoute(result);
    } catch (err) {
      console.error('Failed to calculate safe route:', err);
    } finally {
      setIsRouting(false);
    }
  };

  // Re-trigger calculation whenever origin, destination, roadblocks, or tickets change
  useEffect(() => {
    recalculateRoute();
  }, [
    origin.latitude,
    origin.longitude,
    destinationCoord.latitude,
    destinationCoord.longitude,
    avoidRoadblocks,
    activeTicketsList.length,
    hazards.length,
  ]);

  // -------------------------------------------------------------
  // Redraw Polylines & Markers on Map
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mapRef.current || !routeLayerGroupRef.current || !markersLayerGroupRef.current) return;

    const map = mapRef.current;
    const routeGroup = routeLayerGroupRef.current;
    const markersGroup = markersLayerGroupRef.current;

    // Clear previous overlays
    routeGroup.clearLayers();
    markersGroup.clearLayers();

    // 1. Origin Marker (Civic Blue Pulsing Beacon)
    const originIcon = L.divIcon({
      className: 'bg-transparent',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10">
          <div class="absolute w-10 h-10 rounded-full bg-blue-500/35 animate-ping"></div>
          <div class="relative w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center">
            <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const originMarker = L.marker([origin.latitude, origin.longitude], {
      icon: originIcon,
      zIndexOffset: 1000,
    }).addTo(markersGroup);

    originMarker.bindPopup(`
      <div class="p-2 space-y-1 text-slate-900 font-sans">
        <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          YOUR CURRENT LOCATION
        </span>
        <h4 class="text-xs font-bold text-slate-900 mt-1">${originLabel}</h4>
        <p class="text-[11px] text-slate-500 font-mono">${origin.latitude.toFixed(5)}, ${origin.longitude.toFixed(5)}</p>
      </div>
    `);

    // 2. Destination Marker (Emerald Shield Beacon)
    const destIcon = L.divIcon({
      className: 'bg-transparent',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10">
          <div class="absolute w-9 h-9 rounded-full bg-emerald-500/30 animate-pulse"></div>
          <div class="relative w-7 h-7 rounded-xl bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const destMarker = L.marker([destinationCoord.latitude, destinationCoord.longitude], {
      icon: destIcon,
      zIndexOffset: 990,
    }).addTo(markersGroup);

    destMarker.bindPopup(`
      <div class="p-2.5 space-y-1 text-slate-900 font-sans">
        <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          DESTINATION SAFE SHELTER
        </span>
        <h4 class="text-xs font-bold text-slate-900 mt-1">${destinationName}</h4>
        <p class="text-[11px] text-slate-500 font-mono">${destinationCoord.latitude.toFixed(5)}, ${destinationCoord.longitude.toFixed(5)}</p>
      </div>
    `);

    // 3. Cyclone Shelters Layer
    if (showSheltersLayer) {
      shelters.forEach((shelter) => {
        if (!shelter.coordinates) return;
        const isCurrentTarget = shelter.coordinates.latitude === destinationCoord.latitude;
        if (isCurrentTarget) return; // already rendered as dest

        const shelterIcon = L.divIcon({
          className: 'bg-transparent',
          html: `
            <div class="w-7 h-7 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white border-2 border-white shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
              <span class="text-[11px] font-bold">🏥</span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const sm = L.marker([shelter.coordinates.latitude, shelter.coordinates.longitude], {
          icon: shelterIcon,
        }).addTo(markersGroup);

        sm.bindPopup(`
          <div class="p-2.5 space-y-1.5 text-slate-900 font-sans max-w-[220px]">
            <span class="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              CYCLONE SHELTER · ${shelter.id}
            </span>
            <h4 class="text-xs font-bold text-slate-900">${shelter.name}</h4>
            <p class="text-[11px] text-slate-500">${shelter.location}</p>
            <div class="text-[11px] font-mono text-slate-700">
              Occupancy: <strong>${shelter.currentOccupants} / ${shelter.totalCapacity}</strong>
            </div>
            <button
              id="btn-route-${shelter.id}"
              class="w-full mt-2 py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded transition-all cursor-pointer shadow-xs"
            >
              Route to this Shelter
            </button>
          </div>
        `);

        sm.on('popupopen', () => {
          const btn = document.getElementById(`btn-route-${shelter.id}`);
          if (btn) {
            btn.onclick = () => {
              setSelectedShelterId(shelter.id);
              setCustomDestination(null);
            };
          }
        });
      });
    }

    // 4. Civic Defect Tickets Layer (Color-coded by category with photo previews)
    if (showTicketsLayer) {
      activeTicketsList.forEach((ticket) => {
        const isBlocker = isTicketRoadBlocking(ticket);
        const markerColor = isBlocker ? '#ef4444' : '#f59e0b';
        const badgeLabel = isBlocker ? '⛔ ROADBLOCK' : 'CIVIC DEFECT';

        const ticketIcon = L.divIcon({
          className: 'bg-transparent',
          html: `
            <div class="relative flex items-center justify-center w-8 h-8 group cursor-pointer">
              ${isBlocker ? '<div class="absolute w-8 h-8 rounded-full bg-red-500/35 animate-ping"></div>' : ''}
              <div class="relative w-6 h-6 rounded-lg ${isBlocker ? 'bg-red-600' : 'bg-amber-600'} text-white border-2 border-white shadow-lg flex items-center justify-center font-bold text-[10px] transition-transform hover:scale-125">
                ${isBlocker ? '⛔' : '⚠️'}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const tm = L.marker([ticket.coordinates.latitude, ticket.coordinates.longitude], {
          icon: ticketIcon,
          zIndexOffset: isBlocker ? 850 : 700,
        }).addTo(markersGroup);

        tm.bindPopup(`
          <div class="p-2.5 space-y-2 text-slate-900 font-sans max-w-[240px]">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-bold ${isBlocker ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-800 border-amber-200'} px-2 py-0.5 rounded border">
                ${badgeLabel} · ${ticket.id}
              </span>
              <span class="text-[10px] font-mono text-slate-500">${ticket.severity}</span>
            </div>
            <h4 class="text-xs font-bold text-slate-900 leading-tight">${ticket.title}</h4>
            <p class="text-[11px] text-slate-500 leading-snug">${ticket.location}</p>
            ${
              ticket.beforeImageUrl
                ? `<div class="w-full h-24 rounded overflow-hidden border border-slate-200">
                    <img src="${ticket.beforeImageUrl}" alt="Defect proof" class="w-full h-full object-cover" />
                   </div>`
                : ''
            }
            <div class="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
              <span>Status: <strong class="capitalize">${ticket.currentStage.replace('_', ' ')}</strong></span>
              <span>${ticket.mergedCount} reports</span>
            </div>
          </div>
        `);
      });
    }

    // 5. Draw Route Polylines
    if (computedRoute && computedRoute.coordinates.length > 0) {
      // If there was an obstructed segment that got bypassed, draw the blocked path in red dashed line
      if (computedRoute.isDetour && computedRoute.blockedSegment) {
        L.polyline(computedRoute.blockedSegment, {
          color: '#ef4444',
          weight: 4,
          opacity: 0.7,
          dashArray: '8, 8',
          lineCap: 'round',
        }).addTo(routeGroup);
      }

      // Draw the active path (detour or direct) in Emerald / Civic Blue
      const routeColor = computedRoute.isDetour ? '#059669' : '#2563eb';

      const mainPolyline = L.polyline(computedRoute.coordinates, {
        color: routeColor,
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(routeGroup);

      // Fit map bounds to show entire route with comfortable padding
      try {
        const bounds = mainPolyline.getBounds();
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      } catch (e) {}
    }
  }, [
    computedRoute,
    origin.latitude,
    origin.longitude,
    destinationCoord.latitude,
    destinationCoord.longitude,
    showSheltersLayer,
    showTicketsLayer,
    activeTicketsList.length,
  ]);

  // Handle adding a simulated roadblock on the map
  const handleSimulateRoadblockNearRoute = () => {
    if (!computedRoute || computedRoute.coordinates.length < 5) return;

    // Pick coordinate at ~35% of the route to inject a realistic road obstruction
    const sampleIdx = Math.floor(computedRoute.coordinates.length * 0.35);
    const point = computedRoute.coordinates[sampleIdx];

    const newBlocker: Ticket = {
      id: `TKT-${Math.floor(2000 + Math.random() * 8000)}`,
      category: 'Fallen Tree & Power Line',
      title: '🚨 Snapped Coconut Tree Blocking Highway Artery',
      location: 'Ward 14 Beach Road Bypass Corridor, Visakhapatnam',
      coordinates: { latitude: point[0], longitude: point[1] },
      reportedAt: 'Just Now',
      currentStage: 'submitted',
      citizenName: 'Simulated Disaster Blockade',
      citizenPhone: '+91 98480 99999',
      mergedCount: 1,
      severity: 'Critical',
    };

    setSimulatedBlockers((prev) => [newBlocker, ...prev]);
    setIsAddRoadblockMode(false);
  };

  const handleClearSimulatedBlockers = () => {
    setSimulatedBlockers([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => (onGoBack ? onGoBack() : onNavigate('citizen_home_disaster'))}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 transition-colors w-fit active:scale-95 cursor-pointer shadow-2xs"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Exit Navigation</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAcquireLiveGPS}
            disabled={isLocating}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring GPS...' : 'My Live Location'}</span>
          </button>

          <button
            onClick={() => onNavigate('cyclone_shelter_capacity')}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-all cursor-pointer"
          >
            All Shelters ({shelters.length})
          </button>
        </div>
      </div>

      {/* Main Title & Dynamic Rerouting Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-blue-700 font-mono font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>DYNAMIC AI ROADBLOCK & HAZARD REROUTING GIS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Real-Time Hazard & Evacuation Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Real-time route calculation between live GPS coordinates and elevated cyclone shelters.
              Automatically scans for blocking civic defect tickets (craters, fallen trees, waterlogging)
              and reroutes around obstructed corridors.
            </p>
          </div>

          {/* Reroute Avoidance Switch */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={avoidRoadblocks}
                onChange={(e) => setAvoidRoadblocks(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <span>Auto-Detour Active Roadblocks</span>
            </label>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                avoidRoadblocks
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {avoidRoadblocks ? 'SAFETY ENGAGED' : 'DIRECT PATH'}
            </span>
          </div>
        </div>

        {/* Location Notice Banner if Any */}
        {locationNotice && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong>Location Update:</strong> {locationNotice}
            </div>
            <button
              onClick={() => setLocationNotice(null)}
              className="text-amber-500 hover:text-amber-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Dynamic Roadblock Alert & Detour Status Banner */}
        {computedRoute?.isDetour && computedRoute.bypassedBlockers.length > 0 && (
          <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                    DYNAMIC DETOUR ACTIVE
                  </span>
                  <span className="text-xs font-bold text-amber-900">
                    {computedRoute.bypassedBlockers.length} Obstruction(s) Bypassed
                  </span>
                </div>
                <p className="text-xs text-amber-950 font-medium">
                  Primary road blocked by{' '}
                  <strong>{computedRoute.bypassedBlockers[0].title}</strong> (
                  {computedRoute.bypassedBlockers[0].id}). Safe elevated detour dynamically recalculated!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900 bg-white/80 px-3 py-1.5 rounded-lg border border-amber-200 shrink-0">
              <span>Passable Corridors: 100% Cleared</span>
            </div>
          </div>
        )}
      </div>

      {/* Origin & Destination Switcher Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Origin Selector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-blue-700 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              STARTING POINT (ORIGIN)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {origin.latitude.toFixed(4)}, {origin.longitude.toFixed(4)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ORIGIN_PRESETS.map((preset, idx) => {
              const isSelected =
                origin.latitude === preset.coord.latitude &&
                origin.longitude === preset.coord.longitude;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setOrigin(preset.coord);
                    setOriginLabel(preset.name);
                    setIsGpsActive(false);
                    if (mapRef.current) {
                      mapRef.current.flyTo([preset.coord.latitude, preset.coord.longitude], 15);
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Destination Shelter Selector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              TARGET RELIEF DESTINATION
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {destinationCoord.latitude.toFixed(4)}, {destinationCoord.longitude.toFixed(4)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {shelters.slice(0, 4).map((s) => {
              const isSelected = selectedShelterId === s.id && !customDestination;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedShelterId(s.id);
                    setCustomDestination(null);
                    if (s.coordinates && mapRef.current) {
                      mapRef.current.flyTo([s.coordinates.latitude, s.coordinates.longitude], 15);
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s.name.split(' ')[0]} {s.name.split(' ')[1]}
                </button>
              );
            })}

            {customDestination && (
              <span className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Map Pin Selected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Turn-by-Turn Guidance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Real Leaflet Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-200 overflow-hidden shadow-md relative min-h-[520px] sm:min-h-[580px] flex flex-col">
            {/* Map Top Floating Overlay Bar */}
            <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 pointer-events-auto">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                  {destinationName}
                </span>
              </div>

              {/* Map Theme Toggle */}
              <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1 pointer-events-auto">
                <button
                  onClick={() => setMapTheme('voyager')}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                    mapTheme === 'voyager' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  GovTech
                </button>
                <button
                  onClick={() => setMapTheme('standard')}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                    mapTheme === 'standard' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  OSM
                </button>
                <button
                  onClick={() => setMapTheme('dark')}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                    mapTheme === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Tactical Dark
                </button>
              </div>
            </div>

            {/* The Actual Real Leaflet Map DOM Element */}
            <div ref={mapContainerRef} className="w-full h-full min-h-[520px] sm:min-h-[580px] z-0" />

            {/* Map Bottom Floating Controls Bar */}
            <div className="absolute bottom-3 left-3 right-14 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="bg-white/95 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-md flex items-center gap-2 text-xs pointer-events-auto">
                <button
                  onClick={() => setShowTicketsLayer((prev) => !prev)}
                  className={`px-2 py-1 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer ${
                    showTicketsLayer ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <span>⚠️ Defect Tickets</span>
                </button>
                <button
                  onClick={() => setShowSheltersLayer((prev) => !prev)}
                  className={`px-2 py-1 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer ${
                    showSheltersLayer ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <span>🏥 Shelters</span>
                </button>
              </div>

              {/* Roadblock Simulation Trigger */}
              <div className="pointer-events-auto flex items-center gap-1.5">
                <button
                  onClick={handleSimulateRoadblockNearRoute}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  title="Simulate a road-blocking defect ticket on route to verify dynamic recalculation"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Test Roadblock Reroute</span>
                </button>

                {simulatedBlockers.length > 0 && (
                  <button
                    onClick={handleClearSimulatedBlockers}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                    title="Clear simulated blockers"
                  >
                    Clear ({simulatedBlockers.length})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Route Status Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">SAFE DISTANCE</span>
              <span className="text-lg font-black text-slate-900 font-mono">
                {computedRoute ? `${computedRoute.distanceKm} KM` : 'Calculating...'}
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">ESTIMATED ETA</span>
              <span className="text-lg font-black text-emerald-600 font-mono">
                {computedRoute ? `~${computedRoute.durationMinutes} MINS` : 'Calculating...'}
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">ROAD CLEARANCE</span>
              <span className="text-xs font-bold text-slate-800 block truncate mt-1">
                {computedRoute?.isDetour ? '✅ Bypassed Obstruction' : '🟢 Primary Open'}
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">DETOUR STATUS</span>
              <span
                className={`text-xs font-bold block truncate mt-1 ${
                  computedRoute?.isDetour ? 'text-amber-600' : 'text-slate-600'
                }`}
              >
                {computedRoute?.isDetour ? '⚠️ Detour Engaged' : 'Direct Line'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Turn-by-Turn Navigation & Active Roadblock Tickets */}
        <div className="space-y-4">
          {/* Active Roadblock List affecting route */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  ACTIVE ROADBLOCK TICKETS
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {activeTicketsList.filter(isTicketRoadBlocking).length} Total
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Civic defect tickets flagged with high severity, road craters, or fallen infrastructure:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {activeTicketsList.filter(isTicketRoadBlocking).map((ticket) => {
                const isBypassedOnRoute = computedRoute?.bypassedBlockers.some(
                  (b) => b.id === ticket.id
                );

                return (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.flyTo(
                          [ticket.coordinates.latitude, ticket.coordinates.longitude],
                          16
                        );
                      }
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isBypassedOnRoute
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        {ticket.id}
                      </span>
                      {isBypassedOnRoute && (
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded">
                          ON ROUTE
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                      {ticket.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{ticket.location}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Turn-by-Turn Navigation Instructions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  TURN-BY-TURN GUIDANCE
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                {computedRoute?.steps.length || 0} Steps
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {computedRoute?.steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                    step.isDetour
                      ? 'bg-amber-50 border-amber-300 text-amber-950 font-semibold'
                      : 'bg-slate-50 border-slate-100 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono font-bold ${
                      step.isDetour ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="leading-snug">{step.instruction}</p>
                    {step.distanceMeters > 0 && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {step.distanceMeters} meters
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
