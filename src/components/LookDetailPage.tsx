import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Outfit, CatalogProduct } from '../types';
import { OFFICIAL_CATALOG_PRODUCTS } from '../data/products';
import {
  ArrowRight,
  ArrowLeft,
  Ruler,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
  Eye,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface PieceSelection {
  color: string;
  colorHex: string;
  size: string;
}

interface LookDetailPageProps {
  outfit: Outfit;
  otherOutfits?: Outfit[];
  onBackToOutfits: () => void;
  onOpenSizeChart: () => void;
  onSelectOtherOutfit?: (other: Outfit) => void;
  onOpenProductDetails?: (product: CatalogProduct, initialColor?: string) => void;
  onOpenCheckout?: (initialItems?: any[]) => void;
}

interface ColorSwatchOption {
  name: string;
  hex: string;
}

export const LookDetailPage: React.FC<LookDetailPageProps> = ({
  outfit,
  otherOutfits = [],
  onBackToOutfits,
  onOpenSizeChart,
  onSelectOtherOutfit,
  onOpenProductDetails,
  onOpenCheckout,
}) => {
  const { addToCart, setCartDrawerOpen } = useCart();

  // Scroll to top when outfit changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSlideIndex(0);
    setAttemptedSubmit(false);
    setAddedNotification('');
  }, [outfit?.id]);

  // Catalog resolver
  const getCatalogData = (catalogProductId?: string): CatalogProduct | undefined => {
    if (!catalogProductId) return undefined;
    return OFFICIAL_CATALOG_PRODUCTS.find((p) => p.id === catalogProductId);
  };

  // State: Selections for each of the 3 pieces (color, colorHex, size)
  const [pieceSelections, setPieceSelections] = useState<Record<string, PieceSelection>>(() => {
    const initial: Record<string, PieceSelection> = {};
    (outfit?.pieces || []).forEach((piece) => {
      initial[piece.id] = {
        color: piece.colorName,
        colorHex: piece.colorHex,
        size: '',
      };
    });
    return initial;
  });

  // Keep piece selections in sync if outfit changes
  useEffect(() => {
    const updated: Record<string, PieceSelection> = {};
    (outfit?.pieces || []).forEach((piece) => {
      updated[piece.id] = {
        color: piece.colorName,
        colorHex: piece.colorHex,
        size: '',
      };
    });
    setPieceSelections(updated);
  }, [outfit?.id, outfit?.pieces]);

  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
  const [addedNotification, setAddedNotification] = useState<string>('');
  const sliderTouchStartX = useRef<number | null>(null);

  // Gallery of Look Images (at least 3 images)
  const allImages: string[] = useMemo(() => {
    if (!outfit) return [];
    const list = outfit.image ? [outfit.image] : [];
    if (outfit.gallery && outfit.gallery.length > 0) {
      outfit.gallery.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    // Also include product piece images to provide rich variety
    (outfit.pieces || []).forEach((p) => {
      const cat = getCatalogData(p.catalogProductId);
      const pieceImg = p.image || cat?.image;
      if (pieceImg && !list.includes(pieceImg)) {
        list.push(pieceImg);
      }
    });
    return list;
  }, [outfit]);

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    sliderTouchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (sliderTouchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = sliderTouchStartX.current - endX;
    // In RTL, dragging right-to-left is diff > 40 -> Next
    if (diff > 40) {
      handleNextSlide();
    } else if (diff < -40) {
      handlePrevSlide();
    }
    sliderTouchStartX.current = null;
  };

  // Color change handler
  const handleColorChange = (pieceId: string, newColorName: string, newHex: string) => {
    setPieceSelections((prev) => ({
      ...prev,
      [pieceId]: {
        ...prev[pieceId],
        color: newColorName,
        colorHex: newHex,
      },
    }));
  };

  // Size change handler
  const handleSizeChange = (pieceId: string, newSize: string) => {
    setPieceSelections((prev) => ({
      ...prev,
      [pieceId]: {
        ...prev[pieceId],
        size: newSize,
      },
    }));
  };

  // Check if all 3 sizes have been chosen
  const allSizesSelected = useMemo(() => {
    return outfit.pieces.every((piece) => {
      const sel = pieceSelections[piece.id];
      return sel && sel.size && sel.size.trim() !== '';
    });
  }, [outfit.pieces, pieceSelections]);

  const scrollToPieces = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const el = document.getElementById('pieces-cards-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Resolve piece image based on chosen color
  const resolvePieceImage = (piece: typeof outfit.pieces[0], selectedColor: string): string => {
    const catalogInfo = getCatalogData(piece.catalogProductId);
    if (catalogInfo?.colorGalleries && catalogInfo.colorGalleries[selectedColor]) {
      return catalogInfo.colorGalleries[selectedColor][0];
    }
    if (catalogInfo && catalogInfo.colorGalleries) {
      const matchKey = Object.keys(catalogInfo.colorGalleries).find(
        (k) => k.trim().toLowerCase() === selectedColor.trim().toLowerCase()
      );
      if (matchKey && catalogInfo.colorGalleries[matchKey]?.[0]) {
        return catalogInfo.colorGalleries[matchKey][0];
      }
    }
    return piece.image || catalogInfo?.image || outfit.image;
  };

  // Execute Add-to-Cart or Direct Checkout
  const executeAddToCart = (isDirectCheckout: boolean = false) => {
    if (!allSizesSelected) {
      setAttemptedSubmit(true);
      scrollToPieces();
      return;
    }

    const bundleId = `bundle-${Date.now()}-${outfit.id}`;
    const generatedItems: any[] = [];

    outfit.pieces.forEach((piece) => {
      const sel = pieceSelections[piece.id];
      const chosenImg = resolvePieceImage(piece, sel.color);
      const catalogInfo = getCatalogData(piece.catalogProductId);

      const cartItemPayload = {
        productId: piece.id,
        productName: piece.name,
        productType:
          piece.category === 'tshirt'
            ? 'تيشيرت'
            : piece.category === 'jeans'
            ? 'بنطلون'
            : 'كوتشي',
        productCategory: piece.category,
        selectedColor: sel.color,
        selectedColorHex: sel.colorHex,
        selectedSize: sel.size,
        price: piece.price,
        quantity: 1,
        image: chosenImg,
        warranty: catalogInfo?.warranty,
        outfitName: outfit.name,
        outfitId: outfit.id,
        bundleId,
        isLookPiece: true,
        lookPrice: outfit.totalPrice,
        lookSeparatePrice: outfit.separatePrice,
        lookSavings: 150,
      };

      addToCart(cartItemPayload);
      generatedItems.push({
        id: `item-${Date.now()}-${Math.random()}`,
        ...cartItemPayload,
        quantity: 1,
      });
    });

    setAddedNotification(`تمت إضافة الـ 3 قطع للـLook (${outfit.name}) مع توفير 150 ج.م!`);

    if (isDirectCheckout && onOpenCheckout) {
      onOpenCheckout(generatedItems);
    } else {
      setCartDrawerOpen(true);
    }
  };

  return (
    <div
      className="bg-[#FFFFFF] text-[#1C1C1C] min-h-screen pt-20 sm:pt-24 pb-14 sm:pb-20"
      dir="rtl"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================= */}
        {/* 01. Top Navigation Bar & Breadcrumb                      */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-[#C8C8C6]/50">
          <button
            onClick={onBackToOutfits}
            id="back-to-outfits-btn"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1C1C1C] hover:opacity-75 transition-opacity py-1 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-[#1C1C1C]" />
            <span>الرجوع لجميع الـLooks</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#777777]">
            <span className="hidden sm:inline">LOOK {outfit.number}</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-[#1C1C1C] font-sans font-black">{outfit.name}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 02. Look Hero: Left Photo Gallery + Right Identity Block */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start mb-12 sm:mb-16">
          
          {/* Gallery Slider (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div
              className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-2xl bg-[#EAEAEA]/40 overflow-hidden border border-[#C8C8C6] shadow-md select-none group"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={allImages[activeSlideIndex] || outfit.image}
                alt={`${outfit.name} - صوره ${activeSlideIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Top Floating Badges */}
              <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-[#1C1C1C]/90 backdrop-blur-md text-[10px] font-mono font-black text-[#FFFFFF]">
                    LOOK {outfit.number}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FFFFFF]/90 backdrop-blur-md text-[10px] font-bold text-[#1C1C1C]">
                    {outfit.occasionTag || outfit.context}
                  </span>
                </div>

                {/* Counter in strict LTR so it NEVER inverts to 3 / 1 */}
                <div
                  dir="ltr"
                  className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-mono font-bold text-white num-ltr select-none"
                >
                  {activeSlideIndex + 1} / {allImages.length}
                </div>
              </div>

              {/* Slider Arrow Controls */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevSlide();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all shadow-md active:scale-90 cursor-pointer"
                    aria-label="الصورة السابقة"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextSlide();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all shadow-md active:scale-90 cursor-pointer"
                    aria-label="الصورة التالية"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Row */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeSlideIndex === idx
                        ? 'border-[#1C1C1C] ring-2 ring-[#1C1C1C]/20 scale-105'
                        : 'border-[#C8C8C6]/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`مصغرة ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Look Details & Direct Pricing Container (6 cols) */}
          <div className="lg:col-span-6 space-y-5 text-right">
            
            {/* Header Identity */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1C]/5 border border-[#C8C8C6] text-xs font-bold text-[#1C1C1C] mb-2.5">
                <span>تنسيق صيفي رسمي</span>
                <span>•</span>
                <span className="font-mono">LOOK {outfit.number}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1C1C] tracking-tight leading-tight mb-2">
                {outfit.name}
              </h1>

              <p className="text-sm sm:text-base font-bold text-[#1C1C1C]/90 mb-3">
                «{outfit.message}»
              </p>

              <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                {outfit.descriptionText}
              </p>
            </div>

            {/* 3 Pieces Highlight List */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#F9F9F9] border border-[#C8C8C6]/50">
              <span className="text-xs font-bold text-[#1C1C1C] block mb-2">
                تنسيق احترافي متكامل من 3 قطع أساسية:
              </span>
              <ul className="space-y-1.5 text-xs text-[#555555]">
                {outfit.pieces.map((p, idx) => (
                  <li key={p.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1C1C1C] shrink-0" />
                    <span className="font-bold text-[#1C1C1C]">{p.name}:</span>
                    <span>{p.fabric} ({p.details})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clean Single-Layer Summer Clearance & Pricing Box (ZERO NESTED FRAMES) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#C8C8C6] shadow-sm space-y-4">
              
              {/* Offer Strip */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#C8C8C6]/30">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#1C1C1C] text-[#FFFFFF] text-[10px] sm:text-[11px] font-mono font-black tracking-wider uppercase">
                    ☀ SUMMER CLEARANCE
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    وفّر 150 ج.م
                  </span>
                </div>
                <span className="text-[11px] text-[#777777]">عرض الصيف المعتمد</span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#777777] mb-0.5">
                    <span>إجمالي القطع منفصلة:</span>
                    <span className="line-through font-mono">
                      {outfit.separatePrice.toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-2xl sm:text-3xl font-black text-[#1C1C1C]">
                      {outfit.totalPrice.toLocaleString('ar-EG')}
                    </span>
                    <span className="text-sm font-bold text-[#555555]">جنيه</span>
                    <span className="text-[11px] font-sans text-[#777777] mr-1">(شامل الـ 3 قطع)</span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-[10px] text-[#777777] block">الشحن والتوصيل</span>
                  <span className="text-xs font-bold text-[#1C1C1C]">80 ج.م • 3–4 أيام</span>
                </div>
              </div>

              {/* Scroll-to-Pieces Action Button */}
              <button
                type="button"
                onClick={scrollToPieces}
                id="btn-scroll-to-pieces"
                className="w-full h-[46px] rounded-xl bg-[#1C1C1C] text-[#FFFFFF] text-center font-black text-xs sm:text-sm hover:bg-[#000000] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
              >
                <span>تحديد مقاسات الـ 3 قطع وإتمام الطلب ↓</span>
              </button>
            </div>

            {/* Micro Guarantees */}
            <div className="grid grid-cols-2 gap-2 text-xs text-[#555555]">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFFFFF] border border-[#C8C8C6]/50">
                <Truck className="w-4 h-4 text-[#1C1C1C] shrink-0" />
                <span>معاينة وقياس عند الاستلام</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFFFFF] border border-[#C8C8C6]/50">
                <RotateCcw className="w-4 h-4 text-[#1C1C1C] shrink-0" />
                <span>استبدال المقاس مجاناً</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* 03. The Three Pieces: Professional Visual Product Cards  */}
        {/* ========================================================= */}
        <section id="pieces-cards-section" className="pt-10 sm:pt-14 mb-14 sm:mb-16 border-t border-[#C8C8C6]/60">
          
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1C1C]/5 border border-[#C8C8C6] text-xs font-bold text-[#1C1C1C] mb-2">
                <span>القطع الـ 3 المكونة للـ Look</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1C1C] tracking-tight">
                تفاصيل القطع وصور المنتجات
              </h2>
              <p className="text-xs sm:text-sm text-[#555555] mt-1">
                كل قطعة معروضة بصورتها الحقيقية وخامتها. حدد اللون والمقاس لكل قطعة، أو اضغط على أي كارت لمعاينة تفاصيل المنتج بالكامل.
              </p>
            </div>

            <button
              onClick={onOpenSizeChart}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1C1C] bg-[#FFFFFF] border border-[#C8C8C6] hover:border-[#1C1C1C] px-3.5 py-2 rounded-xl shadow-sm transition-colors shrink-0 cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>جدول المقاسات وبيانات المودل</span>
            </button>
          </div>

          {/* 3 Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {outfit.pieces.map((piece, index) => {
              const catalogInfo = getCatalogData(piece.catalogProductId);
              const currentSel = pieceSelections[piece.id] || {
                color: piece.colorName,
                colorHex: piece.colorHex,
                size: '',
              };
              const isMissingSize = attemptedSubmit && currentSel.size === '';
              const pieceImage = resolvePieceImage(piece, currentSel.color);

              const availableColors: ColorSwatchOption[] =
                piece.availableColors ||
                catalogInfo?.colorOptions || [
                  { name: piece.colorName, hex: piece.colorHex },
                ];

              const categoryArabic =
                piece.category === 'tshirt'
                  ? 'تيشيرت أوفرسايز'
                  : piece.category === 'jeans'
                  ? 'بنطلون جينز'
                  : 'كوتشي سنيكرز';

              return (
                <div
                  key={piece.id}
                  id={`piece-card-${piece.id}`}
                  className={`bg-[#FFFFFF] border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md ${
                    isMissingSize
                      ? 'border-red-500 ring-2 ring-red-100'
                      : 'border-[#C8C8C6] hover:border-[#1C1C1C]'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-bold text-[#1C1C1C] bg-[#F4F4F4] px-2.5 py-1 rounded-lg border border-[#C8C8C6]/50">
                        قطعة 0{index + 1} — {categoryArabic}
                      </span>
                      <span className="text-xs font-bold text-[#555555] bg-[#FBFBFB] px-2.5 py-1 rounded-lg border border-[#C8C8C6]/40">
                        {piece.fit || catalogInfo?.fit}
                      </span>
                    </div>

                    {/* Image with zoom and inspect pill */}
                    <div className="relative aspect-[4/3] w-full bg-[#F4F4F4] rounded-xl overflow-hidden mb-4 border border-[#C8C8C6]/40 group/img">
                      <img
                        src={pieceImage}
                        alt={piece.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
                      />

                      {catalogInfo && onOpenProductDetails && (
                        <button
                          type="button"
                          onClick={() => onOpenProductDetails(catalogInfo, currentSel.color)}
                          className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/75 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-all cursor-pointer"
                          title="عرض تفاصيل المنتج في الكتالوج"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>معاينة المنتج</span>
                        </button>
                      )}

                      <div className="absolute top-2.5 right-2.5 bg-[#FFFFFF]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold font-mono text-[#1C1C1C] border border-[#C8C8C6] shadow-sm">
                        {piece.price} ج.م
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-[#1C1C1C] mb-1 leading-snug">
                      {piece.name}
                    </h3>

                    {/* Fabric details */}
                    <p className="text-xs text-[#555555] leading-relaxed mb-4 pb-3 border-b border-[#C8C8C6]/40">
                      {piece.fabric || catalogInfo?.fabric} • {piece.details || catalogInfo?.cardShortCopy}
                    </p>

                    {/* Color Swatches */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-[#1C1C1C]">اللون:</span>
                        <span className="text-[#555555] font-semibold">{currentSel.color}</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {availableColors.map((col) => {
                          const isSelected = currentSel.color === col.name;
                          return (
                            <button
                              key={col.name}
                              type="button"
                              onClick={() => handleColorChange(piece.id, col.name, col.hex)}
                              title={col.name}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#1C1C1C] bg-[#1C1C1C] text-[#FFFFFF] shadow-sm'
                                  : 'border-[#C8C8C6] bg-[#FFFFFF] text-[#1C1C1C] hover:border-[#1C1C1C]'
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full border border-black/15 inline-block shrink-0"
                                style={{ backgroundColor: col.hex }}
                              />
                              <span>{col.name}</span>
                              {isSelected && <Check className="w-3 h-3 text-[#FFFFFF]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Size Selector */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-[#1C1C1C]">المقاس المطلوب:</span>
                        {currentSel.size ? (
                          <span className="font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded text-[11px] border border-green-200 flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-600" />
                            <span>المقاس: {currentSel.size}</span>
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold text-[11px]">
                            * مطلوب اختيار المقاس
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                        {piece.sizes.map((sz) => {
                          const isSelected = currentSel.size === sz;
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => handleSizeChange(piece.id, sz)}
                              className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all text-center cursor-pointer ${
                                isSelected
                                  ? 'bg-[#1C1C1C] text-[#FFFFFF] border-[#1C1C1C] shadow-sm scale-105'
                                  : 'bg-[#FFFFFF] text-[#1C1C1C] border-[#C8C8C6] hover:border-[#1C1C1C] hover:bg-[#F9F9F9]'
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>

                      {isMissingSize && (
                        <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>يرجى اختيار مقاس {piece.name} أولاً</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-[#C8C8C6]/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[11px] text-[#555555] block">سعر القطعة:</span>
                      <span className="font-mono font-black text-[#1C1C1C] text-sm">
                        {piece.price} ج.م
                      </span>
                    </div>

                    {catalogInfo && onOpenProductDetails && (
                      <button
                        type="button"
                        onClick={() => onOpenProductDetails(catalogInfo, currentSel.color)}
                        className="text-xs font-bold text-[#1C1C1C] hover:underline flex items-center gap-1 py-1 px-2 rounded-md hover:bg-[#F4F4F4] cursor-pointer"
                      >
                        <span>تفاصيل القطعة</span>
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 04. Order Summary & Primary Purchase Box                 */}
        {/* ========================================================= */}
        <section className="mb-14 sm:mb-16 bg-[#FFFFFF] border-2 border-[#1C1C1C] rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 shadow-md">
          <div className="max-w-[760px] mx-auto text-right">
            
            <div className="mb-6">
              <span className="text-xs font-bold text-[#555555] block mb-1">
                الخطوة الأخيرة
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1C1C1C]">
                ملخص طلب الـLook (3 قطع كاملة)
              </h3>
              <p className="text-xs sm:text-sm text-[#555555] mt-1">
                تأكد من اختيارات المقاسات والألوان للـ 3 قطع قبل إتمام الطلب:
              </p>
            </div>

            {/* Line items table with selections */}
            <div className="space-y-2.5 mb-6">
              {outfit.pieces.map((piece) => {
                const sel = pieceSelections[piece.id] || {
                  color: piece.colorName,
                  colorHex: piece.colorHex,
                  size: '',
                };
                const catalogInfo = getCatalogData(piece.catalogProductId);
                const pieceImage = resolvePieceImage(piece, sel.color);

                return (
                  <div
                    key={piece.id}
                    className="flex items-center justify-between text-xs sm:text-sm p-3 rounded-xl bg-[#F9F9F9] border border-[#C8C8C6]/60 gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={pieceImage}
                        alt={piece.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover border border-[#C8C8C6] shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-black text-[#1C1C1C] block text-xs sm:text-sm truncate">
                          {piece.name}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-[#555555] mt-0.5">
                          <span>اللون: <strong className="text-[#1C1C1C]">{sel.color}</strong></span>
                          <span>•</span>
                          {sel.size ? (
                            <span className="font-bold text-green-700">
                              المقاس: <strong className="font-mono text-[#1C1C1C]">{sel.size}</strong>
                            </span>
                          ) : (
                            <span className="text-red-500 font-bold">
                              (لم يتم اختيار المقاس بعد)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="font-mono font-black text-[#1C1C1C] text-xs sm:text-sm shrink-0">
                      {piece.price} ج.م
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total pricing calculation */}
            <div className="border-t border-[#C8C8C6] pt-4 mb-6 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-[#777777]">
                <span>إجمالي القطع منفصلة (3 قطع):</span>
                <span className="font-mono line-through">{outfit.separatePrice.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="flex items-center justify-between font-bold text-[#1C1C1C]">
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1C1C1C] text-[#FFFFFF]">CLEARANCE</span>
                  <span>خصم الـLook الكاملة:</span>
                </span>
                <span className="font-mono text-emerald-700 font-bold">-150 ج.م</span>
              </div>
              <div className="flex items-center justify-between font-bold text-[#1C1C1C]">
                <span>سعر الـLook بعد الخصم:</span>
                <span className="font-mono text-sm sm:text-base">{outfit.totalPrice.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="flex items-center justify-between text-[#777777]">
                <span>شحن وتوصيل (القاهرة والجيزة):</span>
                <span className="font-mono font-bold text-[#1C1C1C]">80 ج.م</span>
              </div>
              <div className="border-t border-[#C8C8C6]/50 pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <span className="text-sm sm:text-base font-black text-[#1C1C1C]">
                    الإجمالي النهائي شامل التوصيل:
                  </span>
                  <span className="block text-[11px] text-[#777777]">
                    الدفع عند الاستلام نقداً بعد المعاينة والفحص
                  </span>
                </div>
                <div className="flex items-baseline gap-1 font-mono text-[#1C1C1C] self-end sm:self-auto">
                  <span className="text-2xl sm:text-3xl font-black">
                    {(outfit.totalPrice + 80).toLocaleString('ar-EG')}
                  </span>
                  <span className="text-sm font-bold text-[#555555]">جنيه</span>
                </div>
              </div>
            </div>

            {/* Notification alert */}
            {addedNotification && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 font-bold flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{addedNotification}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCartDrawerOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#1C1C1C] text-[#FFFFFF] font-bold text-xs hover:bg-[#000000] shrink-0 transition-all cursor-pointer"
                >
                  فتح السلة
                </button>
              </div>
            )}

            {/* Primary & Secondary Action CTAs */}
            <div className="space-y-2.5">
              <button
                id="btn-complete-look-order"
                onClick={() => executeAddToCart(true)}
                className={`w-full h-[48px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  allSizesSelected
                    ? 'bg-[#1C1C1C] text-[#FFFFFF] hover:bg-[#000000] active:scale-[0.99]'
                    : 'bg-[#EAEAEA] text-[#777777] border border-[#C8C8C6]'
                }`}
              >
                <span>إتمام طلب الـLook الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeAddToCart(false)}
                className="w-full h-[46px] rounded-xl bg-[#FFFFFF] border-2 border-[#1C1C1C] text-[#1C1C1C] font-black text-xs sm:text-sm hover:bg-[#F4F4F4] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4 text-[#1C1C1C]" />
                <span>إضافة الـ 3 قطع إلى السلة والمتابعة</span>
              </button>
            </div>

            {!allSizesSelected && (
              <p className="text-xs text-center text-red-600 mt-2.5 font-bold">
                * يرجى اختيار مقاس كل قطعة من الـ 3 قطع بالأعلى لإتمام الطلب.
              </p>
            )}

            {/* Reassurances list */}
            <div className="mt-6 pt-5 border-t border-[#C8C8C6]/50 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-xs text-[#555555]">
              <div className="flex items-center justify-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-[#1C1C1C]" />
                <span>توصيل خلال 3–4 أيام عمل</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#1C1C1C]" />
                <span>معاينة وفحص قبل الاستلام</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 font-medium">
                <RotateCcw className="w-4 h-4 text-[#1C1C1C]" />
                <span>استبدال المقاس مجاناً</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* 05. Switch to Other Looks                                */}
        {/* ========================================================= */}
        {otherOutfits && otherOutfits.length > 0 && onSelectOtherOutfit && (
          <section className="pt-8 border-t border-[#C8C8C6]">
            <div className="text-center mb-6">
              <h3 className="text-lg sm:text-xl font-black text-[#1C1C1C]">
                استكشف الـLooks التانية
              </h3>
              <p className="text-xs text-[#555555] mt-0.5">
                تنسيقات مختلفة لكل وقت في يومك
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1050px] mx-auto">
              {otherOutfits.map((other) => (
                <div
                  key={other.id}
                  onClick={() => onSelectOtherOutfit(other)}
                  className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#C8C8C6] hover:border-[#1C1C1C] shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
                >
                  <img
                    src={other.image}
                    alt={other.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-22 rounded-xl object-cover border border-[#C8C8C6] group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="flex-1 text-right overflow-hidden">
                    <span className="text-[10px] font-mono font-bold text-[#555555] block">
                      LOOK {other.number} — {other.context}
                    </span>
                    <h4 className="text-sm font-black text-[#1C1C1C] mt-0.5 group-hover:text-black truncate">
                      {other.name}
                    </h4>
                    <p className="text-xs text-[#555555] line-clamp-1 mt-0.5">
                      {other.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#C8C8C6]/40">
                      <span className="font-mono font-bold text-xs text-[#1C1C1C]">
                        {other.totalPrice.toLocaleString()} ج.م
                      </span>
                      <span className="text-xs font-bold text-[#1C1C1C] flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                        <span>شوف الـLook</span>
                        <ArrowLeft className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
