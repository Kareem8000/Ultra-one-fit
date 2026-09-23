import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';

interface TopAnnouncementBarProps {
  onCtaClick: () => void;
  onDismiss?: () => void;
}

export const TopAnnouncementBar: React.FC<TopAnnouncementBarProps> = ({
  onCtaClick,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div
      id="top-announcement-bar"
      className="relative z-50 bg-[#1C1C1C] text-[#FFFFFF] border-b border-[#C8C8C6]/20 py-1.5 sm:py-2 px-2.5 sm:px-6 transition-all duration-300"
    >
      <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Spacer for symmetrical center balance on desktop */}
        <div className="hidden md:block w-7 shrink-0" aria-hidden="true" />

        {/* Content: Mobile-First Auto-fitting Layout */}
        <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-3 text-center min-w-0 overflow-hidden">
          {/* Badge: Shown on all screens, compact on mobile */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#FFFFFF]/15 text-[#FFFFFF] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider shrink-0">
            <span className="text-yellow-400">☀</span>
            <span className="hidden xs:inline">SUMMER CLEARANCE</span>
            <span className="xs:hidden">CLEARANCE</span>
          </span>

          {/* Offer text */}
          <span className="text-[11px] sm:text-xs md:text-[13px] font-medium text-[#EAEAEA] truncate sm:overflow-visible">
            <span className="hidden sm:inline">وفّر 150 جنيه عند اختيار أي Look كاملة</span>
            <span className="sm:hidden">وفّر 150 ج.م على أي Look</span>
          </span>

          {/* CTA Link */}
          <button
            onClick={onCtaClick}
            type="button"
            className="inline-flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-xs font-bold text-[#FFFFFF] underline underline-offset-4 decoration-[#C8C8C6]/60 hover:decoration-[#FFFFFF] hover:text-[#FFFFFF] transition-all cursor-pointer group shrink-0"
          >
            <span>شوف الـLooks</span>
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="إغلاق شريط الإعلان"
          className="p-1 rounded-md text-[#C8C8C6] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

