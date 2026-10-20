'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { RegionSummary, LandmarkItem } from '@/types/country';
import { Compass, RotateCcw, MapPin } from 'lucide-react';

interface MapLeafletProps {
  regions: RegionSummary[];
  landmarks: LandmarkItem[];
  selectedRegionId: string;
  onSelectRegion: (region: RegionSummary) => void;
  onSelectLandmark: (landmark: LandmarkItem) => void;
}

export const MapLeaflet: React.FC<MapLeafletProps> = ({
  regions,
  landmarks,
  selectedRegionId,
  onSelectRegion,
  onSelectLandmark,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const geoJsonLayerRef = useRef<any>(null);
  const markersRef = useRef<{ id: string; marker: any; originalCoords: [number, number] }[]>([]);
  const [activeRegionName, setActiveRegionName] = useState<string>('');

  const mainlandBounds: [[number, number], [number, number]] = [
    [35.8, -9.5], // Southwest Spain (Cadiz / Tarifa)
    [43.9, 4.4],  // Northeast Spain (Girona / Cap de Creus)
  ];

  // Helper to normalize GeoJSON names to match our regions array
  const normalizeCommunityName = (name: string): string => {
    const n = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (n.includes('andaluc')) return 'andalusia';
    if (n.includes('catalun') || n.includes('catalan')) return 'catalonia';
    if (n.includes('pais vasco') || n.includes('euskadi') || n.includes('vasco')) return 'basque-country';
    if (n.includes('galicia')) return 'galicia';
    if (n.includes('madrid')) return 'madrid';
    if (n.includes('valenc')) return 'valencia';
    return '';
  };

  const getRegionThemeColor = (regionId: string): string => {
    switch (regionId) {
      case 'andalusia':
        return '#C2512B'; // terracotta
      case 'catalonia':
        return '#E5A02D'; // saffron
      case 'basque-country':
        return '#1E3A5F'; // azulejo deep blue
      case 'galicia':
        return '#2A6F62'; // atlantic green
      case 'madrid':
        return '#C2512B'; // terracotta
      case 'valencia':
        return '#E5A02D'; // saffron
      default:
        return '#C2512B';
    }
  };

  // Helper to calculate display coordinates avoiding overlap at low zoom
  const getDisplayCoords = (
    id: string,
    coords: [number, number],
    zoom: number
  ): [number, number] => {
    if (zoom >= 8) {
      return coords; // exact building GPS coordinates
    }

    // Offset close pins in Madrid (Prado vs Plaza Mayor)
    if (id === 'prado') {
      return [coords[0] - 0.04, coords[1] + 0.12]; // shift East
    }
    if (id === 'plaza-mayor') {
      return [coords[0] + 0.04, coords[1] - 0.12]; // shift West
    }

    // Offset close pins in Barcelona (Sagrada Familia vs Park Güell)
    if (id === 'sagrada-familia') {
      return [coords[0] - 0.03, coords[1] + 0.08]; // shift Southeast
    }
    if (id === 'park-guell') {
      return [coords[0] + 0.03, coords[1] - 0.08]; // shift Northwest
    }

    return coords;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    let L: any;
    let isMounted = true;

    const initMap = async () => {
      try {
        L = await import('leaflet');

        if (!isMounted || !mapContainerRef.current) return;

        // Sensible bounds covering Mainland Spain, Balearics, and Canaries to the southwest
        const spainMaxBounds = L.latLngBounds([27.0, -18.5], [45.5, 5.5]);

        const map = L.map(mapContainerRef.current, {
          center: [40.2, -3.7],
          zoom: 6,
          minZoom: 5,
          maxZoom: 12,
          maxBounds: spainMaxBounds,
          maxBoundsViscosity: 0.85,
          scrollWheelZoom: false,
          zoomControl: true,
          attributionControl: true,
        });

        // OpenStreetMap warm tile layer
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        mapInstanceRef.current = map;

        // Fit entire Spain mainland with generous padding so Andalusia is never cut off
        map.fitBounds(L.latLngBounds(mainlandBounds), {
          padding: [24, 24],
          maxZoom: 7,
        });

        // 1. Fetch & Render Real GeoJSON Outlines of Spain's Autonomous Communities
        try {
          const res = await fetch('/data/spain-communities.geojson');
          if (res.ok) {
            const geoData = await res.json();
            if (isMounted) {
              const geoLayer = L.geoJSON(geoData, {
                style: (feature: any) => {
                  const rawName = feature?.properties?.name || '';
                  const regId = normalizeCommunityName(rawName);
                  const isFeatured = !!regId;
                  const isSelected = regId === selectedRegionId;
                  const color = isFeatured ? getRegionThemeColor(regId) : '#B4A693';

                  return {
                    fillColor: isFeatured ? color : '#EBDDC0',
                    fillOpacity: isSelected ? 0.38 : isFeatured ? 0.18 : 0.06,
                    color: isFeatured ? color : '#8C7A6B',
                    weight: isSelected ? 3 : isFeatured ? 1.8 : 1,
                    dashArray: isFeatured ? (isSelected ? undefined : '4, 4') : '2, 3',
                  };
                },
                onEachFeature: (feature: any, layer: any) => {
                  const rawName = feature?.properties?.name || '';
                  const regId = normalizeCommunityName(rawName);
                  const reg = regions.find((r) => r.id === regId);

                  if (reg) {
                    // Show region name as clean permanent Leaflet tooltip at the center
                    layer.bindTooltip(reg.name, {
                      permanent: true,
                      direction: 'center',
                      className: 'leaflet-clean-region-label',
                    });

                    // Interactive popup
                    const popupContent = `
                      <div style="font-family: var(--font-karla, sans-serif); color: #231A14; min-width: 220px; padding: 4px;">
                        <strong style="font-family: var(--font-fraunces, serif); font-size: 15px; color: #C2512B; display: block; margin-bottom: 5px;">${reg.name} (${reg.name_es})</strong>
                        <div style="font-size: 12px; line-height: 1.45; color: #231A14;">
                          <div style="margin-bottom: 2px;">🏛️ <strong>Lugar célebre:</strong> ${reg.famous_place}</div>
                          <div style="margin-bottom: 2px;">🎉 <strong>Fiesta:</strong> ${reg.signature_festival}</div>
                          <div>🥘 <strong>Plato típico:</strong> ${reg.signature_dish}</div>
                        </div>
                      </div>
                    `;
                    layer.bindPopup(popupContent);

                    // Hover effects
                    layer.on('mouseover', () => {
                      layer.setStyle({ fillOpacity: 0.42, weight: 2.5 });
                      setActiveRegionName(reg.name);
                    });

                    layer.on('mouseout', () => {
                      const isSel = reg.id === selectedRegionId;
                      layer.setStyle({
                        fillOpacity: isSel ? 0.38 : 0.18,
                        weight: isSel ? 3 : 1.8,
                      });
                      setActiveRegionName('');
                    });

                    // Click handler: select region & zoom smoothly to its bounds
                    layer.on('click', () => {
                      onSelectRegion(reg);
                      layer.openPopup();
                      map.fitBounds(layer.getBounds(), { padding: [40, 40], maxZoom: 8 });
                    });
                  }
                },
              }).addTo(map);

              geoJsonLayerRef.current = geoLayer;
            }
          }
        } catch (geoErr) {
          console.warn('[Leaflet Map] GeoJSON load error, falling back gracefully:', geoErr);
        }

        // 2. Render Pin Markers using L.divIcon with TIP exact at [width/2, height]
        // Pin size: 28 x 36 px. Anchor = [14, 36] (tip point).
        const currentZoom = map.getZoom();

        landmarks.forEach((lm) => {
          const displayCoords = getDisplayCoords(lm.id, lm.coordinates, currentZoom);

          const pinSvg = `
            <div class="custom-pin-container" style="
              width: 28px;
              height: 36px;
              cursor: pointer;
              transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            ">
              <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 5px rgba(35,26,20,0.38));">
                <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#C2512B" stroke="#F5ECD9" stroke-width="2"/>
                <circle cx="14" cy="14" r="5.5" fill="#F5ECD9"/>
                <circle cx="14" cy="14" r="2.5" fill="#C2512B"/>
              </svg>
            </div>
          `;

          const pinIcon = L.divIcon({
            className: 'custom-leaflet-landmark-pin',
            html: pinSvg,
            iconSize: [28, 36],
            iconAnchor: [14, 36],     // The TIP sits exactly on the coordinate!
            popupAnchor: [0, -36],
            tooltipAnchor: [0, -36],
          });

          const marker = L.marker(displayCoords, { icon: pinIcon }).addTo(map);

          marker.bindTooltip(
            `<strong style="font-family: var(--font-fraunces, serif); color: #231A14; font-size: 13px;">${lm.name}</strong><br/><span style="font-size: 11px; color: #C2512B; font-weight: 600;">${lm.city}</span>`,
            { direction: 'top', offset: [0, -2] }
          );

          marker.on('click', () => {
            onSelectLandmark(lm);
            map.flyTo(lm.coordinates, 9, { duration: 0.8 });
          });

          markersRef.current.push({
            id: lm.id,
            marker,
            originalCoords: lm.coordinates,
          });
        });

        // 3. Update pin positions smoothly on zoomend so close pins separate when zoomed out
        map.on('zoomend', () => {
          const z = map.getZoom();
          markersRef.current.forEach((item) => {
            const nextCoords = getDisplayCoords(item.id, item.originalCoords, z);
            item.marker.setLatLng(nextCoords);
          });
        });
      } catch (err) {
        console.warn('[Leaflet Map] Init error handled gracefully:', err);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [regions, landmarks]);

  // Update GeoJSON styling when selectedRegionId changes
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;
    geoJsonLayerRef.current.eachLayer((layer: any) => {
      const feature = layer.feature;
      if (!feature) return;
      const rawName = feature.properties?.name || '';
      const regId = normalizeCommunityName(rawName);
      if (!regId) return;

      const isSelected = regId === selectedRegionId;
      const color = getRegionThemeColor(regId);
      layer.setStyle({
        fillColor: color,
        fillOpacity: isSelected ? 0.38 : 0.18,
        color: color,
        weight: isSelected ? 3 : 1.8,
        dashArray: isSelected ? undefined : '4, 4',
      });
    });
  }, [selectedRegionId]);

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    try {
      const L = (window as any).L;
      if (L) {
        mapInstanceRef.current.fitBounds(L.latLngBounds(mainlandBounds), {
          padding: [24, 24],
          maxZoom: 7,
        });
      } else {
        mapInstanceRef.current.setView([40.2, -3.7], 6);
      }
    } catch {
      mapInstanceRef.current?.setView([40.2, -3.7], 6);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Map Container - Tall enough that Andalusia is fully visible on all devices */}
      <div className="relative w-full h-[520px] sm:h-[600px] md:h-[660px] rounded-2xl overflow-hidden border border-sand shadow-inner bg-sand/30">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Top-Right Control: Active Hover Badge & Reset View */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          {activeRegionName && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream/95 text-ink text-xs font-bold font-display border border-terracotta/30 shadow-xs backdrop-blur-xs">
              <Compass className="w-3.5 h-3.5 text-terracotta" />
              <span>{activeRegionName}</span>
            </span>
          )}

          <button
            onClick={handleResetView}
            className="px-3 py-1.5 rounded-lg bg-cream/95 text-ink text-xs font-bold font-display border border-sand hover:border-terracotta/40 shadow-xs backdrop-blur-xs flex items-center gap-1.5 transition-colors"
            title="Reset to whole Spain view"
          >
            <RotateCcw className="w-3.5 h-3.5 text-terracotta" />
            <span>Whole Spain</span>
          </button>
        </div>
      </div>

      {/* Map Information & Legend Bar (Moved below map so Andalusia is 100% uncovered) */}
      <div className="bg-cream/90 border border-sand rounded-xl p-3 sm:p-4 text-xs font-body text-ink/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-3.5 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-terracotta fill-terracotta/20" />
            </span>
            <span className="font-semibold text-ink">Landmark Pins:</span>
            <span>Accurate GPS anchors (tip points to exact monument)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs border border-terracotta/50 bg-terracotta/20" />
            <span className="font-semibold text-ink">Autonomous Communities:</span>
            <span>Real GeoJSON boundary outlines</span>
          </div>
        </div>

        <div className="text-[11px] text-ink/60 md:text-right">
          <span>Mainland Spain &amp; Balearic Islands focused. Canary Islands located southwest in the Atlantic.</span>
        </div>
      </div>
    </div>
  );
};
