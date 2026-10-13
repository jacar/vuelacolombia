import React from 'react';
import { Lightbulb, Info, Luggage, TrendingUp, Plane, ShieldCheck, Flame } from 'lucide-react';

interface RouteInsightsProps {
  origin?: string;
  destination?: string;
}

export const RouteInsights: React.FC<RouteInsightsProps> = ({
  origin = 'BOG',
  destination = 'MDE',
}) => {
  return (
    <section className="bg-white rounded-3xl border border-red-100 p-6 shadow-md space-y-6">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
        <div className="p-2.5 rounded-2xl bg-red-50 text-red-600">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">
            Consejos de Vuelo: Tarifas Promo &lt; $200.000 COP ({origin} ➔ {destination})
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Estrategias aéreas para comprar tiquetes baratos en Avianca, LATAM, Wingo y Clic Air
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center space-x-2 text-red-600 font-black text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>¿Por qué los Sábados y Fechas Clave?</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Los sábados en la mañana aerolíneas como <strong className="text-slate-900">Avianca y LATAM</strong> lanzan cupos en tarifas <strong className="text-red-600">XS / Basic</strong> para optimizar ocupación antes del tráfico de retorno dominical, permitiendo cazar pasajes desde <strong className="text-red-600">$119.000 a $185.000 COP</strong>.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center space-x-2 text-slate-800 font-black text-xs">
            <Luggage className="w-4 h-4 text-red-600" />
            <span>Regla de Equipaje en Cabina</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Las tarifas menores a $200k incluyen <strong className="text-slate-900">artículo personal</strong> (morral o cartera de 45x35x20 cm) que se ubica bajo el asiento delantero. Si necesitas llevar maleta de mano de 10kg, añádela durante el check-in online para pagar la mitad de lo que cobran en mostrador del aeropuerto.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center space-x-2 text-red-600 font-black text-xs">
            <Plane className="w-4 h-4" />
            <span>Conexiones y Rutas Directas</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Para rutas con escala en Bogotá (BOG) o Medellín (MDE), los tiempos promedio son de 1h15m a 1h45m. Al comprar con la misma aerolínea (ej. Avianca o LATAM), tu equipaje y conexión quedan 100% garantizados ante cualquier demora.
          </p>
        </div>
      </div>

      {/* Banner */}
      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start space-x-3">
        <Info className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1">
          <p className="font-black text-red-900">
            Asegura el precio antes de que cambie el algoritmo:
          </p>
          <p className="text-slate-600 leading-relaxed font-medium">
            Las aerolíneas modifican precios según demanda y cupos restantes. Cuando la aplicación detecte una ganga menor a $200.000 COP, utiliza el enlace directo de compra en Google Flights o la aerolínea para congelar la tarifa inmediatamente.
          </p>
        </div>
      </div>
    </section>
  );
};
