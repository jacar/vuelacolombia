import React from 'react';
import { Plane, Bell, Volume2, VolumeX, Radar, Settings, Zap, MapPin } from 'lucide-react';
import { AlertNotificationItem } from '../types';
import { getAirportByCode } from '../services/flightDataService';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onOpenScanner: () => void;
  onOpenTurbo: () => void;
  isScanning: boolean;
  notifications: AlertNotificationItem[];
  origin: string;
  destination: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenNotifications,
  onOpenScanner,
  onOpenTurbo,
  isScanning,
  notifications,
  origin,
  destination,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const originInfo = getAirportByCode(origin);
  const destInfo = getAirportByCode(destination);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-red-100 shadow-sm text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Route */}
        <div className="flex items-center space-x-3">
          <BrandLogo size="md" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-xl tracking-tight text-slate-900">
                Vuela<span className="text-red-600">Colombia</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200 hidden xs:inline">
                &lt; $200k COP
              </span>
            </div>
            <div className="flex items-center text-xs text-slate-500 space-x-1.5 font-semibold">
              <span className="text-red-600 font-bold">{originInfo.city} ({origin})</span>
              <span>➔</span>
              <span className="text-slate-800 font-bold">{destInfo.city} ({destination})</span>
            </div>
          </div>
        </div>

        {/* Desktop Action Controls */}
        <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
          {/* Turbo Búsqueda Forzada Button */}
          <button
            onClick={onOpenTurbo}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs sm:text-sm font-black bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-all shadow-xs"
            title="Lanzar Turbo Búsqueda Forzada"
          >
            <Zap className="w-4 h-4 fill-current text-red-600 animate-pulse" />
            <span>Turbo Búsqueda</span>
          </button>

          {/* Always-On Live Radar Button */}
          <button
            onClick={onOpenScanner}
            className={`flex items-center space-x-2 px-3 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all border shadow-sm ${
              isScanning
                ? 'bg-red-600 text-white border-red-600 shadow-red-600/20 ring-2 ring-red-600/30'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
            title="Radar de escaneo en vivo de aerolíneas"
          >
            <span className="relative flex h-2.5 w-2.5">
              {isScanning && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isScanning ? 'bg-white' : 'bg-red-500'
                }`}
              ></span>
            </span>
            <Radar className={`w-4 h-4 ${isScanning ? 'text-white' : 'text-red-600'}`} />
            <span>{isScanning ? 'Escaneo Activo' : 'Radar'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 sm:p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors shadow-sm"
            title={soundEnabled ? 'Sonido de alertas activado' : 'Sonido silenciado'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            )}
          </button>

          {/* Notifications History Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 sm:p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors shadow-sm"
            title="Historial de alertas y gangas"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-600 text-white animate-bounce shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 sm:p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors shadow-sm"
            title="Configuración de alertas y filtros"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>
        </div>

        {/* Mobile App Bar Actions */}
        <div className="flex md:hidden items-center space-x-1.5">
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 tap-highlight-none"
            aria-label="Silenciar o activar alertas"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-red-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 tap-highlight-none"
            aria-label="Ajustes"
          >
            <Settings className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>
    </header>
  );
};
