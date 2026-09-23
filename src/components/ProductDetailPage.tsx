import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowRight,
  Check,
  ShoppingBag,
  ShieldCheck,
  Ruler,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Images,
} from 'lucide-react';
import { CatalogProduct } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailPageProps {
  product: CatalogProduct;
  initialColor?: string;
  onBackToProducts: () => void;
  onNavigateToOutfits: () => void;
  onOpenSizeChart: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  initialColor,
  onBackToProducts,
  onNavigateToOutfits,
  onOpenSizeChart,
}) => {
  const { addToCart, setCartDrawerOpen, totalItems } = useCart();

  const isJeansProduct =
    product.id === 'prod-3-regular-jeans' || product.id === 'prod-4-wide-leg-jeans';

  // Strict resolver to guarantee the selected color belongs to this specific product's allowed colors
  const resolveValidColor = (colorToTest?: string): string => {
    if (!product.colors || product.colors.length === 0) return '';
    if (!colorToTest) {
      // For jeans, before selection all images are flipped automatically
      if (isJeansProduct) return '';
      return product.colors[0];
    }

    const trimmed = colorToTest.trim().toLowerCase();
    const directMatch = product.colors.find(
      (c) => c.trim().toLowerCase() === trimmed
    );
    if (directMatch) return directMatch;

    const partialMatch = product.colors.find((c) => {
      const cLow = c.trim().toLowerCase();
      return cLow.includes(trimmed) || trimmed.includes(cLow);
    });
    if (partialMatch) return partialMatch;

    const optMatch = product.colorOptions?.find((o) => {
      const oLow = o.name.trim().toLowerCase();
      return oLow.includes(trimmed) || trimmed.includes(oLow);
    });
    if (optMatch) return optMatch.name;

    // Strict safety fallback: never allow an unassigned color
    return isJeansProduct ? '' : product.colors[0];
  };

  const [selectedColor, setSelectedColor] = useState<string>(() => resolveValidColor(initialColor));
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>('');
  const [isAddedSuccessfully, setIsAddedSuccessfully] = useState<boolean>(false);

  // Synchronize color selection when product or initialColor changes
  useEffect(() => {
    setSelectedColor(resolveValidColor(initialColor));
    setActiveImageIndex(0);
    setIsAutoPlaying(true);
  }, [product.id, initialColor]);

  // Gallery images determined strictly by the selected color (or fallback to product gallery / main image)
  const currentGallery: string[] = useMemo(() => {
    if (selectedColor && product.colorGalleries) {
      if (product.colorGalleries[selectedColor]) {
        return product.colorGalleries[selectedColor];
      }
      const trimmed = selectedColor.trim().toLowerCase();
      const match = Object.keys(product.colorGalleries).find((k) => {
        const kLow = k.trim().toLowerCase();
        return kLow === trimmed || kLow.includes(trimmed) || trimmed.includes(kLow);
      });
      if (match && product.colorGalleries[match]) {
        return product.colorGalleries[match];
      }
    }
    if (product.gallery && product.gallery.length > 0) {
      return product.gallery;
    }
    return [product.image];
  }, [selectedColor, product]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Identify which color is currently being previewed in the auto-loop
  const currentPreviewedColor = useMemo(() => {
    if (selectedColor) return selectedColor;
    const currentImg = currentGallery[activeImageIndex];
    if (!currentImg || !product.colorGalleries) return '';
    for (const [colName, imgs] of Object.entries(product.colorGalleries)) {
      if (Array.isArray(imgs) && imgs.includes(currentImg)) {
        const match = product.colors.find(
          (c) => c.trim().toLowerCase() === colName.trim().toLowerCase()
        );
        if (match) return match;
        return colName;
      }
    }
    return product.colors[activeImageIndex] || '';
  }, [selectedColor, currentGallery, activeImageIndex, product.colorGalleries, product.colors]);

  // Reset image index whenever color selection changes or gallery updates
  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedColor, currentGallery]);

  // Autoplay loop: automatically flips through photos every 3 seconds
  useEffect(() => {
    if (currentGallery.length <= 1 || !isAutoPlaying) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % currentGallery.length);
    }, 3000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [currentGallery.length, isAutoPlaying]);

  const handlePrevSlide = () => {
    setActiveImageIndex((prev) => (prev === 0 ? currentGallery.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveImageIndex((prev) => (prev + 1) % currentGallery.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsAutoPlaying(false);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 40) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    touchStartXRef.current = null;
    setIsAutoPlaying(true);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      setValidationError('اختار اللون والمقاس الأول.');
      return;
    }

    setValidationError('');
    const chosenImage = currentGallery[activeImageIndex] || currentGallery[0] || product.image;
    addToCart({
      productId: product.id,
      productName: product.name,
      productType: product.type,
      selectedColor,
      selectedSize,
      quantity,
      price: product.price,
      image: chosenImage,
      warranty: product.warranty,
    });

    setIsAddedSuccessfully(true);
    setTimeout(() => {
      setIsAddedSuccessfully(false);
    }, 2800);
  };

  return (
    <div className="bg-[#FFFFFF] text-[#1C1C1C] min-h-screen pt-24 sm:pt-28 pb-10 sm:pb-14 px-3 sm:px-6">
      <div className="max-w-[1180px] mx-auto">
        {/* Top Breadcrumbs & Back Navigation */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#C8C8C6]/50">
          <button
            onClick={onBackToProducts}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1C1C1C] hover:text-[#1C1C1C]/70 transition-colors focus:outline-none py-1"
            id="back-to-products-btn"
          >
            <ArrowRight className="w-4 h-4 text-[#1C1C1C]" />
            <span>الرجوع للمنتجات</span>
          </button>

          <div className="text-[11px] sm:text-xs text-[#AFAFAD] flex items-center gap-1.5 font-medium">
            <span>المنتجات</span>
            <span>/</span>
            <span className="text-[#1C1C1C] font-semibold">{product.type}</span>
          </div>
        </div>

        {/* Main Product Layout (Desktop: Left Gallery, Right Details | Mobile: Gallery First) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (Desktop) / First Column: Large Product Gallery with Auto-Flip Carousel */}
          <div className="lg:col-span-6 space-y-3.5">
            {/* Main Image Slider with Auto-Play & Navigation */}
            <div
              className="relative aspect-[3/4] w-full rounded-[22px] bg-[#EAEAEA]/40 overflow-hidden border border-[#C8C8C6] shadow-sm group select-none"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Active Image */}
              <img
                key={`${selectedColor}-${activeImageIndex}-${currentGallery[activeImageIndex]}`}
                src={currentGallery[activeImageIndex] || product.image}
                alt={`${product.name} - ${selectedColor || ''} (${activeImageIndex + 1})`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Previous / Next Arrow Controls (When gallery has multiple images) */}
              {currentGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevSlide();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFFFFF]/85 hover:bg-[#FFFFFF] text-[#1C1C1C] flex items-center justify-center shadow-md border border-[#C8C8C6]/60 transition-all opacity-85 hover:opacity-100 hover:scale-105 focus:outline-none"
                    aria-label="الصورة السابقة"
                  >
                    <ChevronRight className="w-5 h-5 text-[#1C1C1C]" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextSlide();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFFFFF]/85 hover:bg-[#FFFFFF] text-[#1C1C1C] flex items-center justify-center shadow-md border border-[#C8C8C6]/60 transition-all opacity-85 hover:opacity-100 hover:scale-105 focus:outline-none"
                    aria-label="الصورة التالية"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#1C1C1C]" />
                  </button>
                </>
              )}

              {/* Product Fit Tag Overlay */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-[8px] bg-[#1C1C1C]/90 backdrop-blur-md text-[#FFFFFF] text-xs font-bold font-mono tracking-wide shadow-md">
                {product.fit}
              </div>

              {product.warranty && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-[8px] bg-[#FFFFFF]/90 backdrop-blur-md text-[#1C1C1C] text-xs font-bold flex items-center gap-1.5 border border-[#C8C8C6] shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1C1C1C]" />
                  <span>{product.warranty}</span>
                </div>
              )}

              {/* Bottom Badges: Image Counter & Color Pill */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none">
                {selectedColor ? (
                  <div className="px-2.5 py-1 rounded-[8px] bg-[#FFFFFF]/95 backdrop-blur-md text-[#1C1C1C] text-[11px] font-bold flex items-center gap-1.5 border border-[#C8C8C6] shadow-md pointer-events-auto">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10"
                      style={{
                        backgroundColor:
                          product.colorOptions.find((c) => c.name === selectedColor)?.hex ||
                          '#1C1C1C',
                      }}
                    />
                    <span>لون محدد: {selectedColor} (ثابت)</span>
                  </div>
                ) : (
                  <div className="px-2.5 py-1 rounded-[8px] bg-[#FFFFFF]/95 backdrop-blur-md text-[#1C1C1C] text-[11px] font-bold flex items-center gap-1.5 border border-[#C8C8C6] shadow-md pointer-events-auto">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10"
                      style={{
                        backgroundColor:
                          product.colorOptions.find((c) => c.name === currentPreviewedColor)?.hex ||
                          product.colorOptions[activeImageIndex]?.hex ||
                          '#1C1C1C',
                      }}
                    />
                    <span>معاينة تلقائية: {currentPreviewedColor || 'جميع الألوان'}</span>
                  </div>
                )}

                {currentGallery.length > 1 && (
                  <div className="px-2.5 py-1 rounded-[8px] bg-[#1C1C1C]/85 backdrop-blur-md text-[#FFFFFF] text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md pointer-events-auto">
                    <Images className="w-3.5 h-3.5 text-[#FFFFFF]" />
                    <span>
                      {activeImageIndex + 1} / {currentGallery.length}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails Row (when gallery has multiple photos) */}
            {currentGallery.length > 1 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#AFAFAD] px-0.5">
                  <span className="font-medium text-[#1C1C1C]">
                    {selectedColor
                      ? `معاينة صور اللون (${currentGallery.length} صور) • تقليب تلقائي`
                      : `استعراض جميع ألوان الجينز (${currentGallery.length} صور) تلقائياً`}
                  </span>
                  <span>{selectedColor ? 'اضغط على أي صورة لتحديدها' : 'اضغط على أي صورة لتثبيت لونها'}</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
                  {currentGallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveImageIndex(idx);
                        if (!selectedColor && isJeansProduct) {
                          const clickedImg = currentGallery[idx];
                          let matchedColor = '';
                          if (product.colorGalleries) {
                            for (const [colName, imgs] of Object.entries(product.colorGalleries)) {
                              if (Array.isArray(imgs) && imgs.includes(clickedImg)) {
                                const found = product.colors.find(
                                  (c) => c.trim().toLowerCase() === colName.trim().toLowerCase()
                                );
                                matchedColor = found || colName;
                                break;
                              }
                            }
                          }
                          if (matchedColor) {
                            setSelectedColor(matchedColor);
                            setValidationError('');
                          }
                        }
                      }}
                      className={`relative shrink-0 w-14 h-16 sm:w-16 sm:h-20 rounded-[10px] overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#1C1C1C] ring-2 ring-[#1C1C1C]/25 scale-105 shadow-sm opacity-100'
                          : 'border-[#C8C8C6]/80 opacity-65 hover:opacity-100 hover:border-[#1C1C1C]/60'
                      }`}
                      aria-label={`عرض الصورة رقم ${idx + 1}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`معاينة ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                      {activeImageIndex === idx && (
                        <span className="absolute bottom-0 inset-x-0 h-1 bg-[#1C1C1C]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reassurance Badges */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-[14px] bg-[#1C1C1C]/[0.03] border border-[#C8C8C6]/60 text-center text-xs text-[#1C1C1C]">
              <div className="flex flex-col items-center gap-1 p-1">
                <Truck className="w-4 h-4 text-[#1C1C1C]" />
                <span className="font-bold text-[11px]">شحن القاهرة والجيزة</span>
                <span className="text-[10px] text-[#AFAFAD]">80 جنيه (3-4 أيام)</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-1 border-x border-[#C8C8C6]/50">
                <RotateCcw className="w-4 h-4 text-[#1C1C1C]" />
                <span className="font-bold text-[11px]">استبدال 14 يوم</span>
                <span className="text-[10px] text-[#AFAFAD]">بشروط الحالة الأصلية</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-1">
                <ShieldCheck className="w-4 h-4 text-[#1C1C1C]" />
                <span className="font-bold text-[11px]">دفع عند الاستلام</span>
                <span className="text-[10px] text-[#AFAFAD]">نقداً بعد المعاينة</span>
              </div>
            </div>
          </div>

          {/* Right Column (Desktop) / Second Column: Product Information & Purchase */}
          <div className="lg:col-span-6 text-right space-y-6">
            
            {/* Header Identity & Price */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#1C1C1C] text-[#FFFFFF] text-[10px] font-mono font-bold tracking-wider shrink-0">
                  ☀ SUMMER CLEARANCE
                </span>
                <span className="text-xs font-mono text-[#AFAFAD] uppercase tracking-wider">
                  ULTRA ONE FIT • {product.type}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-[#1C1C1C]/80 leading-relaxed mb-4">
                {product.cardShortCopy}
              </p>

              <div className="flex flex-col gap-1 pb-4 border-b border-[#C8C8C6]/60">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-[#1C1C1C]">
                    {product.price}
                  </span>
                  <span className="text-sm font-bold text-[#1C1C1C]">جنيه مصري</span>
                </div>
                <span className="text-[11px] text-[#777777]">
                  السعر الرسمي للقطعة في تصفيات الصيف • وفّر 150 ج.م عند طلب الـLook كاملة
                </span>
              </div>
            </div>

            {/* 1. Color Selection */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-bold text-[#1C1C1C] flex items-center gap-2">
                  <span>اختار اللون:</span>
                  <span className={selectedColor ? 'text-[#1C1C1C] font-black' : 'text-amber-700 font-medium'}>
                    {selectedColor || 'لم يتم التحديد بعد (تقليب تلقائي لجميع الألوان)'}
                  </span>
                </label>

                {isJeansProduct && selectedColor && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedColor('');
                      setActiveImageIndex(0);
                      setIsAutoPlaying(true);
                    }}
                    className="text-[11px] text-[#555555] hover:text-[#1C1C1C] underline font-medium cursor-pointer"
                  >
                    استعراض كل الألوان تلقائياً ↺
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.colorOptions.map((col, cIdx) => {
                  const isSelected = selectedColor === col.name;
                  const isBeingAutoPreviewed =
                    !selectedColor &&
                    (currentPreviewedColor === col.name || (!currentPreviewedColor && activeImageIndex === cIdx));
                  const count = product.colorGalleries?.[col.name]?.length || 0;
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => {
                        if (isJeansProduct && selectedColor === col.name) {
                          setSelectedColor('');
                          setActiveImageIndex(0);
                          setIsAutoPlaying(true);
                        } else {
                          setSelectedColor(col.name);
                          setActiveImageIndex(0);
                          setValidationError('');
                        }
                      }}
                      className={`h-10 px-3.5 rounded-[10px] border flex items-center gap-2.5 transition-all text-xs font-bold cursor-pointer ${
                        isSelected
                          ? 'border-[#1C1C1C] bg-[#1C1C1C] text-[#FFFFFF] shadow-sm'
                          : isBeingAutoPreviewed
                          ? 'border-[#1C1C1C] bg-[#1C1C1C]/5 text-[#1C1C1C] ring-2 ring-[#1C1C1C]/25 scale-105'
                          : 'border-[#C8C8C6] bg-[#FFFFFF] text-[#1C1C1C] hover:border-[#1C1C1C]/60'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full border shrink-0 ${
                          isSelected ? 'ring-1 ring-offset-1 ring-[#FFFFFF]' : 'border-[#C8C8C6]'
                        }`}
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                      {count > 1 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                            isSelected
                              ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]'
                              : 'bg-[#1C1C1C]/5 text-[#1C1C1C]/75'
                          }`}
                        >
                          {count} صور
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FFFFFF]" />}
                      {isBeingAutoPreviewed && !isSelected && (
                        <span className="text-[10px] text-[#1C1C1C]/70 font-semibold px-1 py-0.5 rounded bg-black/5">
                          معاينة
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {product.colorNotes && (
                <div className="mt-2 text-[11px] text-[#AFAFAD] leading-relaxed">
                  {product.colorNotes}
                </div>
              )}
            </div>

            {/* 2. Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-bold text-[#1C1C1C]">
                  اختار المقاس: <span className="font-normal text-[#1C1C1C]/70">{selectedSize || 'لم يتم التحديد بعد'}</span>
                </label>

                <button
                  type="button"
                  onClick={onOpenSizeChart}
                  className="text-xs text-[#1C1C1C] underline flex items-center gap-1 hover:text-[#1C1C1C]/70 font-semibold focus:outline-none"
                >
                  <Ruler className="w-3.5 h-3.5 text-[#1C1C1C]" />
                  <span>دليل المقاسات</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  const weightText = product.sizeWeights?.[sz];
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setSelectedSize(sz);
                        setValidationError('');
                      }}
                      className={`py-2.5 px-3 rounded-[10px] border text-center transition-all ${
                        isSelected
                          ? 'border-[#1C1C1C] bg-[#1C1C1C] text-[#FFFFFF] shadow-sm font-black'
                          : 'border-[#C8C8C6] bg-[#FFFFFF] text-[#1C1C1C] hover:border-[#1C1C1C]/60 font-bold'
                      }`}
                    >
                      <div className="text-sm font-mono">{sz}</div>
                      {weightText && (
                        <div
                          className={`text-[10px] mt-0.5 ${
                            isSelected ? 'text-[#C8C8C6]' : 'text-[#AFAFAD]'
                          }`}
                        >
                          {weightText}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-[#1C1C1C]">الكمية:</span>
              <div className="flex items-center rounded-[8px] border border-[#C8C8C6] overflow-hidden bg-[#FFFFFF]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-[#1C1C1C] hover:bg-[#EAEAEA] font-bold text-sm focus:outline-none"
                  aria-label="تقليل الكمية"
                >
                  -
                </button>
                <span className="px-3.5 py-1.5 font-mono font-bold text-xs text-[#1C1C1C] border-x border-[#C8C8C6]/50 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-[#1C1C1C] hover:bg-[#EAEAEA] font-bold text-sm focus:outline-none"
                  aria-label="زيادة الكمية"
                >
                  +
                </button>
              </div>
            </div>

            {/* Validation Notice */}
            {validationError && (
              <div className="p-3 rounded-[10px] bg-[#1C1C1C]/5 border border-[#1C1C1C]/20 text-xs font-bold text-[#1C1C1C] animate-in fade-in duration-200">
                {validationError}
              </div>
            )}

            {/* Primary Action Button: أضف إلى السلة */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full h-[50px] rounded-[12px] font-black text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 focus:outline-none ${
                  isAddedSuccessfully
                    ? 'bg-[#1C1C1C] text-[#FFFFFF] scale-[0.99]'
                    : 'bg-[#1C1C1C] text-[#FFFFFF] hover:bg-[#2A2A2A] hover:-translate-y-0.5 active:translate-y-0'
                }`}
                id="add-to-cart-btn"
              >
                {isAddedSuccessfully ? (
                  <>
                    <Check className="w-4 h-4 text-[#FFFFFF]" />
                    <span>تمت الإضافة للسلة</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#FFFFFF]" />
                    <span>أضف إلى السلة</span>
                  </>
                )}
              </button>

              {/* Lightweight Mini-Cart Feedback Notification */}
              {isAddedSuccessfully && (
                <div className="p-3 rounded-[12px] bg-[#1C1C1C]/[0.03] border border-[#C8C8C6] flex items-center justify-between animate-in fade-in duration-200 text-xs">
                  <div className="flex items-center gap-2 text-[#1C1C1C]">
                    <Check className="w-4 h-4 text-[#1C1C1C]" />
                    <span>اتضافت للسلة ({selectedColor} • {selectedSize})</span>
                  </div>
                  <button
                    onClick={() => setCartDrawerOpen(true)}
                    className="font-bold underline text-[#1C1C1C] hover:text-[#1C1C1C]/70"
                  >
                    عرض السلة ({totalItems})
                  </button>
                </div>
              )}
            </div>

            {/* Clear Product Specifications Sections (Section 11) */}
            <div className="pt-6 border-t border-[#C8C8C6]/60 space-y-4">
              <h3 className="font-bold text-sm text-[#1C1C1C]">مواصفات القطعة الرسمية:</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-[10px] bg-[#1C1C1C]/[0.02] border border-[#C8C8C6]/50">
                  <span className="text-[#AFAFAD] block mb-1">الخامة</span>
                  <span className="font-bold text-[#1C1C1C]">
                    {product.fabricComposition || product.fabric}
                  </span>
                </div>

                <div className="p-3 rounded-[10px] bg-[#1C1C1C]/[0.02] border border-[#C8C8C6]/50">
                  <span className="text-[#AFAFAD] block mb-1">القصة</span>
                  <span className="font-bold text-[#1C1C1C]">{product.fit}</span>
                </div>

                <div className="p-3 rounded-[10px] bg-[#1C1C1C]/[0.02] border border-[#C8C8C6]/50">
                  <span className="text-[#AFAFAD] block mb-1">الألوان</span>
                  <span className="font-bold text-[#1C1C1C]">
                    {product.colors.join(' • ')}
                  </span>
                </div>

                <div className="p-3 rounded-[10px] bg-[#1C1C1C]/[0.02] border border-[#C8C8C6]/50">
                  <span className="text-[#AFAFAD] block mb-1">المقاسات</span>
                  <span className="font-bold text-[#1C1C1C]">
                    {product.sizes.join(' / ')}
                  </span>
                </div>
              </div>

              {/* Long official description scanned */}
              <div className="p-4 rounded-[12px] bg-[#1C1C1C]/[0.02] border border-[#C8C8C6]/50">
                <span className="text-[11px] text-[#AFAFAD] font-bold block mb-1">التفاصيل الكاملة</span>
                <p className="text-xs text-[#1C1C1C]/80 leading-relaxed mb-3">
                  {product.description}
                </p>

                {product.additionalDetails && product.additionalDetails.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-[#C8C8C6]/40">
                    {product.additionalDetails.map((det, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#1C1C1C]/80">
                        <span className="w-1 h-1 rounded-full bg-[#1C1C1C]" />
                        <span>{det}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Gentle Bridge toward the Outfits Experience */}
              <div className="p-4 rounded-[14px] bg-[#1C1C1C] text-[#FFFFFF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFFFFF]" />
                    <span>بتدور على الـLook مش القطعة؟</span>
                  </div>
                  <p className="text-[11px] text-[#C8C8C6]">
                    القطعة دي مصممة لتكون جزء من Look منسق جاهز ومدروس.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToOutfits}
                  className="px-3.5 py-2 rounded-[8px] bg-[#FFFFFF] text-[#1C1C1C] text-xs font-black shrink-0 hover:bg-[#EAEAEA] transition-colors"
                >
                  شوف الـOutfits
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
