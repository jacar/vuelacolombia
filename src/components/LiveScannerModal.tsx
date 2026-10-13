import React from 'react';
import { Lottie } from 'lottie-react';
import { X, Radar, Play, Pause, Sparkles, ExternalLink, ShieldCheck, CheckCircle2, Globe, Flame } from 'lucide-react';
import { formatCOP } from '../services/flightDataService';
import { radarScanLottie } from './lottie/flightAnimations';
import { HeroFlightBanner } from './HeroFlightBanner';
import { BrandLogo } from './BrandLogo';

interface LiveScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isScanning: boolean;
  onToggleScanning: () => void;
  onTriggerLiveWebScan: () => void;
  isWebScanning: boolean;
  lastScannedTime: string | null;
  scanLog: string[];
  origin: string;
  destination: string;
  selectedDate: string;
  groundingSources: Array<{ uri: string; title: string }>;
  aiSummary: string;
}

export const LiveScannerModal: React.FC<LiveScannerModalProps> = ({
  isOpen,
  onClose,
  isScanning,
  onToggleScanning,
  onTriggerLiveWebScan,
  isWebScanning,
  lastScannedTime,
  scanLog,
  origin,
  destination,
  selectedDate,
  groundingSources,
  aiSummary,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-red-100 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-3">
            <BrandLogo size="md" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-900">
                  Radar de Vuelos en Vivo
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-600 border border-red-200">
                  {origin} ➔ {destination}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Escaneo continuo en aerolíneas (Avianca, LATAM, Wingo, Clic Air)
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 scrollbar-thin">
          {/* Radar Status Animation - White & Red Style */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-red-50/50 p-5 rounded-3xl border border-red-100">
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <Lottie src={radarScanLottie} loop={isScanning || isWebScanning} autoplay={isScanning || isWebScanning} />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <span
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black ${
                  isScanning
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span>{isScanning ? 'Radar Activo Siempre (15s)' : 'Radar en Pausa'}</span>
              </span>
              <p className="text-xs text-slate-700 font-bold">
                {lastScannedTime ? `Última verificación: ${lastScannedTime}` : 'Listo para iniciar escaneo continuo'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Al detectar una tarifa aérea menor a $200.000 COP, sonará la campana y se notificará en tu pantalla.
              </p>
            </div>
          </div>

          {/* Interactive Lottie Flight Simulator & Progress Slider */}
          <HeroFlightBanner
            origin={origin}
            destination={destination}
            selectedDate={selectedDate}
          />

          {/* AI Web Search Grounding Findings */}
          {aiSummary && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-red-600 font-black text-xs">
                <Globe className="w-4 h-4" />
                <span>Datos Reales en la Web:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                {aiSummary}
              </p>
              {groundingSources.length > 0 && (
                <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2 text-[11px]">
                  <span className="text-slate-400 font-medium">Fuentes oficiales:</span>
                  {groundingSources.slice(0, 3).map((s, idx) => (
                    <a
                      key={idx}
                      href={s.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 font-bold hover:underline flex items-center space-x-0.5"
                    >
                      <span>{s.title}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Real-time Log Feed */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs max-h-44 overflow-y-auto space-y-1.5 scrollbar-thin">
            <p className="text-slate-400 font-bold">// Registro de vuelos en tiempo real:</p>
            {scanLog.length === 0 ? (
              <p className="text-slate-500 italic">No hay registros aún. Presiona "Escanear en la Web" o mantén el radar activo.</p>
            ) : (
              scanLog.map((log, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-1.5 ${
                    log.includes('¡ALERTA') || log.includes('GANGA') || log.includes('TARIFA')
                      ? 'text-red-400 font-bold'
                      : 'text-slate-300'
                  }`}
                >
                  <span>&gt;</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 shrink-0">
          <button
            onClick={onToggleScanning}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md ${
              isScanning
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
            }`}
          >
            {isScanning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar Escaneo Continuo</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Mantener Escaneo Activo Siempre</span>
              </>
            )}
          </button>

          <button
            onClick={onTriggerLiveWebScan}
            disabled={isWebScanning}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 shadow-md shadow-red-600/20"
          >
            <Globe className={`w-4 h-4 ${isWebScanning ? 'animate-spin' : ''}`} />
            <span>{isWebScanning ? 'Consultando Aerolíneas...' : 'Escanear Web con Google Flights'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
