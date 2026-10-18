'use client';

import React from 'react';
import Image from 'next/image';
import { LandmarkItem, SpanishWordItem } from '@/types/country';
import { PalabrasStrip } from './PalabrasStrip';
import { renderBilingualContent } from './SpanishTooltip';
import { StudentBadge } from './StudentBadge';
import { MapPin } from 'lucide-react';

interface LugaresSectionProps {
  countryName: string;
  lugares: LandmarkItem[];
  palabras: SpanishWordItem[];
  studentName?: string;
  currentCountry?: string;
}

export const LugaresSection: React.FC<LugaresSectionProps> = ({
  countryName,
  lugares,
  palabras,
  studentName = 'Liam Vance',
  currentCountry,
}) => {
  const isCentralAmerica = currentCountry === 'central-america';

  const title = isCentralAmerica
    ? 'Lugares · Central American Landmarks'
    : 'Lugares · Famous Places';

  const description = isCentralAmerica
    ? 'Discover ancient Maya cities, Caribbean coastlines, tropical rainforests, volcanoes, and iconic landmarks across all seven Central American countries.'
    : `${lugares.length} defining places across ${countryName}, each captured in a field photo.`;

  const tagline = isCentralAmerica
    ? 'Siete países, mil historias'
    : 'Piedra, luz y memoria';

  return (
    <section
      id="lugares"
      className="py-16 sm:py-24 bg-cream text-ink scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-sand">
          <div>
            <span className="animate-stamp inline-block text-xs font-bold tracking-widest uppercase text-terracotta font-display px-2.5 py-1 rounded-full bg-sand/60 border border-sand mb-2">
              Sección 01 · Landmarks
            </span>
            <div className="mb-2">
              <StudentBadge studentName={studentName} role="Landmark research" />
            </div>

            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-ink mt-1">
              {title}
            </h2>

            <p className="mt-2 text-sm sm:text-base text-ink/80 max-w-2xl font-body">
              {description}
            </p>
          </div>

          <div className="text-right hidden sm:block shrink-0">
            <span className="font-handwriting text-2xl text-terracotta block">
              &ldquo;{tagline}&rdquo;
            </span>
            <span className="text-xs text-ink/70">
              Hover photo to inspect
            </span>
          </div>
        </div>

        {/* Asymmetric Magazine Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {lugares.map((place, index) => {
            const colSpan =
              index === 0
                ? 'lg:col-span-7'
                : index === 1
                  ? 'lg:col-span-5'
                  : index === 2
                    ? 'lg:col-span-4'
                    : index === 3
                      ? 'lg:col-span-4'
                      : index === 4
                        ? 'lg:col-span-4'
                        : 'lg:col-span-6';

            const heightClass =
              index === 0 || index === 1
                ? 'h-72 sm:h-84'
                : 'h-64 sm:h-72';

            const tiltClass =
              index % 2 === 0
                ? 'photo-hover-tilt'
                : 'photo-hover-tilt-alt';

            return (
              <div
                key={place.id}
                className={`${colSpan} group bg-sand/40 rounded-2xl overflow-hidden border border-sand shadow-xs flex flex-col justify-between hover:border-terracotta transition-colors duration-300`}
              >
                {/* Photo */}
                <div
                  className={`relative w-full ${heightClass} overflow-hidden bg-sand ${tiltClass}`}
                >
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* City Tag */}
                  <div className="animate-stamp absolute top-3 left-3 bg-cream/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-ink border border-sand flex items-center gap-1 shadow-xs">
                    <MapPin className="w-3 h-3 text-terracotta" />
                    <span>{place.city}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-ink mb-1 group-hover:text-terracotta transition-colors">
                      {place.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-ink/80 font-body leading-relaxed">
                      {renderBilingualContent(place.caption)}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-sand flex items-center justify-between text-xs text-ink/60 font-body">
                    <span className="italic">{place.credit}</span>
                    <span className="font-mono text-terracotta font-semibold">
                      #{index + 1}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {isCentralAmerica && lugares.length === 0 && (
          <div className="mt-8 rounded-2xl border border-sand bg-sand/30 p-8 text-center">
            <h3 className="font-display text-2xl font-bold text-ink">
              Seven countries, countless places to explore
            </h3>
            <p className="mt-2 text-sm text-ink/70">
              Landmark cards will appear here once the Central America
              chapter&apos;s places and image paths are added to its data file.
            </p>
          </div>
        )}

        {/* Spanish Vocabulary */}
        <PalabrasStrip
          words={palabras}
          sectionName="Lugares · Places"
          variant="light"
        />
      </div>
    </section>
  );
};