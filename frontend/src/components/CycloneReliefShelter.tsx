import React, { useMemo, useState } from 'react';
import { ScreenId, Shelter, LiveGPSLocation } from '../types';
import { calculateShelterCapacity } from '../utils/logic';
import { calculateHaversineDistance } from '../utils/routingEngine';
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  Ambulance,
  BatteryCharging,
  BedDouble,
  CheckCircle2,
  Compass,
  Droplet,
  HeartPulse,
  MapPin,
  Navigation,
  PawPrint,
  Phone,
  ShieldCheck,
  Users,
  Zap,
  LocateFixed,
} from 'lucide-react';

interface CycloneReliefShelterProps {
  shelters: Shelter[];
  onNavigate: (screen: ScreenId) => void;
  onUpdateOccupancy: (shelterId: string, delta: number) => void;
  onGoBack?: () => void;
  onSelectShelterForNavigation?: (shelterId: string) => void;
  liveLocation?: LiveGPSLocation | null;
}

export const CycloneReliefShelter: React.FC<CycloneReliefShelterProps> = ({
  shelters,
  onNavigate,
  onUpdateOccupancy,
  onGoBack,
  onSelectShelterForNavigation,
  liveLocation,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'nearby' | 'medical' | 'power' | 'pets'>('all');

  // Compute dynamic shelter distances based on liveLocation if available
  const sheltersWithDynamicDistance = useMemo(() => {
    if (!liveLocation) return shelters;
    return shelters.map((s) => {
      const distM = calculateHaversineDistance(
        { latitude: liveLocation.latitude, longitude: liveLocation.longitude },
        s.coordinates
      );
      return {
        ...s,
        distanceKm: parseFloat((distM / 1000).toFixed(1)),
      };
    });
  }, [shelters, liveLocation]);

  const recommendedShelter = useMemo(
    () =>
      [...sheltersWithDynamicDistance].sort((a, b) => {
        const aSafe = a.safeRouteStatus === 'Clear & Elevated' ? 0 : 1;
        const bSafe = b.safeRouteStatus === 'Clear & Elevated' ? 0 : 1;
        return aSafe - bSafe || a.distanceKm - b.distanceKm;
      })[0],
    [sheltersWithDynamicDistance]
  );

  const visibleShelters = useMemo(
    () =>
      sheltersWithDynamicDistance
        .filter((shelter) => {
          if (activeFilter === 'nearby') return shelter.distanceKm < 3;
          if (activeFilter === 'medical') {
            return shelter.amenities.some((amenity) => /medical|first aid|ambulance|hospital/i.test(amenity));
          }
          if (activeFilter === 'power') {
            return shelter.generatorStatus !== 'Offline' || shelter.amenities.some((amenity) => /generator|solar|inverter/i.test(amenity));
          }
          if (activeFilter === 'pets') {
            return shelter.amenities.some((amenity) => /pet/i.test(amenity));
          }
          return true;
        })
        .sort((a, b) => a.distanceKm - b.distanceKm),
    [activeFilter, sheltersWithDynamicDistance]
  );

  const totalCapacity = shelters.reduce((total, shelter) => total + shelter.totalCapacity, 0);
  const totalOccupants = shelters.reduce((total, shelter) => total + shelter.currentOccupants, 0);
  const overallOccupancy = totalCapacity ? Math.round((totalOccupants / totalCapacity) * 100) : 0;
  const hasRecommendedShelter = visibleShelters.some((shelter) => shelter.id === recommendedShelter?.id);
  const secondaryShelters = visibleShelters.filter((shelter) => shelter.id !== recommendedShelter?.id);

  const renderCapacity = (shelter: Shelter) => {
    const capacity = calculateShelterCapacity(shelter.currentOccupants, shelter.totalCapacity);
    const nearCapacity = capacity.occupancyRate >= 90;

    return (
      <div className="mt-4 rounded-lg bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-3 text-slate-900">
          <span className="flex items-center gap-1.5 text-xs font-bold">
            <BedDouble className="h-4 w-4 text-orange-600" /> Live shelter occupancy
          </span>
          <span className="shrink-0 text-sm font-extrabold tabular-nums">
            {shelter.currentOccupants.toLocaleString()} <span className="font-medium text-slate-500">/ {shelter.totalCapacity.toLocaleString()}</span>
          </span>
        </div>
        <div
          className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label={`${shelter.name} occupancy`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={capacity.occupancyRate}
        >
          <div
            className={`h-full rounded-full transition-all ${nearCapacity ? 'bg-red-600' : 'bg-emerald-500'}`}
            style={{ width: `${Math.min(capacity.occupancyRate, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
          <span className={nearCapacity ? 'font-bold text-red-700' : 'text-slate-600'}>
            {capacity.occupancyRate}% occupied{nearCapacity ? ' • Near capacity' : ''}
          </span>
          <span className="font-bold text-emerald-700">{capacity.remainingSlots.toLocaleString()} beds free</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Roster adjustment</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => onUpdateOccupancy(shelter.id, -5)}
              disabled={shelter.currentOccupants <= 0}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              aria-label={`Check out five people at ${shelter.name}`}
            >
              -5 out
            </button>
            <button
              type="button"
              onClick={() => onUpdateOccupancy(shelter.id, 10)}
              disabled={shelter.currentOccupants >= shelter.totalCapacity}
              className="rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-800 hover:bg-blue-100 disabled:opacity-40 cursor-pointer"
              aria-label={`Check in ten people at ${shelter.name}`}
            >
              +10 in
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFacilities = (shelter: Shelter) => (
    <div className="mt-3 flex flex-wrap gap-1.5">
      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
        <Droplet className="h-3 w-3 text-blue-700" /> {shelter.waterSupplyStatus} water
      </span>
      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
        <Zap className="h-3 w-3 text-amber-600" /> {shelter.generatorStatus} generator
      </span>
      {shelter.amenities.map((amenity) => (
        <span key={amenity} className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
          {amenity}
        </span>
      ))}
    </div>
  );

  return (
    <div className="mx-auto min-h-full w-full max-w-5xl px-3 pb-8 sm:px-6">
      <header className="sticky top-0 z-20 -mx-3 flex h-16 items-center justify-between gap-2 border-b border-slate-200 bg-white/95 px-3 shadow-sm backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={() => (onGoBack ? onGoBack() : onNavigate('citizen_home_disaster'))}
            aria-label="Go Back"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-700" />
          <h1 className="truncate text-base font-bold text-slate-900">Cyclone Relief Shelters</h1>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-800">Shelter roster</span>
      </header>

      <section className="-mx-3 bg-emerald-50 px-3 py-3 sm:-mx-6 sm:px-6" aria-label="Shelter summary">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase text-emerald-950">
          <Activity className="h-4 w-4 text-amber-600" /> Visakhapatnam cyclone shelter status
          <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Current roster
          </span>
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Nearby relief shelters</h2>
              <p className="mt-0.5 text-xs text-slate-600">{shelters.length} shelters • {totalCapacity.toLocaleString()} total capacity</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${overallOccupancy >= 90 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'}`}>
              {overallOccupancy}% occupied
            </span>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(overallOccupancy, 100)}%` }} />
          </div>
          <p className="mt-1 text-right text-[11px] text-slate-500">{totalOccupants.toLocaleString()} people currently listed</p>
        </div>
      </section>

      <div className="-mx-3 flex items-center gap-2 overflow-x-auto bg-slate-50 px-3 py-2.5 sm:-mx-6 sm:px-6" role="group" aria-label="Filter shelters">
        {([
          ['all', `All shelters (${shelters.length})`],
          ['nearby', 'Under 3 km'],
          ['medical', 'Medical ready'],
          ['power', 'Power backup'],
          ['pets', 'Pet friendly'],
        ] as const).map(([filter, label]) => (
          <button
            key={filter}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-bold transition-colors cursor-pointer ${activeFilter === filter ? 'bg-emerald-800 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4 py-4">
        {hasRecommendedShelter && recommendedShelter && (
          <article className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-950">
                <CheckCircle2 className="h-3.5 w-3.5" /> Recommended shelter
              </span>
              <span className={`flex items-center gap-1 text-xs font-bold ${recommendedShelter.safeRouteStatus === 'Clear & Elevated' ? 'text-emerald-800' : 'text-amber-800'}`}>
                <ShieldCheck className="h-4 w-4" /> {recommendedShelter.safeRouteStatus}
              </span>
            </div>
            <h2 className="text-lg font-extrabold leading-snug text-slate-900">{recommendedShelter.name}</h2>
            <div className="mt-2 flex items-start gap-2 rounded bg-blue-50 p-2.5">
              <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-blue-800" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900">{recommendedShelter.distanceKm} km away</p>
                <p className="mt-0.5 flex items-start gap-1 text-[11px] leading-snug text-slate-600">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {recommendedShelter.location}
                </p>
                <p className="mt-1 text-[11px] text-slate-600">Route status: {recommendedShelter.safeRouteStatus}</p>
              </div>
            </div>
            {renderCapacity(recommendedShelter)}
            {renderFacilities(recommendedShelter)}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded bg-slate-100 p-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <HeartPulse className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900">{recommendedShelter.medicalOfficer}</p>
                  <p className="text-[10px] text-slate-600">Medical contact</p>
                </div>
              </div>
              <a href={`tel:${recommendedShelter.contactNumber}`} className="inline-flex shrink-0 items-center gap-1.5 rounded bg-white px-3 py-2 text-xs font-bold text-blue-800 shadow-sm hover:bg-blue-50">
                <Phone className="h-3.5 w-3.5" /> Call shelter
              </a>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onSelectShelterForNavigation) {
                  onSelectShelterForNavigation(recommendedShelter.id);
                }
                onNavigate('hazard_navigation_map');
              }}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded bg-emerald-800 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-900 cursor-pointer shadow-sm active:scale-95"
            >
              <Compass className="h-5 w-5" /> Navigate safe route
            </button>
          </article>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <h2 className="text-base font-extrabold text-slate-900">Nearby shelters</h2>
          <span className="text-[11px] text-slate-500">Sorted by distance</span>
        </div>

        {secondaryShelters.map((shelter) => {
          const capacity = calculateShelterCapacity(shelter.currentOccupants, shelter.totalCapacity);
          const nearCapacity = capacity.occupancyRate >= 90;
          return (
            <article key={shelter.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {shelter.distanceKm} km away • {shelter.location}
                  </span>
                  <h3 className="mt-1 text-sm font-bold leading-snug text-slate-900">{shelter.name}</h3>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${nearCapacity ? 'bg-red-800 text-white' : 'bg-emerald-100 text-emerald-900'}`}>
                  {capacity.occupancyRate}% {nearCapacity ? 'FULL' : 'OCCUPIED'}
                </span>
              </div>
              {nearCapacity && (
                <div className="mt-3 flex items-start gap-2 rounded bg-red-50 p-2.5 text-red-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
                  <div>
                    <p className="text-xs font-bold">Limited capacity remaining</p>
                    <p className="mt-0.5 text-[11px]">{capacity.remainingSlots.toLocaleString()} beds remain. Consider another nearby shelter.</p>
                  </div>
                </div>
              )}
              {renderFacilities(shelter)}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <Users className="h-3.5 w-3.5" /> {shelter.currentOccupants.toLocaleString()} / {shelter.totalCapacity.toLocaleString()} beds
                  {shelter.amenities.some((amenity) => /medical|first aid|ambulance|hospital/i.test(amenity)) && <Ambulance className="ml-1 h-3.5 w-3.5 text-emerald-700" aria-label="Medical facility" />}
                  {shelter.amenities.some((amenity) => /pet/i.test(amenity)) && <PawPrint className="ml-1 h-3.5 w-3.5 text-slate-600" aria-label="Pet facility" />}
                  {shelter.generatorStatus !== 'Offline' && <BatteryCharging className="ml-1 h-3.5 w-3.5 text-amber-700" aria-label="Power backup" />}
                </div>
                <div className="flex items-center gap-2">
                  <a href={`tel:${shelter.contactNumber}`} aria-label={`Call ${shelter.name}`} className="flex h-9 w-9 items-center justify-center rounded bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer">
                    <Phone className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectShelterForNavigation) {
                        onSelectShelterForNavigation(shelter.id);
                      }
                      onNavigate('hazard_navigation_map');
                    }}
                    className="flex items-center gap-1.5 rounded bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    <Compass className="h-4 w-4" /> Directions
                  </button>
                </div>
              </div>
              {renderCapacity(shelter)}
            </article>
          );
        })}

        {visibleShelters.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center">
            <PawPrint className="mx-auto h-6 w-6 text-slate-400" />
            <p className="mt-2 text-sm font-bold text-slate-800">No shelters match this filter</p>
            <p className="mt-1 text-xs text-slate-500">Try another filter to see available locations.</p>
          </div>
        )}

        <section className="rounded-lg bg-slate-900 p-4 text-center text-white">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-700">
            <Phone className="h-5 w-5" />
          </div>
          <h2 className="mt-2 text-sm font-bold">Need urgent evacuation assistance?</h2>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-300">For urgent cyclone rescue or evacuation support, contact the disaster helpline.</p>
          <a href="tel:1077" className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded bg-red-700 px-4 text-sm font-bold text-white hover:bg-red-800 cursor-pointer shadow-xs active:scale-95">
            <Phone className="h-4 w-4" /> Call disaster helpline: 1077
          </a>
          <p className="mt-3 text-[10px] text-slate-400">If you are in immediate danger, move to a safer location and contact emergency services.</p>
        </section>
      </div>
    </div>
  );
};
