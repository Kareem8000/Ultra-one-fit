import React, { useState } from 'react';
import { Outfit } from '../types';
import { OUTFITS } from '../data/outfits';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface ConceptCardsSectionProps {
  onSelectOutfit: (outfit: Outfit) => void;
  onOpenGuide: () => void;
}

export const ConceptCardsSection: React.FC<ConceptCardsSectionProps> = ({
  onSelectOutfit,
}) => {
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
      className="bg-[#FFFFFF] text-[#1C1C1C] py-12 sm:py-16 md:py-20 border-b border-[#C8C8C6]/30"
      dir="rtl"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-[800px] mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1C1C]/[0.05] border border-[#C8C8C6] text-xs font-bold text-[#1C1C1C] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#1C1C1C]" />
            <span>7 Looks منسقة بالكامل</span>
          </div>

          <h2 className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-black text-[#1C1C1C] leading-tight mb-2.5">
            Outfits متناسقة جاهزة لكل وقت في يومك
          </h2>
          <p className="text-xs min-[400px]:text-sm sm:text-base text-[#555555] leading-relaxed max-w-xl mx-auto">
            3 قطع متناسقة (تيشيرت + جينز + سنيكرز) توفر عليك التفكير وتضمن مظهرك بأفضل ستايل مع توفير 150 جنيه فوراً.
          </p>
        </div>

        {/* Unified Summer Clearance Offer Banner */}
        <div className="max-w-[780px] mx-auto mb-6 sm:mb-8 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#1C1C1C] text-[#FFFFFF] border border-[#C8C8C6]/20 shadow-md text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="px-2 py-0.5 rounded-md bg-[#FFFFFF] text-[#1C1C1C] text-[10px] sm:text-[11px] font-mono font-black tracking-wider uppercase">
              ☀ SUMMER CLEARANCE
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#FFFFFF]">
              توفير 150 جنيه مباشر على أي Look كاملة
            </span>
          </div>
        </div>

        {/* Interactive Tabs / Switcher: Horizontal scroll on mobile, flex-wrap on tablet */}
        <div className="flex items-center sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 mb-6 sm:mb-8 no-scrollbar scroll-smooth">
          {OUTFITS.map((outfit, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={outfit.id}
                onClick={() => setActiveTab(index)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shrink-0 focus:outline-none cursor-pointer ${
                  isActive
                    ? 'bg-[#1C1C1C] text-[#FFFFFF] shadow-sm'
                    : 'bg-[#F4F4F4] text-[#555555] border border-[#C8C8C6]/60 hover:text-[#1C1C1C] hover:border-[#1C1C1C]'
                }`}
              >
                <span className="font-mono text-[10px] opacity-80">{outfit.number}</span>
                <span className="whitespace-nowrap">{outfit.name}</span>
              </button>
            );
          })}
        </div>

        {/* ----------------- MOBILE SWAPPABLE CARD (< md) ----------------- */}
        <div className="block md:hidden">
          {(() => {
            const outfit = OUTFITS[activeTab];
            return (
              <div
                key={outfit.id}
                className="rounded-2xl bg-[#FFFFFF] border border-[#C8C8C6] shadow-sm overflow-hidden text-right flex flex-col transition-all duration-300 animate-in fade-in"
              >
                {/* Look Product Image with Badges */}
                <div
                  onClick={() => onSelectOutfit(outfit)}
                  className="relative aspect-[4/3] w-full bg-[#F4F4F4] overflow-hidden border-b border-[#C8C8C6]/40 cursor-pointer group/img"
                  title={`عرض تفاصيل ${outfit.name}`}
                >
                  <img
                    src={outfit.image}
                    alt={outfit.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20" />
                  
                  {/* Top floating metadata */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md bg-[#1C1C1C]/85 backdrop-blur-md text-[10px] font-bold text-[#FFFFFF]">
                      {outfit.context}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FFFFFF]/95 backdrop-blur-md text-[10px] font-mono font-bold text-[#1C1C1C]">
                      وفّر 150 ج.م
                    </span>
                  </div>

                  {/* Bottom Image Headline */}
                  <div className="absolute bottom-3 inset-x-3 text-right">
                    <div className="text-[11px] font-mono font-bold text-[#C8C8C6] mb-0.5">
                      {outfit.number} — {outfit.name}
                    </div>
                    <h3 className="text-base font-black text-[#FFFFFF] leading-tight drop-shadow-sm">
                      {outfit.message}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Description */}
                    <p className="text-xs text-[#555555] leading-relaxed mb-3 pb-3 border-b border-[#C8C8C6]/40">
                      {outfit.descriptionText}
                    </p>

                    {/* Pieces Breakdown List */}
                    <div className="space-y-1.5 mb-2">
                      <span className="text-[11px] font-bold text-[#1C1C1C] block mb-1">
                        القطع الـ 3 المكونة للـ Look:
                      </span>
                      {outfit.pieces.map((piece) => (
                        <div
                          key={piece.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#F9F9F9] border border-[#C8C8C6]/40 text-xs"
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
                              <span className="text-[10px] text-[#777777]">
                                {piece.colorName}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-[#1C1C1C] shrink-0 text-[11px]">
                            {piece.price} ج.م
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clean Pricing Breakdown */}
                  <div className="pt-3 border-t border-[#C8C8C6]/40">
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-xs text-[#777777]">
                        <span>إجمالي القطع منفصلة:</span>
                        <span className="font-mono line-through">
                          {outfit.separatePrice.toLocaleString('ar-EG')} جنيه
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#1C1C1C] block">سعر الـLook كاملة:</span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">وفرت 150 جنيه</span>
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
                      className="w-full h-[44px] rounded-xl bg-[#1C1C1C] text-[#FFFFFF] font-extrabold text-xs hover:bg-[#000000] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span>شوف الـLook</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile Navigation Arrows */}
                <div className="px-4 py-2.5 bg-[#F9F9F9] border-t border-[#C8C8C6]/40 flex items-center justify-between text-xs text-[#555555]">
                  <button
                    onClick={prevLook}
                    className="flex items-center gap-1 hover:text-[#1C1C1C] py-1 px-2.5 rounded-lg bg-[#FFFFFF] border border-[#C8C8C6]/50 font-medium cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>السابق</span>
                  </button>
                  <span className="font-mono font-bold text-xs text-[#1C1C1C] num-ltr">
                    {activeTab + 1} / {OUTFITS.length}
                  </span>
                  <button
                    onClick={nextLook}
                    className="flex items-center gap-1 hover:text-[#1C1C1C] py-1 px-2.5 rounded-lg bg-[#FFFFFF] border border-[#C8C8C6]/50 font-medium cursor-pointer"
                  >
                    <span>التالي</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
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
                  className="relative aspect-[4/3] w-full bg-[#F4F4F4] overflow-hidden border-b border-[#C8C8C6]/50 cursor-pointer"
                >
                  <img
                    src={outfit.image}
                    alt={outfit.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md bg-[#1C1C1C]/85 backdrop-blur-md text-[10px] font-bold text-[#FFFFFF]">
                      {outfit.context}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FFFFFF]/95 backdrop-blur-md text-[10px] font-mono font-bold text-[#1C1C1C]">
                      وفّر 150 ج.م
                    </span>
                  </div>

                  {/* Bottom Meta */}
                  <div className="absolute bottom-3.5 inset-x-3.5 text-right">
                    <div className="text-[11px] font-mono font-bold text-[#C8C8C6] mb-0.5">
                      {outfit.number} — {outfit.name}
                    </div>
                    <h3 className="text-lg font-black text-[#FFFFFF] leading-tight">
                      {outfit.message}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-xs text-[#555555] leading-relaxed mb-4 pb-3 border-b border-[#C8C8C6]/40">
                      {outfit.descriptionText}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      <span className="text-[11px] font-bold text-[#1C1C1C] block mb-1">
                        القطع الـ 3 المكونة للـ Look:
                      </span>
                      {outfit.pieces.map((piece) => (
                        <div
                          key={piece.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#F9F9F9] border border-[#C8C8C6]/40 text-xs"
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
                              <span className="text-[10px] text-[#777777]">
                                {piece.colorName}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-[#1C1C1C] shrink-0 text-[11px]">
                            {piece.price} ج.م
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Breakdown & CTA */}
                  <div className="pt-3 border-t border-[#C8C8C6]/40">
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-xs text-[#777777]">
                        <span>إجمالي القطع منفصلة:</span>
                        <span className="font-mono line-through">
                          {outfit.separatePrice.toLocaleString('ar-EG')} جنيه
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#1C1C1C] block">سعر الـLook كاملة:</span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">وفرت 150 جنيه</span>
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
                      className="w-full h-[44px] rounded-xl bg-[#1C1C1C] text-[#FFFFFF] font-extrabold text-xs hover:bg-[#000000] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 group/btn cursor-pointer"
                    >
                      <span>شوف الـLook</span>
                      <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
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
