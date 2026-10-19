'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FoodTileItem, SpanishWordItem } from '@/types/country';
import { PalabrasStrip } from './PalabrasStrip';
import { Leaf, Sparkles, RotateCw } from 'lucide-react';

interface ComidaVisualSectionProps {
  comida: FoodTileItem[];
  palabras: SpanishWordItem[];
  studentName?: string;
}

export const ComidaVisualSection: React.FC<ComidaVisualSectionProps> = ({
  comida,
  palabras,
  studentName = 'Sofia Morales',
}) => {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  // Short phrases with translation right next to it (rule: at most one per card)
  const dishPhrases: Record<string, { es: string; en: string }> = {
    paella: { es: '¡Qué rico!', en: 'How delicious!' },
    tortilla: { es: '¡Buen provecho!', en: 'Enjoy your meal!' },
    gazpacho: { es: '¡Qué fresco!', en: 'How refreshing!' },
    padron: { es: 'Unos pican, otros no.', en: 'Some are hot, others not.' },
    'pan-tomate': { es: 'Sabor puro.', en: 'Pure simple flavor.' },
    churros: { es: 'Para chuparse los dedos.', en: 'Finger-licking good.' },
  };

  const handleCardClick = (id: string) => {
    setFlippedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="comida" className="py-16 sm:py-24 bg-sand text-ink scroll-mt-16 border-t border-terracotta/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-terracotta/20">
          <div>
            <span className="animate-stamp inline-block text-xs font-bold tracking-widest uppercase text-terracotta font-display px-2.5 py-1 rounded-full bg-cream border border-terracotta/20 mb-2">
              Sección 03 · Gastronomy
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-ink mt-1">
              Comida · Culinary Craft
            </h2>
            <p className="mt-2 text-sm sm:text-base text-ink/80 max-w-2xl font-body">
              Discover local ingredients and signature dishes. Hover or tap each tile to flip and reveal notes.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-cream text-ink border border-terracotta/20 shadow-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              <span>🌱 = Vegetarian plate</span>
            </span>
          </div>
        </div>

        {/* 3D Flip Card Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {comida.map((dish) => {
            const isFlipped = flippedCardId === dish.id;
            const phrase = dishPhrases[dish.id] || { es: '¡Qué rico!', en: 'How delicious!' };

            return (
              <div
                key={dish.id}
                onClick={() => handleCardClick(dish.id)}
                className="perspective-1000 h-80 sm:h-88 cursor-pointer select-none group"
                role="button"
                tabIndex={0}
                aria-label={`${dish.name_es}: ${dish.caption}. Tap to flip.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(dish.id);
                  }
                }}
              >
                {/* Flipping Container */}
                <div
                  className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-2xl shadow-xs group-hover:[transform:rotateY(180deg)] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* FRONT FACE */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden border border-sand bg-cream flex flex-col justify-between">
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={dish.image}
                        alt={dish.name_es}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 via-40% to-transparent" />

                      {/* Dietary Tag */}
                      <div className="absolute top-3.5 right-3.5 z-10">
                        {dish.veg_friendly ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-cream/95 text-ink border border-emerald-700/30 shadow-xs">
                            <Leaf className="w-3 h-3 text-emerald-700" />
                            <span>Veg</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cream/95 text-ink border border-sand shadow-xs">
                            Meat / Seafood
                          </span>
                        )}
                      </div>

                      {/* Dish Name and Flip Hint */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                        <div>
                          <h3 className="font-display text-2xl sm:text-3xl font-bold text-cream tracking-tight drop-shadow-sm">
                            {dish.name_es}
                          </h3>
                          <p className="text-xs text-saffron font-handwriting text-lg mt-0.5">
                            {phrase.es} &mdash; {phrase.en}
                          </p>
                        </div>
                        <span className="p-1.5 rounded-full bg-cream/80 text-ink text-xs backdrop-blur-xs flex items-center gap-1 shrink-0">
                          <RotateCw className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE (REVEAL CARD) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl p-6 sm:p-7 border border-terracotta/30 bg-cream text-ink flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-sand">
                        <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                          Ficha Culinaria · Recipe Note
                        </span>
                        {dish.veg_friendly && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-sand/60 px-2 py-0.5 rounded-full">
                            <Leaf className="w-3 h-3 text-emerald-700" />
                            <span>Apto para vegetarianos</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-3">
                        {dish.name_es}
                      </h3>

                      {/* Max 8 words caption */}
                      <p className="font-body text-base sm:text-lg italic text-ink/90 mt-3 leading-snug">
                        &ldquo;{dish.caption}&rdquo;
                      </p>

                      {/* Single short phrase with inline translation */}
                      <div className="mt-4 p-3 rounded-xl bg-sand/50 border border-sand flex items-center gap-2 text-xs">
                        <Sparkles className="w-4 h-4 text-terracotta shrink-0" />
                        <span className="font-display font-bold text-ink">
                          {phrase.es}
                        </span>
                        <span className="text-terracotta font-medium">
                          &mdash; {phrase.en}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-sand flex items-center justify-between text-xs text-ink/60">
                      <span>Photo: {dish.credit}</span>
                      <span className="font-mono text-terracotta font-bold">Tap to flip back</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Palabras Strip */}
        <PalabrasStrip words={palabras} sectionName="Comida · Food" variant="light" />
      </div>
    </section>
  );
};
