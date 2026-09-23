import React from 'react';

interface FooterProps {
  onOpenGuide: () => void;
  onOpenSizeChart: () => void;
  onScrollToOutfits: () => void;
  onScrollToOrderSection: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onNavigateToProducts?: () => void;
  onNavigateToOutfits?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenGuide,
  onOpenSizeChart,
  onScrollToOutfits,
  onScrollToOrderSection,
  onOpenTerms,
  onOpenPrivacy,
  onNavigateToProducts,
  onNavigateToOutfits,
}) => {
  const scrollToElement = (elementId: string) => {
    if (onNavigateToOutfits) {
      onNavigateToOutfits();
    }
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const navItems = [
    {
      label: 'الـOutfits',
      action: () => {
        if (onNavigateToOutfits) onNavigateToOutfits();
        scrollToElement('concept-cards-section');
      },
    },
    {
      label: 'المنتجات',
      action: () => {
        if (onNavigateToProducts) onNavigateToProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      label: 'إيه المشكلة؟',
      action: () => scrollToElement('problem-section'),
    },
    {
      label: 'إيه الحل؟',
      action: () => scrollToElement('solution-section'),
    },
    {
      label: 'تفاصيل الـ Look',
      action: () => scrollToElement('dedicated-pricing-section'),
    },
    {
      label: 'بيانات المودل',
      action: () => scrollToElement('editorial-model-section'),
    },
    {
      label: 'الأسئلة الشائعة',
      action: () => scrollToElement('faq-section'),
    },
  ];

  return (
    <footer
      id="main-footer"
      className="bg-[#1C1C1C] text-[#EAEAEA] pt-12 sm:pt-16 pb-28 sm:pb-16 border-t border-[#C8C8C6]/15"
      dir="rtl"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-[#C8C8C6]/15 text-right">
          
          {/* Brand Column (5 cols) */}
          <div className="md:col-span-5">
            <div className="flex flex-col mb-3">
              <span className="font-black text-xl sm:text-2xl tracking-tight text-[#FFFFFF] uppercase">
                Ultra One Fit
              </span>
              <div
                dir="ltr"
                className="flex items-center gap-1.5 text-[10px] tracking-wider text-[#AFAFAD] uppercase mt-0.5 font-medium select-none"
              >
                <span>3 pieces</span>
                <span className="text-[#C8C8C6]/60 font-black">•</span>
                <span>1 outfit</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#C8C8C6] leading-relaxed max-w-[340px] mb-4">
              Outfits متناسقة جاهزة، عشان اختيار لبسك يبقى أسهل.
            </p>

            {/* Essential Brand Shipping & Policy notes */}
            <div className="space-y-1.5 text-xs text-[#AFAFAD]">
              <p>شحن القاهرة والجيزة: 80 جنيه • التوصيل خلال 3–4 أيام عمل</p>
              <p>ضمان لمدة عام كامل على بنطلونات الجينز ضد عيوب الصناعة</p>
              <p>الاستبدال متاح خلال 14 يوم بحالته الأصلية</p>
              <p>الدفع عند الاستلام نقداً بعد المعاينة والفحص</p>
            </div>
          </div>

          {/* Navigation Links Column (4 cols) */}
          <div className="md:col-span-4">
            <span className="text-xs font-mono font-bold tracking-wider text-[#FFFFFF] uppercase block mb-3">
              الأقسام الرئيسية
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className="text-right text-[#C8C8C6] hover:text-[#FFFFFF] py-1 transition-colors focus:outline-none cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Tools & Legal (3 cols) */}
          <div className="md:col-span-3">
            <span className="text-xs font-mono font-bold tracking-wider text-[#FFFFFF] uppercase block mb-3">
              أدوات وتفاصيل
            </span>
            <div className="flex flex-col gap-2 text-xs text-[#C8C8C6]">
              <button
                onClick={onOpenSizeChart}
                className="text-right hover:text-[#FFFFFF] transition-colors focus:outline-none cursor-pointer"
              >
                جدول المقاسات بالسنتيمتر
              </button>
              <button
                onClick={onOpenGuide}
                className="text-right hover:text-[#FFFFFF] transition-colors focus:outline-none cursor-pointer"
              >
                دليل الـOutfits المعتمد
              </button>
              <button
                onClick={onOpenTerms}
                className="text-right hover:text-[#FFFFFF] transition-colors focus:outline-none cursor-pointer"
              >
                الشروط والأحكام
              </button>
              <button
                onClick={onOpenPrivacy}
                className="text-right hover:text-[#FFFFFF] transition-colors focus:outline-none cursor-pointer"
              >
                سياسة الخصوصية
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#AFAFAD]">
          <p>© {new Date().getFullYear()} Ultra One Fit. جميع الحقوق محفوظة — براند أزياء رجالي مصري.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>القاهرة، جمهورية مصر العربية</span>
            <span>•</span>
            <span className="font-mono">Summer 2026 Collection</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
