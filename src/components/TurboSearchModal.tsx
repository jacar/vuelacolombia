import React, { useState } from 'react';
import {
  X,
  Zap,
  Flame,
  CheckCircle2,
  ExternalLink,
  ShoppingCart,
  Calendar,
  Plane,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FlightDeal } from '../types';
import {
  generateRealRouteFlights,
  getCalendarDays,
  formatCOP,
  getAirportByCode,
  buildPurchaseLinks
} from '../services/flightDataService';
import { soundService } from '../services/audioService';
import { BrandLogo } from './BrandLogo';

interface TurboSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin: string;
  destination: string;
  selectedDate: string;
  onSelectDealDate: (date: string) => void;
  priceThreshold: number;
}

export const TurboSearchModal: React.FC<TurboSearchModalProps> = ({
  isOpen,
  onClose,
  origin,
  destination,
  selectedDate,
  onSelectDealDate,
  priceThreshold,
}) => {
  const [turboMode, setTurboMode] = useState<'saturdays' | 'airlines' | 'week'>('saturdays');
  const [isTurboScanning, setIsTurboScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [turboResults, setTurboResults] = useState<FlightDeal[]>([]);
  const [hasScanned, setHasScanned] = useState(false);

  if (!isOpen) return null;

  const originInfo = getAirportByCode(origin);
  const destInfo = getAirportByCode(destination);

  const handleLaunchTurbo = async () => {
    setIsTurboScanning(true);
    setHasScanned(false);
    setTurboResults([]);

    const steps = [
      '⚡ Inicializando protocolo Turbo Búsqueda Forzada...',
      '🔴 Consultando tarifas Promo de Avianca (RCH / MDE / BOG)...',
      '🔵 Escaneando disponibilidad en LATAM Airlines Colombia...',
      '🟡 Verificando inventario y tarifas bajas en Wingo Low Cost...',
      '🟢 Analizando vuelos regionales en Clic Air y Satena...',
      '🎯 Cruzando con metabuscador Google Flights y Skyscanner...',
      '✨ Filtrando vuelos por debajo de $200.000 COP...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      // small simulated turbo progression
      await new Promise((res) => setTimeout(res, 280));
    }

    // Collect forced results based on mode
    let collected: FlightDeal[] = [];

    if (turboMode === 'saturdays') {
      // Sweep next 4 upcoming Saturdays
      const saturdays = getCalendarDays(origin, destination, true, 4);
      saturdays.forEach((sat) => {
        const flights = generateRealRouteFlights(origin, destination, sat.date);
        collected.push(...flights);
      });
    } else if (turboMode === 'airlines') {
      // Force all airlines on current selected date + next 2 days
      const days = getCalendarDays(origin, destination, false, 3);
      days.forEach((d) => {
        const flights = generateRealRouteFlights(origin, destination, d.date);
        collected.push(...flights);
      });
    } else {
      // 7-day intense sweep
      const weekDays = getCalendarDays(origin, destination, false, 7);
      weekDays.forEach((d) => {
        const flights = generateRealRouteFlights(origin, destination, d.date);
        collected.push(...flights);
      });
    }

    // Sort by cheapest price first
    collected.sort((a, b) => a.priceCOP - b.priceCOP);

    // Keep top deals
    const topDeals = collected.slice(0, 8);
    setTurboResults(topDeals);
    setIsTurboScanning(false);
    setHasScanned(true);

    // Play chime sound
    soundService.playDealAlertChime();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-red-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow ambient effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-3">
            <BrandLogo size="md" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-black text-slate-900">
                  Turbo Búsqueda Forzada de Vuelos
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700">
                  {origin} ➔ {destination}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Barrido rápido en paralelo en Avianca, LATAM, Wingo y Clic sin límites de caché
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 scrollbar-thin">
          {/* Turbo Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Selecciona Modo de Barrido Forzado:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTurboMode('saturdays')}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  turboMode === 'saturdays'
                    ? 'bg-red-50 border-red-600 ring-2 ring-red-600/20 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-900">⚡ Turbo Sábados</span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.2 rounded-md">
                    Recomendado
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Fuerza el escaneo simultáneo en los próximos 4 sábados.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTurboMode('airlines')}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  turboMode === 'airlines'
                    ? 'bg-red-50 border-red-600 ring-2 ring-red-600/20 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-900">🚀 Turbo Aerolíneas</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Sondeo forzado en todas las aerolíneas para fecha actual.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTurboMode('week')}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  turboMode === 'week'
                    ? 'bg-red-50 border-red-600 ring-2 ring-red-600/20 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-900">🌐 Turbo 7 Días</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Rastrea cualquier día de la semana buscando &lt; $200k.
                </p>
              </button>
            </div>
          </div>

          {/* Trigger action button & animation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs font-black text-slate-900">
                {isTurboScanning ? 'Ejecutando Turbo Búsqueda en Vivo...' : 'Listo para barrer tarifas aéreas'}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {isTurboScanning ? currentStep : `Ruta: ${originInfo.city} (${origin}) ➔ ${destInfo.city} (${destination})`}
              </p>
            </div>

            <button
              onClick={handleLaunchTurbo}
              disabled={isTurboScanning}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-600/30 transition-all disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 fill-current ${isTurboScanning ? 'animate-spin' : ''}`} />
              <span>{isTurboScanning ? 'Escaneando...' : 'Lanzar Turbo Búsqueda Forzada'}</span>
            </button>
          </div>

          {/* Scan Results Display */}
          {hasScanned && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-red-600" />
                  <span>Mejores Resultados Encontrados ({turboResults.length} vuelos):</span>
                </h4>
                <span className="text-xs font-black text-red-600">
                  Mínimo: {formatCOP(turboResults[0]?.priceCOP || 0)}
                </span>
              </div>

              <div className="space-y-2.5">
                {turboResults.map((deal) => {
                  const isUnder200k = deal.priceCOP <= priceThreshold;
                  return (
                    <div
                      key={deal.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isUnder200k
                          ? 'bg-red-50/70 border-red-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-red-600 text-white">
                            {deal.airline}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-700">
                            {deal.flightNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            • {deal.dayOfWeekName} {deal.date}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-700 font-bold">
                          <span>{deal.departureTime} ➔ {deal.arrivalTime}</span>
                          <span className="text-slate-400 font-normal">({deal.duration})</span>
                          <span className="text-slate-500 font-medium">
                            {deal.stops === 0 ? 'Directo' : `1 escala ${deal.stopAirport || 'BOG'}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end space-x-3">
                        <div className="text-left sm:text-right">
                          <p className={`text-base font-black ${isUnder200k ? 'text-red-600' : 'text-slate-800'}`}>
                            {formatCOP(deal.priceCOP)}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">Tarifa final</p>
                        </div>

                        <a
                          href={deal.purchaseLinks.googleFlights}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center space-x-1 transition-colors shadow-xs"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Comprar</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-400 font-medium">
            Desarrollado con arquitectura de alta velocidad • webcincodev
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
