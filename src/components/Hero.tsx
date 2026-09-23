import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Headphones,
  BookOpen,
} from 'lucide-react';

interface HeroProps {
  onScrollToOutfits: () => void;
  onOpenGuide: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToOutfits, onOpenGuide }) => {
  const handleOutfitGuideClick = () => {
    const element = document.getElementById('concept-cards-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      onOpenGuide();
    }
  };

  return (
    <section
      id="hero-section"
      className="relative bg-[#1C1C1C] text-[#FFFFFF] pt-20 sm:pt-28 pb-12 sm:pb-16 overflow-hidden border-b border-[#C8C8C6]/15"
      dir="rtl"
    >
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        
        {/* Summer Clearance Hero Offer Banner */}
        <div
          id="hero-announcement-badge"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#FFFFFF]/[0.08] border border-[#C8C8C6]/30 text-[#FFFFFF] text-xs font-semibold mb-4 sm:mb-6 shadow-sm"
        >
          <span className="px-2 py-0.5 rounded-md bg-[#FFFFFF] text-[#1C1C1C] text-[10px] sm:text-[11px] font-mono font-black tracking-wider uppercase shrink-0">
            ☀ SUMMER CLEARANCE
          </span>
          <span className="text-xs text-[#EAEAEA] font-bold">
            توفير 150 جنيه على أي Look كاملة
          </span>
        </div>

        {/* Main Headline */}
        <h1
          id="hero-headline"
          className="max-w-[760px] mx-auto text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFFFF] tracking-tight leading-[1.25] sm:leading-tight mb-3 sm:mb-4"
        >
          اختار الـLook كاملة ووفّر 150 جنيه
        </h1>

        {/* Sub-headline */}
        <p
          id="hero-description"
          className="max-w-[620px] mx-auto text-xs min-[400px]:text-sm sm:text-base font-normal text-[#C8C8C6] leading-relaxed mb-6 sm:mb-8 text-center"
        >
          3 قطع متناسقة، اختيار أسهل، وسعر أقل من شراء القطع منفصلة. لوك كامل منسق ليضمن شكلك في الخروجات والكافيهات والجامعة.
        </p>

        {/* Main Buttons */}
        <div
          id="hero-cta-group"
          className="flex flex-row items-center justify-center gap-2.5 sm:gap-3 mb-8 sm:mb-10 w-full max-w-[420px]"
        >
          {/* Primary CTA */}
          <button
            onClick={onScrollToOutfits}
            id="hero-primary-cta"
            className="flex-1 sm:flex-initial h-[44px] sm:h-[48px] px-5 sm:px-8 rounded-xl bg-[#FFFFFF] text-[#1C1C1C] font-extrabold text-xs sm:text-sm hover:bg-[#EAEAEA] transition-all duration-200 shadow-lg flex items-center justify-center gap-2 focus:outline-none hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>شوف الـLooks</span>
            <ArrowLeft className="w-4 h-4 text-[#1C1C1C]" />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={handleOutfitGuideClick}
            id="hero-secondary-cta"
            className="flex-1 sm:flex-initial h-[44px] sm:h-[48px] px-4 sm:px-6 rounded-xl bg-transparent border border-[#C8C8C6]/35 text-[#EAEAEA] font-semibold text-xs sm:text-sm hover:bg-[#FFFFFF]/10 hover:border-[#C8C8C6]/70 transition-all duration-200 focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C8C8C6]" />
            <span>دليل التنسيقات</span>
          </button>
        </div>

        {/* 4 Benefits Row: Clean 2-column grid on mobile, unified flex on tablet/desktop */}
        <div
          id="hero-benefit-row"
          className="w-full max-w-[700px] grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-x-6 sm:gap-y-2 text-[11px] sm:text-xs text-[#C8C8C6] font-medium"
        >
          <div className="flex items-center justify-center gap-1.5 p-2 sm:p-0 rounded-lg bg-[#FFFFFF]/[0.03] sm:bg-transparent border border-[#C8C8C6]/15 sm:border-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#EAEAEA] shrink-0" />
            <span>استبدال خلال 14 يوم</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 p-2 sm:p-0 rounded-lg bg-[#FFFFFF]/[0.03] sm:bg-transparent border border-[#C8C8C6]/15 sm:border-0">
            <Truck className="w-3.5 h-3.5 text-[#EAEAEA] shrink-0" />
            <span>شحن 80 ج.م للقاهرة</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 p-2 sm:p-0 rounded-lg bg-[#FFFFFF]/[0.03] sm:bg-transparent border border-[#C8C8C6]/15 sm:border-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#EAEAEA] shrink-0" />
            <span>3 قطع أكتر من لوك</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 p-2 sm:p-0 rounded-lg bg-[#FFFFFF]/[0.03] sm:bg-transparent border border-[#C8C8C6]/15 sm:border-0">
            <Headphones className="w-3.5 h-3.5 text-[#EAEAEA] shrink-0" />
            <span>متابعة حتى الاستلام</span>
          </div>
        </div>

      </div>
    </section>
  );
};
