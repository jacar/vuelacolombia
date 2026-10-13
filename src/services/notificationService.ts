import { AlertNotificationItem, FlightDeal } from '../types';
import { soundService } from './audioService';
import { formatCOP } from './flightDataService';

const STORAGE_KEY_ALERTS = 'rch_mde_alert_history_v2';

export class NotificationManager {
  /**
   * Request browser notifications permission
   */
  public static async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  public static isPermissionGranted(): boolean {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    return Notification.permission === 'granted';
  }

  /**
   * Trigger notification for a bargain deal
   */
  public static notifyBargain(
    deal: FlightDeal,
    options: { playSound?: boolean; useBrowserNotification?: boolean } = {}
  ): AlertNotificationItem {
    const formattedPrice = formatCOP(deal.priceCOP);
    const route = `${deal.originCode} ➔ ${deal.destinationCode}`;
    const title = `🎯 ¡Ganga ${route}: ${formattedPrice}!`;
    const body = `${deal.airline} (${deal.flightNumber}) para el ${deal.dayOfWeekName} ${deal.date} por ${formattedPrice}. ¡Link de compra directo disponible!`;

    // 1. Play sound chime if enabled
    if (options.playSound !== false) {
      soundService.playDealAlertChime();
    }

    // 2. Dispatch browser native notification if permitted
    if (options.useBrowserNotification !== false && this.isPermissionGranted()) {
      try {
        const notif = new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: `deal-${deal.id}`,
        });
        notif.onclick = () => {
          window.focus();
          window.open(deal.purchaseLinks.googleFlights, '_blank');
        };
      } catch (e) {
        console.warn('Native notification dispatch failed:', e);
      }
    }

    // 3. Save to alerts history
    const alertItem: AlertNotificationItem = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: deal.date,
      route,
      airline: deal.airline,
      priceCOP: deal.priceCOP,
      flightNumber: deal.flightNumber,
      message: `Tarifa real de ${formattedPrice} encontrada en ${deal.airline}`,
      read: false,
      type: 'bargain_detected',
      purchaseUrl: deal.purchaseLinks.googleFlights,
    };

    this.saveAlertToHistory(alertItem);
    return alertItem;
  }

  public static getAlertHistory(): AlertNotificationItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ALERTS);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public static saveAlertToHistory(item: AlertNotificationItem) {
    try {
      const history = this.getAlertHistory();
      const updated = [item, ...history.slice(0, 49)];
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed saving alert history:', e);
    }
  }

  public static clearAlertHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY_ALERTS);
    } catch (e) {
      console.warn('Failed clearing history:', e);
    }
  }

  public static markAllAsRead() {
    try {
      const history = this.getAlertHistory();
      const updated = history.map((item) => ({ ...item, read: true }));
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed marking read:', e);
    }
  }
}
