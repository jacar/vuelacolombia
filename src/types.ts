export interface AirportInfo {
  code: string;
  name: string;
  city: string;
  department: string;
}

export type TripType = 'one_way' | 'round_trip' | 'multi_city';

export interface MultiCityLeg {
  id: string;
  origin: string;
  destination: string;
  date: string;
}

export interface MultiCityPreset {
  id: string;
  name: string;
  routeStr: string;
  origin: string;
  destinations: string[];
  daysInterval: number[];
  badge: string;
}

export interface PassengerConfig {
  adults: number; // 12+ years
  children: number; // 2-11 years
  infants: number; // under 2 years on lap
  pets: number; // pet in cabin (perro o gato en guacal bajo asiento)
}

export interface PassengerPricingBreakdown {
  basePerAdult: number;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  petsCount: number;
  adultsSubtotal: number;
  childrenSubtotal: number;
  infantsSubtotal: number;
  petsSubtotal: number;
  petFeePerUnit: number;
  tripMultiplier: number; // 1 = solo ida, 2 = ida y vuelta
  grandTotal: number;
}

export interface PurchaseLinks {
  googleFlights: string;
  skyscanner: string;
  airlineDirect: string;
  kayak: string;
  despegar: string;
}

export interface FlightDeal {
  id: string;
  airline: 'Avianca' | 'LATAM' | 'Wingo' | 'Clic Air' | 'Satena';
  flightNumber: string;
  airlineCode: string;
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
  stops: number;
  stopAirport?: string;
  stopDuration?: string;
  priceCOP: number;
  originalPriceCOP?: number;
  date: string; // YYYY-MM-DD
  dayOfWeekName: string; // "Lunes", "Martes", "Sábado", etc.
  formattedDate: string; // "Sábado 17 de Octubre, 2026"
  baggageIncluded: string;
  fareClass: string;
  purchaseLinks: PurchaseLinks;
  seatsRemaining?: number;
  isBargain: boolean; // priceCOP <= priceThreshold
  priceTrend: 'bajando' | 'estable' | 'subiendo';
  provider: string;
  isRealLiveVerified?: boolean;
}

export interface DayFareInfo {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Sáb 17 Oct"
  fullLabel: string; // "Sábado 17 de Octubre, 2026"
  dayOfWeek: string; // "Sábado", "Domingo", etc.
  isSaturday: boolean;
  lowestPrice: number;
  hasBargain: boolean; // lowestPrice <= threshold
  flightCount: number;
  bargainCount: number;
}

export interface PriceHistoryPoint {
  date: string;
  dayLabel: string;
  dayOfWeek: string;
  priceCOP: number;
  isSaturday: boolean;
  airline: string;
  isBargain: boolean;
  thresholdCOP: number;
}

export interface PriceAlertSettings {
  maxPriceThreshold: number; // default 200000
  soundEnabled: boolean;
  browserNotificationsEnabled: boolean;
  email: string;
  phoneWhatsapp: string;
  autoScanIntervalSeconds: number; // default 15s
  onlySaturdays: boolean;
  alwaysOnScanning: boolean;
  origin: string; // default "BOG"
  destination: string; // default "MDE"
}

export interface AlertNotificationItem {
  id: string;
  timestamp: string;
  date: string;
  route: string;
  airline: string;
  priceCOP: number;
  flightNumber: string;
  message: string;
  read: boolean;
  type: 'bargain_detected' | 'price_drop' | 'scan_complete';
  purchaseUrl: string;
}
