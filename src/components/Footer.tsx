import React from 'react';
import { Plane, ShieldCheck, ExternalLink, Zap, Bell, Radar, Heart, Globe } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenTerms: () => void;
  onOpenTurbo: () => void;
  onOpenSettings: () => void;
  onOpenScanner: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTerms,
  onOpenTurbo,
  onOpenSettings,
  onOpenScanner,
}) => {
  return (
    <footer className="border-t border-red-100 bg-white text-slate-600 text-xs mt-16 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <BrandLogo size="sm" />
              <span className="font-black text-lg text-slate-900 tracking-tight">
                Vuela<span className="text-red-600">Colombia</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Plataforma personal de búsqueda continua y alertas sonoras de pasajes aéreos por menos de <strong className="text-red-600 font-bold">$200.000 COP</strong> los sábados y cualquier día de la semana.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-50 text-red-600 border border-red-200">
                <span>Solo Vuelos Comerciales</span>
              </span>
            </div>
          </div>

          {/* Column 2: Herramientas de Rastreo */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Herramientas de Rastreo
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  type="button"
                  onClick={onOpenTurbo}
                  className="hover:text-red-600 transition-colors flex items-center space-x-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-red-600" />
                  <span>Turbo Búsqueda Forzada</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenScanner}
                  className="hover:text-red-600 transition-colors flex items-center space-x-1.5"
                >
                  <Radar className="w-3.5 h-3.5 text-red-600" />
                  <span>Radar en Vivo Activo</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="hover:text-red-600 transition-colors flex items-center space-x-1.5"
                >
                  <Bell className="w-3.5 h-3.5 text-red-600" />
                  <span>Ajustes de Notificación</span>
                </button>
              </li>
              <li>
                <a
                  href="https://www.google.com/travel/flights"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition-colors flex items-center space-x-1"
                >
                  <span>Google Flights Directo</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Aerolíneas Monitoreadas */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Aerolíneas en Colombia
            </h4>
            <ul className="space-y-2 font-medium text-slate-500">
              <li>
                <a
                  href="https://www.avianca.com/es/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition-colors font-bold text-red-600 flex items-center space-x-1"
                >
                  <span>Avianca (Tarifas Promo XS)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.latamairlines.com/co/es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 transition-colors flex items-center space-x-1"
                >
                  <span>LATAM Airlines Colombia</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.wingo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 transition-colors flex items-center space-x-1"
                >
                  <span>Wingo Low Cost</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://clicair.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 transition-colors flex items-center space-x-1"
                >
                  <span>Clic Air / Satena Regional</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Crédito Profesional webcincodev */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Información Legal &amp; Autoría
            </h4>
            <div className="space-y-2 font-medium">
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-slate-700 hover:text-red-600 font-bold transition-colors flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                <span className="underline decoration-red-300 underline-offset-2">Términos y Condiciones</span>
              </button>

              <div className="pt-2 text-xs leading-relaxed text-slate-500">
                <p>
                  Plataforma desarrollada profesionalmente por{' '}
                  <span className="font-black text-slate-900">webcincodev</span>.
                </p>
                <div className="mt-2">
                  <a
                    href="https://jacomeovalle.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors shadow-sm shadow-red-600/20"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>jacomeovalle.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with developer signature */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 font-medium text-center sm:text-left">
            © 2026 <strong className="text-slate-900">VuelaColombia</strong>. Todos los derechos reservados. Tarifas aéreas con impuestos incluidos.
          </p>

          <div className="flex items-center space-x-2 text-slate-700 font-bold">
            <span>Desarrollo web:</span>
            <span className="text-red-600 font-black">webcincodev</span>
            <span>•</span>
            <a
              href="https://jacomeovalle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-900 hover:text-red-600 underline font-black transition-colors"
            >
              jacomeovalle.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
