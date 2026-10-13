import React, { useState } from 'react';
import {
  Plane,
  Clock,
  Briefcase,
  ExternalLink,
  Share2,
  BellRing,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
  Copy,
  ShoppingCart,
  Flame,
  Users,
  Dog,
  Activity,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { FlightDeal, PassengerConfig, TripType } from '../types';
import {
  formatCOP,
  getWhatsappShareUrl,
  calculatePassengerBreakdown
} from '../services/flightDataService';

interface FlightCardProps {
  deal: FlightDeal;
  onTestAlert: (deal: FlightDeal) => void;
  priceThreshold: number;
  passengerConfig?: PassengerConfig;
  tripType?: TripType;
  isSelectedForTrend?: boolean;
  onSelectForTrend?: (deal: FlightDeal) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  deal,
  onTestAlert,
  priceThreshold,
  passengerConfig = { adults: 1, children: 0, infants: 0, pets: 0 },
  tripType = 'one_way',
  isSelectedForTrend = false,
  onSelectForTrend,
}) => {
  const [copied, setCopied] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const isBargain = deal.priceCOP <= priceThreshold;
  const savingsVsThreshold = priceThreshold - deal.priceCOP;

  // Passenger price calculation
  const pricing = calculatePassengerBreakdown(deal.priceCOP, passengerConfig, tripType);
  const hasExtraPassengersOrPets =
    passengerConfig.adults > 1 ||
    passengerConfig.children > 0 ||
    passengerConfig.infants > 0 ||
    passengerConfig.pets > 0 ||
    tripType === 'round_trip';

  const getAirlineColor = (airline: string) => {
    switch (airline) {
      case 'Avianca':
        return {
          badge: 'bg-red-600 text-white font-black',
          dot: 'bg-red-600',
          border: 'border-red-200',
        };
      case 'LATAM':
        return {
          badge: 'bg-indigo-900 text-white font-bold',
          dot: 'bg-indigo-900',
          border: 'border-indigo-100',
        };
      case 'Wingo':
        return {
          badge: 'bg-cyan-500 text-slate-950 font-black',
          dot: 'bg-cyan-500',
          border: 'border-cyan-100',
        };
      case 'Clic Air':
        return {
          badge: 'bg-emerald-600 text-white font-bold',
          dot: 'bg-emerald-600',
          border: 'border-emerald-100',
        };
      default:
        return {
          badge: 'bg-slate-800 text-white font-bold',
          dot: 'bg-slate-700',
          border: 'border-slate-200',
        };
    }
  };

  const colors = getAirlineColor(deal.airline);

  const handleShareWhatsapp = () => {
    const url = getWhatsappShareUrl(deal);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deal.purchaseLinks.googleFlights);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative rounded-3xl border transition-all duration-300 overflow-hidden ${
        isSelectedForTrend
          ? 'bg-white border-red-600 ring-2 ring-red-600/30 shadow-xl'
          : isBargain
          ? 'bg-white border-red-300 hover:border-red-600 shadow-md hover:shadow-xl ring-1 ring-red-100'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Top Banner if Bargain - Avianca Red Style */}
      {isBargain && (
        <div className="bg-red-600 px-4 py-1.5 text-white font-black text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-1.5">
            <Flame className="w-4 h-4 fill-current text-white animate-pulse" />
            <span className="uppercase tracking-wide font-black">
              TARIFA ROJA CONFIRMADA &lt; $200.000 COP • {deal.dayOfWeekName.toUpperCase()}
            </span>
          </div>
          {savingsVsThreshold > 0 && (
            <span className="bg-white text-red-600 px-2 py-0.5 rounded-full text-[11px] font-black shadow-xs">
              Ahorras {formatCOP(savingsVsThreshold)} vs tope
            </span>
          )}
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Airline, Route & Schedule */}
          <div className="space-y-3.5 flex-1">
            {/* Airline Header */}
            <div className="flex items-center justify-between sm:justify-start sm:space-x-3">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-xl text-xs shadow-xs ${colors.badge}`}>
                  {deal.airline}
                </span>
                <span className="text-xs font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                  {deal.flightNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-red-50 text-red-700 border border-red-200">
                  {deal.dayOfWeekName} {deal.date}
                </span>
                {tripType === 'round_trip' && (
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-slate-900 text-white">
                    Ida y Vuelta
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                {deal.fareClass}
              </span>
            </div>

            {/* Flight Timeline */}
            <div className="flex items-center space-x-3 sm:space-x-8">
              {/* Departure */}
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {deal.departureTime}
                </p>
                <p className="text-xs font-black text-red-600">
                  {deal.originCity} ({deal.originCode})
                </p>
                <p className="text-[10px] text-slate-400 font-semibold">Salida Vuelo</p>
              </div>

              {/* Path & Duration */}
              <div className="flex-1 max-w-[220px] flex flex-col items-center">
                <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1 mb-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{deal.duration}</span>
                </span>
                <div className="w-full flex items-center relative">
                  <div className={`h-2.5 w-2.5 rounded-full ${colors.dot}`}></div>
                  <div className="h-[2px] w-full bg-slate-200 relative">
                    {deal.stops > 0 && (
                      <div
                        className="absolute left-1/2 -top-1 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white"
                        title={deal.stopAirport}
                      ></div>
                    )}
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-red-600"></div>
                </div>
                <div className="text-[10px] mt-1 font-bold text-center">
                  {deal.stops === 0 ? (
                    <span className="text-emerald-700 font-black">Directo sin escalas</span>
                  ) : (
                    <span className="text-amber-800 font-bold">
                      1 escala: {deal.stopAirport} {deal.stopDuration ? `(${deal.stopDuration})` : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Arrival */}
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {deal.arrivalTime}
                </p>
                <p className="text-xs font-black text-slate-800">
                  {deal.destinationCity} ({deal.destinationCode})
                </p>
                <p className="text-[10px] text-slate-400 font-semibold">Llegada</p>
              </div>
            </div>

            {/* Baggage policy & remaining seats */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600 font-medium">
              <span className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 text-slate-700 font-semibold">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <span>{deal.baggageIncluded}</span>
              </span>

              {deal.seatsRemaining && deal.seatsRemaining <= 4 && (
                <span className="flex items-center space-x-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-xl text-[11px] font-black">
                  <AlertCircle className="w-3 h-3 text-red-600" />
                  <span>¡Solo {deal.seatsRemaining} cupos disponibles!</span>
                </span>
              )}

              {/* Historical Trend quick focus button */}
              {onSelectForTrend && (
                <button
                  type="button"
                  onClick={() => onSelectForTrend(deal)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-black transition-colors ${
                    isSelectedForTrend
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  <span>{isSelectedForTrend ? 'Viendo en Gráfico' : 'Ver en Gráfico 30D'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Pricing & Direct Buy Actions */}
          <div className="flex flex-col items-start lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 shrink-0 space-y-3 w-full lg:w-76">
            {/* Price display */}
            <div className="text-left lg:text-right w-full">
              {deal.originalPriceCOP && (
                <p className="text-xs text-slate-400 line-through font-semibold">
                  {formatCOP(deal.originalPriceCOP)}
                </p>
              )}
              <div className="flex items-baseline space-x-1 justify-start lg:justify-end">
                <p
                  className={`text-2xl sm:text-3xl font-black tracking-tight ${
                    isBargain ? 'text-red-600' : 'text-slate-900'
                  }`}
                >
                  {formatCOP(deal.priceCOP)}
                </p>
                <span className="text-[10px] text-slate-500 font-bold">/ adulto</span>
              </div>

              {/* Passenger Grand Total Summary if multiple pax or pets */}
              {hasExtraPassengersOrPets && (
                <div className="mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-left">
                  <div className="flex items-center justify-between text-xs font-black text-slate-900">
                    <span>Total Grupo:</span>
                    <span className="text-red-600 text-sm font-black">
                      {formatCOP(pricing.grandTotal)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBreakdown((prev) => !prev)}
                    className="text-[10px] text-slate-500 hover:text-red-600 flex items-center space-x-0.5 mt-0.5 font-bold"
                  >
                    <span>Desglose {pricing.adultsCount} ad.{pricing.childrenCount > 0 ? `, ${pricing.childrenCount} niñ.` : ''}{pricing.petsCount > 0 ? `, ${pricing.petsCount} masc.` : ''}</span>
                    {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {/* Detailed breakdown expandable */}
                  {showBreakdown && (
                    <div className="mt-2 pt-2 border-t border-slate-200 space-y-1 text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span>{pricing.adultsCount} Adultos ({tripType === 'round_trip' ? 'ida y vuelta' : 'solo ida'}):</span>
                        <span className="font-bold">{formatCOP(pricing.adultsSubtotal)}</span>
                      </div>
                      {pricing.childrenCount > 0 && (
                        <div className="flex justify-between">
                          <span>{pricing.childrenCount} Niños (-15%):</span>
                          <span className="font-bold">{formatCOP(pricing.childrenSubtotal)}</span>
                        </div>
                      )}
                      {pricing.infantsCount > 0 && (
                        <div className="flex justify-between">
                          <span>{pricing.infantsCount} Bebés (en brazos):</span>
                          <span className="font-bold">{formatCOP(pricing.infantsSubtotal)}</span>
                        </div>
                      )}
                      {pricing.petsCount > 0 && (
                        <div className="flex justify-between text-red-700 font-bold">
                          <span>{pricing.petsCount} Mascota(s) en cabina:</span>
                          <span>{formatCOP(pricing.petsSubtotal)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Tarifa final con tasas e impuestos aeronáuticos
              </p>
            </div>

            {/* Direct Purchase Action Buttons */}
            <div className="w-full space-y-2">
              {/* Button 1: Google Flights Direct Buy (Red Button) */}
              <a
                href={deal.purchaseLinks.googleFlights}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md ${
                  isBargain
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25 ring-2 ring-red-600/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Comprar en Google Flights</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Button 2: Skyscanner Direct Buy */}
              <a
                href={deal.purchaseLinks.skyscanner}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-2xl font-bold text-xs bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors"
              >
                <span>Comprar en Skyscanner</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>

              {/* Button 3: Airline Direct Portal */}
              <a
                href={deal.purchaseLinks.airlineDirect}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-2xl text-[11px] font-bold bg-white hover:bg-slate-50 text-slate-700 hover:text-red-600 border border-slate-200 transition-colors"
              >
                <span>Portal oficial de {deal.airline}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Auxiliary actions: Whatsapp, copy link, alert chime test */}
            <div className="flex items-center space-x-1.5 justify-start lg:justify-end w-full pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={handleShareWhatsapp}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                title="Compartir link directo en WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
                title="Copiar link directo al portapapeles"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-red-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>

              <button
                type="button"
                onClick={() => onTestAlert(deal)}
                className="p-1.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 transition-colors"
                title="Probar sonido y notificación para este vuelo"
              >
                <BellRing className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
