import React, { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown, Tag, DollarSign, Filter, Flame } from 'lucide-react';
import { formatCOP } from '../services/flightDataService';
import { MobileFilterModal } from './MobileFilterModal';

interface FiltersBarProps {
  maxPrice: number;
  onMaxPriceChange: (val: number) => void;
  onlyBargains: boolean;
  onToggleOnlyBargains: () => void;
  selectedAirline: string;
  onSelectAirline: (airline: string) => void;
  sortBy: 'price' | 'duration' | 'departure';
  onSortByChange: (sort: 'price' | 'duration' | 'departure') => void;
  airlinesList: string[];
  totalResults: number;
  filteredResults: number;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  maxPrice,
  onMaxPriceChange,
  onlyBargains,
  onToggleOnlyBargains,
  selectedAirline,
  onSelectAirline,
  sortBy,
  onSortByChange,
  airlinesList,
  totalResults,
  filteredResults,
}) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  return (
    <>
      {/* MOBILE APP FILTER PILLS (Only on mobile) */}
      <div className="md:hidden space-y-2">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x-mandatory">
          {/* Main Filter Modal Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMobileModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-white text-slate-800 border border-slate-200 shadow-xs font-black text-xs shrink-0 active:scale-95 transition-transform tap-highlight-none"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-600" />
            <span>Filtros ({filteredResults})</span>
            {maxPrice < 350000 && (
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
            )}
          </button>

          {/* Quick Ganga < 200k Toggle */}
          <button
            type="button"
            onClick={onToggleOnlyBargains}
            className={`flex items-center space-x-1 px-3 py-2 rounded-2xl font-black text-xs shrink-0 transition-all active:scale-95 tap-highlight-none border ${
              onlyBargains
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${onlyBargains ? 'fill-current' : 'text-red-500'}`} />
            <span>&lt; $200k</span>
          </button>

          {/* Quick Airline Pills */}
          <button
            type="button"
            onClick={() => onSelectAirline('ALL')}
            className={`px-3 py-2 rounded-2xl text-xs font-black shrink-0 transition-colors border ${
              selectedAirline === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            Todas
          </button>
          {airlinesList.map((airline) => (
            <button
              key={airline}
              type="button"
              onClick={() => onSelectAirline(airline)}
              className={`px-3 py-2 rounded-2xl text-xs font-black shrink-0 transition-colors border ${
                selectedAirline === airline
                  ? 'bg-red-600 text-white border-red-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {airline}
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP FILTERS BAR (md and up) */}
      <div className="hidden md:block bg-white rounded-3xl border border-red-100 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Price Slider & Ganga Toggle */}
          <div className="flex-1 max-w-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                <DollarSign className="w-4 h-4 text-red-600" />
                <span>Tope Máximo de Tarifa:</span>
                <span className="text-red-600 font-black text-base">
                  {formatCOP(maxPrice)}
                </span>
              </label>
              <button
                onClick={() => onMaxPriceChange(200000)}
                className="text-xs text-red-600 hover:text-red-700 font-bold underline underline-offset-2"
              >
                Reset a $200.000 COP
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-[11px] text-slate-400 font-mono font-bold">$100k</span>
              <input
                type="range"
                min="140000"
                max="350000"
                step="5000"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <span className="text-[11px] text-slate-400 font-mono font-bold">$350k</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onToggleOnlyBargains}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    onlyBargains
                      ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>🎯 Solo Vuelos &lt; $200.000 COP</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Viendo <span className="font-bold text-slate-900">{filteredResults}</span> de {totalResults} vuelos
              </p>
            </div>
          </div>

          {/* Sort selector */}
          <div className="flex items-center space-x-3 lg:border-l lg:border-slate-100 lg:pl-6">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-black uppercase tracking-wider mb-1">
                Ordenar por
              </span>
              <select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-2xl px-3 py-2 font-bold focus:ring-2 focus:ring-red-600 outline-none cursor-pointer"
              >
                <option value="price">💰 Precio más bajo primero</option>
                <option value="departure">🕒 Hora de salida más temprana</option>
                <option value="duration">⚡ Menor tiempo de vuelo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Airline filter pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-500 font-bold shrink-0 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-red-600" />
            <span>Aerolíneas:</span>
          </span>
          <button
            onClick={() => onSelectAirline('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
              selectedAirline === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Todas ({totalResults})
          </button>
          {airlinesList.map((airline) => (
            <button
              key={airline}
              onClick={() => onSelectAirline(airline)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                selectedAirline === airline
                  ? 'bg-red-600 text-white border-red-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {airline}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Filter Sheet Modal */}
      <MobileFilterModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        maxPrice={maxPrice}
        onMaxPriceChange={onMaxPriceChange}
        onlyBargains={onlyBargains}
        onToggleOnlyBargains={onToggleOnlyBargains}
        selectedAirline={selectedAirline}
        onSelectAirline={onSelectAirline}
        sortBy={sortBy}
        onSortByChange={onSortByChange}
        airlinesList={airlinesList}
        totalResults={totalResults}
        filteredResults={filteredResults}
      />
    </>
  );
};
