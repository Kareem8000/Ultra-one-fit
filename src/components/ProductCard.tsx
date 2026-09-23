import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CatalogProduct } from '../types';

interface ProductCardProps {
  product: CatalogProduct;
  onOpenDetails: (product: CatalogProduct, initialColor?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
}) => {
  const isAutoPreviewProduct =
    product.id === 'prod-3-regular-jeans' ||
    product.id === 'prod-4-wide-leg-jeans' ||
    product.id === 'prod-5-adidas-sneakers';
  const [hasUserSelectedColor, setHasUserSelectedColor] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<string>(product.colors[0]);

  useEffect(() => {
    setActiveColor(product.colors[0]);
    setHasUserSelectedColor(false);
  }, [product.id]);

  const matchingKey = Object.keys(product.colorGalleries || {}).find((k) => {
    const kLow = k.trim().toLowerCase();
    const actLow = activeColor.trim().toLowerCase();
    return kLow === actLow || kLow.includes(actLow) || actLow.includes(kLow);
  });
  const displayImage =
    (activeColor && product.colorGalleries?.[activeColor]?.[0]) ||
    (matchingKey && product.colorGalleries?.[matchingKey]?.[0]) ||
    product.image;

  const handleOpen = () => {
    onOpenDetails(product, isAutoPreviewProduct && !hasUserSelectedColor ? undefined : activeColor);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-[#FFFFFF] rounded-2xl border border-[#C8C8C6] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 sm:p-5 hover:-translate-y-0.5 text-right"
    >
      <div>
        {/* Product Image Frame (Consistent 3:4 Aspect Ratio) */}
        <div
          onClick={handleOpen}
          className="relative w-full aspect-[3/4] rounded-xl bg-[#EAEAEA]/30 overflow-hidden mb-3.5 cursor-pointer border border-[#C8C8C6]/40"
        >
          <img
            src={displayImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />

          {/* Fit and Summer badge on top corner */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
            <span className="px-2 py-0.5 rounded-md bg-[#1C1C1C] text-[#FFFFFF] text-[10px] font-mono font-bold tracking-wider shadow-sm uppercase">
              ☀ SUMMER
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#FFFFFF]/95 backdrop-blur-sm text-[#1C1C1C] text-[10px] font-bold font-mono tracking-wide shadow-sm border border-black/10">
              {product.fit}
            </span>
          </div>
        </div>

        {/* Product Identity */}
        <div className="space-y-1 mb-3">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onOpenDetails(product, activeColor)}
              className="font-bold text-base sm:text-lg text-[#1C1C1C] leading-snug cursor-pointer hover:underline decoration-[#1C1C1C]/30 transition-all"
            >
              {product.name}
            </h3>
            <span className="font-mono font-bold text-sm sm:text-base text-[#1C1C1C] shrink-0 pt-0.5">
              {product.price} جنيه
            </span>
          </div>

          <p className="text-xs text-[#555555] leading-relaxed">
            {product.cardShortCopy}
          </p>
        </div>

        {/* Available Colors with Interactive Color Swatches */}
        <div className="mb-3.5 pt-2 border-t border-[#C8C8C6]/40">
          <div className="flex items-center justify-between text-xs mb-1.5 text-[#777777]">
            <span className="font-medium text-[#1C1C1C]">الألوان المتاحة:</span>
            <span className="font-medium text-[#1C1C1C]">{activeColor}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {product.colorOptions.map((col) => {
              const isSelected = activeColor === col.name;
              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => {
                    setActiveColor(col.name);
                    setHasUserSelectedColor(true);
                  }}
                  title={`${col.name}${col.note ? ` (${col.note})` : ''}`}
                  className={`relative w-6 h-6 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'border-[#1C1C1C] ring-2 ring-[#1C1C1C]/20 scale-105'
                      : 'border-[#C8C8C6] hover:scale-105'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  aria-label={col.name}
                >
                  {isSelected && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        col.hex === '#FFFFFF' || col.hex === '#F8F8F8' || col.hex === '#F4F4F4'
                          ? 'bg-[#1C1C1C]'
                          : 'bg-[#FFFFFF]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Specs & Action CTA */}
      <div className="pt-3 border-t border-[#C8C8C6]/40 flex items-center justify-between gap-2">
        <span className="text-[11px] text-[#777777] font-medium truncate">
          {product.fabricComposition || product.fabric}
        </span>

        <button
          onClick={handleOpen}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#1C1C1C] hover:bg-[#1C1C1C]/5 py-1.5 px-3 rounded-lg transition-colors cursor-pointer shrink-0"
          id={`view-details-${product.id}`}
        >
          <span>التفاصيل</span>
          <ArrowLeft className="w-3.5 h-3.5 text-[#1C1C1C] transition-transform group-hover:-translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
