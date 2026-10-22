'use client';

import React from 'react';
import { IndiaTravellerGuide } from '@/types/country';
import { StudentBadge } from './StudentBadge';
import {
  FileText,
  Plane,
  IndianRupee,
  Leaf,
  CheckCircle2,
} from 'lucide-react';

interface IndiaTravellerProps {
  data: IndiaTravellerGuide;
  studentName?: string;
}

export const IndiaTraveller: React.FC<IndiaTravellerProps> = ({
  data,
  studentName = 'Rohan Verma',
}) => {
  return (
    <section id="india" className="py-16 sm:py-24 bg-[#FCFAF6] border-t border-[#E6DCCD] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#E6DCCD]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C25B38]">
                Consejos Prácticos · Cross-Cultural Travel Guide
              </span>

            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1917]">
              Consejos para Viajeros de la India · Indian Traveller&apos;s Guide
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#57524E] max-w-2xl font-body">
              Entry requirements, route guidance, source-based INR budget information, and vegetarian dining notes for travelers from India.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* 1. Visa Requirements */}
          <div className="bg-[#F9F6F0] rounded-2xl p-6 sm:p-7 border border-[#E6DCCD] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-[#F4E8E2] text-[#943A1E]">
                  <FileText className="w-5 h-5" />
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FCFAF6] border border-[#E6DCCD] text-[#943A1E]">
                  {data.visa_label ?? 'Check visa requirements'}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#1C1917] mb-2">
                Visado y Trámites · Visa Process
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1917] font-body leading-relaxed">
                {data.visa_note}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E6DCCD] flex items-center justify-between text-xs text-[#57524E]">
              {data.visa_official_url ? (
                <a
                  className="underline underline-offset-2"
                  href={data.visa_official_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {data.visa_official_label ?? 'Official guidance'}
                </a>
              ) : (
                <span>Check with the relevant consular authority</span>
              )}
              <span className="text-[#943A1E] font-semibold">
                {data.visa_timing_note ?? 'Recheck before travel'}
              </span>
            </div>
          </div>

          {/* 2. Flight Logistics */}
          <div className="bg-[#F9F6F0] rounded-2xl p-6 sm:p-7 border border-[#E6DCCD] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-[#F4EFE6] text-[#C25B38]">
                  <Plane className="w-5 h-5" />
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FCFAF6] border border-[#E6DCCD] text-[#57524E]">
                  {data.flight_duration ?? 'Not verified'}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#1C1917] mb-2">
                Vuelos y Conexiones · Flight Routes
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1917] font-body leading-relaxed">
                {data.flight_note}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E6DCCD] flex items-center justify-between text-xs text-[#57524E]">
              <span>{data.flight_route ?? 'Route not verified'}</span>
              <span className="text-[#C25B38] font-semibold">
                {data.flight_carriers ?? 'Carriers not verified'}
              </span>
            </div>
          </div>

          {/* 3. Budget in INR */}
          <div className="bg-[#F9F6F0] rounded-2xl p-6 sm:p-7 border border-[#E6DCCD] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-[#FCF4E4] text-[#D99B26]">
                  <IndianRupee className="w-5 h-5 text-[#A66E0C]" />
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FCFAF6] border border-[#E6DCCD] text-[#A66E0C]">
                  {data.cost_daily_range ?? 'Range not verified'}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#1C1917] mb-2">
                Presupuesto en Rupias · Daily Costs in INR
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1917] font-body leading-relaxed">
                {data.cost_per_day_inr ?? 'No source-based daily cost estimate is available.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E6DCCD] flex items-center justify-between text-xs text-[#57524E]">
              <span>{data.cost_reference_note ?? 'Check current local prices'}</span>
              <span className="text-[#4A582F] font-semibold">INR</span>
            </div>
          </div>

          {/* 4. Vegetarian Tips */}
          <div className="bg-[#F9F6F0] rounded-2xl p-6 sm:p-7 border border-[#4A582F]/20 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-[#EEF3E6] text-[#4A582F]">
                  <Leaf className="w-5 h-5" />
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FCFAF6] border border-[#E6DCCD] text-[#354020]">
                  Dieta Vegetariana
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#1C1917] mb-2">
                Consejos para Vegetarianos · Dining Navigation
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1917] font-body leading-relaxed">
                {data.veg_tips}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E6DCCD] flex items-center justify-between text-xs text-[#354020]">
              <span className="font-bold">
                Frase clave: &ldquo;{data.key_food_phrase ?? 'Sin carne ni pescado, por favor'}&rdquo;
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#4A582F]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
