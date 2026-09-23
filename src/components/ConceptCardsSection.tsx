import React, { useState } from 'react';
import { Outfit } from '../types';
import { OUTFITS } from '../data/outfits';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, Check } from 'lucide-react';

interface ConceptCardsSectionProps {
  onSelectOutfit: (outfit: Outfit) => void;
  onOpenGuide: () => void;
}

export const ConceptCardsSection: React.FC<ConceptCardsSectionProps> = ({
  onSelectOutfit,
}) => {
  // Mobile / Tab Active Index for swapping view
  const [activeTab, setActiveTab] = useState<number>(0);

  const nextLook = () => {
    setActiveTab((prev) => (prev + 1) % OUTFITS.length);
  };

  const prevLook = () => {
    setActiveTab((prev) => (prev - 1 + OUTFITS.length) % OUTFITS.length);
  };

  return (
    <section
      id="concept-cards-section"
      className="bg-[#FFFFFF] text-[#1C1C1C] py-16 sm:py-24 border-b border-[#C8C8C6]/30"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-[800px] mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1C1C1C]/[0.05] border border-[#C8C8C6] text-xs font-bold text-[#1C1C1C] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#1C1C1C]" />
            <span>7 Looks منسقة بالكامل</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#1C1C1C] leading-tight mb-3">
            Outfits متناسقة جاهزة لكل وقت في يومك
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            3 قطع متناسقة (تيشيرت + جينز + سنيكرز) توفر عليك التفكير وتضمن ظهورك بأفضل ستايل مع توفير مباشر.
          </p>
        </div>

        {/* Summer Clearance Offer Strip Above Look Grid */}
        <div className="max-w-[860px] mx-auto mb-8 sm:mb-10 p-4 sm:p-5 rounded-2xl bg-[#1C1C1C] text-[#FFFFFF] border border-[#C8C8C6]/20 shadow-md text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-[5px] bg-[#FFFFFF] text-[#1C1C1C] text-[10px] sm:text-[11px] font-mono font-black tracking-wider">
              ☀ SUMMER CLEARANCE
            </span>
            <span className="text-sm sm:text-base font-bold text-[#FFFFFF]">
              كل Look كاملة = توفير 150 جنيه
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#C8C8C6]">
            التوفير محسوب من أسعار القطع الحالية عند شرائها منفصلة.
          </p>
        </div>

        {/* Interactive Tabs / Switcher */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {OUTFITS.map((outfit, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={outfit.id}
                onClick={() => setActiveTab(index)}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 focus:outline-none cursor-pointer ${
                  isActive
                    ? 'bg-[#1C1C1C] text-[#FFFFFF] shadow-md scale-105'
                    : 'bg-[#F4F4F4] text-[#555555] border border-[#C8C8C6]/60 hover:text-[#1C1C1C] hover:border-[#1C1C1C]'
                }`}
              >
                <span className="font-mono text-[11px] opacity-80">{outfit.number}</span>
                <span>{outfit.name}</span>
              </button>
            );
          })}
        </div>

        {/* ----------------- MOBILE SWAPPABLE CAROUSEL / SLIDER (< md) ----------------- */}
        <div className="block md:hidden">
          {(() => {
            const outfit = OUTFITS[activeTab];
            return (
              <div
                key={outfit.id}
                className="rounded-2xl bg-[#FFFFFF] border border-[#C8C8C6] shadow-md overflow-hidden text-right flex flex-col transition-all duration-300 animate-in fade-in"
              >
                {/* Look Product Image with Badges */}
                <div
                  onClick={() => onSelectOutfit(outfit)}
                  className="relative aspect-[4/3] w-full bg-[#F4F4F4] overflow-hidden border-b border-[#C8C8C6]/50 cursor-pointer group/img"
                  title={`عرض تفاصيل ${outfit.name}`}
                >
                  <img
                    src={outfit.image}
                    alt={outfit.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
                  
                  {/* Top floating metadata */}
                  <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md bg-[#1C1C1C]/80 backdrop-blur-md text-[10px] font-bold text-[#FFFFFF]">
                      {outfit.context}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#FFFFFF]/90 backdrop-blur-md text-[10px] font-mono font-bold text-[#1C1C1C]">
                      وفّر 150 ج.م
                    </span>
                  </div>

                  {/* Bottom Image Headline */}
                  <div className="absolute bottom-3 right-3 left-3 text-right">
                    <div className="text-[11px] font-mono font-bold text-[#C8C8C6] mb-0.5">
                      {outfit.number} — {outfit.name}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#FFFFFF] leading-tight drop-shadow-md">
                      {outfit.message}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Description */}
                    <p className="text-xs text-[#555555] leading-relaxed mb-4 pb-3 border-b border-[#C8C8C6]/40">
                      {outfit.descriptionText}
                    </p>

                    {/* Pieces Breakdown List with Prices */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[11px] font-bold text-[#1C1C1C] block">
                        القطع الـ 3 المكونة للـ Look:
                      </span>
                      {outfit.pieces.map((piece) => (
                        <div
                          key={piece.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#F9F9F9] border border-[#C8C8C6]/50 text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                              style={{ backgroundColor: piece.colorHex }}
                            />
                            <div className="truncate">
                              <span className="font-bold text-[#1C1C1C] block truncate leading-tight">
                                {piece.name}
                              </span>
                              <span className="text-[10px] text-[#555555]">
                                {piece.colorName}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-[#1C1C1C] shrink-0 mr-1 text-[11px]">
                            {piece.price} ج.م
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summer Clearance Pricing Breakdown without nested frames */}
                  <div className="pt-3 border-t border-[#C8C8C6]/40">
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center justify-between text-xs text-[#777777]">
                        <span>إجمالي القطع منفصلة:</span>
                        <span className="font-mono line-through">
                          {outfit.separatePrice.toLocaleString('ar-EG')} جنيه
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#1C1C1C] block">سعر الـLook كاملة:</span>
                          <span className="text-[11px] font-bold text-emerald-700">وفرت 150 جنيه في التصفيات</span>
                        </div>
                        <div className="flex items-baseline gap-1 font-mono text-[#1C1C1C]">
                          <span className="text-xl sm:text-2xl font-black">
                            {outfit.totalPrice.toLocaleString('ar-EG')}
                          </span>
                          <span className="text-xs font-bold text-[#555555]">جنيه</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectOutfit(outfit)}
                      className="w-full h-[46px] rounded-xl bg-[#1C1C1C] text-[#FFFFFF] font-extrabold text-xs hover:bg-[#000000] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 group cursor-pointer"
                    >
                      <span>شوف الـLook</span>
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Mobile Navigation Arrows to Swap cleanly */}
                <div className="px-5 py-3 bg-[#F9F9F9] border-t border-[#C8C8C6]/40 flex items-center justify-between text-xs text-[#555555]">
                  <button
                    onClick={prevLook}
                    className="flex items-center gap-1 hover:text-[#1C1C1C] py-1 px-2.5 rounded-lg bg-[#FFFFFF] border border-[#C8C8C6]/50 font-medium cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>الـLook السابقة</span>
                  </button>
                  <span className="font-mono font-bold text-xs text-[#1C1C1C]">
                    {activeTab + 1} / {OUTFITS.length}
                  </span>
                  <button
                    onClick={nextLook}
                    className="flex items-center gap-1 hover:text-[#1C1C1C] py-1 px-2.5 rounded-lg bg-[#FFFFFF] border border-[#C8C8C6]/50 font-medium cursor-pointer"
                  >
                    <span>الـLook التالية</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ----------------- DESKTOP 7-CARD GRID (>= md) ----------------- */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-right items-stretch">
          {OUTFITS.map((outfit, index) => {
            const isSelected = activeTab === index;
            return (
              <div
                key={outfit.id}
                onMouseEnter={() => setActiveTab(index)}
                className={`rounded-2xl bg-[#FFFFFF] border transition-all duration-300 shadow-sm overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? 'border-[#1C1C1C] shadow-lg scale-[1.01]'
                    : 'border-[#C8C8C6] hover:border-[#1C1C1C]'
                }`}
              >
                {/* Look Photo Box */}
                <div
                  onClick={() => onSelectOutfit(outfit)}
                  className="relative aspect-[16/11] w-full bg-[#F4F4F4] overflow-hidden border-b border-[#C8C8C6]/50 cursor-pointer group/img"
                  title={`عرض تفاصيل ${outfit.name}`}
                >
                  <img
                    src={outfit.image}
                    alt={outfit.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

                  {/* Top Bar on Photo */}
                  <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md bg-[#1C1C1C]/80 backdrop-blur-md text-[10px] font-bold text-[#FFFFFF]">
                      {outfit.context}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#FFFFFF]/90 backdrop-blur-md text-[10px] font-mono font-bold text-[#1C1C1C]">
                      وفّر 150 ج.م
                    </span>
                  </div>

                  {/* Headline over Image */}
                  <div className="absolute bottom-3 right-3 left-3 text-right">
                    <div className="text-[11px] font-mono font-bold text-[#C8C8C6] mb-0.5">
                      {outfit.number} — {outfit.name}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#FFFFFF] leading-snug drop-shadow-md">
                      {outfit.message}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Description */}
                    <p className="text-xs text-[#555555] leading-relaxed mb-4 min-h-[44px]">
                      {outfit.descriptionText}
                    </p>

                    {/* Pieces Breakdown */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[11px] font-bold text-[#1C1C1C] block">
                        القطع الـ 3 المكونة للـ Look:
                      </span>
                      {outfit.pieces.map((piece) => (
                        <div
                          key={piece.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#F9F9F9] border border-[#C8C8C6]/50 text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                              style={{ backgroundColor: piece.colorHex }}
                            />
                            <span className="font-bold text-[#1C1C1C] truncate">
                              {piece.name} — {piece.colorName}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-[#1C1C1C] shrink-0 mr-1 text-[11px]">
                            {piece.price} ج.م
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summer Clearance Pricing Breakdown */}
                  <div className="pt-3 border-t border-[#C8C8C6]/40">
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center justify-between text-xs text-[#777777]">
                        <span>القطع منفصلة:</span>
                        <span className="font-mono line-through">
                          {outfit.separatePrice.toLocaleString('ar-EG')} جنيه
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#1C1C1C] block">سعر الـLook:</span>
                          <span className="text-[11px] font-bold text-emerald-700">وفرت 150 جنيه في التصفيات</span>
                        </div>
                        <div className="flex items-baseline gap-1 font-mono text-[#1C1C1C]">
                          <span className="text-xl font-black">
                            {outfit.totalPrice.toLocaleString('ar-EG')}
                          </span>
                          <span className="text-xs font-bold text-[#555555]">جنيه</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectOutfit(outfit)}
                      className="w-full h-[42px] rounded-lg bg-[#1C1C1C] text-[#FFFFFF] font-extrabold text-xs hover:bg-[#000000] transition-all flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
                    >
                      <span>شوف الـLook</span>
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
