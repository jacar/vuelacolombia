import React, { useState } from 'react';
import { Search, MapPin, X, Check, Plane } from 'lucide-react';
import { COLOMBIAN_AIRPORTS } from '../services/flightDataService';

interface MobileAirportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  selectedCode: string;
  onSelectAirport: (code: string) => void;
  excludeCode?: string;
}

export const MobileAirportModal: React.FC<MobileAirportModalProps> = ({
  isOpen,
  onClose,
  title,
  selectedCode,
  onSelectAirport,
  excludeCode,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  if (!isOpen) return null;

  const filtered = COLOMBIAN_AIRPORTS.filter((apt) => {
    if (excludeCode && apt.code === excludeCode) return false;
    const matchesSearch =
      apt.city.toLowerCase().includes(search.toLowerCase()) ||
      apt.code.toLowerCase().includes(search.toLowerCase()) ||
      apt.name.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedRegion === 'CARIBE') {
      return ['CTG', 'BAQ', 'SMR', 'RCH', 'MTR', 'VUP'].includes(apt.code);
    }
    if (selectedRegion === 'TRONCAL') {
      return ['BOG', 'MDE', 'CLO', 'BAQ', 'CTG', 'BGA'].includes(apt.code);
    }
    if (selectedRegion === 'ISLAS') {
      return ['ADZ', 'PVA'].includes(apt.code);
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden border border-red-100 safe-area-bottom">
        {/* Handle bar on mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-slate-300"></div>
        </div>

        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{title}</h3>
              <p className="text-[11px] text-slate-500 font-semibold">Aeropuertos comerciales de Colombia</p>
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

        {/* Search bar */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ciudad o código (ej. Medellín, BOG, CTG)..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              autoFocus
            />
          </div>

          {/* Region filter pills */}
          <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedRegion('ALL')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors ${
                selectedRegion === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setSelectedRegion('TRONCAL')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors ${
                selectedRegion === 'TRONCAL'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Troncales
            </button>
            <button
              type="button"
              onClick={() => setSelectedRegion('CARIBE')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors ${
                selectedRegion === 'CARIBE'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Costa Caribe
            </button>
            <button
              type="button"
              onClick={() => setSelectedRegion('ISLAS')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors ${
                selectedRegion === 'ISLAS'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              San Andrés
            </button>
          </div>
        </div>

        {/* Airport list */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-semibold">
              No se encontraron aeropuertos con "{search}"
            </div>
          ) : (
            filtered.map((apt) => {
              const isSelected = apt.code === selectedCode;
              return (
                <button
                  key={apt.code}
                  type="button"
                  onClick={() => {
                    onSelectAirport(apt.code);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-colors tap-highlight-none ${
                    isSelected ? 'bg-red-50 text-red-700' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {apt.code}
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-900">{apt.city}</p>
                      <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-[280px]">
                        {apt.name}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-1 rounded-full bg-red-600 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
