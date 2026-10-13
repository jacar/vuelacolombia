import React from 'react';
import { X, Bell, Trash2, CheckCheck, ExternalLink, Calendar, Plane, ShoppingCart } from 'lucide-react';
import { AlertNotificationItem } from '../types';
import { formatCOP, getGoogleFlightsUrl } from '../services/flightDataService';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AlertNotificationItem[];
  onClearHistory: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearHistory,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-red-50 text-red-600 border border-red-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Historial de Tarifas</h3>
              <p className="text-xs text-slate-500 font-medium">
                {notifications.length} avisos de vuelos &lt; $200.000 COP
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

        {/* Toolbar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center space-x-1"
            >
              <CheckCheck className="w-3.5 h-3.5 text-red-600" />
              <span>Marcar leídos</span>
            </button>
            <button
              onClick={onClearHistory}
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar historial</span>
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">
                No hay alertas registradas aún
              </p>
              <p className="text-xs text-slate-500 max-w-xs font-medium">
                Cuando el radar detecte una tarifa de vuelo menor a $200.000 COP, aparecerá aquí con hora exacta, precio y link de compra directo.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.read
                    ? 'bg-slate-50 border-slate-200 text-slate-600'
                    : 'bg-red-50/60 border-red-200 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <span className="text-xs font-black text-slate-900">
                      {item.airline}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      ({item.flightNumber})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-semibold">
                    {item.timestamp}
                  </span>
                </div>

                <div className="flex items-baseline justify-between my-1">
                  <span className="text-xs text-slate-600 font-bold flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-red-600 inline mr-1" />
                    <span>{item.date}</span>
                  </span>
                  <span className="text-base font-black text-red-600">
                    {formatCOP(item.priceCOP)}
                  </span>
                </div>

                <p className="text-xs text-slate-700 mt-1 font-medium">{item.message}</p>

                <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-end">
                  <a
                    href={item.purchaseUrl || getGoogleFlightsUrl(item.date)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-black text-red-600 hover:text-red-700 flex items-center space-x-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Comprar directo en Google Flights</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
