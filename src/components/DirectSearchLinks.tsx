import React from 'react';
import { ExternalLink, ShoppingCart, Search, Plane, Users, Dog } from 'lucide-react';
import { buildPurchaseLinks, getAirportByCode, getGoogleFlightsMultiCityUrl } from '../services/flightDataService';
import { PassengerConfig, TripType, MultiCityLeg } from '../types';

interface DirectSearchLinksProps {
  origin: string;
  destination: string;
  selectedDate: string;
  fullDateLabel: string;
  passengerConfig?: PassengerConfig;
  tripType?: TripType;
  returnDate?: string;
  multiCityLegs?: MultiCityLeg[];
}

export const DirectSearchLinks: React.FC<DirectSearchLinksProps> = ({
  origin,
  destination,
  selectedDate,
  fullDateLabel,
  passengerConfig = { adults: 1, children: 0, infants: 0, pets: 0 },
  tripType = 'one_way',
  returnDate,
  multiCityLegs,
}) => {
  const originInfo = getAirportByCode(origin);
  const destInfo = getAirportByCode(destination);
  const links = buildPurchaseLinks(
    origin,
    destination,
    selectedDate,
    undefined,
    passengerConfig,
    tripType,
    returnDate
  );

  const totalPassengers =
    passengerConfig.adults + passengerConfig.children + passengerConfig.infants;

  const isMulti = tripType === 'multi_city' && multiCityLegs && multiCityLegs.length > 0;
  const multiCityGoogleUrl = isMulti ? getGoogleFlightsMultiCityUrl(multiCityLegs, passengerConfig.adults) : links.googleFlights;

  const engines = [
    {
      name: 'Google Flights',
      desc: isMulti
        ? `Comprar ruta multi-tramo completa (${multiCityLegs.map(l => l.origin).join('-')}-${multiCityLegs[multiCityLegs.length - 1].destination}) en Google Flights`
        : `Comprar directo en Google Flights (${totalPassengers} pax${
            passengerConfig.pets > 0 ? `, ${passengerConfig.pets} masc.` : ''
          }${tripType === 'round_trip' ? ', ida y vuelta' : ''})`,
      url: multiCityGoogleUrl,
      badge: 'Verificado',
      isPrimary: true,
    },
    {
      name: 'Skyscanner Colombia',
      desc: `Comparador oficial de aerolíneas para ${origin} ➔ ${destination}`,
      url: links.skyscanner,
      badge: 'Multiaplicación',
      isPrimary: false,
    },
    {
      name: 'Avianca Oficial',
      desc: 'Comprar directo en portal oficial de Avianca Colombia',
      url: 'https://www.avianca.com/es/',
      badge: 'Aerolínea Oficial',
      isPrimary: true,
    },
    {
      name: 'LATAM Airlines',
      desc: 'Comprar directo en LATAM Airlines Colombia',
      url: 'https://www.latamairlines.com/co/es',
      badge: 'Aerolínea Oficial',
      isPrimary: false,
    },
    {
      name: 'Kayak Colombia',
      desc: `Buscar tarifas en tiempo real en Kayak Colombia`,
      url: links.kayak,
      badge: 'Buscador Global',
      isPrimary: false,
    },
    {
      name: 'Despegar Colombia',
      desc: `Consultar promociones y paquetes en Despegar`,
      url: links.despegar,
      badge: 'Agencia Líder',
      isPrimary: false,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-red-100 p-6 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-red-50 text-red-600">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {isMulti
                ? `Links de Compra Multi-tramo: ${multiCityLegs.map(l => l.origin).join(' ➔ ')} ➔ ${multiCityLegs[multiCityLegs.length - 1].destination}`
                : `Links Directos de Compra: ${originInfo.city} ➔ ${destInfo.city}`}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {isMulti
                ? `Ruta Concatenada (${multiCityLegs.length} tramos) • ${totalPassengers} Pax${passengerConfig.pets > 0 ? ` + ${passengerConfig.pets} Mascota` : ''}`
                : `${fullDateLabel} • ${tripType === 'round_trip' ? 'Ida y Vuelta' : 'Solo Ida'} • ${totalPassengers} Pax${passengerConfig.pets > 0 ? ` + ${passengerConfig.pets} Mascota` : ''}`}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
          Redirección Segura sin Comisiones
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {engines.map((e) => (
          <a
            key={e.name}
            href={e.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 group ${
              e.isPrimary
                ? 'bg-red-50/40 border-red-200 hover:border-red-600 hover:shadow-md'
                : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-slate-900 group-hover:text-red-600 transition-colors">
                  {e.name}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                    e.isPrimary
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {e.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-snug font-medium">{e.desc}</p>
            </div>

            <div className="flex items-center justify-between text-xs font-black text-red-600 pt-2 border-t border-slate-100 group-hover:translate-x-0.5 transition-transform">
              <span>Abrir Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
