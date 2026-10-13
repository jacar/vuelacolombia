import React from 'react';
import { Plane, Radar, Zap, Bell, Settings, Calendar, SlidersHorizontal } from 'lucide-react';
import { AlertNotificationItem } from '../types';

export type MobileTab = 'flights' | 'radar' | 'calendar' | 'alerts' | 'settings';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  onOpenTurbo: () => void;
  onOpenScanner: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  isScanning: boolean;
  notifications: AlertNotificationItem[];
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenTurbo,
  onOpenScanner,
  onOpenNotifications,
  onOpenSettings,
  isScanning,
  notifications,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-area-bottom">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center">
        {/* Tab 1: Vuelos */}
        <button
          type="button"
          onClick={() => onSelectTab('flights')}
          className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all tap-highlight-none ${
            activeTab === 'flights'
              ? 'text-red-600 font-black'
              : 'text-slate-500 hover:text-slate-800 font-semibold'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'flights' ? 'bg-red-50 text-red-600 scale-110' : ''
            }`}
          >
            <Plane className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Vuelos</span>
        </button>

        {/* Tab 2: Calendario / Radar */}
        <button
          type="button"
          onClick={() => onSelectTab('calendar')}
          className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all tap-highlight-none ${
            activeTab === 'calendar'
              ? 'text-red-600 font-black'
              : 'text-slate-500 hover:text-slate-800 font-semibold'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'calendar' ? 'bg-red-50 text-red-600 scale-110' : ''
            }`}
          >
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Fechas</span>
        </button>

        {/* Tab 3: Turbo Floating Center Action */}
        <button
          type="button"
          onClick={onOpenTurbo}
          className="flex flex-col items-center justify-center -mt-4 transition-transform active:scale-95 tap-highlight-none group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-600/35 border-2 border-white ring-2 ring-red-100 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 fill-current animate-pulse text-yellow-300" />
          </div>
          <span className="text-[10px] font-black text-red-700 mt-1 tracking-tight">Turbo</span>
        </button>

        {/* Tab 4: Radar en Vivo */}
        <button
          type="button"
          onClick={onOpenScanner}
          className="flex flex-col items-center justify-center py-1 rounded-2xl transition-all tap-highlight-none text-slate-500 hover:text-slate-800 font-semibold"
        >
          <div className="relative p-1 rounded-xl">
            <Radar className="w-5 h-5 text-slate-700" />
            {isScanning && (
              <span className="absolute top-0 right-0 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Radar</span>
        </button>

        {/* Tab 5: Alertas / Notificaciones */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative flex flex-col items-center justify-center py-1 rounded-2xl transition-all tap-highlight-none text-slate-500 hover:text-slate-800 font-semibold"
        >
          <div className="relative p-1 rounded-xl">
            <Bell className="w-5 h-5 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-red-600 text-white shadow-sm animate-bounce">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Alertas</span>
        </button>
      </div>
    </nav>
  );
};
