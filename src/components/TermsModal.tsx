import React from 'react';
import { X, ShieldCheck, FileText, ExternalLink, Plane, CheckCircle2, AlertCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-red-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-3">
            <BrandLogo size="md" />
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Términos y Condiciones de Uso
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                VuelaColombia • Plataforma de Búsqueda y Alerta de Tarifas Aéreas
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

        {/* Scrollable Terms Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 text-xs text-slate-600 leading-relaxed scrollbar-thin">
          {/* Section 1 */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>1. Objeto del Servicio</span>
            </h4>
            <p>
              VuelaColombia es una herramienta web personal e informativa creada para monitorear, comparar y notificar en tiempo real tarifas aéreas económicas (menores a $200.000 COP) disponibles en aerolíneas comerciales que operan rutas nacionales en Colombia (incluyendo Avianca, LATAM Airlines Colombia, Wingo, Clic Air y Satena).
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>2. Independencia y Enlaces Directos de Compra</span>
            </h4>
            <p>
              Esta aplicación <strong>NO es una agencia de viajes ni un intermediario financiero</strong>. No vende tiquetes directamente ni procesa pagos o transacciones bancarias. Los enlaces provistos redirigen de manera oficial y transparente a las plataformas de las aerolíneas (Avianca, LATAM, etc.) o a metabuscadores certificados como Google Flights y Skyscanner, donde el usuario finaliza su compra bajo las condiciones de cada proveedor.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>3. Disponibilidad y Variabilidad de Tarifas</span>
            </h4>
            <p>
              Las tarifas aéreas y cupos mostrados corresponden al momento exacto del escaneo o consulta. Debido a los algoritmos de precios dinámicos propios de las aerolíneas, los valores pueden cambiar rápidamente por demanda o agotamiento de sillas promocionales (ej. Tarifas XS o Basic). VuelaColombia no garantiza la permanencia indefinida de una tarifa.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>4. Notificaciones y Privacidad</span>
            </h4>
            <p>
              El sistema utiliza notificaciones de navegador Web Push y almacenamiento local (localStorage) en el dispositivo del usuario para guardar filtros y registros de alertas de precios. No se comercializan ni comparten datos personales con terceros. Las alertas por sonido se sintetizan directamente mediante la API Web Audio de tu navegador.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>5. Autoría y Desarrollo</span>
            </h4>
            <p>
              Esta plataforma fue desarrollada y diseñada profesionalmente por <strong>webcincodev</strong>. Puedes conocer más desarrollos, soluciones tecnológicas y servicios de ingeniería en{' '}
              <a
                href="https://jacomeovalle.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 font-bold hover:underline inline-flex items-center space-x-0.5"
              >
                <span>jacomeovalle.com</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>.
            </p>
          </div>

          {/* Badge disclaimer */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500">
              Al utilizar esta aplicación y sus sistemas de alerta, aceptas estos términos informativos diseñados para maximizar tu ahorro en vuelos dentro de Colombia.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Versión 2026 • webcincodev</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors shadow-md shadow-red-600/20"
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
