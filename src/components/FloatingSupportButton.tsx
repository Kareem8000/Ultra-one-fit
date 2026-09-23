import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface FloatingSupportButtonProps {
  onScrollToFaq: () => void;
}

export const FloatingSupportButton: React.FC<FloatingSupportButtonProps> = ({
  onScrollToFaq,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('مرحباً، أود الاستفسار عن أطقم Ultra One Fit ومقاساتها.');
    window.open(`https://wa.me/201000000000?text=${message}`, '_blank');
  };

  return (
    <div
      id="floating-support-action"
      className="fixed bottom-[74px] sm:bottom-5 left-3 sm:left-6 z-40"
      dir="rtl"
    >
      {/* Mini Tooltip */}
      {tooltipOpen && (
        <div className="absolute bottom-[56px] left-0 w-[240px] p-3 rounded-2xl bg-[#1C1C1C] border border-[#C8C8C6]/30 text-[#FFFFFF] shadow-2xl text-right animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-1 pb-1 border-b border-[#C8C8C6]/20">
            <span className="text-[11px] font-bold text-[#EAEAEA]">خدمة العملاء (واتساب)</span>
            <button
              onClick={() => setTooltipOpen(false)}
              className="text-[#AFAFAD] hover:text-[#FFFFFF] cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-[#C8C8C6] mb-2 leading-relaxed">
            تواصل معانا مباشرة على واتساب لأي استفسار عن المقاسات أو تأكيد الطلب.
          </p>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={handleWhatsAppClick}
              className="w-full py-1.5 px-2 rounded-lg bg-[#FFFFFF] text-[#1C1C1C] font-bold text-[10px] flex items-center justify-center gap-1.5 hover:bg-[#EAEAEA] cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>محادثة واتساب فورية</span>
            </button>
            <button
              onClick={() => {
                setTooltipOpen(false);
                onScrollToFaq();
              }}
              className="w-full py-1 px-2 rounded-lg text-[#C8C8C6] hover:text-[#FFFFFF] text-[10px] text-center cursor-pointer"
            >
              أو شوف الأسئلة الشائعة
            </button>
          </div>
        </div>
      )}

      {/* Floating Black WhatsApp Button */}
      <button
        onClick={() => setTooltipOpen(!tooltipOpen)}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1C1C1C] text-[#FFFFFF] border border-[#C8C8C6]/40 shadow-xl flex items-center justify-center hover:bg-[#000000] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none cursor-pointer"
        aria-label="تواصل مع خدمة العملاء"
        title="خدمة العملاء واتساب"
      >
        <MessageCircle className="w-5 h-5 text-[#FFFFFF]" />
      </button>
    </div>
  );
};
