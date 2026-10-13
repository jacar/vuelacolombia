import React from 'react';
import {
  Route,
  ArrowRight,
  MapPin,
  Calendar,
  ExternalLink,
  Sparkles,
  Plane,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  Layers
} from 'lucide-react';
import { MultiCityLeg, PassengerConfig } from '../types';
import {
  getAirportByCode,
  formatCOP,
  generateRealRouteFlights,
  getGoogleFlightsMultiCityUrl,
  calculatePassengerBreakdown
} from '../services/flightDataService';

interface MultiCitySummaryCardProps {
  legs: MultiCityLeg[];
  activeLegIndex: number;
  onSelectActiveLegIndex: (index: number) => void;
  passengerConfig: PassengerConfig;
  priceThreshold: number;
}

export const MultiCitySummaryCard: React.FC<MultiCitySummaryCardProps> = ({
  legs,
  activeLegIndex,
  onSelectActiveLegIndex,
  passengerConfig,
  priceThreshold,
}) => {
  if (!legs || legs.length === 0) return null;

  // Compute best flight for each leg
  const legDetails = legs.map((leg, idx) => {
    const deals = generateRealRouteFlights(leg.origin, leg.destination, leg.date);
    const bestFlight = deals.length > 0 ? deals[0] : null;
    const lowestPrice = bestFlight ? bestFlight.priceCOP : 185000;
    const bargainCount = deals.filter((d) => d.priceCOP <= priceThreshold).length;

    return {
      leg,
      index: idx,
      bestFlight,
      lowestPrice,
      bargainCount,
      originAirport: getAirportByCode(leg.origin),
      destAirport: getAirportByCode(leg.destination),
    };
  });

  const totalBasePrice = legDetails.reduce((sum, item) => sum + item.lowestPrice, 0);
  const pricingBreakdown = calculatePassengerBreakdown(
    totalBasePrice,
    passengerConfig,
    'multi_city',
    1 // Base already includes sum of legs
  );

  const googleFlightsUrl = getGoogleFlightsMultiCityUrl(legs, passengerConfig.adults);
  const totalPassengers =
    passengerConfig.adults + passengerConfig.children + passengerConfig.infants;

  return (
    <div className="bg-gradient-to-br from-white via-rose-50/20 to-amber-50/20 rounded-3xl border border-red-200 p-5 sm:p-7 shadow-lg space-y-6 relative overflow-hidden animate-in fade-in">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-red-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-red-600 text-white rounded-xl shadow-xs">
              <Route className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Itinerario Multi-tramo para Viajeros Frecuentes
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-extrabold text-[11px] border border-red-200">
                  {legs.length} Destinos Concatenados
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Ruta concatenada: {legs.map((l) => `${l.origin} (${getAirportByCode(l.origin).city})`).join(' ➔ ')} ➔ {legs[legs.length - 1]?.destination} ({getAirportByCode(legs[legs.length - 1]?.destination).city})
              </p>
            </div>
          </div>
        </div>

        {/* Total Price & Google Flights Direct CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-red-200 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Tarifa Estimada Total:
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl sm:text-2xl font-black text-red-600">
                {formatCOP(pricingBreakdown.grandTotal)}
              </span>
              <span className="text-[11px] text-slate-500 font-bold">
                ({totalPassengers} pax{passengerConfig.pets > 0 ? `, ${passengerConfig.pets} masc.` : ''})
              </span>
            </div>
          </div>

          <a
            href={googleFlightsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center space-x-2 shadow-md shadow-red-600/20 transition-all hover:scale-105"
          >
            <span>Reservar Ruta Completa</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Grid of concatenated legs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {legDetails.map((item) => {
          const isActive = activeLegIndex === item.index;

          return (
            <div
              key={item.leg.id || item.index}
              onClick={() => onSelectActiveLegIndex(item.index)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                isActive
                  ? 'bg-white border-red-600 ring-2 ring-red-400/30 shadow-md'
                  : 'bg-white/80 hover:bg-white border-slate-200 hover:border-red-300'
              }`}
            >
              {/* Top Leg Label */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center ${
                    isActive ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.index + 1}
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    Tramo {item.index + 1}
                  </span>
                </div>

                {item.lowestPrice <= priceThreshold ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-black text-[10px]">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>&lt; $200k COP</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                    Tarifa estándar
                  </span>
                )}
              </div>

              {/* Route details */}
              <div>
                <div className="flex items-center justify-between text-sm font-black text-slate-900">
                  <span>{item.originAirport.city} ({item.leg.origin})</span>
                  <ArrowRight className="w-4 h-4 text-red-500 mx-2 shrink-0" />
                  <span>{item.destAirport.city} ({item.leg.destination})</span>
                </div>

                <div className="flex items-center space-x-1.5 mt-1 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-red-600" />
                  <span>{item.leg.date}</span>
                </div>
              </div>

              {/* Best Flight in this Leg */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">
                    Mejor tarifa desde:
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {formatCOP(item.lowestPrice)}
                  </span>
                  {item.bestFlight && (
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {item.bestFlight.airline} ({item.bestFlight.departureTime})
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectActiveLegIndex(item.index);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700'
                  }`}
                >
                  {isActive ? 'Viendo Vuelos' : 'Ver Ofertas'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful banner explaining active leg focus */}
      <div className="bg-white/80 p-3 rounded-2xl border border-red-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Plane className="w-4 h-4 text-red-600" />
          <span className="text-slate-700 font-bold">
            Mostrando ofertas activas para: <strong className="text-slate-900">Tramo {activeLegIndex + 1} ({legs[activeLegIndex]?.origin} ➔ {legs[activeLegIndex]?.destination})</strong> en fecha {legs[activeLegIndex]?.date}.
          </span>
        </div>
        <span className="text-[11px] text-red-700 font-black">
          Haz clic en cualquier tramo para alternar y comparar aerolíneas
        </span>
      </div>
    </div>
  );
};
