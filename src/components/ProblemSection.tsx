import React from 'react';

export const ProblemSection: React.FC = () => {
  const summaryPoints = [
    'قطع كتير… ومش دايمًا عارف إيه يركب مع إيه.',
    'بتدور على Inspiration قبل ما تشتري.',
    'وبتفضل تسأل: الـLook هيطلع زي ما أنا متخيل؟',
  ];

  const thoughtCards = [
    {
      num: '01',
      title: 'القطعة عاجباك… بس هتلبسها على إيه؟',
      desc: 'اختيار قطعة واحدة سهل. الصعب إنك تعرف هتعمل بيها Look كامل إزاي.',
      highlight: false,
    },
    {
      num: '02',
      title: 'كل قطعة ممكن تبقى حلوة لوحدها.',
      desc: 'لكن المهم الألوان والقطع لما يجتمعوا في Look واحد.',
      highlight: false,
    },
    {
      num: '03',
      title: 'وبتبدأ تسأل: اللون ده راكب مع ده؟',
      desc: 'والبنطلون؟ والجزمة؟ وهل التلاتة هيطلعوا بالشكل اللي في دماغك؟',
      highlight: false,
    },
    {
      num: '04',
      title: 'قبل ما تدفع… عايز تشوف النتيجة.',
      desc: 'مش بس تشوف المنتجات، تشوف الـLook نفسه وهو متجمع.',
      highlight: false,
    },
    {
      num: '05',
      title: 'وعشان كده بتبدأ تدور على Inspiration.',
      desc: 'TikTok، Instagram، أصحابك… لحد ما تلاقي حاجة تحاول تبني عليها.',
      highlight: false,
    },
    {
      num: '06',
      title: 'بس لسه فيه سؤال واحد.',
      desc: 'هل الـLook ده مناسب ليك، ولجسمك، ولليوم اللي هتلبسه فيه؟',
      highlight: false,
    },
    {
      num: '07',
      title: 'الموضوع كله يبدأ من الـLook.',
      desc: 'بدل ما تبدأ من قطعة وتحاول تركب الباقي، شوف الـLook كامل الأول.',
      highlight: true,
    },
  ];

  return (
    <section
      id="problem-section"
      className="bg-[#FFFFFF] text-[#1C1C1C] py-12 sm:py-16 md:py-20 border-b border-[#C8C8C6]/30"
      dir="rtl"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Right Column: Section Headline & Intro */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 text-right flex flex-col items-start">
            
            {/* Badge */}
            <div
              id="problem-badge"
              className="inline-flex items-center px-3 py-1 rounded-lg bg-[#1C1C1C] text-[#FFFFFF] text-xs font-bold tracking-wide mb-3 sm:mb-4 shadow-sm"
            >
              <span>المشكلة مش في القطعة</span>
            </div>

            {/* Headline */}
            <h2
              id="problem-headline"
              className="text-2xl min-[400px]:text-3xl sm:text-4xl font-black text-[#1C1C1C] leading-[1.3] sm:leading-[1.25] tracking-tight mb-4"
            >
              <span className="block text-[#1C1C1C]">
                مشكلتك مش إنك مش لاقي هدوم حلوة…
              </span>
              <span className="block text-[#1C1C1C]/90 mt-1">
                مشكلتك إنك مش عارف تعمل منها{' '}
                <span className="underline decoration-[#1C1C1C]/40 decoration-2 underline-offset-4">
                  Look حلو
                </span>
                .
              </span>
            </h2>

            {/* Intro */}
            <p
              id="problem-intro"
              className="text-xs min-[400px]:text-sm sm:text-base text-[#1C1C1C]/80 leading-relaxed mb-5 font-normal"
            >
              ممكن تلاقي تيشيرت عاجبك جدًا. بس أول سؤال بييجي بعده: هلبسه على إيه؟
            </p>

            {/* Quick Summary */}
            <div
              id="problem-quick-summary"
              className="space-y-2.5 mb-6 w-full pt-3 border-t border-[#C8C8C6]/40"
            >
              {summaryPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1C1C1C]/85 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1C1C1C] mt-2 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="hidden lg:block pt-3 border-t border-[#C8C8C6]/20 w-full text-xs text-[#AFAFAD]">
              Ultra One Fit • تفكيرك في اللبس بيبدأ من النتيجة النهائية
            </div>
          </div>

          {/* Left Column: 7 Thought Cards */}
          <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-3.5 text-right">
            {thoughtCards.map((card) => {
              if (card.highlight) {
                return (
                  <div
                    key={card.num}
                    id={`problem-card-${card.num}`}
                    className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#1C1C1C]/[0.03] border-2 border-[#1C1C1C] shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs sm:text-sm font-black text-[#1C1C1C] tracking-wider">
                        {card.num}
                      </span>
                      <span className="text-[10px] font-bold tracking-widest text-[#1C1C1C] uppercase px-2 py-0.5 rounded-md bg-[#1C1C1C]/10">
                        المدخل للحل
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#1C1C1C] mb-1.5 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#1C1C1C]/85 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                );
              }

              return (
                <div
                  key={card.num}
                  id={`problem-card-${card.num}`}
                  className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FFFFFF] border border-[#C8C8C6]/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#1C1C1C]/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[#AFAFAD] tracking-wider">
                      {card.num}
                    </span>
                  </div>

                  <h3 className="text-xs min-[400px]:text-sm sm:text-base font-bold text-[#1C1C1C] mb-1 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[11px] min-[400px]:text-xs sm:text-sm text-[#1C1C1C]/75 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}

            {/* Strategic Transition Bridge */}
            <button
              onClick={() => {
                const el = document.getElementById('solution-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              id="problem-transition-bridge"
              className="mt-3 pt-3 border-t border-[#C8C8C6]/40 flex items-center justify-between text-right px-1 w-full group hover:text-[#1C1C1C] transition-colors focus:outline-none cursor-pointer"
            >
              <p className="text-xs sm:text-sm font-bold text-[#1C1C1C] group-hover:underline">
                وعشان كده… إحنا بنبدأ من الـLook.
              </p>
              <span className="text-xs font-bold text-[#1C1C1C] flex items-center gap-1">
                <span>شوف الحل</span>
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
              </span>
            </button>

          </div>

        </div>
      </div>
    </section>
  );
};
