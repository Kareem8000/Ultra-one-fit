import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface StickyBottomCtaProps {
  onScrollToOrderSection: () => void;
  onOpenGuide?: () => void;
}

export const StickyBottomCta: React.FC<StickyBottomCtaProps> = ({
  onScrollToOrderSection,
}) => {
  return (
    <div
      id="sticky-bottom-cta-bar"
      className="fixed bottom-3 sm:bottom-5 inset-x-0 z-40 pointer-events-none flex items-center justify-center px-4"
    >
      <div className="pointer-events-auto flex items-center justify-center p-1 rounded-full bg-[#1C1C1C]/95 backdrop-blur-md border border-[#C8C8C6]/30 shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
        <button
          onClick={onScrollToOrderSection}
          id="sticky-bar-action-btn"
          className="h-[42px] sm:h-[46px] px-4 min-[380px]:px-5 sm:px-7 rounded-full bg-[#FFFFFF] text-[#1C1C1C] font-extrabold text-xs sm:text-sm hover:bg-[#EAEAEA] transition-all duration-200 shadow-md flex items-center justify-center gap-2 focus:outline-none active:scale-95 cursor-pointer"
        >
          <span className="px-2 py-0.5 rounded-full bg-[#1C1C1C] text-[#FFFFFF] text-[10px] font-mono font-bold">
            وفّر 150 ج.م
          </span>
          <span>اطلب الـLook كاملة</span>
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1C1C1C]" />
        </button>
      </div>
    </div>
  );
};
