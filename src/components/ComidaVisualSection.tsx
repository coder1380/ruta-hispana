'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FoodTileItem, SpanishWordItem } from '@/types/country';
import { PalabrasStrip } from './PalabrasStrip';
import { renderBilingualContent } from './SpanishTooltip';
import { StudentBadge } from './StudentBadge';
import { Sparkles, RotateCw, Info, Leaf } from 'lucide-react';

interface ComidaVisualSectionProps {
  comida: FoodTileItem[];
  palabras: SpanishWordItem[];
  studentName?: string;
}

type DietFilter = 'all' | 'veg' | 'non-veg' | 'egg';

export const ComidaVisualSection: React.FC<ComidaVisualSectionProps> = ({
  comida,
  palabras,
  studentName = 'Sofia Morales',
}) => {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<DietFilter>('all');

  // Short phrases with translation right next to it (rule: at most one per card)
  const dishPhrases: Record<string, { es: string; en: string }> = {
    paella: { es: '¡Qué rico!', en: 'How delicious!' },
    tortilla: { es: '¡Buen provecho!', en: 'Enjoy your meal!' },
    gazpacho: { es: '¡Qué fresco!', en: 'How refreshing!' },
    padron: { es: 'Unos pican, otros no.', en: 'Some are hot, others not.' },
    'pan-tomate': { es: 'Sabor puro.', en: 'Pure simple flavor.' },
    churros: { es: 'Para chuparse los dedos.', en: 'Finger-licking good.' },
    pulpo: { es: '¡Una delicia del mar!', en: 'A delicacy of the sea!' },
    gambas: { es: '¡Sabor a fuego y ajo!', en: 'Fire and garlic flavor!' },
  };

  const handleCardClick = (id: string) => {
    setFlippedCardId((prev) => (prev === id ? null : id));
  };

  const getEffectiveDiet = (dish: FoodTileItem): 'veg' | 'non-veg' | 'egg' => {
    if (dish.diet) return dish.diet;
    return dish.veg_friendly ? 'veg' : 'non-veg';
  };

  const filteredDishes = comida.filter((dish) => {
    if (activeFilter === 'all') return true;
    return getEffectiveDiet(dish) === activeFilter;
  });

  // Standard Indian Food Mark Renderer
  const renderIndianMark = (diet: 'veg' | 'non-veg' | 'egg', labelOnly = false) => {
    if (diet === 'veg') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-cream/95 text-emerald-900 border border-emerald-600/40 shadow-xs">
          <span
            className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center p-[1px] rounded-[2px] bg-white shrink-0"
            aria-hidden="true"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block" />
          </span>
          <span>Veg</span>
        </span>
      );
    }

    if (diet === 'egg') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-cream/95 text-amber-900 border border-amber-600/40 shadow-xs">
          <span
            className="w-3.5 h-3.5 border-2 border-amber-600 flex items-center justify-center p-[1px] rounded-[2px] bg-white shrink-0"
            aria-hidden="true"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 block" />
          </span>
          <span>Contains egg</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-cream/95 text-red-900 border border-red-700/40 shadow-xs">
        <span
          className="w-3.5 h-3.5 border-2 border-red-700 flex items-center justify-center p-[1px] rounded-[2px] bg-white shrink-0"
          aria-hidden="true"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-700 block" />
        </span>
        <span>Non-veg</span>
      </span>
    );
  };

  const countByDiet = {
    all: comida.length,
    veg: comida.filter((d) => getEffectiveDiet(d) === 'veg').length,
    'non-veg': comida.filter((d) => getEffectiveDiet(d) === 'non-veg').length,
    egg: comida.filter((d) => getEffectiveDiet(d) === 'egg').length,
  };

  return (
    <section id="comida" className="py-16 sm:py-24 bg-sand text-ink scroll-mt-16 border-t border-terracotta/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-terracotta/20">
          <div>
            <span className="animate-stamp inline-block text-xs font-bold tracking-widest uppercase text-terracotta font-display px-2.5 py-1 rounded-full bg-cream border border-terracotta/20 mb-2">
              Sección 03 · Gastronomy
            </span>
            <div className="mb-2">

            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-ink mt-1">
              Comida · Culinary Craft
            </h2>
            <p className="mt-2 text-sm sm:text-base text-ink/80 max-w-2xl font-body">
              Discover authentic signature dishes across Spain. Tap or hover each tile to flip and explore recipe notes.
            </p>
          </div>
        </div>

        {/* Dietary Filter Bar & Travellers Tip */}
        <div className="mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/70 mr-1 font-display">
              Diet Filter:
            </span>

            {/* ALL */}
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${activeFilter === 'all'
                  ? 'bg-terracotta text-cream border-terracotta shadow-xs'
                  : 'bg-cream text-ink border-sand hover:border-terracotta/40'
                }`}
            >
              <span>All</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'all' ? 'bg-cream/20 text-cream' : 'bg-sand/60 text-ink/70'}`}>
                {countByDiet.all}
              </span>
            </button>

            {/* VEG */}
            <button
              onClick={() => setActiveFilter('veg')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${activeFilter === 'veg'
                  ? 'bg-emerald-800 text-cream border-emerald-800 shadow-xs'
                  : 'bg-cream text-ink border-sand hover:border-emerald-600/40'
                }`}
            >
              <span className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center p-[1px] rounded-[2px] bg-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block" />
              </span>
              <span>Veg</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'veg' ? 'bg-cream/20 text-cream' : 'bg-sand/60 text-ink/70'}`}>
                {countByDiet.veg}
              </span>
            </button>

            {/* NON-VEG */}
            <button
              onClick={() => setActiveFilter('non-veg')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${activeFilter === 'non-veg'
                  ? 'bg-red-800 text-cream border-red-800 shadow-xs'
                  : 'bg-cream text-ink border-sand hover:border-red-700/40'
                }`}
            >
              <span className="w-3.5 h-3.5 border-2 border-red-700 flex items-center justify-center p-[1px] rounded-[2px] bg-white">
                <span className="w-1.5 h-1.5 rounded-full bg-red-700 block" />
              </span>
              <span>Non-veg</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'non-veg' ? 'bg-cream/20 text-cream' : 'bg-sand/60 text-ink/70'}`}>
                {countByDiet['non-veg']}
              </span>
            </button>

            {/* EGG */}
            <button
              onClick={() => setActiveFilter('egg')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${activeFilter === 'egg'
                  ? 'bg-amber-700 text-cream border-amber-700 shadow-xs'
                  : 'bg-cream text-ink border-sand hover:border-amber-600/40'
                }`}
            >
              <span className="w-3.5 h-3.5 border-2 border-amber-600 flex items-center justify-center p-[1px] rounded-[2px] bg-white">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 block" />
              </span>
              <span>Egg</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'egg' ? 'bg-cream/20 text-cream' : 'bg-sand/60 text-ink/70'}`}>
                {countByDiet.egg}
              </span>
            </button>
          </div>

          {/* Veg traveller tip line */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-cream/90 border border-terracotta/25 flex items-start sm:items-center gap-2.5 text-xs text-ink/80 font-body shadow-2xs">
            <Info className="w-4 h-4 text-terracotta shrink-0 mt-0.5 sm:mt-0" />
            <p className="leading-snug">
              <strong className="text-terracotta font-semibold">Veg traveller tip:</strong> Ask for <em>&ldquo;sin carne&rdquo;</em> (without meat) and <em>&ldquo;sin jamón&rdquo;</em> (without ham). Some traditional vegetable broths, beans, and tapas use cured ham or fish stock for flavor, so double-check with your <em>camarero</em> (server).
            </p>
          </div>
        </div>

        {/* 3D Flip Card Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300">
          {filteredDishes.map((dish) => {
            const isFlipped = flippedCardId === dish.id;
            const phrase = dishPhrases[dish.id] || { es: '¡Qué rico!', en: 'How delicious!' };
            const dishDiet = getEffectiveDiet(dish);

            return (
              <div
                key={dish.id}
                onClick={() => handleCardClick(dish.id)}
                className="perspective-1000 h-80 sm:h-88 cursor-pointer select-none group transition-all duration-300"
                role="button"
                tabIndex={0}
                aria-label={`${dish.name_es}: ${dish.caption}. Diet: ${dishDiet}. Tap to flip.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(dish.id);
                  }
                }}
              >
                {/* Flipping Container */}
                <div
                  className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-2xl shadow-xs group-hover:[transform:rotateY(180deg)] ${isFlipped ? '[transform:rotateY(180deg)]' : ''
                    }`}
                >
                  {/* FRONT FACE */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden border border-sand bg-cream flex flex-col justify-between">
                    <div className="relative w-full h-full overflow-hidden">
                      {dish.image ? (
                        <>
                          <Image
                            src={dish.image}
                            alt={dish.alt || dish.name_es}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 via-40% to-black/20" />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-ink/60 bg-sand/30 p-4 text-center">
                          No verified image available
                        </div>
                      )}

                      {/* Standard Indian Food Mark Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        {renderIndianMark(dishDiet)}
                      </div>

                      {/* Dish Name and Flip Hint */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                        <div>
                          <h3 className="font-display text-2xl font-bold text-cream tracking-tight drop-shadow-sm leading-tight">
                            {dish.name_es}
                          </h3>
                          <p className="text-saffron font-handwriting text-lg mt-0.5">
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
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl p-5 sm:p-6 border border-terracotta/30 bg-cream text-ink flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex items-center justify-between pb-2.5 border-b border-sand">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
                          Ficha Culinaria
                        </span>
                        <div>{renderIndianMark(dishDiet)}</div>
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-bold text-ink mt-2.5">
                        {dish.name_es}
                      </h3>

                      {/* Max 8 words caption */}
                      <p className="font-body text-sm sm:text-base italic text-ink/90 mt-2 leading-snug">
                        &ldquo;{renderBilingualContent(dish.caption)}&rdquo;
                      </p>

                      {/* Single short phrase with inline translation */}
                      <div className="mt-3 p-2.5 rounded-xl bg-sand/50 border border-sand flex items-center gap-2 text-xs">
                        <Sparkles className="w-4 h-4 text-terracotta shrink-0" />
                        <span className="font-display font-bold text-ink">
                          {phrase.es}
                        </span>
                        <span className="text-terracotta font-medium">
                          &mdash; {phrase.en}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-sand flex items-center justify-between text-[11px] text-ink/60">
                      <span className="truncate max-w-[65%]">
                        Photo:{' '}
                        {dish.source_url ? (
                          <a
                            href={dish.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="underline hover:text-terracotta"
                          >
                            {dish.credit}
                          </a>
                        ) : (
                          dish.credit
                        )}
                        {dish.license ? ` (${dish.license})` : ''}
                      </span>
                      <span className="font-mono text-terracotta font-bold text-[10px] shrink-0">
                        Tap to flip
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state if filter returns none */}
        {filteredDishes.length === 0 && (
          <div className="text-center py-12 bg-cream/50 rounded-2xl border border-sand">
            <p className="text-ink/70 font-display text-base">No dishes found matching this diet filter.</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-3 px-4 py-1.5 rounded-lg text-xs font-bold bg-terracotta text-cream"
            >
              Show all dishes
            </button>
          </div>
        )}

        {/* Palabras Strip */}
        <PalabrasStrip words={palabras} sectionName="Comida · Food" variant="light" />
      </div>
    </section>
  );
};
