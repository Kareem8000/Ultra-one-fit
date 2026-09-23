import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { CatalogProduct } from '../types';
import { OFFICIAL_CATALOG_PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

interface ProductsPageProps {
  onOpenProductDetails: (product: CatalogProduct, initialColor?: string) => void;
  onNavigateToOutfits: () => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onOpenProductDetails,
  onNavigateToOutfits,
}) => {
  return (
    <div
      className="bg-[#FFFFFF] text-[#1C1C1C] min-h-screen pt-20 sm:pt-24 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-[1200px] mx-auto">
        
        {/* Minimal Editorial Hero */}
        <section className="text-center max-w-[680px] mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1C1C]/[0.05] border border-[#C8C8C6] text-xs font-bold text-[#1C1C1C] mb-3">
            <span>المنتجات الرسمية</span>
          </div>

          <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl font-black text-[#1C1C1C] tracking-tight mb-2.5">
            كل قطعة… بكل تفاصيلها.
          </h1>

          <p className="text-xs min-[400px]:text-sm sm:text-base text-[#555555] leading-relaxed">
            شوف الخامة، القصة، الألوان، المقاسات والأسعار المعتمدة قبل ما تختار.
          </p>
        </section>

        {/* Summer Clearance Promo Banner on Products Page */}
        <section className="max-w-[900px] mx-auto mb-8 sm:mb-10">
          <div className="rounded-2xl bg-[#1C1C1C] text-[#FFFFFF] border border-[#C8C8C6]/20 p-4 sm:p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FFFFFF]/10 border border-white/20 text-[#FFFFFF] text-[10px] sm:text-[11px] font-mono font-black tracking-wider uppercase mb-1.5">
                ☀ SUMMER CLEARANCE
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#FFFFFF] mb-1">
                أسعار الصيف على القطع والـLooks
              </h2>
              <p className="text-xs sm:text-sm text-[#C8C8C6] max-w-[540px]">
                اختار القطع اللي محتاجها، أو خُد Look كاملة ووفّر 150 جنيه مباشرة.
              </p>
            </div>

            <button
              onClick={onNavigateToOutfits}
              className="inline-flex items-center justify-center gap-2 h-[42px] px-5 rounded-xl bg-[#FFFFFF] text-[#1C1C1C] font-bold text-xs sm:text-sm hover:bg-[#EAEAEA] transition-all shrink-0 shadow-sm cursor-pointer active:scale-95"
            >
              <span>شوف الـLooks ووفر 150 جنيه</span>
              <ArrowLeft className="w-3.5 h-3.5 text-[#1C1C1C]" />
            </button>
          </div>
        </section>

        {/* Product Grid: Desktop 3x2, Tablet 2, Mobile 1 */}
        <section aria-label="قائمة المنتجات الرسمية">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {OFFICIAL_CATALOG_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenProductDetails}
              />
            ))}
          </div>
        </section>

        {/* Subtle Bottom Bridge to Outfits */}
        <section className="mt-12 sm:mt-16 pt-8 border-t border-[#C8C8C6]/50">
          <div className="max-w-[760px] mx-auto rounded-2xl bg-[#1C1C1C] text-[#FFFFFF] p-5 sm:p-7 text-center border border-[#C8C8C6]/20 shadow-md">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FFFFFF]/10 mb-2.5 text-[#FFFFFF]">
              <Sparkles className="w-4 h-4" />
            </div>

            <h2 className="text-base sm:text-lg font-black text-[#FFFFFF] mb-1.5">
              بتدور على الـLook مش القطعة؟
            </h2>

            <p className="text-xs sm:text-sm text-[#C8C8C6] max-w-[480px] mx-auto leading-relaxed mb-5">
              شوف الـOutfits الجاهزة واختار الـLook كاملة ووفر 150 جنيه.
            </p>

            <button
              onClick={onNavigateToOutfits}
              className="inline-flex items-center justify-center gap-2 h-[42px] px-6 rounded-xl bg-[#FFFFFF] text-[#1C1C1C] font-bold text-xs sm:text-sm hover:bg-[#EAEAEA] transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
              id="bridge-to-outfits-btn"
            >
              <span>شوف الـOutfits</span>
              <ArrowLeft className="w-4 h-4 text-[#1C1C1C]" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
