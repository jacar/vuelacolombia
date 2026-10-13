import React from 'react';
import { X, SlidersHorizontal, DollarSign, Flame, ArrowUpDown, Filter, Check } from 'lucide-react';
import { formatCOP } from '../services/flightDataService';

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  isOpen,
  onClose,
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-red-100 safe-area-bottom">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-slate-300"></div>
        </div>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Filtros y Ordenar</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {filteredResults} vuelos encontrados de {totalResults}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* 1. Ganga button */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Tarifas Especiales
            </span>
            <button
              type="button"
              onClick={onToggleOnlyBargains}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                onlyBargains
                  ? 'bg-red-50 border-red-600 text-red-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Flame className={`w-5 h-5 ${onlyBargains ? 'text-red-600 fill-current' : 'text-slate-400'}`} />
                <div className="text-left">
                  <p className="text-xs font-black">Solo Tarifas Rojas (&lt; $200.000 COP)</p>
                  <p className="text-[10px] text-slate-500">Pasajes súper económicos confirmados</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  onlyBargains ? 'bg-red-600 border-red-600 text-white' : 'border-slate-300'
                }`}
              >
                {onlyBargains && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          </div>

          {/* 2. Price slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Tope Máximo de Precio
              </span>
              <span className="text-sm font-black text-red-600">{formatCOP(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="140000"
              max="350000"
              step="5000"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono font-bold">
              <span>$140.000 COP</span>
              <button
                type="button"
                onClick={() => onMaxPriceChange(200000)}
                className="text-red-600 underline font-bold"
              >
                Tope $200.000
              </button>
              <span>$350.000 COP</span>
            </div>
          </div>

          {/* 3. Airline filter */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Aerolíneas
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSelectAirline('ALL')}
                className={`p-3 rounded-2xl text-xs font-black border transition-all text-left flex items-center justify-between ${
                  selectedAirline === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span>Todas las aerolíneas</span>
                {selectedAirline === 'ALL' && <Check className="w-3.5 h-3.5" />}
              </button>
              {airlinesList.map((airline) => (
                <button
                  key={airline}
                  type="button"
                  onClick={() => onSelectAirline(airline)}
                  className={`p-3 rounded-2xl text-xs font-black border transition-all text-left flex items-center justify-between ${
                    selectedAirline === airline
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{airline}</span>
                  {selectedAirline === airline && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Sort By */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Ordenar Resultados
            </span>
            <div className="space-y-1.5">
              {[
                { id: 'price', label: '💰 Precio más bajo primero' },
                { id: 'departure', label: '🕒 Hora de salida más temprana' },
                { id: 'duration', label: '⚡ Menor duración de vuelo' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSortByChange(item.id as any)}
                  className={`w-full p-3 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    sortBy === item.id
                      ? 'bg-red-50 border-red-600 text-red-700'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{item.label}</span>
                  {sortBy === item.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm transition-all shadow-lg shadow-red-600/25 flex items-center justify-center space-x-2"
          >
            <span>Ver {filteredResults} Vuelos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
