import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Truck, ShieldCheck, ArrowLeft, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import {
  generateOrderId,
  normalizeCartItemToProductSnapshot,
  submitOrderToGoogleSheets,
  OrderSnapshot,
} from '../services/googleSheetsOrderService';
import { trackInitiateCheckout, trackPurchase } from '../lib/analytics';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted?: (orderData: any) => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted,
}) => {
  const { cart, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [governorate, setGovernorate] = useState<'Cairo' | 'Giza'>('Cairo');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderCompletedRef, setOrderCompletedRef] = useState<string | null>(null);

  const hasTrackedCheckoutRef = useRef(false);

  useEffect(() => {
    if (isOpen && cart.length > 0 && !hasTrackedCheckoutRef.current) {
      trackInitiateCheckout({
        contents: cart.map((item) => ({
          content_id: item.productId,
          content_name: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
        value: subtotal,
      });
      hasTrackedCheckoutRef.current = true;
    }
    if (!isOpen) {
      hasTrackedCheckoutRef.current = false;
    }
  }, [isOpen, cart, subtotal]);

  if (!isOpen) return null;

  const shippingFee = 80;
  const finalTotal = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) return;
    if (cart.length === 0) return;

    // Prevent duplicate or parallel submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Generate unique Order ID for this submission attempt
    const generatedRef = generateOrderId();

    // Map each cart item preserving all variant, color, size, price, and quantity details
    const products = cart.map((item) => normalizeCartItemToProductSnapshot(item));

    // Create concise summary of ordered items
    const itemsSummary = products
      .map((p) => `${p.productName} (${p.color} - ${p.size}) × ${p.quantity}`)
      .join(' | ');

    const uniqueBundles = new Set(
      cart.filter((i) => i.bundleId || i.isLookPiece).map((i) => i.bundleId || i.outfitName)
    );
    const bundleSavings = uniqueBundles.size * 150;

    // Create complete immutable order snapshot (Cash on Delivery exclusively)
    const clearanceNote = bundleSavings > 0 ? `[عرض Summer Clearance - توفير ${bundleSavings} ج.م] ` : '';
    const orderSnapshot: OrderSnapshot = {
      orderId: generatedRef,
      name: customerName.trim(),
      phone: customerPhone.trim(),
      governorate: governorate === 'Cairo' ? 'القاهرة (Cairo)' : 'الجيزة (Giza)',
      address: customerAddress.trim(),
      paymentMethod: 'Cash on Delivery',
      depositAmount: 0,
      deliveryTime: '3-4 Business Days',
      products,
      itemCount: products.reduce((acc, p) => acc + p.quantity, 0),
      itemsSummary,
      subtotal,
      shipping: shippingFee,
      total: finalTotal,
      notes: `${clearanceNote}${customerNotes.trim()}`.trim(),
      orderDate: new Date().toLocaleString('ar-EG'),
      timestamp: new Date().toISOString(),
    };

    try {
      // Send order snapshot to Google Apps Script via hidden iframe & form POST
      // and wait for window.postMessage with success === true
      const response = await submitOrderToGoogleSheets(orderSnapshot);

      if (response && response.success === true) {
        setOrderCompletedRef(generatedRef);
        setIsSubmitting(false);

        // Track TikTok Purchase Event
        trackPurchase({
          orderId: generatedRef,
          value: finalTotal,
          content_ids: cart.map((item) => item.productId),
          contents: cart.map((item) => ({
            content_id: item.productId,
            content_name: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        if (onOrderCompleted) {
          onOrderCompleted({
            orderRef: generatedRef,
            items: cart,
            total: finalTotal,
            customerName,
            paymentMethod: 'cod',
            orderSnapshot,
          });
        }

        // Only clear cart after successful order confirmation
        clearCart();
      } else {
        throw new Error(response?.message || 'حدث خطأ في الاتصال. يرجى إعادة المحاولة.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      // Keep customer on checkout, do not clear cart, preserve all inputs, show friendly error
      setSubmitError(
        err?.message ||
          'حدث خطأ غير متوقع أو مشكلة في الاتصال بالإنترنت. بياناتك وسلتك محفوظة، يرجى إعادة المحاولة.'
      );
    }
  };

  const handleClose = () => {
    setOrderCompletedRef(null);
    setSubmitError(null);
    onClose();
  };

  return (
    <div
      id="cart-checkout-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#1C1C1C]/85 backdrop-blur-md"
      onClick={handleClose}
    >
      <div
        className="bg-[#FFFFFF] text-[#1C1C1C] w-full max-w-[640px] max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl border border-[#C8C8C6] shadow-2xl flex flex-col text-right relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="shrink-0 p-4 sm:p-5 bg-[#1C1C1C] text-[#FFFFFF] border-b border-[#C8C8C6]/20 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#C8C8C6]/30 flex items-center justify-center text-[#EAEAEA] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition-colors focus:outline-none"
            aria-label="إغلاق النافذة"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex flex-col text-right">
            <span className="text-[10px] font-mono text-[#AFAFAD] uppercase tracking-wider">
              ULTRA ONE FIT • CHECKOUT
            </span>
            <span className="font-extrabold text-base sm:text-lg md:text-xl text-[#FFFFFF]">
              إتمام طلب السلة
            </span>
          </div>
        </div>

        {orderCompletedRef ? (
          /* SUCCESS CONFIRMATION SCREEN */
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in fade-in duration-300 flex-1 overflow-y-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1C1C1C] text-[#FFFFFF] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-[#AFAFAD] uppercase tracking-wider block mb-1">
                رقم الطلب: {orderCompletedRef}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#1C1C1C]">
                تم تأكيد طلبك بنجاح!
              </h3>
              <p className="text-xs text-[#1C1C1C]/75 max-w-[360px] mx-auto mt-2 leading-relaxed">
                شكراً لاختيارك Ultra One Fit يا {customerName}. هنتواصل معاك على الرقم ({customerPhone}) لتأكيد موعد التوصيل.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1C1C1C]/[0.03] border border-[#C8C8C6] text-right text-xs space-y-2 max-w-[420px] mx-auto">
              <div className="flex justify-between">
                <span className="text-[#AFAFAD]">إجمالي الحساب شامل الشحن:</span>
                <span className="font-mono font-bold text-[#1C1C1C]">{finalTotal} جنيه</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#AFAFAD]">المحافظة:</span>
                <span className="font-bold text-[#1C1C1C]">
                  {governorate === 'Cairo' ? 'القاهرة (Cairo)' : 'الجيزة (Giza)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#AFAFAD]">طريقة الدفع:</span>
                <span className="font-bold text-[#1C1C1C]">الدفع عند الاستلام (COD)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#AFAFAD]">مدة التوصيل:</span>
                <span className="font-bold text-[#1C1C1C]">3–4 أيام عمل</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="h-10 sm:h-11 px-8 rounded-xl bg-[#1C1C1C] text-[#FFFFFF] font-bold text-xs hover:bg-[#2A2A2A] transition-colors"
            >
              متابعة التصفح
            </button>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
              {/* Order Items Preview */}
              <div className="p-4 rounded-2xl bg-[#1C1C1C]/[0.02] border border-[#C8C8C6]/70 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#1C1C1C] border-b border-[#C8C8C6]/40 pb-2">
                  <span>القطع المطلوبة ({cart.length})</span>
                  <span className="font-mono">{subtotal} جنيه</span>
                </div>

                <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono font-bold text-[#1C1C1C]">{item.quantity}x</span>
                        <span className="text-[#1C1C1C] font-semibold truncate">{item.productName}</span>
                        <span className="text-[11px] text-[#AFAFAD]">
                          ({item.selectedColor} • {item.selectedSize})
                        </span>
                      </div>
                      <span className="font-mono font-bold text-[#1C1C1C] shrink-0">
                        {item.price * item.quantity} ج.م
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#C8C8C6]/40 space-y-1.5 text-xs">
                  {(() => {
                    const uniqueBundles = new Set(
                      cart.filter((i) => i.bundleId || i.isLookPiece).map((i) => i.bundleId || i.outfitName)
                    );
                    const bundleSavings = uniqueBundles.size * 150;
                    if (bundleSavings === 0) return null;
                    return (
                      <>
                        <div className="flex items-center justify-between text-[#777777]">
                          <span>إجمالي القطع منفصلة:</span>
                          <span className="font-mono line-through">{subtotal + bundleSavings} جنيه</span>
                        </div>
                        <div className="flex items-center justify-between text-[#1C1C1C] font-bold">
                          <span className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-[#1C1C1C] text-[#FFFFFF] text-[9px] font-mono">
                              CLEARANCE
                            </span>
                            <span>خصم الـLooks:</span>
                          </span>
                          <span className="font-mono text-emerald-700">-{bundleSavings} جنيه</span>
                        </div>
                      </>
                    );
                  })()}

                  <div className="flex items-center justify-between text-[#AFAFAD]">
                    <span>شحن القاهرة والجيزة (3-4 أيام):</span>
                    <span className="font-mono font-bold text-[#1C1C1C]">{shippingFee} جنيه</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm font-black text-[#1C1C1C] pt-1 border-t border-[#C8C8C6]/40">
                  <span>الإجمالي النهائي للدفع:</span>
                  <span className="font-mono text-base">{finalTotal} جنيه</span>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#1C1C1C] mb-1">
                    الاسم الكامل <span className="text-[#AFAFAD]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: يوسف أحمد"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#C8C8C6] focus:border-[#1C1C1C] focus:outline-none bg-[#FFFFFF] text-xs font-semibold text-[#1C1C1C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1C1C] mb-1">
                    رقم الهاتف (للتواصل والتأكيد عبر واتساب) <span className="text-[#AFAFAD]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#C8C8C6] focus:border-[#1C1C1C] focus:outline-none bg-[#FFFFFF] text-xs font-mono font-semibold text-[#1C1C1C]"
                    dir="ltr"
                  />
                </div>

                {/* Cairo / Giza Selection */}
                <div>
                  <label className="block font-bold text-[#1C1C1C] mb-1">
                    المحافظة <span className="text-[#AFAFAD]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGovernorate('Cairo')}
                      className={`h-10 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        governorate === 'Cairo'
                          ? 'border-[#1C1C1C] bg-[#1C1C1C] text-[#FFFFFF]'
                          : 'border-[#C8C8C6] bg-[#FFFFFF] text-[#1C1C1C] hover:border-[#1C1C1C]/40'
                      }`}
                    >
                      <span>القاهرة</span>
                      <span className="text-[10px] opacity-75 font-mono">(Cairo)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGovernorate('Giza')}
                      className={`h-10 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        governorate === 'Giza'
                          ? 'border-[#1C1C1C] bg-[#1C1C1C] text-[#FFFFFF]'
                          : 'border-[#C8C8C6] bg-[#FFFFFF] text-[#1C1C1C] hover:border-[#1C1C1C]/40'
                      }`}
                    >
                      <span>الجيزة</span>
                      <span className="text-[10px] opacity-75 font-mono">(Giza)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1C1C1C] mb-1">
                    عنوان التوصيل بالتفصيل (المنطقة، اسم الشارع، رقم العمارة، الشقة) <span className="text-[#AFAFAD]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="المنطقة، اسم الشارع، رقم العمارة، رقم الشقة"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#C8C8C6] focus:border-[#1C1C1C] focus:outline-none bg-[#FFFFFF] text-xs font-semibold text-[#1C1C1C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1C1C] mb-1">
                    ملاحظات إضافية (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="أي تفاصيل تخص الاستلام أو الموعد المفضل..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#C8C8C6] focus:border-[#1C1C1C] focus:outline-none bg-[#FFFFFF] text-xs font-semibold text-[#1C1C1C] resize-none"
                  />
                </div>

                {/* Payment Method Display (Cash on Delivery exclusively) */}
                <div>
                  <label className="block font-bold text-[#1C1C1C] mb-2">طريقة الدفع</label>
                  <div className="p-3.5 rounded-xl border border-[#1C1C1C] bg-[#1C1C1C]/[0.03] text-right flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full border border-[#1C1C1C] bg-[#1C1C1C] mt-0.5 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                    </div>
                    <div>
                      <div className="font-black text-xs sm:text-sm text-[#1C1C1C] flex items-center gap-2">
                        <span>الدفع عند الاستلام (Cash on Delivery)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1C1C1C] text-[#FFFFFF] font-bold">
                          المعتمد
                        </span>
                      </div>
                      <div className="text-[11px] text-[#555555] mt-0.5 leading-relaxed">
                        عاين طلبك واستلمه الأول، وادفع كاش للمندوب بعد التأكد من المقاسات وجودة القطع.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer: Submit CTA */}
            <div className="shrink-0 p-3.5 sm:p-4 border-t border-[#C8C8C6]/50 bg-[#FFFFFF] shadow-lg space-y-2.5">
              {submitError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-right space-y-1 animate-in fade-in duration-200">
                  <div className="font-bold flex items-center gap-1.5 justify-end">
                    <span>{submitError}</span>
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  </div>
                  <div className="text-[11px] text-red-600/80">
                    بياناتك وسلتك محفوظة بالكامل، اضغط على زر تأكيد الطلب للمحاولة مرة أخرى.
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 sm:h-12 rounded-xl bg-[#1C1C1C] text-[#FFFFFF] font-black text-xs sm:text-sm hover:bg-[#2A2A2A] transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75"
                id="submit-cart-order-btn"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#FFFFFF]" />
                    <span>جاري تنفيذ الطلب...</span>
                  </span>
                ) : (
                  <>
                    <span>تأكيد الطلب الآن</span>
                    <ArrowLeft className="w-4 h-4 text-[#FFFFFF]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
