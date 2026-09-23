import React from 'react';
import { ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';

interface GuaranteeBannerSectionProps {
  onScrollToOutfits: () => void;
  onOpenGuide: () => void;
}

export const GuaranteeBannerSection: React.FC<GuaranteeBannerSectionProps> = ({
  onScrollToOutfits,
  onOpenGuide,
}) => {
  return (
    <section
      id="guarantee-section"
      className="bg-[#1C1C1C] text-[#FFFFFF] py-12 sm:py-16 md:py-20 border-b border-[#C8C8C6]/15 text-center relative overflow-hidden"
      dir="rtl"
    >
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFFFF]/[0.06] border border-[#C8C8C6]/30 text-xs font-semibold text-[#EAEAEA] mb-4 sm:mb-5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FFFFFF]" />
          <span>إحنا في ضهرك</span>
        </div>

        {/* Big Bold Headline */}
        <h2 className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFFFF] leading-[1.25] sm:leading-tight mb-4 sm:mb-5">
          مش متأكد من مقاس البنطلون أو السنيكرز؟
          <br />
          <span className="text-[#EAEAEA]">
            مستعدين نستبدل أي قطعة خلال 14 يوم بكل سهولة.
          </span>
        </h2>

        {/* Supporting Explanation */}
        <p className="text-xs min-[400px]:text-sm sm:text-base text-[#C8C8C6] leading-relaxed mb-6 sm:mb-8 max-w-[720px] mx-auto">
          عارفين إن شراء اللبس أونلاين محتاج راحة بال، عشان كده لو جربت الـLook ولقيت أي قطعة محتاجة مقاس أكبر أو أصغر، فريقنا بيوصلك القطعة البديلة لحد عندك.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 max-w-[440px] mx-auto">
          <button
            onClick={onScrollToOutfits}
            className="w-full sm:w-auto h-[46px] px-6 rounded-xl bg-[#FFFFFF] text-[#1C1C1C] font-extrabold text-xs sm:text-sm hover:bg-[#EAEAEA] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
          >
            <span>اختار الـOutfit وانت مطمن</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenGuide}
            className="w-full sm:w-auto h-[46px] px-5 rounded-xl border border-[#C8C8C6]/35 text-[#EAEAEA] font-semibold text-xs sm:text-sm hover:bg-[#FFFFFF]/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C8C8C6]" />
            <span>شوف الـOutfit Guide</span>
          </button>
        </div>

      </div>
    </section>
  );
};
