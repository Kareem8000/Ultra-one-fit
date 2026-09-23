import React, { useState } from 'react';
import { Menu, X, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  currentView: 'home' | 'outfits' | 'look-detail' | 'products' | 'product-detail';
  onNavigateToOutfits: () => void;
  onNavigateToProducts: () => void;
  onScrollToSection: (sectionId: string) => void;
  onScrollToOrderSection: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateToOutfits,
  onNavigateToProducts,
  onScrollToSection,
  onScrollToOrderSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setCartDrawerOpen } = useCart();

  const navItems = [
    {
      id: 'nav-outfits',
      label: 'الـOutfits',
      action: () => {
        setMobileMenuOpen(false);
        onNavigateToOutfits();
      },
      isActive: currentView === 'outfits' || currentView === 'look-detail',
    },
    {
      id: 'nav-products',
      label: 'المنتجات',
      action: () => {
        setMobileMenuOpen(false);
        onNavigateToProducts();
      },
      isActive: currentView === 'products' || currentView === 'product-detail',
    },
    {
      id: 'nav-problem',
      label: 'إيه المشكلة؟',
      action: () => {
        setMobileMenuOpen(false);
        onScrollToSection('problem-section');
      },
      isActive: false,
    },
    {
      id: 'nav-solution',
      label: 'إيه الحل؟',
      action: () => {
        setMobileMenuOpen(false);
        onScrollToSection('solution-section');
      },
      isActive: false,
    },
    {
      id: 'nav-look-details',
      label: 'تفاصيل الـ Look',
      action: () => {
        setMobileMenuOpen(false);
        onScrollToSection('dedicated-pricing-section');
      },
      isActive: false,
    },
    {
      id: 'nav-model',
      label: 'بيانات المودل',
      action: () => {
        setMobileMenuOpen(false);
        onScrollToSection('editorial-model-section');
      },
      isActive: false,
    },
    {
      id: 'nav-faq',
      label: 'الأسئلة الشائعة',
      action: () => {
        setMobileMenuOpen(false);
        onScrollToSection('faq-section');
      },
      isActive: false,
    },
  ];

  return (
    <header
      id="main-header"
      className="fixed top-2 sm:top-3.5 inset-x-0 z-50 px-2.5 sm:px-4 pointer-events-none transition-all duration-200"
    >
      {/* Floating Island Navigation Bar */}
      <div className="max-w-[1240px] mx-auto rounded-xl sm:rounded-2xl bg-[#1C1C1C]/95 backdrop-blur-md border border-[#C8C8C6]/30 shadow-[0_8px_30px_rgb(0,0,0,0.5)] px-2.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between pointer-events-auto transition-all duration-200">
        
        {/* Right (RTL): Brand Logo with Tagline */}
        <button
          onClick={onNavigateToOutfits}
          className="flex items-center gap-1.5 sm:gap-2 group focus:outline-none shrink-0 text-right cursor-pointer"
          id="header-logo-link"
        >
          <div className="flex flex-col text-right">
            <span className="font-black text-sm min-[380px]:text-base sm:text-lg tracking-tight text-[#FFFFFF] uppercase leading-none">
              Ultra One Fit
            </span>
            <div
              dir="ltr"
              className="flex items-center gap-1 text-[8.5px] min-[380px]:text-[9.5px] sm:text-[10px] tracking-wider text-[#AFAFAD] uppercase mt-0.5 font-medium select-none"
            >
              <span>3 pieces</span>
              <span className="text-[#C8C8C6]/60 font-black">•</span>
              <span>1 outfit</span>
            </div>
          </div>
        </button>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-[13px] font-semibold">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`transition-colors focus:outline-none py-1 whitespace-nowrap cursor-pointer ${
                item.isActive
                  ? 'text-[#FFFFFF] font-bold border-b-2 border-[#FFFFFF] pb-0.5'
                  : 'text-[#C8C8C6] hover:text-[#FFFFFF]'
              }`}
              id={`${item.id}-btn`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Left (RTL): Actions Group (Cart + CTA + Mobile Menu) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Cart Button */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="h-[34px] sm:h-[38px] px-2 sm:px-3 rounded-lg sm:rounded-xl bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#FFFFFF] border border-[#C8C8C6]/30 flex items-center justify-center gap-1.5 transition-all duration-200 focus:outline-none relative active:scale-95 cursor-pointer"
            aria-label={`سلة المشتريات (${totalItems} قطعة)`}
            id="header-cart-btn"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFFFFF]" />
              {totalItems > 0 && (
                <span className="sm:hidden absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#FFFFFF] text-[#1C1C1C] text-[9px] font-mono font-black flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-[#FFFFFF]">السلة</span>
            {totalItems > 0 ? (
              <span className="hidden sm:flex min-w-[18px] h-[18px] px-1 rounded-full bg-[#FFFFFF] text-[#1C1C1C] text-[10px] font-mono font-black items-center justify-center">
                {totalItems}
              </span>
            ) : (
              <span className="hidden sm:inline text-[11px] font-mono text-[#AFAFAD]">(0)</span>
            )}
          </button>

          {/* Action Button: اطلب الـ Outfit */}
          <button
            onClick={onScrollToOrderSection}
            className="h-[34px] sm:h-[38px] px-2.5 min-[380px]:px-3 sm:px-4 rounded-lg sm:rounded-xl bg-[#FFFFFF] text-[#1C1C1C] font-black text-[11px] min-[380px]:text-xs hover:bg-[#EAEAEA] transition-all duration-200 shadow-sm flex items-center justify-center gap-1 sm:gap-1.5 focus:outline-none active:scale-95 shrink-0 cursor-pointer"
            id="header-cta-btn"
          >
            <span className="hidden min-[360px]:inline">اطلب الـLook</span>
            <span className="min-[360px]:hidden">اطلب</span>
            <ArrowLeft className="w-3 h-3 min-[380px]:w-3.5 min-[380px]:h-3.5 text-[#1C1C1C]" />
          </button>

          {/* Mobile / Tablet Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-[34px] w-[34px] flex items-center justify-center text-[#EAEAEA] hover:text-[#FFFFFF] focus:outline-none rounded-lg hover:bg-[#FFFFFF]/10 transition-colors cursor-pointer"
            aria-label="القائمة"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="max-w-[1240px] mx-auto mt-2 rounded-xl sm:rounded-2xl bg-[#1C1C1C]/98 backdrop-blur-xl border border-[#C8C8C6]/25 px-4 py-3.5 shadow-2xl lg:hidden animate-in fade-in duration-200 text-right pointer-events-auto">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#EAEAEA]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`py-2 px-3 rounded-lg text-right transition-colors focus:outline-none cursor-pointer ${
                  item.isActive
                    ? 'bg-[#FFFFFF] text-[#1C1C1C] font-bold'
                    : 'bg-[#FFFFFF]/5 hover:bg-[#FFFFFF]/10 text-[#EAEAEA]'
                }`}
                id={`${item.id}-mobile-btn`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-[#C8C8C6]/20 flex items-center justify-between text-[11px] text-[#AFAFAD]">
            <span>Ultra One Fit • شحن لجميع مناطق القاهرة</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToOrderSection();
              }}
              className="text-[#FFFFFF] font-bold underline"
            >
              اطلب الآن
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
