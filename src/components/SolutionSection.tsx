import React from 'react';
import { Eye, Layers, Palette, Ruler, ShoppingBag } from 'lucide-react';

interface SolutionSectionProps {
  onScrollToOutfits?: () => void;
}

export const SolutionSection: React.FC<SolutionSectionProps> = ({ onScrollToOutfits }) => {
  const solutionBlocks = [
    {
      id: '01',
      icon: Eye,
      title: 'شوف الـLook كامل',
      description: 'ابدأ بالشكل النهائي، مش بقطعة منفصلة.',
    },
    {
      id: '02',
      icon: Layers,
      title: 'اعرف الـ3 قطع',
      description: 'كل Look متكوّن من 3 قطع متناسقة وواضحة قدامك.',
    },
    {
      id: '03',
      icon: Palette,
      title: 'شوف الألوان مع بعض',
      description: 'شوف كل لون في مكانه قبل ما تختار.',
    },
    {
      id: '04',
      icon: Ruler,
      title: 'راجع الـFit والمقاس',
      description: 'بيانات الموديل وجدول المقاسات يساعدوك تختار بسهولة.',
    },
    {
      id: '05',
      icon: ShoppingBag,
      title: 'وبعدها… اطلب',
      description: 'اختار مقاس الـ3 قطع، راجع طلبك، وكمّل.',
    },
  ];

  return (
    <section
      id="solution-section"
      className="bg-[#1C1C1C] text-[#FFFFFF] py-12 sm:py-16 md:py-20 border-b border-[#C8C8C6]/15"
      dir="rtl"
    >
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Badge */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div
            id="solution-badge"
            className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FFFFFF]/[0.08] border border-[#C8C8C6]/30 text-[#EAEAEA] text-xs font-bold tracking-wide select-none"
          >
            <span>الحل أبسط</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-[800px] mx-auto mb-8 sm:mb-12">
          <h2
            id="solution-headline"
            className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFFFF] leading-[1.25] sm:leading-[1.2] tracking-tight"
          >
            بلاش تبدأ من القطعة… ابدأ من الـOutfit.
          </h2>
        </div>

        {/* 5-Block Grid: Responsive reflow */}
        <div className="max-w-[1040px] mx-auto">
          {/* Top 3 blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 mb-3 sm:mb-5">
            {solutionBlocks.slice(0, 3).map((block) => {
              const IconComp = block.icon;
              return (
                <div
                  key={block.id}
                  id={`solution-block-${block.id}`}
                  className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#232323] border border-[#383838] flex flex-col items-center text-center hover:border-[#C8C8C6]/50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2E2E2E] border border-[#484848] flex items-center justify-center mb-3 group-hover:bg-[#FFFFFF] group-hover:text-[#1C1C1C] transition-colors duration-200">
                    <IconComp className="w-4 h-4 sm:w-5 sm:h-5 text-[#EAEAEA] group-hover:text-[#1C1C1C] transition-colors duration-200" strokeWidth={1.75} />
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#FFFFFF] mb-1.5 leading-snug">
                    {block.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#C8C8C6] leading-relaxed font-normal">
                    {block.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom 2 blocks (centered on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 max-w-[690px] mx-auto">
            {solutionBlocks.slice(3, 5).map((block) => {
              const IconComp = block.icon;
              return (
                <div
                  key={block.id}
                  id={`solution-block-${block.id}`}
                  className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#232323] border border-[#383838] flex flex-col items-center text-center hover:border-[#C8C8C6]/50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2E2E2E] border border-[#484848] flex items-center justify-center mb-3 group-hover:bg-[#FFFFFF] group-hover:text-[#1C1C1C] transition-colors duration-200">
                    <IconComp className="w-4 h-4 sm:w-5 sm:h-5 text-[#EAEAEA] group-hover:text-[#1C1C1C] transition-colors duration-200" strokeWidth={1.75} />
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#FFFFFF] mb-1.5 leading-snug">
                    {block.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#C8C8C6] leading-relaxed font-normal">
                    {block.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
