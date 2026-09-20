import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  trackPageView,
  trackViewContent,
  trackSearch,
  trackAddToCart,
  trackViewCart,
  trackInitiateCheckout,
  trackAddPaymentInfo,
  trackPurchase,
} from '../lib/analytics';

export interface AnalyticsEvent {
  name: string;
  payload?: Record<string, any>;
  timestamp: string;
}

interface AnalyticsContextType {
  trackEvent: (eventName: string, payload?: Record<string, any>) => void;
  eventsLog: AnalyticsEvent[];
  trackPageView: typeof trackPageView;
  trackViewContent: typeof trackViewContent;
  trackSearch: typeof trackSearch;
  trackAddToCart: typeof trackAddToCart;
  trackViewCart: typeof trackViewCart;
  trackInitiateCheckout: typeof trackInitiateCheckout;
  trackAddPaymentInfo: typeof trackAddPaymentInfo;
  trackPurchase: typeof trackPurchase;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [eventsLog, setEventsLog] = useState<AnalyticsEvent[]>([]);

  const trackEvent = useCallback((eventName: string, payload?: Record<string, any>) => {
    const newEvent: AnalyticsEvent = {
      name: eventName,
      payload,
      timestamp: new Date().toLocaleTimeString('ar-EG'),
    };
    // Safe non-sensitive event log for development
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[UltraOneFit Analytics] 🎯 ${eventName}`, {
        ...(payload?.orderRef ? { orderRef: payload.orderRef } : {}),
        ...(payload?.productId ? { productId: payload.productId } : {}),
        ...(payload?.target ? { target: payload.target } : {}),
      });
    }
    setEventsLog((prev) => [newEvent, ...prev].slice(0, 50));
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        trackEvent,
        eventsLog,
        trackPageView,
        trackViewContent,
        trackSearch,
        trackAddToCart,
        trackViewCart,
        trackInitiateCheckout,
        trackAddPaymentInfo,
        trackPurchase,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};

