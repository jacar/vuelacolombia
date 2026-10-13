import React, { useState } from 'react';
import {
  Plane,
  ArrowLeftRight,
  Calendar,
  MapPin,
  Sparkles,
  Users,
  Dog,
  Plus,
  Minus,
  ChevronDown,
  Route,
  Trash2,
  ArrowRight,
  Milestone,
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';
import {
  COLOMBIAN_AIRPORTS,
  POPULAR_ROUTES,
  MULTI_CITY_PRESETS,
  getAirportByCode,
  formatCOP,
  getGoogleFlightsMultiCityUrl
} from '../services/flightDataService';
import { TripType, PassengerConfig, MultiCityLeg, MultiCityPreset } from '../types';

export interface RouteSelectorProps {
  origin: string;
  destination: string;
  onSelectRoute: (origin: string, dest: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  tripType: TripType;
  onSelectTripType: (type: TripType) => void;
  returnDate?: string;
  onSelectReturnDate?: (date: string) => void;
  passengerConfig: PassengerConfig;
  onSelectPassengers: (cfg: PassengerConfig) => void;
  onlySaturdays: boolean;
  onToggleOnlySaturdays: (val: boolean) => void;
  // Multi-city props
  multiCityLegs?: MultiCityLeg[];
  onSelectMultiCityLegs?: (legs: MultiCityLeg[]) => void;
  activeLegIndex?: number;
  onSelectActiveLegIndex?: (index: number) => void;
}

export const RouteSelector: React.FC<RouteSelectorProps> = ({
  origin,
  destination,
  onSelectRoute,
  selectedDate,
  onSelectDate,
  tripType,
  onSelectTripType,
  returnDate,
  onSelectReturnDate,
  passengerConfig,
  onSelectPassengers,
  onlySaturdays,
  onToggleOnlySaturdays,
  multiCityLegs,
  onSelectMultiCityLegs,
  activeLegIndex = 0,
  onSelectActiveLegIndex,
}) => {
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);

  // Local fallback state for multi-city legs if not provided via props
  const [internalLegs, setInternalLegs] = useState<MultiCityLeg[]>([
    { id: 'leg-1', origin: 'BOG', destination: 'MDE', date: selectedDate || '2026-10-17' },
    { id: 'leg-2', origin: 'MDE', destination: 'CTG', date: '2026-10-20' },
  ]);

  const legs = multiCityLegs && multiCityLegs.length > 0 ? multiCityLegs : internalLegs;

  const updateLegs = (newLegs: MultiCityLeg[]) => {
    if (onSelectMultiCityLegs) {
      onSelectMultiCityLegs(newLegs);
    } else {
      setInternalLegs(newLegs);
    }

    // Sync active leg to parent route if active index is valid
    const currentActiveIdx = Math.min(activeLegIndex, newLegs.length - 1);
    const activeLeg = newLegs[currentActiveIdx];
    if (activeLeg) {
      onSelectRoute(activeLeg.origin, activeLeg.destination);
      onSelectDate(activeLeg.date);
    }
  };

  const handleSwap = () => {
    onSelectRoute(destination, origin);
  };

  const originInfo = getAirportByCode(origin);
  const destInfo = getAirportByCode(destination);

  const totalPassengers =
    passengerConfig.adults + passengerConfig.children + passengerConfig.infants;

  // Passenger counter modifier
  const updatePassenger = (
    key: keyof PassengerConfig,
    delta: number,
    min: number = 0,
    max: number = 9
  ) => {
    const nextVal = Math.max(min, Math.min(max, passengerConfig[key] + delta));
    onSelectPassengers({
      ...passengerConfig,
      [key]: nextVal,
    });
  };

  // Quick return date calculations (+3 days, +7 days, etc.)
  const setQuickReturn = (daysToAdd: number) => {
    try {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + daysToAdd);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      if (onSelectReturnDate) {
        onSelectReturnDate(`${yyyy}-${mm}-${dd}`);
      }
    } catch {}
  };

  // Helper to add days to a date string YYYY-MM-DD
  const addDaysToDate = (baseDate: string, days: number): string => {
    try {
      const parts = baseDate.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      d.setDate(d.getDate() + days);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return baseDate;
    }
  };

  // Multi-city leg actions
  const handleAddLeg = () => {
    if (legs.length >= 3) return; // Máximo 3 destinos concatenados (3 tramos)

    const lastLeg = legs[legs.length - 1];
    const newOrigin = lastLeg.destination;

    // Pick a sensible destination that is not the origin
    const candidates = ['CTG', 'BAQ', 'SMR', 'ADZ', 'BOG', 'CLO'];
    const usedDestinations = legs.map((l) => l.destination);
    const newDestination =
      candidates.find((c) => c !== newOrigin && !usedDestinations.includes(c)) ||
      (newOrigin === 'BOG' ? 'CTG' : 'BOG');

    const newDate = addDaysToDate(lastLeg.date, 3);

    const newLeg: MultiCityLeg = {
      id: `leg-${Date.now()}`,
      origin: newOrigin,
      destination: newDestination,
      date: newDate,
    };

    const nextLegs = [...legs, newLeg];
    updateLegs(nextLegs);

    if (onSelectActiveLegIndex) {
      onSelectActiveLegIndex(nextLegs.length - 1);
    }
  };

  const handleRemoveLeg = (indexToRemove: number) => {
    if (legs.length <= 1) return;
    const nextLegs = legs.filter((_, idx) => idx !== indexToRemove);

    // Re-link adjacent origins if leg was removed in the middle
    if (indexToRemove > 0 && indexToRemove < legs.length - 1) {
      nextLegs[indexToRemove].origin = nextLegs[indexToRemove - 1].destination;
    }

    updateLegs(nextLegs);

    const nextActive = Math.max(0, Math.min(activeLegIndex, nextLegs.length - 1));
    if (onSelectActiveLegIndex) {
      onSelectActiveLegIndex(nextActive);
    }
  };

  const handleUpdateLeg = (
    index: number,
    field: 'origin' | 'destination' | 'date',
    value: string
  ) => {
    const nextLegs = legs.map((leg, idx) => {
      if (idx !== index) return leg;
      return { ...leg, [field]: value };
    });

    // Auto-concatenate: if changing destination of leg i, update origin of leg i+1
    if (field === 'destination' && index < nextLegs.length - 1) {
      nextLegs[index + 1].origin = value;
    }

    // Auto-concatenate: if changing date of leg i, ensure leg i+1 date is not earlier
    if (field === 'date' && index < nextLegs.length - 1) {
      if (nextLegs[index + 1].date < value) {
        nextLegs[index + 1].date = addDaysToDate(value, 2);
      }
    }

    updateLegs(nextLegs);

    // If active leg was updated, sync route
    if (index === activeLegIndex) {
      const active = nextLegs[index];
      onSelectRoute(active.origin, active.destination);
      onSelectDate(active.date);
    }
  };

  const handleSelectActiveLeg = (index: number) => {
    if (onSelectActiveLegIndex) {
      onSelectActiveLegIndex(index);
    }
    const leg = legs[index];
    if (leg) {
      onSelectRoute(leg.origin, leg.destination);
      onSelectDate(leg.date);
    }
  };

  const handleApplyPreset = (preset: MultiCityPreset) => {
    const baseDate = selectedDate || '2026-10-17';
    let currentOrigin = preset.origin;
    const nextLegs: MultiCityLeg[] = [];

    preset.destinations.forEach((dest, i) => {
      const days = preset.daysInterval[i] !== undefined ? preset.daysInterval[i] : i * 3;
      nextLegs.push({
        id: `preset-${preset.id}-${i}`,
        origin: currentOrigin,
        destination: dest,
        date: addDaysToDate(baseDate, days),
      });
      currentOrigin = dest;
    });

    updateLegs(nextLegs);
    if (onSelectActiveLegIndex) {
      onSelectActiveLegIndex(0);
    }
    if (nextLegs[0]) {
      onSelectRoute(nextLegs[0].origin, nextLegs[0].destination);
      onSelectDate(nextLegs[0].date);
    }
  };

  // Multi-city Google flights full route URL
  const multiCityGoogleUrl = getGoogleFlightsMultiCityUrl(legs, passengerConfig.adults);

  return (
    <div className="bg-white rounded-3xl border border-red-100 p-4 sm:p-6 shadow-md space-y-4 relative">
      {/* Top Bar: Trip Type & Passenger Counter Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        {/* Trip Type Pills: Solo Ida, Ida y Vuelta, Multi-tramo */}
        <div className="flex items-center space-x-2">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-black">
            <button
              type="button"
              onClick={() => onSelectTripType('one_way')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                tripType === 'one_way'
                  ? 'bg-red-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solo Ida
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTripType('round_trip');
                if (!returnDate && onSelectReturnDate) {
                  setQuickReturn(7);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                tripType === 'round_trip'
                  ? 'bg-red-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ida y Vuelta
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTripType('multi_city');
                // Ensure initial legs are synced
                if (legs.length > 0 && legs[activeLegIndex]) {
                  const curr = legs[activeLegIndex];
                  onSelectRoute(curr.origin, curr.destination);
                  onSelectDate(curr.date);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                tripType === 'multi_city'
                  ? 'bg-red-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>Multi-tramo</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-lg ${
                tripType === 'multi_city' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
              }`}>
                Hasta 3 destinos
              </span>
            </button>
          </div>
        </div>

        {/* Passenger & Pet Badge Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPassengerDropdownOpen((p) => !p)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-xs font-black text-slate-800 transition-all shadow-xs"
          >
            <Users className="w-3.5 h-3.5 text-red-600" />
            <span>
              {totalPassengers} {totalPassengers === 1 ? 'Pasajero' : 'Pasajeros'}
            </span>
            {passengerConfig.pets > 0 && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-red-100 text-red-700 font-extrabold text-[11px]">
                <Dog className="w-3 h-3" />
                <span>
                  {passengerConfig.pets} {passengerConfig.pets === 1 ? 'Mascota' : 'Mascotas'}
                </span>
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                isPassengerDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Passenger & Pet Popover Drawer */}
          {isPassengerDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-88 bg-white rounded-3xl border border-red-100 shadow-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Pasajeros &amp; Mascotas
                </span>
                <button
                  type="button"
                  onClick={() => setIsPassengerDropdownOpen(false)}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Listo
                </button>
              </div>

              {/* 1. Adultos */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-black text-slate-900">Adultos</p>
                  <p className="text-[10px] text-slate-400">12 años en adelante</p>
                </div>
                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    disabled={passengerConfig.adults <= 1}
                    onClick={() => updatePassenger('adults', -1, 1, 9)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center font-black text-sm text-slate-900">
                    {passengerConfig.adults}
                  </span>
                  <button
                    type="button"
                    disabled={passengerConfig.adults >= 9}
                    onClick={() => updatePassenger('adults', 1, 1, 9)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2. Niños */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-black text-slate-900">Niños</p>
                  <p className="text-[10px] text-slate-400">2 a 11 años (-15% tarifa)</p>
                </div>
                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    disabled={passengerConfig.children <= 0}
                    onClick={() => updatePassenger('children', -1, 0, 8)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center font-black text-sm text-slate-900">
                    {passengerConfig.children}
                  </span>
                  <button
                    type="button"
                    disabled={passengerConfig.children >= 8}
                    onClick={() => updatePassenger('children', 1, 0, 8)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 3. Bebés */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-black text-slate-900">Bebés</p>
                  <p className="text-[10px] text-slate-400">Menores de 2 años (en brazos)</p>
                </div>
                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    disabled={passengerConfig.infants <= 0}
                    onClick={() => updatePassenger('infants', -1, 0, 4)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center font-black text-sm text-slate-900">
                    {passengerConfig.infants}
                  </span>
                  <button
                    type="button"
                    disabled={passengerConfig.infants >= 4}
                    onClick={() => updatePassenger('infants', 1, 0, 4)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4. Mascotas en cabina */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <Dog className="w-3.5 h-3.5 text-red-600" />
                    <p className="font-black text-slate-900">Mascotas en Cabina</p>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Perro o gato en guacal bajo asiento (~$85.000 COP)
                  </p>
                </div>
                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    disabled={passengerConfig.pets <= 0}
                    onClick={() => updatePassenger('pets', -1, 0, 2)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center font-black text-sm text-slate-900">
                    {passengerConfig.pets}
                  </span>
                  <button
                    type="button"
                    disabled={passengerConfig.pets >= 2}
                    onClick={() => updatePassenger('pets', 1, 0, 2)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pet airline policy note */}
              <div className="p-2.5 bg-red-50/60 rounded-xl border border-red-100 text-[10px] text-slate-600 space-y-1">
                <span className="font-black text-red-700 block">
                  Regla de Mascotas (Avianca, LATAM, Wingo):
                </span>
                <span>
                  Peso máximo de mascota + guacal: 10 kg. Debe caber debajo del asiento delantero y contar con carné de vacunación al día.
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsPassengerDropdownOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors shadow-md shadow-red-600/20"
              >
                Aplicar Configuración ({totalPassengers} pax{passengerConfig.pets > 0 ? `, ${passengerConfig.pets} mascota` : ''})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODE 1 & 2: SOLO IDA O IDA Y VUELTA */}
      {tripType !== 'multi_city' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Origin Selector */}
            <div className="md:col-span-4 relative">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>Origen (Colombia):</span>
              </label>
              <div className="relative">
                <select
                  value={origin}
                  onChange={(e) => onSelectRoute(e.target.value, destination)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-red-300 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer transition-all"
                >
                  {COLOMBIAN_AIRPORTS.map((apt) => (
                    <option key={apt.code} value={apt.code}>
                      {apt.city} ({apt.code}) - {apt.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-red-700 font-extrabold bg-red-100/70 px-2 py-0.5 rounded-lg border border-red-200">
                  {origin}
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                className="p-3 rounded-2xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 shadow-sm transition-all duration-300 hover:rotate-180"
                title="Invertir origen y destino"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Destination Selector */}
            <div className="md:col-span-4 relative">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>Destino (Colombia):</span>
              </label>
              <div className="relative">
                <select
                  value={destination}
                  onChange={(e) => onSelectRoute(origin, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-red-300 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer transition-all"
                >
                  {COLOMBIAN_AIRPORTS.map((apt) => (
                    <option key={apt.code} value={apt.code} disabled={apt.code === origin}>
                      {apt.city} ({apt.code}) - {apt.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-800 font-extrabold bg-slate-200/80 px-2 py-0.5 rounded-lg border border-slate-300">
                  {destination}
                </div>
              </div>
            </div>

            {/* Departure Date input */}
            <div className="md:col-span-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-red-600" />
                <span>{tripType === 'round_trip' ? 'Fecha de Ida:' : 'Fecha del Vuelo:'}</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) onSelectDate(e.target.value);
                }}
                className="w-full bg-slate-50 border border-slate-200 hover:border-red-300 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Round Trip Return Date row if tripType === 'round_trip' */}
          {tripType === 'round_trip' && (
            <div className="bg-red-50/50 p-3.5 rounded-2xl border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    Fecha de Regreso:
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Selecciona cuándo deseas retornar a {originInfo.city}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  min={selectedDate}
                  value={returnDate || ''}
                  onChange={(e) => {
                    if (e.target.value && onSelectReturnDate) {
                      onSelectReturnDate(e.target.value);
                    }
                  }}
                  className="bg-white border border-slate-300 hover:border-red-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setQuickReturn(3)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-red-50 text-[11px] font-bold text-slate-700 border border-slate-200"
                >
                  +3 Días
                </button>
                <button
                  type="button"
                  onClick={() => setQuickReturn(7)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-red-50 text-[11px] font-bold text-slate-700 border border-slate-200"
                >
                  +7 Días (1 Semana)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickReturn(14)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-red-50 text-[11px] font-bold text-slate-700 border border-slate-200"
                >
                  +14 Días
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODE 3: MULTI-TRAMO (EJ: BOG-MDE-CTG, HASTA 3 DESTINOS CONCATENADOS) */}
      {tripType === 'multi_city' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Header con resumen visual de ruta concatenada */}
          <div className="bg-gradient-to-r from-red-50 via-rose-50 to-amber-50/50 p-4 rounded-2xl border border-red-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-red-600 text-white rounded-lg">
                  <Route className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-black text-slate-900">
                  Ruta Multi-tramo Concatenada ({legs.length} {legs.length === 1 ? 'Tramo' : 'Tramos'} • Máx. 3 destinos)
                </h4>
              </div>

              {/* Breadcrumb visual de la ruta concatenada */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="font-extrabold text-xs px-2.5 py-1 rounded-xl bg-white text-slate-900 border border-red-200 shadow-xs flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-red-600" />
                  <span>{legs[0]?.origin} ({getAirportByCode(legs[0]?.origin).city})</span>
                </span>
                {legs.map((leg, idx) => (
                  <React.Fragment key={leg.id || idx}>
                    <ArrowRight className="w-3.5 h-3.5 text-red-500 shrink-0 font-black" />
                    <span
                      onClick={() => handleSelectActiveLeg(idx)}
                      className={`cursor-pointer font-extrabold text-xs px-2.5 py-1 rounded-xl transition-all border shadow-xs flex items-center space-x-1 ${
                        activeLegIndex === idx
                          ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-300'
                          : 'bg-white text-slate-800 border-red-200 hover:border-red-400'
                      }`}
                      title={`Ver vuelos de tramo ${idx + 1}`}
                    >
                      <MapPin className={`w-3 h-3 ${activeLegIndex === idx ? 'text-white' : 'text-red-600'}`} />
                      <span>{leg.destination} ({getAirportByCode(leg.destination).city})</span>
                      <span className={`text-[10px] ml-1 px-1 rounded ${activeLegIndex === idx ? 'bg-red-700' : 'bg-slate-100 text-slate-500'}`}>
                        T{idx + 1}
                      </span>
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Acciones de cabecera: Google Flights link multi-tramo y contador */}
            <div className="flex items-center space-x-2 shrink-0">
              <a
                href={multiCityGoogleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-white hover:bg-red-50 text-red-700 text-xs font-black border border-red-200 flex items-center space-x-1.5 shadow-xs transition-colors"
                title="Abrir la ruta concatenada completa en Google Flights"
              >
                <span>Google Flights</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {legs.length < 3 ? (
                <button
                  type="button"
                  onClick={handleAddLeg}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center space-x-1.5 shadow-md shadow-red-600/20 transition-all hover:scale-105"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Destino ({legs.length}/3)</span>
                </button>
              ) : (
                <span className="text-[11px] font-black text-amber-700 bg-amber-100/80 px-2.5 py-1.5 rounded-xl border border-amber-300">
                  Máximo 3 destinos alcanzado
                </span>
              )}
            </div>
          </div>

          {/* Lista editable de tramos concatenados */}
          <div className="space-y-3">
            {legs.map((leg, index) => {
              const originApt = getAirportByCode(leg.origin);
              const destApt = getAirportByCode(leg.destination);
              const isActive = activeLegIndex === index;

              return (
                <div
                  key={leg.id || index}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-red-50/30 border-red-300 ring-2 ring-red-500/20 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        Tramo {index + 1}: {originApt.city} ({leg.origin}) ➔ {destApt.city} ({leg.destination})
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-red-600 text-white animate-pulse">
                          Inspeccionando Vuelos
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleSelectActiveLeg(index)}
                        className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-colors ${
                          isActive
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isActive ? 'Tramo Activo' : 'Ver Vuelos'}
                      </button>

                      {legs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLeg(index)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Eliminar este tramo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    {/* Origen del tramo */}
                    <div className="md:col-span-4 relative">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-red-600" />
                        <span>Origen Tramo {index + 1}:</span>
                      </label>
                      <div className="relative">
                        <select
                          value={leg.origin}
                          onChange={(e) => handleUpdateLeg(index, 'origin', e.target.value)}
                          className="w-full bg-white border border-slate-200 hover:border-red-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer"
                        >
                          {COLOMBIAN_AIRPORTS.map((apt) => (
                            <option key={apt.code} value={apt.code}>
                              {apt.city} ({apt.code}) - {apt.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono font-black text-red-700 bg-red-100/70 px-1.5 py-0.5 rounded">
                          {leg.origin}
                        </div>
                      </div>
                    </div>

                    {/* Flecha conectora */}
                    <div className="md:col-span-1 flex justify-center text-red-500">
                      <ArrowRight className="w-4 h-4 font-black hidden md:block" />
                    </div>

                    {/* Destino del tramo */}
                    <div className="md:col-span-4 relative">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-red-600" />
                        <span>Destino Tramo {index + 1}:</span>
                      </label>
                      <div className="relative">
                        <select
                          value={leg.destination}
                          onChange={(e) => handleUpdateLeg(index, 'destination', e.target.value)}
                          className="w-full bg-white border border-slate-200 hover:border-red-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer"
                        >
                          {COLOMBIAN_AIRPORTS.map((apt) => (
                            <option key={apt.code} value={apt.code} disabled={apt.code === leg.origin}>
                              {apt.city} ({apt.code}) - {apt.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono font-black text-slate-800 bg-slate-200/80 px-1.5 py-0.5 rounded">
                          {leg.destination}
                        </div>
                      </div>
                    </div>

                    {/* Selector de fecha del tramo */}
                    <div className="md:col-span-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-red-600" />
                        <span>Fecha Tramo {index + 1}:</span>
                      </label>
                      <input
                        type="date"
                        value={leg.date}
                        min={index > 0 ? legs[index - 1].date : undefined}
                        onChange={(e) => {
                          if (e.target.value) handleUpdateLeg(index, 'date', e.target.value);
                        }}
                        className="w-full bg-white border border-slate-200 hover:border-red-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botón para añadir destino adicional si < 3 */}
          {legs.length < 3 && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={handleAddLeg}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-red-300 hover:border-red-600 bg-red-50/40 hover:bg-red-50 text-red-700 font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-xs group"
              >
                <Plus className="w-4 h-4 text-red-600 group-hover:scale-125 transition-transform" />
                <span>
                  + Añadir Destino Concatenado {legs.length + 1} (ej: {legs[legs.length - 1].destination} ➔ CTG / BAQ / ADZ)
                </span>
                <span className="text-[10px] bg-red-200/80 text-red-800 px-2 py-0.5 rounded-lg">
                  Hasta 3 destinos
                </span>
              </button>
            </div>
          )}

          {/* Plantillas de Rutas Frecuentes Multi-tramo para Viajeros Frecuentes */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-xs font-black text-slate-700 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Rutas Frecuentes Multi-tramo (1-Click Presets):</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {MULTI_CITY_PRESETS.map((preset) => {
                const isCurrent =
                  legs.length === preset.destinations.length &&
                  legs[0]?.origin === preset.origin &&
                  legs.every((l, idx) => l.destination === preset.destinations[idx]);

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
                        : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200 hover:border-red-300'
                    }`}
                  >
                    <div>
                      <p className={`text-xs font-black ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                        {preset.name}
                      </p>
                      <p className={`text-[11px] font-mono mt-0.5 font-bold ${isCurrent ? 'text-red-100' : 'text-red-600'}`}>
                        {preset.routeStr}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg ${
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {preset.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Preset popular routes & Day-of-week switch */}
      <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Day switch */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-600 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-red-600" />
            <span>Filtro de Días:</span>
          </span>
          <button
            type="button"
            onClick={() => onToggleOnlySaturdays(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-xs ${
              onlySaturdays
                ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Solo Sábados (Foco Principal &lt; 200k)
          </button>
          <button
            type="button"
            onClick={() => onToggleOnlySaturdays(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-xs ${
              !onlySaturdays
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Cualquier Día de la Semana
          </button>
        </div>

        {/* Quick routes bar (for one_way / round_trip) */}
        {tripType !== 'multi_city' && (
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-slate-400 font-semibold shrink-0">Rutas frecuentes:</span>
            {POPULAR_ROUTES.slice(0, 6).map((r) => {
              const isActive = origin === r.origin && destination === r.dest;
              return (
                <button
                  key={`${r.origin}-${r.dest}`}
                  onClick={() => onSelectRoute(r.origin, r.dest)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors border ${
                    isActive
                      ? 'bg-red-50 text-red-700 border-red-300 font-black'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {r.origin} ➔ {r.dest}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
