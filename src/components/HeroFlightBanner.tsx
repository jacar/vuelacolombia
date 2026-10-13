import React, { useState, useEffect } from 'react';
import { Lottie } from 'lottie-react';
import { Plane, Compass, Cloud, Gauge, ArrowRight, Play, Pause, RotateCcw, MapPin, Sparkles } from 'lucide-react';
import { airplaneFlightLottie } from './lottie/flightAnimations';
import { getAirportByCode } from '../services/flightDataService';

interface HeroFlightBannerProps {
  origin: string;
  destination: string;
  selectedDate: string;
}

export const HeroFlightBanner: React.FC<HeroFlightBannerProps> = ({
  origin,
  destination,
  selectedDate,
}) => {
  const [progress, setProgress] = useState<number>(38); // 0 to 100
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const originInfo = getAirportByCode(origin);
  const destInfo = getAirportByCode(destination);

  // Auto-play flight path animation loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 90);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Derived telemetry
  const altitude = progress < 15
    ? Math.round(progress * 1500)
    : progress > 85
    ? Math.round((100 - progress) * 1500)
    : 32000;

  const speed = progress < 10 ? 320 : progress > 90 ? 280 : 815;

  return (
    <div className="bg-white rounded-3xl border border-red-100 p-5 sm:p-7 shadow-lg relative overflow-hidden space-y-5">
      {/* Background clouds & subtle red aura */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-50 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-red-50/60 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
            <Plane className="w-5 h-5 transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-red-600">
                Simulador de Vuelo en Vivo
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                {selectedDate}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Ruta Aérea {originInfo.city} ({origin}) ➔ {destInfo.city} ({destination})
            </h3>
          </div>
        </div>

        {/* Live Flight Telemetry Badges */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-1.5">
            <Gauge className="w-3.5 h-3.5 text-red-600" />
            <span className="text-slate-500 font-medium">Altitud:</span>
            <span className="font-black text-slate-900">{altitude.toLocaleString()} ft</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-1.5">
            <Compass className="w-3.5 h-3.5 text-red-600" />
            <span className="text-slate-500 font-medium">Velocidad:</span>
            <span className="font-black text-slate-900">{speed} km/h</span>
          </div>
        </div>
      </div>

      {/* Animated Flight Arc Stage */}
      <div className="relative bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 p-6 sm:p-8 min-h-[170px] flex flex-col justify-between overflow-hidden">
        {/* Lottie Cloud and Plane decorative backdrop */}
        <div className="absolute top-2 right-2 w-44 sm:w-56 opacity-80 pointer-events-none">
          <Lottie src={airplaneFlightLottie} loop autoplay />
        </div>

        {/* Flight Waypoint Arc */}
        <div className="relative z-10 w-full py-4">
          <div className="relative flex items-center justify-between">
            {/* Origin Pin */}
            <div className="flex flex-col items-center z-10">
              <div className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-red-600/30">
                {origin}
              </div>
              <p className="text-[11px] font-black text-slate-900 mt-1">{originInfo.city}</p>
              <p className="text-[10px] text-slate-400">Despegue</p>
            </div>

            {/* Connecting flight progress track */}
            <div className="flex-1 mx-4 sm:mx-8 relative h-10 flex items-center">
              {/* Background dashed line */}
              <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-150 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Floating Airplane Icon along progress */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-150 ease-out z-20"
                style={{ left: `${progress}%` }}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transform -rotate-12">
                    <Plane className="w-4 h-4" />
                  </div>
                  {/* Pulsing beacon */}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                </div>
              </div>
            </div>

            {/* Destination Pin */}
            <div className="flex flex-col items-center z-10">
              <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-md">
                {destination}
              </div>
              <p className="text-[11px] font-black text-slate-900 mt-1">{destInfo.city}</p>
              <p className="text-[10px] text-slate-400">Aterrizaje</p>
            </div>
          </div>
        </div>

        {/* Flight stage status text */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 z-10">
          <span className="font-bold text-slate-700">
            {progress < 15
              ? '🛫 Fase: Despegue e inicio de ascenso'
              : progress > 85
              ? '🛬 Fase: Descenso y aproximación final'
              : '✈️ Fase: Altitud de crucero sobre Colombia'}
          </span>
          <span className="font-mono font-bold text-red-600">
            {progress}% de la ruta completada
          </span>
        </div>
      </div>

      {/* Interactive Flight Scrub Slider & Animation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex-1 flex items-center space-x-3">
          <span className="text-[11px] font-black text-slate-600 shrink-0">
            Deslizador de Vuelo:
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => {
              setProgress(Number(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <span className="text-xs font-mono font-black text-red-600 w-10 text-right">
            {progress}%
          </span>
        </div>

        {/* Play / Pause / Reset button */}
        <div className="flex items-center space-x-2 justify-end">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 border ${
              isPlaying
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar Animación</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Reanudar Vuelo</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setProgress(0);
              setIsPlaying(true);
            }}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Reiniciar Despegue"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
