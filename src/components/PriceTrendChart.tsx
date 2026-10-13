import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingDown,
  TrendingUp,
  Activity,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Info,
  DollarSign,
  Flame,
  ArrowRight
} from 'lucide-react';
import { FlightDeal, PriceHistoryPoint } from '../types';
import { getHistoricalPriceTrend, formatCOP, getAirportByCode } from '../services/flightDataService';

interface PriceTrendChartProps {
  origin: string;
  destination: string;
  selectedFlight?: FlightDeal | null;
  priceThreshold?: number;
  onSelectDate?: (date: string) => void;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  origin,
  destination,
  selectedFlight,
  priceThreshold = 200000,
  onSelectDate,
}) => {
  const [daysRange, setDaysRange] = useState<30 | 14 | 7>(30);
  const [selectedAirlineFilter, setSelectedAirlineFilter] = useState<string>('ALL');

  const originInfo = getAirportByCode(origin);
  const destInfo = getAirportByCode(destination);

  // Generate historical data points
  const historyData = useMemo(() => {
    return getHistoricalPriceTrend(
      origin,
      destination,
      daysRange,
      selectedAirlineFilter,
      selectedFlight ? selectedFlight.priceCOP : undefined
    );
  }, [origin, destination, daysRange, selectedAirlineFilter, selectedFlight]);

  // Statistical calculations for volatility and pricing
  const stats = useMemo(() => {
    if (historyData.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        volatilityPercent: 0,
        volatilityLevel: 'Baja',
        bargainDays: 0,
        minDay: null as PriceHistoryPoint | null,
        maxDay: null as PriceHistoryPoint | null,
      };
    }

    const prices = historyData.map((p) => p.priceCOP);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const sum = prices.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / prices.length);

    const minDay = historyData.find((p) => p.priceCOP === min) || null;
    const maxDay = historyData.find((p) => p.priceCOP === max) || null;

    const volatilityPercent = avg > 0 ? Math.round(((max - min) / avg) * 100) : 0;
    let volatilityLevel = 'Baja';
    if (volatilityPercent > 35) volatilityLevel = 'Alta';
    else if (volatilityPercent > 20) volatilityLevel = 'Moderada';

    const bargainDays = historyData.filter((p) => p.priceCOP <= priceThreshold).length;

    return {
      min,
      max,
      avg,
      volatilityPercent,
      volatilityLevel,
      bargainDays,
      minDay,
      maxDay,
    };
  }, [historyData, priceThreshold]);

  // Current flight comparison
  const currentPrice = selectedFlight ? selectedFlight.priceCOP : stats.min;
  const priceVsAvgDiff = stats.avg > 0 ? Math.round(((currentPrice - stats.avg) / stats.avg) * 100) : 0;
  const isCurrentlyBargain = currentPrice <= priceThreshold;

  return (
    <div className="bg-white rounded-3xl border border-red-100 p-5 sm:p-7 shadow-lg space-y-6">
      {/* Header and Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-red-50">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-600">
                  Radar Histórico de Volatilidad
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200">
                  Últimos {daysRange} días
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Tendencia de Precios: {originInfo.city} ({origin}) ➔ {destInfo.city} ({destination})
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Visualiza las variaciones diarias y detecta el momento con menor precio antes de comprar tu tiquete.
          </p>
        </div>

        {/* Airline & Day Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Days Toggle */}
          <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setDaysRange(7)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                daysRange === 7
                  ? 'bg-white text-red-600 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Días
            </button>
            <button
              type="button"
              onClick={() => setDaysRange(14)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                daysRange === 14
                  ? 'bg-white text-red-600 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              14 Días
            </button>
            <button
              type="button"
              onClick={() => setDaysRange(30)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                daysRange === 30
                  ? 'bg-red-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Días
            </button>
          </div>

          {/* Airline Selector */}
          <select
            value={selectedAirlineFilter}
            onChange={(e) => setSelectedAirlineFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 hover:border-red-300 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
          >
            <option value="ALL">Todas las Aerolíneas</option>
            <option value="Avianca">Solo Avianca</option>
            <option value="LATAM">Solo LATAM</option>
            <option value="Wingo">Solo Wingo</option>
            <option value="Clic Air">Solo Clic Air</option>
          </select>
        </div>
      </div>

      {/* Volatility & Analytics Metric Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Min Price */}
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Piso Mínimo ({daysRange}D)</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            {formatCOP(stats.min)}
          </div>
          <p className="text-[10px] text-slate-500 truncate font-semibold">
            {stats.minDay ? `${stats.minDay.dayLabel} (${stats.minDay.airline})` : 'En promoción'}
          </p>
        </div>

        {/* Metric 2: Avg Price */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Precio Promedio</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800">
            {formatCOP(stats.avg)}
          </div>
          <p className="text-[10px] text-slate-500 font-semibold">
            Media histórica de la ruta
          </p>
        </div>

        {/* Metric 3: Volatility Index */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Índice Volatilidad</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              ±{stats.volatilityPercent}%
            </span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                stats.volatilityLevel === 'Alta'
                  ? 'bg-red-100 text-red-700'
                  : stats.volatilityLevel === 'Moderada'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {stats.volatilityLevel}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 truncate font-semibold">
            Oscilación de {formatCOP(stats.max - stats.min)}
          </p>
        </div>

        {/* Metric 4: Bargain days */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Días &lt; $200k (Gangas)</span>
            <Sparkles className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-red-600">
            {stats.bargainDays} de {daysRange} días
          </div>
          <p className="text-[10px] text-slate-500 font-semibold">
            {Math.round((stats.bargainDays / daysRange) * 100)}% de días en presupuesto
          </p>
        </div>
      </div>

      {/* Smart Volatility Advice Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          isCurrentlyBargain
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/80 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-start sm:items-center space-x-2.5">
          <div
            className={`p-1.5 rounded-xl shrink-0 ${
              isCurrentlyBargain ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-sm block">
              {isCurrentlyBargain
                ? '🎯 ¡Recomendación: Momento Óptimo para Comprar!'
                : '⚠️ Tarifa por encima de la media recomendada'}
            </span>
            <span className="font-medium text-slate-600">
              {selectedFlight ? (
                <>
                  Vuelo actual ({selectedFlight.airline} {selectedFlight.flightNumber}):{' '}
                  <strong className="text-slate-900">{formatCOP(selectedFlight.priceCOP)}</strong>.{' '}
                  {priceVsAvgDiff < 0
                    ? `Está un ${Math.abs(priceVsAvgDiff)}% más económico que el promedio de 30 días.`
                    : `Está un ${priceVsAvgDiff}% más caro que la media de la ruta.`}
                </>
              ) : (
                <>
                  La ruta cuenta con tarifas promocionales frecuentes los sábados. Te recomendamos fijar tu alerta en{' '}
                  <strong className="text-red-700">{formatCOP(priceThreshold)}</strong>.
                </>
              )}
            </span>
          </div>
        </div>

        {selectedFlight && (
          <div className="shrink-0 flex items-center space-x-1.5 font-bold">
            <span className="text-slate-500">Estado:</span>
            <span
              className={`px-2.5 py-1 rounded-xl font-black ${
                selectedFlight.priceCOP <= stats.min * 1.05
                  ? 'bg-emerald-600 text-white'
                  : selectedFlight.priceCOP <= priceThreshold
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-200 text-slate-800'
              }`}
            >
              {selectedFlight.priceCOP <= stats.min * 1.05
                ? 'Piso Mínimo'
                : selectedFlight.priceCOP <= priceThreshold
                ? 'Tarifa Ganga'
                : 'Tarifa Estándar'}
            </span>
          </div>
        )}
      </div>

      {/* Main Recharts Line & Area Chart */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={historyData}
            margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
            onClick={(e: any) => {
              if (e && e.activePayload && e.activePayload.length > 0 && onSelectDate) {
                const dataPoint = e.activePayload[0].payload as PriceHistoryPoint;
                if (dataPoint && dataPoint.date) {
                  onSelectDate(dataPoint.date);
                }
              }
            }}
          >
            <defs>
              <linearGradient id="colorPriceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
              interval={daysRange === 30 ? 3 : daysRange === 14 ? 1 : 0}
            />

            <YAxis
              domain={['auto', 'auto']}
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
              tickFormatter={(val: number) => `$${Math.round(val / 1000)}k`}
            />

            {/* Threshold line at 200,000 COP */}
            <ReferenceLine
              y={priceThreshold}
              stroke="#16A34A"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: `Meta Ganga: ${formatCOP(priceThreshold)}`,
                position: 'insideTopLeft',
                fill: '#16A34A',
                fontSize: 11,
                fontWeight: 800,
              }}
            />

            {/* Average line */}
            <ReferenceLine
              y={stats.avg}
              stroke="#94A3B8"
              strokeDasharray="2 2"
              strokeWidth={1.5}
              label={{
                value: `Promedio: ${formatCOP(stats.avg)}`,
                position: 'insideBottomRight',
                fill: '#64748B',
                fontSize: 10,
                fontWeight: 700,
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as PriceHistoryPoint;
                  return (
                    <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 space-y-1.5 text-xs max-w-xs">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
                        <span className="font-extrabold text-slate-200">
                          {data.dayOfWeek}, {data.dayLabel}
                        </span>
                        {data.isSaturday && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-600 text-white">
                            SÁBADO
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline space-x-2 pt-0.5">
                        <span className="text-lg font-black text-red-400">
                          {formatCOP(data.priceCOP)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          ({data.airline})
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300">
                        {data.priceCOP <= priceThreshold ? (
                          <span className="text-emerald-400 font-bold flex items-center space-x-1">
                            <span>🎯 ¡Ganga por debajo de $200k!</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            + {formatCOP(data.priceCOP - priceThreshold)} sobre tu meta
                          </span>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 italic">
                        Haz clic para seleccionar esta fecha
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Smooth shaded area under line */}
            <Area
              type="monotone"
              dataKey="priceCOP"
              fill="url(#colorPriceGradient)"
              stroke="none"
            />

            {/* Price trend line */}
            <Line
              type="monotone"
              dataKey="priceCOP"
              stroke="#DC2626"
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (!payload) return null;
                const isMin = payload.priceCOP === stats.min;
                const isSat = payload.isSaturday;
                const isBargain = payload.priceCOP <= priceThreshold;

                if (isMin) {
                  return (
                    <circle
                      key={`dot-min-${payload.date}`}
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill="#16A34A"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      className="animate-pulse"
                    />
                  );
                }

                if (isSat && isBargain) {
                  return (
                    <circle
                      key={`dot-sat-${payload.date}`}
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="#DC2626"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  );
                }

                return (
                  <circle
                    key={`dot-${payload.date}`}
                    cx={cx}
                    cy={cy}
                    r={2.5}
                    fill="#94A3B8"
                    stroke="#FFFFFF"
                    strokeWidth={1}
                  />
                );
              }}
              activeDot={{
                r: 7,
                fill: '#DC2626',
                stroke: '#FFFFFF',
                strokeWidth: 3,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend and Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 font-semibold border-t border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
            <span>Tendencia Real</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-emerald-600 inline-block border-b border-emerald-600 border-dashed"></span>
            <span>Límite $200.000 COP</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
            <span>Piso Mínimo del Periodo</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400">
          * Datos históricos calculados con base en los algoritmos tarifarios de aerolíneas colombianas.
        </span>
      </div>
    </div>
  );
};
