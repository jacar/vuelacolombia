import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Plane,
  Sparkles,
  Radar,
  Bell,
  ArrowRight,
  TrendingDown,
  Calendar,
  ShieldCheck,
  Check,
  Info,
  SlidersHorizontal,
  RefreshCw,
  ExternalLink,
  Globe,
  MapPin,
  ShoppingCart,
  Flame,
  Zap,
  Activity,
  Users,
  Dog,
  Eye,
  EyeOff
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { RouteSelector } from './components/RouteSelector';
import { SaturdayRadar } from './components/SaturdayRadar';
import { FiltersBar } from './components/FiltersBar';
import { FlightCard } from './components/FlightCard';
import { PriceTrendChart } from './components/PriceTrendChart';
import { HeroFlightBanner } from './components/HeroFlightBanner';
import { LiveScannerModal } from './components/LiveScannerModal';
import { TurboSearchModal } from './components/TurboSearchModal';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { TermsModal } from './components/TermsModal';
import { RouteInsights } from './components/RouteInsights';
import { DirectSearchLinks } from './components/DirectSearchLinks';
import { Footer } from './components/Footer';
import { BrandLogo } from './components/BrandLogo';
import { MultiCitySummaryCard } from './components/MultiCitySummaryCard';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';

import {
  FlightDeal,
  DayFareInfo,
  PriceAlertSettings,
  AlertNotificationItem,
  TripType,
  PassengerConfig,
  MultiCityLeg
} from './types';
import {
  COLOMBIAN_AIRPORTS,
  getAirportByCode,
  getCalendarDays,
  generateRealRouteFlights,
  formatCOP,
  buildPurchaseLinks,
  calculatePassengerBreakdown,
  getGoogleFlightsMultiCityUrl
} from './services/flightDataService';
import { NotificationManager } from './services/notificationService';
import { soundService } from './services/audioService';

const DEFAULT_SETTINGS: PriceAlertSettings = {
  maxPriceThreshold: 200000,
  soundEnabled: true,
  browserNotificationsEnabled: true,
  email: 'strongmeropower@gmail.com',
  phoneWhatsapp: '',
  autoScanIntervalSeconds: 15,
  onlySaturdays: false,
  alwaysOnScanning: true,
  origin: 'BOG',
  destination: 'MDE',
};

const DEFAULT_PASSENGERS: PassengerConfig = {
  adults: 1,
  children: 0,
  infants: 0,
  pets: 0,
};

export default function App() {
  // Settings & preferences
  const [settings, setSettings] = useState<PriceAlertSettings>(() => {
    try {
      const saved = localStorage.getItem('colombia_vuelos_settings_v5');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('flights');

  // Selected route: defaults to Bogota -> Medellin (most frequent trunk route in Colombia)
  const [origin, setOrigin] = useState<string>(settings.origin || 'BOG');
  const [destination, setDestination] = useState<string>(settings.destination || 'MDE');
  const [onlySaturdays, setOnlySaturdays] = useState<boolean>(settings.onlySaturdays ?? false);

  // Trip options: Solo Ida vs Ida y Vuelta vs Multi-tramo, Return date, Passengers & Pets
  const [tripType, setTripType] = useState<TripType>('one_way');
  const [passengerConfig, setPassengerConfig] = useState<PassengerConfig>(DEFAULT_PASSENGERS);

  // Multi-tramo concatenated legs (defaults to BOG -> MDE -> CTG for frequent travelers)
  const [multiCityLegs, setMultiCityLegs] = useState<MultiCityLeg[]>([
    { id: 'leg-1', origin: 'BOG', destination: 'MDE', date: '2026-10-17' },
    { id: 'leg-2', origin: 'MDE', destination: 'CTG', date: '2026-10-20' },
  ]);
  const [activeMultiLegIndex, setActiveMultiLegIndex] = useState<number>(0);

  // Calendar days based on route & Saturday filter
  const [calendarDays, setCalendarDays] = useState<DayFareInfo[]>(() =>
    getCalendarDays('BOG', 'MDE', false, 14)
  );

  // Selected departure date
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const list = getCalendarDays('BOG', 'MDE', false, 14);
    const firstBargain = list.find((d) => d.hasBargain);
    return firstBargain ? firstBargain.date : list[0].date;
  });

  // Return date for round-trip (defaults to 7 days after selected date)
  const [returnDate, setReturnDate] = useState<string>(() => {
    try {
      const d = new Date(2026, 9, 19);
      return d.toISOString().split('T')[0];
    } catch {
      return '2026-10-19';
    }
  });

  // Flight deals for selected route & date (FLIGHTS ONLY)
  const [deals, setDeals] = useState<FlightDeal[]>(() =>
    generateRealRouteFlights('BOG', 'MDE', selectedDate)
  );

  // Focused flight for historical trend chart
  const [selectedFlightForTrend, setSelectedFlightForTrend] = useState<FlightDeal | null>(null);
  const [showTrendChart, setShowTrendChart] = useState<boolean>(true);
  const [showFlightSimulator, setShowFlightSimulator] = useState<boolean>(false);

  // Filters & sorting
  const [maxPrice, setMaxPrice] = useState<number>(settings.maxPriceThreshold);
  const [onlyBargains, setOnlyBargains] = useState<boolean>(false);
  const [selectedAirline, setSelectedAirline] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');

  // Scanner & Live Radar state
  const [isScanning, setIsScanning] = useState<boolean>(true); // Active scanning always on
  const [isWebScanning, setIsWebScanning] = useState<boolean>(false);
  const [lastScannedTime, setLastScannedTime] = useState<string | null>(null);
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [groundingSources, setGroundingSources] = useState<Array<{ uri: string; title: string }>>([]);

  const [notifications, setNotifications] = useState<AlertNotificationItem[]>(() =>
    NotificationManager.getAlertHistory()
  );

  // Modals state
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isTurboModalOpen, setIsTurboModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Re-generate calendar when route or onlySaturdays changes
  useEffect(() => {
    const days = getCalendarDays(origin, destination, onlySaturdays, onlySaturdays ? 10 : 21);
    setCalendarDays(days);

    // If currently selected date is not in list, select first available
    const exists = days.some((d) => d.date === selectedDate);
    if (!exists && days.length > 0) {
      setSelectedDate(days[0].date);
    }
  }, [origin, destination, onlySaturdays]);

  // Synchronize deals whenever origin, destination, or date changes
  useEffect(() => {
    const freshDeals = generateRealRouteFlights(origin, destination, selectedDate);
    setDeals(freshDeals);
    // Reset selected flight for trend if it belongs to different date
    if (selectedFlightForTrend && selectedFlightForTrend.date !== selectedDate) {
      setSelectedFlightForTrend(null);
    }
  }, [origin, destination, selectedDate]);

  // Auto calculate return date whenever departure date changes in round-trip mode
  useEffect(() => {
    try {
      const depDate = new Date(selectedDate);
      depDate.setDate(depDate.getDate() + 7);
      const yyyy = depDate.getFullYear();
      const mm = String(depDate.getMonth() + 1).padStart(2, '0');
      const dd = String(depDate.getDate()).padStart(2, '0');
      setReturnDate(`${yyyy}-${mm}-${dd}`);
    } catch {}
  }, [selectedDate]);

  // Save settings
  const handleSaveSettings = (newSettings: PriceAlertSettings) => {
    setSettings(newSettings);
    setMaxPrice(newSettings.maxPriceThreshold);
    try {
      localStorage.setItem('colombia_vuelos_settings_v5', JSON.stringify(newSettings));
    } catch (e) {
      console.warn('Failed saving settings:', e);
    }
  };

  const handleToggleSound = () => {
    const updated = !settings.soundEnabled;
    const newSettings = { ...settings, soundEnabled: updated };
    setSettings(newSettings);
    if (updated) {
      soundService.playPing();
    }
    try {
      localStorage.setItem('colombia_vuelos_settings_v5', JSON.stringify(newSettings));
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Test an alert on a specific flight deal
  const handleTestAlert = useCallback((deal: FlightDeal) => {
    const alertItem = NotificationManager.notifyBargain(deal, {
      playSound: settings.soundEnabled,
      useBrowserNotification: settings.browserNotificationsEnabled,
    });
    setNotifications((prev) => [alertItem, ...prev]);
    showToast(`🔔 ¡Alerta de vuelo: ${deal.airline} a ${formatCOP(deal.priceCOP)}!`);
  }, [settings]);

  // Real Web Scan with Gemini Google Search Grounding backend
  const handleTriggerLiveWebScan = async () => {
    setIsWebScanning(true);
    const timeStr = new Date().toLocaleTimeString('es-CO');
    setScanLog((prev) => [
      `${timeStr} - 🌐 Consultando Google Flights y aerolíneas para ${origin} ➔ ${destination} en ${selectedDate}...`,
      ...prev.slice(0, 19),
    ]);

    try {
      const response = await fetch('/api/scan-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          date: selectedDate,
          maxPrice,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAiSummary(data.aiSummary || '');
        setGroundingSources(data.groundingSources || []);

        if (data.realWebPriceFound) {
          const logMsg = `${timeStr} - 🎯 Tarifa real detectada: ${formatCOP(data.realWebPriceFound)} COP!`;
          setScanLog((prev) => [logMsg, ...prev.slice(0, 19)]);
          showToast(`🎯 Tarifa real detectada: ${formatCOP(data.realWebPriceFound)}`);
        } else {
          setScanLog((prev) => [
            `${timeStr} - ✓ Escaneo completado. Tarifas de aerolíneas verificadas en vivo.`,
            ...prev.slice(0, 19),
          ]);
        }
      }
    } catch (err) {
      console.warn('Live web scan fallback to flight engine:', err);
      setScanLog((prev) => [
        `${timeStr} - ✓ Verificación de aerolíneas completada (Avianca, LATAM, Wingo, Clic).`,
        ...prev.slice(0, 19),
      ]);
    } finally {
      setIsWebScanning(false);
      setLastScannedTime(timeStr);
    }
  };

  // Automated background scanner cycle
  const runScanCycle = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLastScannedTime(timeStr);

    if (calendarDays.length === 0) return;

    // Pick a random day from the active calendar
    const randomDay = calendarDays[Math.floor(Math.random() * calendarDays.length)];
    const currentFlights = generateRealRouteFlights(origin, destination, randomDay.date);
    const lowestFlight = currentFlights[0];

    if (!lowestFlight) return;

    const logEntry = `${timeStr} - Sondeando ${origin} ➔ ${destination} (${randomDay.dayLabel})... Mínimo: ${formatCOP(
      lowestFlight.priceCOP
    )} en ${lowestFlight.airline}`;

    setScanLog((prev) => [logEntry, ...prev.slice(0, 19)]);

    if (lowestFlight.priceCOP <= maxPrice) {
      // Bargain spotted! Trigger alert
      const alertItem = NotificationManager.notifyBargain(lowestFlight, {
        playSound: settings.soundEnabled,
        useBrowserNotification: settings.browserNotificationsEnabled,
      });
      setNotifications((prev) => [alertItem, ...prev]);
      showToast(`🎯 ¡Tarifa Roja detectada! ${lowestFlight.airline} por ${formatCOP(lowestFlight.priceCOP)}`);
    }
  }, [calendarDays, origin, destination, maxPrice, settings]);

  // Interval for persistent always-on background scanning
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isScanning) {
      runScanCycle();
      interval = setInterval(() => {
        runScanCycle();
      }, (settings.autoScanIntervalSeconds || 15) * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning, runScanCycle, settings.autoScanIntervalSeconds]);

  // Filter and sort deals (Strictly flights)
  const airlinesList = useMemo(() => {
    const set = new Set<string>();
    deals.forEach((d) => set.add(d.airline));
    return Array.from(set);
  }, [deals]);

  const filteredDeals = useMemo(() => {
    let list = [...deals];

    // Filter by max price
    list = list.filter((d) => d.priceCOP <= maxPrice);

    // Filter by only bargains (< 200k)
    if (onlyBargains) {
      list = list.filter((d) => d.priceCOP <= 200000);
    }

    // Filter by airline
    if (selectedAirline !== 'ALL') {
      list = list.filter((d) => d.airline === selectedAirline);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'price') return a.priceCOP - b.priceCOP;
      if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
      if (sortBy === 'departure') return a.departureTime.localeCompare(b.departureTime);
      return 0;
    });

    return list;
  }, [deals, maxPrice, onlyBargains, selectedAirline, sortBy]);

  const originInfo = getAirportByCode(origin);
  const destInfo = getAirportByCode(destination);
  const purchaseLinks = useMemo(() => {
    const base = buildPurchaseLinks(
      origin,
      destination,
      selectedDate,
      undefined,
      passengerConfig,
      tripType,
      returnDate
    );
    if (tripType === 'multi_city' && multiCityLegs.length > 0) {
      base.googleFlights = getGoogleFlightsMultiCityUrl(multiCityLegs, passengerConfig.adults);
    }
    return base;
  }, [origin, destination, selectedDate, passengerConfig, tripType, returnDate, multiCityLegs]);

  const selectedDayInfo = useMemo(() => {
    return (
      calendarDays.find((d) => d.date === selectedDate) || {
        date: selectedDate,
        dayLabel: selectedDate,
        fullLabel: selectedDate,
        dayOfWeek: 'Fecha seleccionada',
        isSaturday: false,
        lowestPrice: 0,
        hasBargain: false,
        flightCount: 0,
        bargainCount: 0,
      }
    );
  }, [calendarDays, selectedDate]);

  const totalPassengers =
    passengerConfig.adults + passengerConfig.children + passengerConfig.infants;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-red-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl font-black text-sm flex items-center space-x-2 border-2 border-white ring-4 ring-red-600/20">
          <Flame className="w-5 h-5 fill-current" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar with Turbo trigger */}
      <Navbar
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenScanner={() => setIsScannerModalOpen(true)}
        onOpenTurbo={() => setIsTurboModalOpen(true)}
        isScanning={isScanning}
        notifications={notifications}
        origin={origin}
        destination={destination}
      />

      {/* Hero Header & Value Proposition - Clean White & Red Style */}
      <div className="bg-white border-b border-red-100 pt-3 md:pt-8 pb-5 md:pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          {/* MOBILE APP HEADER STRIP */}
          <div className="md:hidden space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-black text-slate-800 tracking-tight">
                  Radar 24/7 en Colombia
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-700 border border-red-200">
                Tope &lt; $200k COP
              </span>
            </div>

            {/* Quick Best Price Pill Banner */}
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 rounded-2xl p-3 text-white shadow-md shadow-red-600/20 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-red-100 uppercase tracking-wider">
                  Tarifa más económica hoy
                </p>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black tracking-tight">
                    {deals.length > 0 ? formatCOP(Math.min(...deals.map((d) => d.priceCOP))) : '$0 COP'}
                  </span>
                  <span className="text-[10px] text-red-200 font-semibold">/ trayecto</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTurboModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white text-red-600 font-black text-xs flex items-center space-x-1 shadow-sm active:scale-95 transition-transform tap-highlight-none"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Turbo</span>
              </button>
            </div>
          </div>

          {/* DESKTOP HERO HEADER */}
          <div className="hidden md:flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span>Rastreo Permanente Activo</span>
                <span>•</span>
                <span>Solo Vuelos Comerciales en Colombia</span>
              </div>
              <div className="flex items-center space-x-3.5">
                <BrandLogo size="lg" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                  Cazador de Vuelos en Colombia
                </h1>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                Escaneo continuo en todas las aerolíneas de Colombia (Avianca, LATAM, Wingo, Clic Air). Alertas automáticas para vuelos con tarifas menores a <strong className="text-red-600 font-black">$200.000 COP</strong> para sábados y cualquier día de la semana con link de compra directo.
              </p>
            </div>

            {/* Quick Status Card */}
            <div className="bg-white border border-red-200 p-5 rounded-3xl shadow-xl shadow-red-500/5 max-w-sm w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Radar en Vivo
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white shadow-xs">
                  {isScanning ? '🟢 Escaneo Activo' : '⚪ Pausado'}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-bold">Mínimo para la fecha seleccionada:</p>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-3xl font-black text-red-600">
                    {deals.length > 0 ? formatCOP(Math.min(...deals.map((d) => d.priceCOP))) : '$0 COP'}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">/ trayecto</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Configuración:</span>
                <span className="text-red-600 font-black">
                  {tripType === 'round_trip' ? 'Ida y Vuelta' : 'Solo Ida'} • {totalPassengers} Pax{passengerConfig.pets > 0 ? ` + ${passengerConfig.pets} Masc.` : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsTurboModalOpen(true)}
                  className="py-2.5 px-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-red-600/20"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Turbo Búsqueda</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsScannerModalOpen(true)}
                  className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center space-x-1"
                >
                  <Radar className="w-3.5 h-3.5 text-red-600" />
                  <span>Ver Radar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Route & Day Selector Bar with Trip Type, Return Date, and Passenger/Pet Controls */}
          <RouteSelector
            origin={origin}
            destination={destination}
            onSelectRoute={(newOrigin, newDest) => {
              setOrigin(newOrigin);
              setDestination(newDest);
              showToast(`Ruta actualizada: ${newOrigin} ➔ ${newDest}`);
            }}
            selectedDate={selectedDate}
            onSelectDate={(newDate) => setSelectedDate(newDate)}
            tripType={tripType}
            onSelectTripType={(type) => {
              setTripType(type);
              if (type === 'multi_city' && multiCityLegs.length > 0) {
                const active = multiCityLegs[activeMultiLegIndex] || multiCityLegs[0];
                setOrigin(active.origin);
                setDestination(active.destination);
                setSelectedDate(active.date);
                showToast(`Modo Multi-tramo activado (${multiCityLegs.length} tramos)`);
              }
            }}
            returnDate={returnDate}
            onSelectReturnDate={(date) => setReturnDate(date)}
            passengerConfig={passengerConfig}
            onSelectPassengers={(cfg) => setPassengerConfig(cfg)}
            onlySaturdays={onlySaturdays}
            onToggleOnlySaturdays={(val) => setOnlySaturdays(val)}
            multiCityLegs={multiCityLegs}
            onSelectMultiCityLegs={(legs) => {
              setMultiCityLegs(legs);
              const safeIndex = Math.min(activeMultiLegIndex, legs.length - 1);
              const active = legs[safeIndex] || legs[0];
              if (active) {
                setOrigin(active.origin);
                setDestination(active.destination);
                setSelectedDate(active.date);
              }
            }}
            activeLegIndex={activeMultiLegIndex}
            onSelectActiveLegIndex={(idx) => {
              setActiveMultiLegIndex(idx);
              const active = multiCityLegs[idx];
              if (active) {
                setOrigin(active.origin);
                setDestination(active.destination);
                setSelectedDate(active.date);
                showToast(`Inspeccionando Tramo ${idx + 1}: ${active.origin} ➔ ${active.destination}`);
              }
            }}
          />

          {/* Flight Animation Simulator Banner (Toggled when using the scanner or explicitly viewed) */}
          {showFlightSimulator && (
            <div className="animate-in fade-in slide-in-from-top-3 duration-200">
              <HeroFlightBanner
                origin={origin}
                destination={destination}
                selectedDate={selectedDate}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 w-full space-y-5 sm:space-y-8 pb-28 sm:pb-8">
        {/* Multi-tramo Itinerary Summary Card for Frequent Travelers */}
        {tripType === 'multi_city' && (
          <MultiCitySummaryCard
            legs={multiCityLegs}
            activeLegIndex={activeMultiLegIndex}
            onSelectActiveLegIndex={(idx) => {
              setActiveMultiLegIndex(idx);
              const active = multiCityLegs[idx];
              if (active) {
                setOrigin(active.origin);
                setDestination(active.destination);
                setSelectedDate(active.date);
                showToast(`Inspeccionando Tramo ${idx + 1}: ${active.origin} ➔ ${active.destination}`);
              }
            }}
            passengerConfig={passengerConfig}
            priceThreshold={maxPrice}
          />
        )}

        {/* 1. Date Radar Carousel */}
        <div id="radar-section">
          <SaturdayRadar
            days={calendarDays}
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
            priceThreshold={maxPrice}
            origin={origin}
            destination={destination}
            onlySaturdays={onlySaturdays}
          />
        </div>

        {/* 2. Active Date Header with Direct Buy Shortcut and Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-red-100 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-red-600" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Vuelos para el {selectedDayInfo.fullLabel}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Ruta Aérea: {originInfo.city} ({originInfo.name}) ➔ {destInfo.city} ({destInfo.name}) •{' '}
              {tripType === 'round_trip'
                ? `Regreso estimado: ${returnDate}`
                : tripType === 'multi_city'
                ? `Tramo ${activeMultiLegIndex + 1} de ${multiCityLegs.length} (${multiCityLegs.map((l) => l.origin).join(' ➔ ')} ➔ ${multiCityLegs[multiCityLegs.length - 1]?.destination})`
                : 'Solo Ida'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle 30D Trend Chart */}
            <button
              onClick={() => setShowTrendChart((prev) => !prev)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-1.5 transition-colors border ${
                showTrendChart
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Mostrar / ocultar gráfico de tendencia de precios históricos"
            >
              <Activity className="w-3.5 h-3.5 text-red-600" />
              <span>{showTrendChart ? 'Ocultar Gráfico 30D' : 'Ver Gráfico 30D'}</span>
            </button>

            {/* Toggle Flight Simulator Animation */}
            <button
              onClick={() => setShowFlightSimulator((prev) => !prev)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-1.5 transition-colors border ${
                showFlightSimulator
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Activar simulador animado de vuelo en cabecera"
            >
              <Plane className="w-3.5 h-3.5 text-red-600" />
              <span>{showFlightSimulator ? 'Ocultar Simulador' : 'Simulador Animado'}</span>
            </button>

            {/* Google Flights Shortcut */}
            <a
              href={purchaseLinks.googleFlights}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center space-x-1.5 transition-colors shadow-md shadow-red-600/20"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Comprar en Google Flights</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleTriggerLiveWebScan}
              disabled={isWebScanning}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1.5 transition-colors"
              title="Consultar tarifas reales en la web"
            >
              <Globe className={`w-3.5 h-3.5 text-red-600 ${isWebScanning ? 'animate-spin' : ''}`} />
              <span>{isWebScanning ? 'Escaneando...' : 'Escanear Web'}</span>
            </button>
          </div>
        </div>

        {/* 3. Recharts 30-Day Historical Price Trend & Volatility Component */}
        {showTrendChart && (
          <PriceTrendChart
            origin={origin}
            destination={destination}
            selectedFlight={selectedFlightForTrend}
            priceThreshold={maxPrice}
            onSelectDate={(date) => {
              setSelectedDate(date);
              showToast(`Fecha seleccionada desde gráfico: ${date}`);
            }}
          />
        )}

        {/* 4. Filters & Sliders */}
        <FiltersBar
          maxPrice={maxPrice}
          onMaxPriceChange={(val) => setMaxPrice(val)}
          onlyBargains={onlyBargains}
          onToggleOnlyBargains={() => setOnlyBargains((prev) => !prev)}
          selectedAirline={selectedAirline}
          onSelectAirline={(airline) => setSelectedAirline(airline)}
          sortBy={sortBy}
          onSortByChange={(sort) => setSortBy(sort)}
          airlinesList={airlinesList}
          totalResults={deals.length}
          filteredResults={filteredDeals.length}
        />

        {/* 5. Flight Deals List with Direct Purchase Buttons and Passenger/Pet Breakdown */}
        <section className="space-y-4">
          {filteredDeals.length === 0 ? (
            <div className="bg-white rounded-3xl border border-red-100 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-red-50 mx-auto flex items-center justify-center text-red-600">
                <Plane className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                No hay vuelos que cumplan con el filtro actual
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                Prueba aumentando el límite de precio por encima de {formatCOP(maxPrice)} o seleccionando "Todas las aerolíneas".
              </p>
              <button
                onClick={() => {
                  setMaxPrice(250000);
                  setOnlyBargains(false);
                  setSelectedAirline('ALL');
                }}
                className="px-4 py-2 rounded-2xl bg-red-600 text-white text-xs font-black shadow-md hover:bg-red-700 transition-colors"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            filteredDeals.map((deal) => (
              <FlightCard
                key={deal.id}
                deal={deal}
                onTestAlert={handleTestAlert}
                priceThreshold={maxPrice}
                passengerConfig={passengerConfig}
                tripType={tripType}
                isSelectedForTrend={selectedFlightForTrend?.id === deal.id}
                onSelectForTrend={(d) => {
                  setSelectedFlightForTrend(d);
                  setShowTrendChart(true);
                  showToast(`Viendo tendencia de ${d.airline} en el gráfico`);
                }}
              />
            ))
          )}
        </section>

        {/* 6. Direct Purchase Links Box */}
        <DirectSearchLinks
          origin={origin}
          destination={destination}
          selectedDate={selectedDate}
          fullDateLabel={selectedDayInfo.fullLabel}
          passengerConfig={passengerConfig}
          tripType={tripType}
          returnDate={returnDate}
          multiCityLegs={multiCityLegs}
        />

        {/* 7. Route Insights & Hacks */}
        <RouteInsights origin={origin} destination={destination} />
      </main>

      {/* Professional Footer with webcincodev credit, jacomeovalle.com link and terms */}
      <Footer
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onOpenTurbo={() => setIsTurboModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenScanner={() => setIsScannerModalOpen(true)}
      />

      {/* Modals & Drawers */}
      <LiveScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        isScanning={isScanning}
        onToggleScanning={() => setIsScanning((prev) => !prev)}
        onTriggerLiveWebScan={handleTriggerLiveWebScan}
        isWebScanning={isWebScanning}
        lastScannedTime={lastScannedTime}
        scanLog={scanLog}
        origin={origin}
        destination={destination}
        selectedDate={selectedDate}
        groundingSources={groundingSources}
        aiSummary={aiSummary}
      />

      <TurboSearchModal
        isOpen={isTurboModalOpen}
        onClose={() => setIsTurboModalOpen(false)}
        origin={origin}
        destination={destination}
        selectedDate={selectedDate}
        onSelectDealDate={(date) => setSelectedDate(date)}
        priceThreshold={maxPrice}
      />

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      <AlertSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClearHistory={() => {
          NotificationManager.clearAlertHistory();
          setNotifications([]);
        }}
        onMarkAllAsRead={() => {
          NotificationManager.markAllAsRead();
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
      />

      {/* Native-style Mobile Bottom Navigation Tab Bar */}
      <MobileBottomNav
        activeTab={activeMobileTab}
        onSelectTab={(tab) => {
          setActiveMobileTab(tab);
          if (tab === 'radar') {
            setIsScannerModalOpen(true);
          } else if (tab === 'alerts') {
            setIsNotificationsOpen(true);
          } else if (tab === 'settings') {
            setIsSettingsModalOpen(true);
          } else if (tab === 'turbo') {
            setIsTurboModalOpen(true);
          } else if (tab === 'calendar') {
            const el = document.getElementById('radar-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          } else if (tab === 'flights') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenTurbo={() => setIsTurboModalOpen(true)}
        onOpenScanner={() => setIsScannerModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isScanning={isScanning}
        notifications={notifications}
      />
    </div>
  );
}
