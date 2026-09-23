import React, { useState } from 'react';
import { Outfit } from '../types';
import { OUTFITS } from '../data/outfits';
import { Check, ArrowLeft, ShieldAlert, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface DedicatedPricingSectionProps {
  onSelectOutfit: (outfit: Outfit) => void;
}

export const DedicatedPricingSection: React.FC<DedicatedPricingSectionProps> = ({
  onSelectOutfit,
}) => {
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState<number>(0);
  const [addedToCartSuccess, setAddedToCartSuccess] = useState<boolean>(false);
  const { addToCart, setCartDrawerOpen } = useCart();

  const currentOutfit = OUTFITS[selectedOutfitIndex] || OUTFITS[0];

  const handleAddToCart = () => {
    const bundleId = `bundle-${Date.now()}-${currentOutfit.id}`;
    currentOutfit.pieces.forEach((piece) => {
      const defaultSize = piece.category === 'tshirt' ? 'L' : piece.category === 'jeans' ? '32' : '43';
      addToCart({
        productId: piece.id,
        productName: piece.name,
        productType: piece.category === 'tshirt' ? 'تيشيرت' : piece.category === 'jeans' ? 'بنطلون' : 'كوتشي',
        productCategory: piece.category,
        selectedSize: defaultSize,
        selectedColor: piece.colorName,
        selectedColorHex: piece.colorHex,
        price: piece.price,
        image: currentOutfit.image,
        quantity: 1,
        outfitName: currentOutfit.name,
        outfitId: currentOutfit.id,
        bundleId,
        isLookPiece: true,
        lookPrice: currentOutfit.totalPrice,
        lookSeparatePrice: currentOutfit.separatePrice,
        lookSavings: 150,
      });
    });

    setAddedToCartSuccess(true);
    setTimeout(() => {
      setAddedToCartSuccess(false);
    }, 3500);
  };

  return (
    <section
      id="dedicated-pricing-section"
      className="bg-[#1C1C1C] text-[#FFFFFF] py-12 sm:py-16 md:py-20 border-b border-[#C8C8C6]/15 text-center"
      dir="rtl"
    >
      <div className="max-w-[840px] mx-auto px-4 sm:px-6">
        
        {/* Centered Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF]/[0.08] border border-[#C8C8C6]/30 text-xs font-bold text-[#EAEAEA] mb-3 sm:mb-4">
          <span className="px-2 py-0.5 rounded-md bg-[#FFFFFF] text-[#1C1C1C] text-[10px] font-mono font-black tracking-wider uppercase">
            ☀ SUMMER CLEARANCE
          </span>
          <span>توفير 150 جنيه على أي Look كاملة</span>
        </div>

        {/* Centered Headline */}
        <h2 className="text-2xl min-[400px]:text-3xl sm:text-4xl font-black text-[#FFFFFF] leading-tight mb-2.5">
          تنسيقات Ultra One Fit الرسمية
        </h2>
        <p className="text-xs min-[400px]:text-sm sm:text-base text-[#AFAFAD] max-w-[560px] mx-auto mb-6 sm:mb-8 leading-relaxed">
          اختر الـLook المناسب ليومك، استعرض تفاصيل قطعه الـ3 المتناسقة، مع توفير فوري 150 جنيه مقارنة بشراء القطع منفصلة.
        </p>

        {/* STEP 1: Select the Look */}
        <div className="mb-5 sm:mb-6 text-right">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-xs sm:text-sm font-black text-[#FFFFFF] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#FFFFFF] text-[#1C1C1C] text-[11px] font-mono font-black flex items-center justify-center">
                1
              </span>
              <span>حدد الـLook المطلوب:</span>
            </span>
            <span className="text-[11px] text-[#AFAFAD] font-mono">
              7 تنسيقات معتمدة
            </span>
          </div>

          {/* 7 Looks Selector: Horizontal scroll on mobile, grid on tablet/desktop */}
          <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {OUTFITS.map((outfit, index) => {
              const isSelected = selectedOutfitIndex === index;
              return (
                <button
                  key={outfit.id}
                  type="button"
                  onClick={() => {
                    setSelectedOutfitIndex(index);
                    setAddedToCartSuccess(false);
                  }}
                  className={`p-2.5 sm:p-3 rounded-xl border text-right transition-all duration-200 focus:outline-none flex flex-col justify-between shrink-0 min-w-[130px] sm:min-w-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFFFFF] text-[#1C1C1C] border-[#FFFFFF] shadow-md ring-2 ring-[#FFFFFF]/40'
                      : 'bg-[#FFFFFF]/[0.05] text-[#EAEAEA] border-[#C8C8C6]/25 hover:bg-[#FFFFFF]/[0.09] hover:border-[#C8C8C6]/40'
                  }`}
                  id={`select-look-btn-${index + 1}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[9.5px] font-mono font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          isSelected
                            ? 'bg-[#1C1C1C] text-[#FFFFFF]'
                            : 'bg-[#FFFFFF]/10 text-[#C8C8C6]'
                        }`}
                      >
                        {outfit.number}
                      </span>
                      {isSelected && (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#1C1C1C] text-[#FFFFFF] flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <div className={`font-black text-xs mb-1 truncate ${isSelected ? 'text-[#1C1C1C]' : 'text-[#FFFFFF]'}`}>
                      {outfit.name}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1.5 border-t border-current/10 mt-1.5">
                    <span className="text-[9px] opacity-70">3 قطع</span>
                    <span className="font-mono font-black text-[11px]">
                      {outfit.totalPrice.toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Selected Look Details & 3 Pieces Breakdown */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#FFFFFF] text-[#1C1C1C] border border-[#C8C8C6] shadow-xl p-4 sm:p-6 md:p-8 text-right relative overflow-hidden transition-all duration-300">
          
          {/* Active Look Header Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#C8C8C6]/40 mb-4 sm:mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-[#1C1C1C] text-[#FFFFFF] text-[10px] font-mono font-black">
                  LOOK {currentOutfit.number}
                </span>
                <span className="text-xs text-[#555555] font-semibold">
                  {currentOutfit.occasionTag}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-[#1C1C1C]">
                {currentOutfit.name} — مكونات وتفاصيل الـLook
              </h3>
            </div>

            {/* Total Price & Savings Breakdown */}
            <div className="flex items-center gap-3 justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#C8C8C6]/30">
              <div className="text-right sm:text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#777777] line-through font-mono">
                    {currentOutfit.separatePrice.toLocaleString('ar-EG')} ج.م
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    وفّر 150 ج.م
                  </span>
                </div>
                <span className="text-lg sm:text-2xl font-black font-mono text-[#1C1C1C]">
                  {currentOutfit.totalPrice.toLocaleString('ar-EG')} ج.م
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSelectOutfit(currentOutfit)}
                className="px-3.5 py-2 rounded-xl bg-[#1C1C1C] text-[#FFFFFF] hover:bg-[#000000] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                title={`عرض صفحة ${currentOutfit.name}`}
              >
                <span>شوف الـLook</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3 Pieces Cards Breakdown */}
          <div className="mb-5 sm:mb-6">
            <span className="text-xs font-bold text-[#555555] block mb-2">
              قطع الـLook الثلاثة المتناسقة:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {currentOutfit.pieces.map((piece, idx) => (
                <div
                  key={piece.id}
                  className="p-3 rounded-xl bg-[#F9F9F9] border border-[#C8C8C6]/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
                        قطعة 0{idx + 1} • {piece.category === 'tshirt' ? 'تيشيرت' : piece.category === 'jeans' ? 'بنطلون' : 'سنيكرز'}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: piece.colorHex }}
                        title={piece.colorName}
                      />
                    </div>
                    <div className="font-bold text-xs text-[#1C1C1C] mb-1 leading-snug">
                      {piece.name}
                    </div>
                    <div className="text-[11px] text-[#555555] mb-2 leading-relaxed">
                      {piece.details}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#C8C8C6]/30 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#777777]">اللون: {piece.colorName}</span>
                    <span className="font-mono font-black text-[#1C1C1C] text-[11px]">{piece.price} ج.م</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee Checklist */}
          <div className="space-y-2 mb-4 text-xs text-[#1C1C1C]/80 pt-3 border-t border-[#C8C8C6]/40">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#1C1C1C] shrink-0" />
              <span>فحص ومطابقة دقيقة للمقاسات حسب الطول والوزن قبل الشحن</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#1C1C1C] shrink-0" />
              <span>شحن للقاهرة والجيزة 80 ج.م خلال 3–4 أيام عمل مع إمكانية المعاينة</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#1C1C1C] shrink-0" />
              <span>الدفع عند الاستلام نقداً بعد المعاينة والفحص</span>
            </div>
          </div>

          {/* Trust Alert Box */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#1C1C1C]/5 border border-[#C8C8C6]/50 flex items-center gap-2 mb-5 text-xs text-[#1C1C1C]">
            <ShieldAlert className="w-4 h-4 text-[#1C1C1C] shrink-0" />
            <span>تقدر تستبدل أي قطعة خلال 14 يوم بكل بساطة لو المقاس محتاج تعديل.</span>
          </div>

          {/* Added to cart notification */}
          {addedToCartSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-[#1C1C1C] text-[#FFFFFF] flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" />
                <span>تمت إضافة الـ 3 قطع للـLook إلى السلة بنجاح!</span>
              </div>
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] text-[#1C1C1C] text-xs font-black hover:bg-[#EAEAEA]"
              >
                فتح السلة
              </button>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <button
              onClick={() => onSelectOutfit(currentOutfit)}
              className="h-[46px] rounded-xl bg-[#1C1C1C] text-[#FFFFFF] font-black text-xs sm:text-sm hover:bg-[#000000] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
            >
              <span>متابعة الطلب وتحديد المقاسات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddToCart}
              className="h-[46px] rounded-xl bg-[#FFFFFF] text-[#1C1C1C] border-2 border-[#1C1C1C] font-bold text-xs sm:text-sm hover:bg-[#F4F4F4] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#1C1C1C]" />
              <span>إضافة الـLook للسلة (3 قطع)</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
