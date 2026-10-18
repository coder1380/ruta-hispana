'use client';

import React, { useState } from 'react';
import { FamousFoodItem } from '@/types/country';
import { StudentBadge } from './StudentBadge';
import { SpanishTooltip } from './SpanishTooltip';
import { Leaf, Volume2, RotateCw, GlassWater, Utensils } from 'lucide-react';

interface FoodSectionProps {
  foods: FamousFoodItem[];
  drink: { name_es: string; tagline: string };
  studentName?: string;
}

export const FoodSection: React.FC<FoodSectionProps> = ({
  foods,
  drink,
  studentName = 'Sofia Morales',
}) => {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const speakText = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section id="food" className="py-16 sm:py-24 bg-[#FCFAF6] border-t border-[#E6DCCD] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#E6DCCD]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C25B38]">
                Gastronomía Tradicional · Authentic Flavors
              </span>
              <StudentBadge studentName={studentName} role="Gastronomy & 3D Interactive Cards" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1917]">
              Comida · Culinary Heritage
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#57524E] max-w-2xl font-body">
              Spanish cuisine revolves around pristine raw ingredients: cold-pressed olive oil, coarse sea salt, and patience. Click any card to flip.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#354020] bg-[#EEF3E6] px-3.5 py-1.5 rounded-full border border-[#4A582F]/20 self-start md:self-auto">
            <Leaf className="w-3.5 h-3.5 text-[#4A582F]" />
            <span>🌱 = Plato Vegetariano (Vegetarian)</span>
          </div>
        </div>

        {/* 6 Foods Grid (3D Flip Cards with 1-Line summaries) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {foods.map((food, index) => {
            const isFlipped = !!flippedCards[index];

            return (
              <div
                key={food.name_es}
                className="perspective-1000 h-64 sm:h-72 cursor-pointer select-none group"
                onClick={() => toggleFlip(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleFlip(index);
                  }
                }}
                aria-label={`Flip card for ${food.name_es}`}
              >
                <div
                  className={`relative w-full h-full rounded-2xl transition-transform duration-500 transform-style-3d shadow-xs hover:shadow-md ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 backface-hidden bg-[#F9F6F0] rounded-2xl p-6 border border-[#E6DCCD] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2.5 rounded-xl bg-[#F4EFE6] text-[#943A1E] border border-[#E6DCCD]">
                          <Utensils className="w-4 h-4" />
                        </span>

                        {food.veg_friendly ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EEF3E6] text-[#354020] border border-[#4A582F]/25">
                            <Leaf className="w-3 h-3" /> Vegetariano
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#57524E] bg-[#F4EFE6]">
                            Tradicional
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-2xl font-bold text-[#1C1917]">
                          {food.name_es}
                        </h3>
                        <button
                          onClick={(e) => speakText(food.name_es, e)}
                          className="p-1.5 text-[#943A1E] hover:bg-[#F4EFE6] rounded-full transition-colors"
                          title="Pronounce dish"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#D99B26] mt-1 font-display">
                        Plato Español
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E6DCCD] flex items-center justify-between text-xs text-[#57524E]">
                      <span className="flex items-center gap-1 font-medium text-[#C25B38]">
                        <RotateCw className="w-3 h-3" /> Toca para voltear · Flip
                      </span>
                      <span className="font-mono text-[11px] text-[#943A1E]">#0{index + 1}</span>
                    </div>
                  </div>

                  {/* BACK SIDE (Strictly One-Line Description) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#1C1917] text-[#F9F6F0] rounded-2xl p-6 border border-[#C25B38]/40 flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                        <span className="text-[11px] font-bold text-[#D99B26] uppercase tracking-wider font-display">
                          {food.name_es}
                        </span>
                        {food.veg_friendly && (
                          <span className="text-[10px] font-semibold text-[#A3E635] flex items-center gap-0.5">
                            <Leaf className="w-2.5 h-2.5" /> Veg
                          </span>
                        )}
                      </div>

                      {/* Short: One Line Only */}
                      <p className="text-sm font-body text-white/95 leading-relaxed italic pt-2">
                        &ldquo;{food.line}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                      <span className="flex items-center gap-1">
                        <RotateCw className="w-3 h-3" /> Click to return
                      </span>
                      <span className="font-handwriting text-sm text-[#D99B26]">Ruta Hispana</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Drink Banner */}
        <div className="rounded-2xl p-6 sm:p-8 bg-[#F4EFE6] border border-[#E6DCCD] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D99B26] flex items-center justify-center text-white shrink-0 shadow-xs">
              <GlassWater className="w-6 h-6 text-[#FCFAF6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#943A1E] font-display">
                  Bebida Típica · Iconic Refreshment
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF3E6] text-[#354020] border border-[#4A582F]/20">
                  100% Plant-Based
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1C1917] mt-0.5">
                {drink.name_es}
              </h3>
              <p className="text-xs sm:text-sm text-[#57524E] font-body mt-1">
                {drink.tagline}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={(e) => speakText(drink.name_es, e)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6DCCD] bg-[#FCFAF6] text-xs font-semibold text-[#943A1E] hover:bg-[#F9F6F0] transition-colors shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Pronunciar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
