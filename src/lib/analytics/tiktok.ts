/**
 * Ultra One Fit — Centralized TikTok Pixel Tracking Layer
 * TikTok Pixel ID: DAO3FI3C77U88MSNTTP0
 * 
 * Implements non-blocking, safe client-side tracking with:
 * - Zero PII logging (no phone, address, or payment details logged)
 * - Anti-duplicate mechanism for Purchase and PageView
 * - Full EGP currency standardization
 * - Resilient error handling so user experience is never blocked
 */

export const TIKTOK_PIXEL_ID = 'DAO3FI3C77U88MSNTTP0';
export const CURRENCY = 'EGP';

export interface TikTokContentItem {
  content_id: string;
  content_name: string;
  quantity: number;
  price: number;
  content_type?: string;
  content_category?: string;
}

// Global TypeScript declaration for TikTok Pixel SDK
declare global {
  interface Window {
    ttq?: {
      page: () => void;
      track: (
        eventName: string,
        params?: Record<string, any>,
        options?: Record<string, any>
      ) => void;
      identify: (params?: Record<string, any>) => void;
      [key: string]: any;
    };
    TiktokAnalyticsObject?: string;
  }
}

// In-memory cache to prevent duplicate events during React re-renders
let lastTrackedRoute = 'home';
let lastTrackedViewContentId = '';
const inMemoryTrackedOrders = new Set<string>();
const PURCHASE_STORAGE_KEY = 'uof_ttq_tracked_orders_v1';

/**
 * Safe development debugger that logs purely non-sensitive tracking telemetry.
 * Strictly avoids logging phone, address, payment, or customer identity.
 */
function logDebug(
  eventName: string,
  data?: {
    order_id?: string;
    content_id?: string;
    content_ids?: string[];
    value?: number;
    quantity?: number;
    currency?: string;
    route?: string;
  }
) {
  if (typeof window !== 'undefined') {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(`[TikTok Pixel Debug] 🎯 Event: ${eventName}`, {
        ...(data?.route ? { route: data.route } : {}),
        ...(data?.order_id ? { order_id: data.order_id } : {}),
        ...(data?.content_id ? { content_id: data.content_id } : {}),
        ...(data?.content_ids ? { content_ids: data.content_ids } : {}),
        ...(data?.quantity !== undefined ? { quantity: data.quantity } : {}),
        ...(data?.value !== undefined ? { value: data.value } : {}),
        currency: data?.currency || CURRENCY,
      });
    }
  }
}

/**
 * Check whether an Order ID has already been tracked to prevent duplicate Purchase events
 * on browser refreshes, back-navigation, or re-renders.
 */
function hasOrderBeenTracked(orderId: string): boolean {
  if (!orderId) return false;
  if (inMemoryTrackedOrders.has(orderId)) return true;

  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const stored = window.sessionStorage.getItem(PURCHASE_STORAGE_KEY);
      if (stored) {
        const list: string[] = JSON.parse(stored);
        if (Array.isArray(list) && list.includes(orderId)) {
          return true;
        }
      }
    }
  } catch {
    // Ignore storage read errors
  }
  return false;
}

/**
 * Register an Order ID as tracked in both in-memory Set and sessionStorage.
 */
function markOrderAsTracked(orderId: string): void {
  if (!orderId) return;
  inMemoryTrackedOrders.add(orderId);

  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const stored = window.sessionStorage.getItem(PURCHASE_STORAGE_KEY);
      const list: string[] = stored ? JSON.parse(stored) : [];
      if (!list.includes(orderId)) {
        list.push(orderId);
        window.sessionStorage.setItem(PURCHASE_STORAGE_KEY, JSON.stringify(list));
      }
    }
  } catch {
    // Ignore storage write errors
  }
}

/**
 * Executes a TikTok Pixel call in a completely safe, non-blocking try-catch block.
 */
function executeTtq(
  action: (ttq: NonNullable<Window['ttq']>) => void
): void {
  try {
    if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.track === 'function') {
      action(window.ttq);
    }
  } catch (err) {
    // Fail silently in production so user operations are never blocked
    // eslint-disable-next-line no-console
    console.warn('[TikTok Pixel] Execution notice:', err);
  }
}

// ---------------------------------------------------------------------------
// Central Tracking API Functions
// ---------------------------------------------------------------------------

/**
 * 01. PageView Event
 * Handles SPA route changes and prevents duplicates on React StrictMode or re-renders.
 */
export function trackPageView(routeIdentifier: string = 'home'): void {
  // Prevent duplicate execution for the same route
  if (routeIdentifier === lastTrackedRoute) {
    return;
  }
  lastTrackedRoute = routeIdentifier;

  // If navigating away from a product or look, reset viewContent cache
  if (!routeIdentifier.startsWith('product:') && !routeIdentifier.startsWith('look:')) {
    lastTrackedViewContentId = '';
  }

  logDebug('PageView', { route: routeIdentifier });

  executeTtq((ttq) => {
    ttq.page();
  });
}

/**
 * 02. ViewContent Event
 * Triggered when a user views a specific product or outfit detail page.
 */
export interface ViewContentParams {
  id: string;
  name: string;
  price: number;
  type?: string;
  category?: string;
  contents?: TikTokContentItem[];
}

export function trackViewContent(params: ViewContentParams): void {
  if (params.id === lastTrackedViewContentId) {
    return;
  }
  lastTrackedViewContentId = params.id;

  const value = Number(params.price) || 0;

  logDebug('ViewContent', {
    content_id: params.id,
    value,
  });

  executeTtq((ttq) => {
    ttq.track('ViewContent', {
      content_id: params.id,
      content_name: params.name,
      content_type: 'product',
      value,
      currency: CURRENCY,
      ...(params.contents && params.contents.length > 0 ? { contents: params.contents } : {}),
    });
  });
}

/**
 * 03. Search Event
 * Triggered when an active search query is executed.
 */
export function trackSearch(query: string): void {
  if (!query || !query.trim()) return;
  const cleanQuery = query.trim();

  logDebug('Search', { route: cleanQuery });

  executeTtq((ttq) => {
    ttq.track('Search', {
      query: cleanQuery,
      search_string: cleanQuery,
    });
  });
}

/**
 * 04. AddToCart Event
 * Triggered ONLY after an item is successfully added to the cart.
 */
export interface AddToCartParams {
  productId: string;
  productName: string;
  price: number;
  quantity?: number;
  category?: string;
}

export function trackAddToCart(params: AddToCartParams): void {
  const quantity = params.quantity && params.quantity > 0 ? params.quantity : 1;
  const unitPrice = Number(params.price) || 0;
  const value = unitPrice * quantity;

  logDebug('AddToCart', {
    content_id: params.productId,
    quantity,
    value,
  });

  executeTtq((ttq) => {
    ttq.track('AddToCart', {
      content_id: params.productId,
      content_name: params.productName,
      content_type: 'product',
      quantity,
      value,
      currency: CURRENCY,
    });
  });
}

/**
 * 05. ViewCart Event
 * Triggered when the cart drawer or cart view is opened by the user.
 */
export interface ViewCartParams {
  contents: TikTokContentItem[];
  value: number;
}

export function trackViewCart(params: ViewCartParams): void {
  const value = Number(params.value) || 0;
  const contentIds = params.contents.map((item) => item.content_id);

  logDebug('ViewCart', {
    content_ids: contentIds,
    value,
  });

  executeTtq((ttq) => {
    ttq.track('ViewCart', {
      contents: params.contents,
      content_type: 'product',
      value,
      currency: CURRENCY,
    });
  });
}

/**
 * 06. InitiateCheckout Event
 * Triggered when the user actively opens the checkout form to place an order.
 */
export interface InitiateCheckoutParams {
  contents: TikTokContentItem[];
  value: number;
}

export function trackInitiateCheckout(params: InitiateCheckoutParams): void {
  const value = Number(params.value) || 0;
  const contentIds = params.contents.map((item) => item.content_id);

  logDebug('InitiateCheckout', {
    content_ids: contentIds,
    value,
  });

  executeTtq((ttq) => {
    ttq.track('InitiateCheckout', {
      contents: params.contents,
      content_type: 'product',
      value,
      currency: CURRENCY,
    });
  });
}

/**
 * 07. AddPaymentInfo Event
 * Available if a real payment credential step is completed.
 */
export interface AddPaymentInfoParams {
  contents: TikTokContentItem[];
  value: number;
}

export function trackAddPaymentInfo(params: AddPaymentInfoParams): void {
  const value = Number(params.value) || 0;
  const contentIds = params.contents.map((item) => item.content_id);

  logDebug('AddPaymentInfo', {
    content_ids: contentIds,
    value,
  });

  executeTtq((ttq) => {
    ttq.track('AddPaymentInfo', {
      contents: params.contents,
      content_type: 'product',
      value,
      currency: CURRENCY,
    });
  });
}

/**
 * 08. Purchase Event
 * The most critical conversion event.
 * Strictly triggered ONLY after the order is confirmed successfully.
 * Enforces deduplication using orderId/event_id to prevent re-firing on page refreshes or re-renders.
 */
export interface PurchaseParams {
  orderId: string;
  value: number;
  contents: TikTokContentItem[];
  content_ids?: string[];
}

export function trackPurchase(params: PurchaseParams): void {
  if (!params.orderId) {
    // eslint-disable-next-line no-console
    console.warn('[TikTok Pixel] Purchase event skipped: orderId is missing.');
    return;
  }

  // Deduplication check: prevent recording the same order twice
  if (hasOrderBeenTracked(params.orderId)) {
    // eslint-disable-next-line no-console
    console.warn(`[TikTok Pixel] Purchase event deduplicated for order: ${params.orderId}`);
    return;
  }

  // Mark as tracked immediately
  markOrderAsTracked(params.orderId);

  const value = Number(params.value) || 0;
  const contentIds =
    params.content_ids && params.content_ids.length > 0
      ? params.content_ids
      : params.contents.map((c) => c.content_id);

  logDebug('Purchase', {
    order_id: params.orderId,
    content_ids: contentIds,
    value,
  });

  executeTtq((ttq) => {
    const payload = {
      event_id: params.orderId,
      order_id: params.orderId,
      content_type: 'product',
      content_ids: contentIds,
      contents: params.contents,
      value,
      currency: CURRENCY,
    };

    // Pass event_id in both payload and options for maximum TikTok server/browser deduplication
    ttq.track('Purchase', payload, { event_id: params.orderId });
  });
}
