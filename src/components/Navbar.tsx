'use client';

import React, { useState } from 'react';
import { Compass, Globe, ChevronDown, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentCountry?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentCountry = 'spain' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const navLinks = [
    { label: 'Mapa · Map', href: '#mapa' },
    { label: 'Lugares · Places', href: '#lugares' },
    { label: 'Fiestas · Festivals', href: '#fiestas' },
    { label: 'Comida · Food', href: '#comida' },
    { label: 'Cultura · Culture', href: '#cultura' },
    { label: 'Herramientas · Tools', href: '#herramientas' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-cream/95 border-b border-sand shadow-2xs text-ink font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-terracotta flex items-center justify-center text-cream shadow-xs">
              <Compass className="w-5 h-5 text-cream" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink">
                  Ruta <span className="text-terracotta">Hispana</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-terracotta/10 text-terracotta border border-terracotta/20">
                  ESPAÑA
                </span>
              </div>
              <p className="text-[10px] text-ink/70 font-body hidden sm:block">
                Cuaderno Visual · Creative Exploration of the Hispanic World
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links (Bilingual labels) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-ink/80 hover:text-terracotta hover:bg-sand/50 transition-colors font-body"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Project Architecture Info Badge */}
          <div className="relative">
            <button
              onClick={() => setInfoOpen(!infoOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-sand bg-sand/30 text-xs font-semibold text-ink hover:border-terracotta transition-colors shadow-2xs cursor-pointer"
              aria-label="Country information"
            >
              <Globe className="w-3.5 h-3.5 text-terracotta" />
              <span>España · Spain</span>
              <ChevronDown className="w-3 h-3 text-ink/60" />
            </button>

            {infoOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-cream p-3.5 shadow-lg border border-sand z-50 animate-in fade-in duration-150 font-body text-ink">
                <p className="text-[10px] font-bold text-terracotta uppercase tracking-wider mb-1 font-display">
                  Capítulo Activo
                </p>
                <div className="flex items-center justify-between p-2 rounded-lg bg-sand/60 border border-sand mb-2">
                  <span className="text-xs font-bold text-ink">🇪🇸 España (Spain)</span>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-terracotta text-cream">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-ink/70 leading-relaxed">
                  Country-agnostic architecture: teammates can drop <code className="bg-sand px-1 rounded text-terracotta">mexico.json</code> into <code className="bg-sand px-1 rounded">/data/countries/</code>.
                </p>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center ml-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-ink hover:bg-sand/60 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sand bg-cream px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-ink hover:bg-sand/60 hover:text-terracotta"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
