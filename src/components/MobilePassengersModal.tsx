import React from 'react';
import { X, Users, Dog, Plus, Minus, Check } from 'lucide-react';
import { PassengerConfig } from '../types';

interface MobilePassengersModalProps {
  isOpen: boolean;
  onClose: () => void;
  passengerConfig: PassengerConfig;
  onSelectPassengers: (cfg: PassengerConfig) => void;
}

export const MobilePassengersModal: React.FC<MobilePassengersModalProps> = ({
  isOpen,
  onClose,
  passengerConfig,
  onSelectPassengers,
}) => {
  if (!isOpen) return null;

  const update = (key: keyof PassengerConfig, delta: number, min: number, max: number) => {
    const nextVal = Math.max(min, Math.min(max, passengerConfig[key] + delta));
    onSelectPassengers({
      ...passengerConfig,
      [key]: nextVal,
    });
  };

  const total = passengerConfig.adults + passengerConfig.children + passengerConfig.infants;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-red-100 safe-area-bottom">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-slate-300"></div>
        </div>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Pasajeros y Mascotas</h3>
              <p className="text-[11px] text-slate-500 font-medium">Configuración de billetes</p>
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

        {/* Counters */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          {/* Adultos */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-black text-sm text-slate-900">Adultos</p>
              <p className="text-[11px] text-slate-500 font-medium">12 años en adelante</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={passengerConfig.adults <= 1}
                onClick={() => update('adults', -1, 1, 9)}
                className="w-9 h-9 rounded-full bg-white border border-slate-300 disabled:opacity-30 text-slate-800 flex items-center justify-center font-bold active:scale-95 transition-transform"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-black text-base text-slate-900">
                {passengerConfig.adults}
              </span>
              <button
                type="button"
                disabled={passengerConfig.adults >= 9}
                onClick={() => update('adults', 1, 1, 9)}
                className="w-9 h-9 rounded-full bg-red-600 text-white disabled:opacity-30 flex items-center justify-center font-bold active:scale-95 transition-transform shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Niños */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-black text-sm text-slate-900">Niños</p>
              <p className="text-[11px] text-slate-500 font-medium">2 a 11 años (-15% tarifa)</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={passengerConfig.children <= 0}
                onClick={() => update('children', -1, 0, 8)}
                className="w-9 h-9 rounded-full bg-white border border-slate-300 disabled:opacity-30 text-slate-800 flex items-center justify-center font-bold active:scale-95 transition-transform"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-black text-base text-slate-900">
                {passengerConfig.children}
              </span>
              <button
                type="button"
                disabled={passengerConfig.children >= 8}
                onClick={() => update('children', 1, 0, 8)}
                className="w-9 h-9 rounded-full bg-red-600 text-white disabled:opacity-30 flex items-center justify-center font-bold active:scale-95 transition-transform shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bebés */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-black text-sm text-slate-900">Bebés</p>
              <p className="text-[11px] text-slate-500 font-medium">Menores de 2 años (en brazos)</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={passengerConfig.infants <= 0}
                onClick={() => update('infants', -1, 0, 4)}
                className="w-9 h-9 rounded-full bg-white border border-slate-300 disabled:opacity-30 text-slate-800 flex items-center justify-center font-bold active:scale-95 transition-transform"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-black text-base text-slate-900">
                {passengerConfig.infants}
              </span>
              <button
                type="button"
                disabled={passengerConfig.infants >= 4}
                onClick={() => update('infants', 1, 0, 4)}
                className="w-9 h-9 rounded-full bg-red-600 text-white disabled:opacity-30 flex items-center justify-center font-bold active:scale-95 transition-transform shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mascotas */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-red-50/50 border border-red-200">
            <div>
              <div className="flex items-center space-x-1.5">
                <Dog className="w-4 h-4 text-red-600" />
                <p className="font-black text-sm text-slate-900">Mascotas en Cabina</p>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Perro o gato en guacal bajo asiento</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={passengerConfig.pets <= 0}
                onClick={() => update('pets', -1, 0, 2)}
                className="w-9 h-9 rounded-full bg-white border border-slate-300 disabled:opacity-30 text-slate-800 flex items-center justify-center font-bold active:scale-95 transition-transform"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-black text-base text-slate-900">
                {passengerConfig.pets}
              </span>
              <button
                type="button"
                disabled={passengerConfig.pets >= 2}
                onClick={() => update('pets', 1, 0, 2)}
                className="w-9 h-9 rounded-full bg-red-600 text-white disabled:opacity-30 flex items-center justify-center font-bold active:scale-95 transition-transform shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm transition-all shadow-lg shadow-red-600/25"
          >
            Confirmar ({total} Pasajero{total > 1 ? 's' : ''}{passengerConfig.pets > 0 ? ` + ${passengerConfig.pets} Mascota` : ''})
          </button>
        </div>
      </div>
    </div>
  );
};
