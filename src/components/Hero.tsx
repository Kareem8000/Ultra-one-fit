import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Headphones,
  BookOpen,
} from 'lucide-react';
import { HERO_IMAGE } from '../data/outfits';

interface HeroProps {
  onScrollToOutfits: () => void;
  onOpenGuide: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToOutfits, onOpenGuide }) => {
  const handleOutfitGuideClick = () => {
    // Scroll down to the 3 Outfits section as specified
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
      className="relative bg-[#1C1C1C] text-[#FFFFFF] pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden border-b border-[#C8C8C6]/15"
    >
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        
        {/* Summer Clearance Hero Offer Banner */}
        <div
          id="hero-announcement-badge"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF]/[0.08] border border-[#C8C8C6]/30 text-[#FFFFFF] text-xs font-semibold mb-4 sm:mb-5 shadow-sm hover:border-[#FFFFFF]/40 transition-colors"
        >
          <span className="px-2 py-0.5 rounded-[5px] bg-[#FFFFFF] text-[#1C1C1C] text-[10px] sm:text-[11px] font-mono font-black tracking-wider">
            ☀ SUMMER CLEARANCE
          </span>
          <span className="text-xs text-[#EAEAEA] font-medium">
            توفير 150 جنيه على أي Look كاملة
          </span>
        </div>

        {/* Main Headline */}
        <h1
          id="hero-headline"
          className="max-w-[760px] mx-auto text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] font-black text-[#FFFFFF] tracking-tight leading-snug sm:leading-tight mb-3 sm:mb-4"
        >
          <span className="block">اختار الـLook كاملة ووفّر 150 جنيه</span>
        </h1>

        {/* Sub-headline */}
        <p
          id="hero-description"
          dir="rtl"
          className="max-w-[620px] mx-auto text-xs sm:text-sm md:text-[15px] font-normal text-[#C8C8C6] leading-relaxed mb-6 sm:mb-7 text-center"
        >
          3 قطع متناسقة، اختيار أسهل، وسعر أقل من شراء القطع منفصلة. لوك كامل منسق ليضمن شكلك في الخروجات والكافيهات والجامعة.
        </p>

        {/* Main Buttons */}
        <div
          id="hero-cta-group"
          className="flex flex-row items-center justify-center gap-2.5 sm:gap-3 mb-6 sm:mb-8 w-full sm:w-auto"
        >
          {/* Primary CTA: "شوف الـLooks" */}
          <button
            onClick={onScrollToOutfits}
            id="hero-primary-cta"
            className="h-[44px] sm:h-[46px] px-6 sm:px-7 rounded-[8px] bg-[#FFFFFF] text-[#1C1C1C] font-extrabold text-xs sm:text-sm hover:bg-[#EAEAEA] transition-all duration-200 shadow-md flex items-center justify-center gap-2 focus:outline-none hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>شوف الـLooks</span>
            <ArrowLeft className="w-4 h-4 text-[#1C1C1C]" />
          </button>

          {/* Secondary CTA: "تصفح القطع" */}
          <button
            onClick={handleOutfitGuideClick}
            id="hero-secondary-cta"
            className="h-[44px] sm:h-[46px] px-4 sm:px-5 rounded-[8px] bg-transparent border border-[#C8C8C6]/35 text-[#EAEAEA] font-semibold text-xs sm:text-sm hover:bg-[#FFFFFF]/10 hover:border-[#C8C8C6]/70 transition-all duration-200 focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C8C8C6]" />
            <span>دليل التنسيقات</span>
          </button>
        </div>

        {/* 7. 4 Benefit Texts: Shortened, compact, space-efficient */}
        <div
          id="hero-benefit-row"
          className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-6 gap-y-2 text-[11px] sm:text-xs text-[#C8C8C6] font-medium mb-8 sm:mb-10"
        >
          {/* 1 */}
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#EAEAEA] shrink-0" />
            <span>استبدال خلال 14 يوم</span>
          </div>

          {/* 2 */}
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#EAEAEA] shrink-0" />
            <span>مصاريف الشحن 80 جنيه للقاهرة فقط</span>
          </div>

          {/* 3 */}
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#EAEAEA] shrink-0" />
            <span>3 قطع أكتر من لوك</span>
          </div>

          {/* 4 */}
          <div className="flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-[#EAEAEA] shrink-0" />
            <span>المتابعة مستمرة حتى الاستلام</span>
          </div>
        </div>

      </div>
    </section>
  );
};
