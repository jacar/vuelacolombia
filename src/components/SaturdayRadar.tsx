import React from 'react';
import { Calendar, Sparkles, TrendingDown, CheckCircle2, Flame } from 'lucide-react';
import { DayFareInfo } from '../types';
import { formatCOP, getAirportByCode } from '../services/flightDataService';

interface SaturdayRadarProps {
  days: DayFareInfo[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  priceThreshold: number;
  origin: string;
  destination: string;
  onlySaturdays: boolean;
}

export const SaturdayRadar: React.FC<SaturdayRadarProps> = ({
  days,
  selectedDate,
  onSelectDate,
  priceThreshold,
  origin,
  destination,
  onlySaturdays,
}) => {
  const originInfo = getAirportByCode(origin);
  const destInfo = getAirportByCode(destination);

  const bargainsCount = days.filter((s) => s.lowestPrice <= priceThreshold).length;
  const lowestOverall = days.length > 0 ? Math.min(...days.map((s) => s.lowestPrice)) : 0;

  return (
    <section className="bg-white rounded-3xl border border-red-100 p-4 sm:p-6 shadow-md">
      {/* Header and stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-red-50 text-red-600">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {onlySaturdays ? 'Radar de Vuelos de Sábados:' : 'Calendario de Vuelos por Día:'}{' '}
              <span className="text-red-600">{originInfo.city} ({origin})</span> ➔{' '}
              <span className="text-slate-800">{destInfo.city} ({destination})</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {onlySaturdays
              ? 'Monitoreando tarifas en aerolíneas para cada sábado. Fechas con pasajes menores a $200.000 COP en rojo destacado.'
              : 'Explorando vuelos nacionales en cualquier día de la semana. Solo vuelos comerciales, sin transporte terrestre.'}
          </p>
        </div>

        {/* Counter Pills */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
          <div className="p-2.5 sm:px-3.5 sm:py-2 rounded-2xl bg-red-50 border border-red-200 flex items-center space-x-2">
            <Flame className="w-4 h-4 text-red-600 shrink-0" />
            <div>
              <p className="text-[9px] sm:text-[10px] uppercase font-black text-red-600 tracking-wider">Tarifas &lt; $200k</p>
              <p className="text-xs sm:text-sm font-black text-slate-900">
                {bargainsCount} de {days.length} fechas
              </p>
            </div>
          </div>

          <div className="p-2.5 sm:px-3.5 sm:py-2 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-slate-600 shrink-0" />
            <div>
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Mínimo en Vuelos</p>
              <p className="text-xs sm:text-sm font-black text-red-600">
                {formatCOP(lowestOverall)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Carousel with Mobile Touch Snap */}
      <div className="overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory touch-pan-x-mandatory">
        <div className="flex space-x-2 sm:space-x-3 min-w-max">
          {days.map((d) => {
            const isSelected = d.date === selectedDate;
            const isBargain = d.lowestPrice <= priceThreshold;
            const diff = priceThreshold - d.lowestPrice;

            return (
              <button
                key={d.date}
                onClick={() => onSelectDate(d.date)}
                className={`relative flex flex-col p-2.5 sm:p-3.5 rounded-2xl text-left transition-all border w-32 sm:w-44 snap-start shrink-0 tap-highlight-none ${
                  isSelected
                    ? 'bg-red-50/90 border-red-600 shadow-md ring-2 ring-red-600/30'
                    : isBargain
                    ? 'bg-white hover:bg-red-50/40 border-red-300 hover:border-red-500 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                {/* Badge Top */}
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-xs font-bold text-slate-800">
                    {d.dayLabel}
                  </span>
                  {isBargain ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-600 text-white uppercase tracking-wider shadow-xs">
                      🎯 &lt; $200k
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400">
                      {d.isSaturday ? 'Sábado' : 'Tarifa normal'}
                    </span>
                  )}
                </div>

                {/* Lowest Price */}
                <div className="my-1">
                  <p className="text-[10px] text-slate-400">Desde</p>
                  <p
                    className={`text-base font-black tracking-tight ${
                      isBargain ? 'text-red-600' : 'text-slate-800'
                    }`}
                  >
                    {formatCOP(d.lowestPrice)}
                  </p>
                </div>

                {/* Sub status */}
                <div className="mt-1 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">
                    {d.flightCount} vuelos
                  </span>
                  {isBargain && diff > 0 ? (
                    <span className="text-red-600 font-bold">
                      -{formatCOP(diff).replace(' COP', '')}
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      &gt; $200k
                    </span>
                  )}
                </div>

                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
