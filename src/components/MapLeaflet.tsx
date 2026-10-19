'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { RegionSummary, LandmarkItem } from '@/types/country';

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
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    let L: any;
    let isMounted = true;

    const initMap = async () => {
      try {
        L = await import('leaflet');

        if (!isMounted || !mapContainerRef.current) return;

        const map = L.map(mapContainerRef.current, {
          center: regions[0]?.coordinates ?? [0, 0],
          zoom: 6,
          minZoom: 2,
          maxZoom: 10,
          scrollWheelZoom: false,
          zoomControl: true,
          attributionControl: true,
        });

        // OpenStreetMap tile layer with attribution
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        mapInstanceRef.current = map;
        if (regions.length > 0) {
          const bounds = L.latLngBounds(regions.map((region) => region.coordinates));
          map.fitBounds(bounds, { padding: [30, 30], maxZoom: 7 });
        }

        // 1. Regional Zones with gentle pulsing circles
        regions.forEach((reg) => {
          const isSelected = reg.id === selectedRegionId;
          const color =
            reg.id === 'andalusia'
              ? '#C2512B'
              : reg.id === 'catalonia'
              ? '#E5A02D'
              : reg.id === 'basque-country'
              ? '#1E3A5F'
              : reg.id === 'galicia'
              ? '#2A6F62'
              : reg.id === 'madrid'
              ? '#C2512B'
              : '#E5A02D';

          const circle = L.circle(reg.coordinates, {
            radius: reg.id === 'madrid' ? 45000 : 70000,
            color: color,
            weight: isSelected ? 3 : 1.5,
            fillColor: color,
            fillOpacity: isSelected ? 0.35 : 0.18,
            dashArray: '4, 4',
            className: 'animate-pulse-glow',
          }).addTo(map);

          const popupContent = `
            <div style="font-family: var(--font-karla, sans-serif); color: #231A14; min-width: 220px; padding: 4px;">
              <strong style="font-family: var(--font-fraunces, serif); font-size: 15px; color: #C2512B; display: block; margin-bottom: 5px;">${reg.name}</strong>
              <div style="font-size: 12px; line-height: 1.45; color: #231A14;">
                <div style="margin-bottom: 2px;">🏛️ <strong>Lugar:</strong> ${reg.famous_place}</div>
                <div style="margin-bottom: 2px;">🎉 <strong>Fiesta:</strong> ${reg.signature_festival}</div>
                <div>🥘 <strong>Plato:</strong> ${reg.signature_dish}</div>
              </div>
            </div>
          `;

          circle.bindPopup(popupContent);

          circle.on('mouseover', () => {
            circle.setStyle({ fillOpacity: 0.45, weight: 2.5 });
          });

          circle.on('mouseout', () => {
            circle.setStyle({ fillOpacity: isSelected ? 0.35 : 0.18, weight: isSelected ? 3 : 1.5 });
          });

          circle.on('click', () => {
            onSelectRegion(reg);
            circle.openPopup();
            map.flyTo(reg.coordinates, 7, { duration: 0.8 });
          });

          // Region Label
          const labelIcon = L.divIcon({
            className: 'custom-region-label',
            html: `<div style="
              background: rgba(245, 236, 217, 0.95);
              border: 1.5px solid ${color};
              color: #231A14;
              font-family: var(--font-fraunces, serif);
              font-weight: 700;
              font-size: 11px;
              padding: 2px 7px;
              border-radius: 6px;
              white-space: nowrap;
              box-shadow: 0 1px 3px rgba(0,0,0,0.12);
              cursor: pointer;
              transform: translate(-50%, -50%);
            ">${reg.name}</div>`,
            iconSize: [0, 0],
          });

          const labelMarker = L.marker(reg.coordinates, { icon: labelIcon }).addTo(map);
          labelMarker.bindPopup(popupContent);
          labelMarker.on('click', () => {
            onSelectRegion(reg);
            labelMarker.openPopup();
            map.flyTo(reg.coordinates, 7, { duration: 0.8 });
          });

          markersRef.current.push(circle, labelMarker);
        });

        // 2. Illustrated Landmark Pins that drop in one after another on load
        landmarks.forEach((lm, index) => {
          if (!lm.coordinates) return;

          const delayMs = index * 120 + 150;
          const pinHtml = `
            <div style="
              animation: pinDrop 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms forwards;
              opacity: 0;
              transform: translateY(-28px);
              width: 32px;
              height: 32px;
              background: #C2512B;
              border: 2px solid #F5ECD9;
              border-radius: 50% 50% 50% 0;
              transform-origin: bottom left;
              rotate: -45deg;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(35,26,20,0.35);
              cursor: pointer;
            ">
              <div style="
                rotate: 45deg;
                color: #F5ECD9;
                font-size: 13px;
                line-height: 1;
              ">🏛️</div>
            </div>
          `;

          const landmarkIcon = L.divIcon({
            className: 'custom-landmark-pin',
            html: pinHtml,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          const marker = L.marker(lm.coordinates, { icon: landmarkIcon }).addTo(map);

          marker.bindTooltip(
            `<strong style="font-family: var(--font-fraunces, serif); color: #231A14;">${lm.name}</strong><br/><span style="font-size: 10px; color: #C2512B;">${lm.city}</span>`,
            { direction: 'top', offset: [0, -24] }
          );

          marker.on('click', () => {
            onSelectLandmark(lm);
            map.flyTo(lm.coordinates, 8, { duration: 0.8 });
          });

          markersRef.current.push(marker);
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

  return (
    <div className="relative w-full h-[440px] sm:h-[480px] rounded-2xl overflow-hidden border border-sand shadow-inner bg-sand/40">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-20 bg-cream/95 backdrop-blur-xs p-2.5 rounded-lg border border-sand shadow-xs text-xs text-ink space-y-1 font-body">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
          <span>Click a region or landmark pin to view local cultural highlights</span>
        </div>
      </div>
    </div>
  );
};
