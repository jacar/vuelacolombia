import React, { useState, useEffect } from 'react';
import { X, Bell, Volume2, Mail, MessageSquare, ShieldCheck, Check, DollarSign } from 'lucide-react';
import { PriceAlertSettings } from '../types';
import { NotificationManager } from '../services/notificationService';
import { soundService } from '../services/audioService';
import { formatCOP } from '../services/flightDataService';
import { BrandLogo } from './BrandLogo';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PriceAlertSettings;
  onSaveSettings: (settings: PriceAlertSettings) => void;
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<PriceAlertSettings>(settings);
  const [browserPermGranted, setBrowserPermGranted] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    setBrowserPermGranted(NotificationManager.isPermissionGranted());
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleRequestBrowserPerm = async () => {
    const granted = await NotificationManager.requestPermission();
    setBrowserPermGranted(granted);
    setLocalSettings((prev) => ({ ...prev, browserNotificationsEnabled: granted }));
  };

  const handleTestAlert = () => {
    if (localSettings.soundEnabled) {
      soundService.playDealAlertChime();
    }
    if (browserPermGranted && localSettings.browserNotificationsEnabled) {
      try {
        new Notification('🎯 Alerta de Vuelos: VuelaColombia', {
          body: '¡Sistema activo! Te avisaremos de inmediato cuando haya vuelos por menos de $200.000 COP.',
        });
      } catch (e) {
        console.warn('Notification failed:', e);
      }
    }
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-red-100 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <BrandLogo size="md" />
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Configuración de Alertas
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Personaliza avisos sonoros y notificaciones de vuelos
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

        {/* Settings Body */}
        <div className="space-y-5 py-5">
          {/* Price Threshold */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800">
                Tope Máximo de Alerta (COP)
              </label>
              <span className="text-sm font-black text-red-600">
                {formatCOP(localSettings.maxPriceThreshold)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Solo se activará la notificación si el vuelo cuesta igual o menos que este valor.
            </p>
            <div className="flex gap-2 pt-1">
              {[180000, 200000, 220000, 250000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setLocalSettings((prev) => ({ ...prev, maxPriceThreshold: preset }))}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all border ${
                    localSettings.maxPriceThreshold === preset
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ${preset / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* Browser Notifications Permission */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-red-600" />
                <span className="text-xs font-black text-slate-900">
                  Notificaciones de Navegador / Escritorio
                </span>
              </div>
              {browserPermGranted ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Permitido ✓
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestBrowserPerm}
                  className="px-2.5 py-1 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
                >
                  Permitir Avisos
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Recibe avisos emergentes cuando una aerolínea libere tiquetes por debajo de $200.000 COP.
            </p>
          </div>

          {/* Sound toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2.5">
              <Volume2 className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-xs font-black text-slate-900">Campana Acústica de Tarifa</p>
                <p className="text-[11px] text-slate-500 font-medium">Tono armónico C6-G6 al encontrar pasaje barato</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.soundEnabled}
                onChange={(e) => setLocalSettings((prev) => ({ ...prev, soundEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {/* Email destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 flex items-center space-x-1.5">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>Correo Electrónico para Avisos</span>
            </label>
            <input
              type="email"
              value={localSettings.email}
              onChange={(e) => setLocalSettings((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="strongmeropower@gmail.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 font-medium"
            />
          </div>

          {/* WhatsApp / Mobile */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>WhatsApp para Envíos Rápidos</span>
            </label>
            <input
              type="text"
              value={localSettings.phoneWhatsapp}
              onChange={(e) => setLocalSettings((prev) => ({ ...prev, phoneWhatsapp: e.target.value }))}
              placeholder="+57 300 123 4567"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 font-medium"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleTestAlert}
            className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            {testSent ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-black">¡Alerta Probada!</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-red-600" />
                <span>Probar Notificación</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-2xl text-xs font-black bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md shadow-red-600/20"
            >
              Guardar Ajustes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
