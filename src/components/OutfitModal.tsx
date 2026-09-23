import React, { useState, useEffect, useRef } from 'react';
import { Outfit } from '../types';
import { X, Check, ArrowRight, ArrowLeft, ShieldCheck, Truck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import {
  generateOrderId,
  submitOrderToGoogleSheets,
  OrderSnapshot,
  OrderProductSnapshot,
} from '../services/googleSheetsOrderService';
import { trackInitiateCheckout, trackPurchase } from '../lib/analytics';

interface OutfitModalProps {
  outfit: Outfit | null;
  onClose: () => void;
  onOrderCompleted: (orderData: any) => void;
}

export const OutfitModal: React.FC<OutfitModalProps> = ({
  outfit,
  onClose,
  onOrderCompleted,
}) => {
  if (!outfit) return null;

  const [step, setStep] = useState<'sizes' | 'shipping' | 'success'>('sizes');
  const [selectedSizes, setSelectedSizes] = useState<{ [category: string]: string }>({
    tshirt: outfit.pieces.find((p) => p.category === 'tshirt')?.sizes[1] || 'L',
    jeans: outfit.pieces.find((p) => p.category === 'jeans')?.sizes[1] || '32',
    shoes: outfit.pieces.find((p) => p.category === 'shoes')?.sizes[2] || '43',
  });

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [governorate, setGovernorate] = useState<'Cairo' | 'Giza'>('Cairo');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderRef, setOrderRef] = useState('');

  const hasTrackedCheckoutRef = useRef(false);

  useEffect(() => {
    if (outfit && !hasTrackedCheckoutRef.current) {
      trackInitiateCheckout({
        contents: outfit.pieces.map((p) => ({
          content_id: p.catalogProductId || p.id,
          content_name: p.name,
          quantity: 1,
          price: p.price,
        })),
        value: outfit.totalPrice,
      });
      hasTrackedCheckoutRef.current = true;
    }
  }, [outfit]);

  const shippingFee = 80; // Cairo/Giza shipping 80 EGP fixed
  const finalTotal = outfit.totalPrice + shippingFee;

  const handleSizeSelect = (category: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [category]: size }));
  };

  const handleProceedToShipping = () => {
    setStep('shipping');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const generatedRef = generateOrderId();

    // Map the 3 pieces of the outfit preserving all selected sizes, categories, and prices
    const products: OrderProductSnapshot[] = outfit.pieces.map((piece) => ({
      productId: piece.catalogProductId || piece.id,
      productName: `${outfit.name} - ${piece.name}`,
      category: piece.category,
      color: piece.colorName || 'Default',
      size: selectedSizes[piece.category] || 'Standard',
      quantity: 1,
      unitPrice: piece.price,
      lineTotal: piece.price,
      outfitName: outfit.name,
      warranty: piece.warranty,
      colorHex: piece.colorHex,
    }));

    const itemsSummary = products
      .map((p) => `${p.productName} (${p.color} - مقاس ${p.size})`)
      .join(' | ');

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
      itemCount: products.length,
      itemsSummary,
      subtotal: outfit.totalPrice,
      shipping: shippingFee,
      total: finalTotal,
      notes: `[عرض Summer Clearance - توفير 150 ج.م على الـLook] ${customerNotes.trim()}`.trim(),
      orderDate: new Date().toLocaleString('ar-EG'),
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await submitOrderToGoogleSheets(orderSnapshot);
      if (response && response.success === true) {
        setOrderRef(generatedRef);
        setIsSubmitting(false);
        setStep('success');

        // Track TikTok Purchase Event
        trackPurchase({
          orderId: generatedRef,
          value: finalTotal,
          content_ids: outfit.pieces.map((p) => p.catalogProductId || p.id),
          contents: outfit.pieces.map((p) => ({
            content_id: p.catalogProductId || p.id,
            content_name: p.name,
            quantity: 1,
            price: p.price,
          })),
        });

        onOrderCompleted({
          orderRef: generatedRef,
          outfitName: outfit.name,
          total: finalTotal,
          customerName,
          paymentMethod: 'cod',
          orderSnapshot,
        });
      } else {
        throw new Error(response?.message || 'حدث خطأ في الاتصال. يرجى إعادة المحاولة.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(
        err?.message ||
          'حدث خطأ غير متوقع أو مشكلة في الاتصال بالإنترنت. بياناتك محفوظة، يرجى إعادة المحاولة.'
      );
    }
  };

  return (
    <div
      id="outfit-order-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#1C1C1C]/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] text-[#1C1C1C] w-full max-w-[640px] max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl border border-[#C8C8C6] shadow-2xl flex flex-col text-right relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="shrink-0 p-4 sm:p-5 bg-[#1C1C1C] text-[#FFFFFF] border-b border-[#C8C8C6]/20 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#C8C8C6]/30 flex items-center justify-center text-[#EAEAEA] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition-colors focus:outline-none"
            aria-label="إغلاق النافذة"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex flex-col text-right">
            <span className="text-[10px] font-mono text-[#AFAFAD] uppercase tracking-wider">
              {outfit.number} • 3 PIECES COMPLETE OUTFIT
            </span>
            <span className="font-extrabold text-base sm:text-lg md:text-xl text-[#FFFFFF] leading-snug">
              {outfit.name} ({outfit.occasionTag})
            </span>
          </div>
        </div>

        {/* STEP 1: SIZES SELECTION */}
        {step === 'sizes' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 overscroll-contain">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#1C1C1C] mb-1">
                  حدد مقاسات الـ3 قطع
                </h3>
                <p className="text-xs text-[#1C1C1C]/70">
                  الـOutfit بيوصلك كامل ومنسق، اختار مقاس كل قطعة بناءً على جدول المقاسات:
                </p>
              </div>

              {/* Pieces Size Pickers */}
              <div className="space-y-4">
                {outfit.pieces.map((piece) => {
                  const selected = selectedSizes[piece.category];
                  return (
                    <div
                      key={piece.id}
                      className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#C8C8C6] bg-[#1C1C1C]/[0.02]"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-[#C8C8C6] shrink-0"
                            style={{ backgroundColor: piece.colorHex }}
                          />
                          <span className="font-bold text-xs sm:text-sm text-[#1C1C1C]">
                            {piece.name}
                          </span>
                          <span className="text-[11px] text-[#AFAFAD]">
                            ({piece.colorName})
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#1C1C1C]">
                          {piece.price} ج.م
                        </span>
                      </div>

                      {/* Size Buttons */}
                      <div>
                        <span className="text-[11px] font-semibold text-[#AFAFAD] block mb-1.5">
                          اختر المقاس:
                        </span>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {piece.sizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSizeSelect(piece.category, size)}
                              className={`min-w-[42px] px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-bold font-mono transition-all focus:outline-none ${
                                selected === size
                                  ? 'bg-[#1C1C1C] text-[#FFFFFF] shadow-sm'
                                  : 'bg-[#FFFFFF] border border-[#C8C8C6] text-[#1C1C1C] hover:bg-[#1C1C1C]/5'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total recap and proceed button (Fixed Footer) */}
            <div className="shrink-0 p-3.5 sm:p-4 border-t border-[#C8C8C6]/50 bg-[#FFFFFF] shadow-lg">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className="text-[11px] text-[#777777] line-through font-mono">
                      {outfit.separatePrice.toLocaleString('ar-EG')} جنيه
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      وفّر 150 جنيه
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#1C1C1C] block">
                    سعر الـOutfit كامل (3 قطع)
                  </span>
                </div>
                <div className="flex items-baseline gap-1 font-mono text-[#1C1C1C]">
                  <span className="text-2xl sm:text-3xl font-black">
                    {outfit.totalPrice.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-xs font-bold text-[#555555]">
                    جنيه
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToShipping}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1C1C1C] text-[#FFFFFF] font-bold text-xs sm:text-sm hover:bg-[#2E2E2E] transition-all shadow-md flex items-center justify-center gap-2 focus:outline-none active:translate-y-0 cursor-pointer"
              >
                <span>متابعة بيانات التوصيل (القاهرة)</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* STEP 2: SHIPPING & PAYMENT */}
        {step === 'shipping' && (
          <form onSubmit={handleSubmitOrder} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
              <div className="flex items-center justify-between pb-2 border-b border-[#C8C8C6]/40">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#1C1C1C]">
                    بيانات التوصيل والدفع
                  </h3>
                  <span className="text-xs text-[#1C1C1C]/70">
                    التوصيل خلال 3–4 أيام داخل القاهرة (شحن 80 ج.م)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('sizes')}
                  className="text-xs font-semibold text-[#1C1C1C] underline focus:outline-none"
                >
                  تعديل المقاسات
                </button>
              </div>

              {/* Input fields */}
              <div className="space-y-3 sm:space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: يوسف أحمد"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#C8C8C6] bg-[#FFFFFF] text-sm text-[#1C1C1C] focus:border-[#1C1C1C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    رقم الموبايل (واتساب متاح عليه) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#C8C8C6] bg-[#FFFFFF] text-sm text-[#1C1C1C] focus:border-[#1C1C1C] focus:outline-none text-right font-mono"
                  />
                </div>

                {/* Cairo / Giza Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    المحافظة *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGovernorate('Cairo')}
                      className={`h-9 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
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
                      className={`h-9 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
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
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    عنوان التوصيل بالتفصيل (المنطقة، اسم الشارع، رقم العمارة، الشقة) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="المنطقة، اسم الشارع، رقم العمارة والدور والشقة"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#C8C8C6] bg-[#FFFFFF] text-sm text-[#1C1C1C] focus:border-[#1C1C1C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    ملاحظات إضافية (اختياري)
                  </label>
                  <input
                    type="text"
                    placeholder="ميعاد مفضل للتسليم، علامة مميزة..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#C8C8C6] bg-[#FFFFFF] text-sm text-[#1C1C1C] focus:border-[#1C1C1C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Display (Cash on Delivery exclusively) */}
              <div>
                <label className="block text-xs font-bold text-[#1C1C1C] mb-1.5">
                  طريقة الدفع:
                </label>
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
                      استلم طقمك وعاينه وقيسه مع المندوب الأول وادفع نقداً بعد التأكد التام من الجودة والمقاس.
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact Cost Breakdown */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#1C1C1C]/[0.03] border border-[#C8C8C6] space-y-2 text-xs">
                <div className="flex justify-between text-[#777777]">
                  <span>إجمالي القطع منفصلة (3 قطع)</span>
                  <span className="font-mono line-through">{outfit.separatePrice} ج.م</span>
                </div>
                <div className="flex justify-between items-center text-[#1C1C1C] font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#1C1C1C] text-[#FFFFFF] text-[10px] font-mono">CLEARANCE</span>
                    <span>خصم الـLook الكاملة:</span>
                  </span>
                  <span className="font-mono text-emerald-700 font-bold">-150 ج.م</span>
                </div>
                <div className="flex justify-between text-[#1C1C1C] font-bold">
                  <span>سعر الـLook بعد الخصم</span>
                  <span className="font-mono">{outfit.totalPrice} ج.م</span>
                </div>
                <div className="flex justify-between text-[#777777]">
                  <span>شحن القاهرة والجيزة</span>
                  <span className="font-mono font-bold text-[#1C1C1C]">{shippingFee} ج.م</span>
                </div>
                <div className="pt-2 border-t border-[#C8C8C6]/50 flex justify-between text-xs sm:text-sm font-black text-[#1C1C1C]">
                  <span>الإجمالي النهائي للدفع</span>
                  <span className="font-mono text-sm sm:text-base">{finalTotal} جنيه</span>
                </div>
              </div>
            </div>

            {/* Fixed Footer: Submit Action */}
            <div className="shrink-0 p-3.5 sm:p-4 border-t border-[#C8C8C6]/50 bg-[#FFFFFF] shadow-lg space-y-2.5">
              {submitError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-right space-y-1 animate-in fade-in duration-200">
                  <div className="font-bold flex items-center gap-1.5 justify-end">
                    <span>{submitError}</span>
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  </div>
                  <div className="text-[11px] text-red-600/80">
                    بياناتك محفوظة، اضغط على زر تأكيد الطلب للمحاولة مرة أخرى.
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1C1C1C] text-[#FFFFFF] font-bold text-xs sm:text-sm hover:bg-[#2E2E2E] transition-all shadow-md flex items-center justify-center gap-2 focus:outline-none disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#FFFFFF]" />
                    <span>جاري تنفيذ الطلب...</span>
                  </span>
                ) : (
                  <>
                    <span>تأكيد طلب الـOutfit</span>
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER SUCCESS */}
        {step === 'success' && (
          <div className="p-6 sm:p-10 text-center overflow-y-auto flex-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1C1C1C] text-[#FFFFFF] flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-lg">
              <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 text-[#FFFFFF]" />
            </div>

            <span className="text-xs font-mono font-bold text-[#AFAFAD] uppercase tracking-wider block mb-1">
              رقم الطلب: {orderRef}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#1C1C1C] mb-2 sm:mb-3">
              تم تسجيل طلب الـOutfit بنجاح!
            </h3>
            <p className="text-xs sm:text-sm text-[#1C1C1C]/75 max-w-[440px] mx-auto leading-relaxed mb-5">
              شكراً لاختيارك Ultra One Fit يا {customerName}. فريقنا هيتواصل معاك هاتفياً أو عبر الواتساب لتأكيد شحن الـOutfit لعنوانك في {governorate === 'Cairo' ? 'القاهرة' : 'الجيزة'} خلال 3–4 أيام عمل.
            </p>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#C8C8C6] bg-[#1C1C1C]/[0.02] text-xs text-right max-w-[420px] mx-auto mb-6 space-y-1.5">
              <div className="font-bold text-[#1C1C1C] mb-1">تفاصيل طلبك:</div>
              <div className="flex justify-between text-[#1C1C1C]/80">
                <span>الـOutfit:</span>
                <span className="font-bold">{outfit.name} (3 قطع)</span>
              </div>
              <div className="flex justify-between text-[#1C1C1C]/80">
                <span>المحافظة:</span>
                <span className="font-bold">{governorate === 'Cairo' ? 'القاهرة' : 'الجيزة'}</span>
              </div>
              <div className="flex justify-between text-[#1C1C1C]/80">
                <span>المقاسات المختارة:</span>
                <span className="font-mono">تيشيرت {selectedSizes.tshirt} • جينز {selectedSizes.jeans} • شوز {selectedSizes.shoes}</span>
              </div>
              <div className="flex justify-between text-[#1C1C1C]/80">
                <span>طريقة الدفع:</span>
                <span className="font-bold text-[#1C1C1C]">الدفع عند الاستلام (COD)</span>
              </div>
              <div className="flex justify-between font-bold text-[#1C1C1C] pt-1 border-t border-[#C8C8C6]/40">
                <span>المبلغ الإجمالي شامل الشحن:</span>
                <span className="font-mono">{finalTotal} جنيه</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-[#1C1C1C] text-[#FFFFFF] font-bold text-xs sm:text-sm hover:bg-[#2E2E2E] transition-all focus:outline-none"
            >
              تم، العودة للصفحة
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
