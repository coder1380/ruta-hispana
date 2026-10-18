'use client';

import React, { useState } from 'react';
import { RegionSummary, LandmarkItem } from '@/types/country';
import { MapLeaflet } from './MapLeaflet';
import { MapPin, X } from 'lucide-react';
import Image from 'next/image';

interface MapSectionProps {
  countryName: string;
  regions: RegionSummary[];
  landmarks: LandmarkItem[];
}

export const MapSection: React.FC<MapSectionProps> = ({ countryName, regions, landmarks }) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionSummary>(regions[0]);
  const [activeLandmark, setActiveLandmark] = useState<LandmarkItem | null>(null);

  const handleSelectRegion = (region: RegionSummary) => {
    setSelectedRegion(region);
    setActiveLandmark(null);
  };

  const handleSelectLandmark = (landmark: LandmarkItem) => {
    setActiveLandmark(landmark);
  };

  return (
    <section id="mapa" className="py-16 sm:py-24 bg-sand text-ink scroll-mt-16 border-t border-terracotta/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-terracotta/20">
          <div>
            <span className="animate-stamp inline-block text-xs font-bold tracking-widest uppercase text-terracotta font-display px-2.5 py-1 rounded-full bg-cream border border-terracotta/20 mb-2">
              Cartografía · Interactive Map
            </span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink mt-1">
              Mapa de {countryName} · Interactive Cartography
            </h2>
            <p className="mt-2 text-sm sm:text-base text-ink/80 max-w-2xl font-body">
              Explore each region and landmark to discover its signature place, festival, and dish.
            </p>
          </div>
          <div className="text-right hidden sm:block shrink-0">
            <span className="font-handwriting text-2xl text-terracotta block">
              &ldquo;Explora y descubre&rdquo;
            </span>
            <span className="text-xs text-ink/70">{regions.length} regions</span>
          </div>
        </div>

        {/* Region Quick Selector Pills (Stamped style) */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {regions.map((reg) => {
            const isSelected = reg.id === selectedRegion.id && !activeLandmark;
            return (
              <button
                key={reg.id}
                onClick={() => handleSelectRegion(reg)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-terracotta text-cream shadow-xs scale-105'
                    : 'bg-cream text-ink border border-terracotta/20 hover:border-terracotta hover:text-terracotta'
                }`}
              >
                {reg.name} ({reg.name_es.split('/')[0].trim()})
              </button>
            );
          })}
        </div>

        {/* Main Grid: Leaflet Map (Left) + Concise 3-Line Side Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Column (7 Cols) */}
          <div className="lg:col-span-7">
            <MapLeaflet
              regions={regions}
              landmarks={landmarks}
              selectedRegionId={selectedRegion.id}
              onSelectRegion={handleSelectRegion}
              onSelectLandmark={handleSelectLandmark}
            />
          </div>

          {/* Side Panel (5 Cols) - Concise 3-line format on Cream Paper */}
          <div className="lg:col-span-5 bg-cream rounded-2xl p-6 sm:p-7 border border-terracotta/20 shadow-sm animate-fade-in-up">
            {activeLandmark ? (
              /* Selected Landmark Mode */
              <div className="space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-sand">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
                      Monumento · Landmark
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-0.5">
                      {activeLandmark.name}
                    </h3>
                    <p className="text-xs text-ink/70 flex items-center gap-1 mt-1 font-body">
                      <MapPin className="w-3.5 h-3.5 text-terracotta" />
                      <span>{activeLandmark.city}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveLandmark(null)}
                    className="p-1 rounded-md text-ink/60 hover:text-ink hover:bg-sand/60 transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative h-48 w-full rounded-xl overflow-hidden border border-sand">
                  <Image
                    src={activeLandmark.image}
                    alt={activeLandmark.name}
                    fill
                    className="object-cover photo-hover-tilt"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>

                <p className="text-sm text-ink font-body leading-relaxed">
                  {activeLandmark.caption}
                </p>

                <p className="text-[10px] text-ink/50 pt-2 border-t border-sand">
                  Photo: {activeLandmark.credit}
                </p>
              </div>
            ) : (
              /* Region Summary Mode: Concise 3 lines */
              <div className="space-y-5">
                <div className="pb-3 border-b border-sand">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                      Región · Region
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sand text-ink font-semibold">
                      Capital: {selectedRegion.capital}
                    </span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
                    {selectedRegion.name}
                  </h3>
                  <p className="text-xs text-terracotta font-medium italic">
                    {selectedRegion.name_es}
                  </p>
                </div>

                {/* The 3 Concise Lines */}
                <div className="space-y-3 font-body text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-sand/40 border border-sand flex items-start gap-3">
                    <span className="text-xl leading-none shrink-0 mt-0.5">🏛️</span>
                    <div>
                      <span className="font-bold text-terracotta block text-xs uppercase tracking-wider">
                        Lugar famoso:
                      </span>
                      <p className="text-ink font-semibold mt-0.5">
                        {selectedRegion.famous_place}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sand/40 border border-sand flex items-start gap-3">
                    <span className="text-xl leading-none shrink-0 mt-0.5">🎉</span>
                    <div>
                      <span className="font-bold text-saffron block text-xs uppercase tracking-wider">
                        Fiesta insigne:
                      </span>
                      <p className="text-ink font-semibold mt-0.5">
                        {selectedRegion.signature_festival}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sand/40 border border-sand flex items-start gap-3">
                    <span className="text-xl leading-none shrink-0 mt-0.5">🥘</span>
                    <div>
                      <span className="font-bold text-terracotta block text-xs uppercase tracking-wider">
                        Plato típico:
                      </span>
                      <p className="text-ink font-semibold mt-0.5">
                        {selectedRegion.signature_dish}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-ink/60 font-handwriting text-base text-terracotta flex items-center justify-between">
                  <span>Selected via map circle or pills</span>
                  <span>Field notes</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
