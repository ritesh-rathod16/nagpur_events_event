"use client";

import React, { useEffect, useRef } from "react";

type EventItem = {
  _id: string;
  title: string;
  date: string;
  googleMapUrl?: string;
  fullAddress?: string;
};

function parseLatLngFromGoogleUrl(url?: string): { lat: number; lng: number } | null {
  if (!url) return null;
  // Match @lat,lng patterns
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) return { lat: Number(atMatch[1]), lng: Number(atMatch[2]) };

  // Match q=lat,lng pattern
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) return { lat: Number(qMatch[1]), lng: Number(qMatch[2]) };

  // Match !3dlat!4dlng pattern
  const dMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (dMatch) return { lat: Number(dMatch[1]), lng: Number(dMatch[2]) };

  return null;
}

import { MarkerClusterer } from "@googlemaps/markerclusterer";

export default function EventsMap({ events }: { events: EventItem[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const clusterRef = useRef<any | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    // ensure script present
    const id = "google-maps-script";
    if (!(window as any).google) {
      if (!document.getElementById(id)) {
        const s = document.createElement("script");
        s.id = id;
        s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
        s.onload = () => initMap();
      }
    } else {
      initMap();
    }

    // Returns a simple pin-shaped SVG as a data URI in the given color
    function makePinSvgDataUri(color: string) {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'><path fill='${color}' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z' stroke='#ffffff' stroke-width='0.6'/></svg>`;
      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    function initMap() {
      if (!containerRef.current) return;
      if (!(window as any).google) return;

      const google = (window as any).google;
      const center = { lat: 21.1458, lng: 79.0882 }; // Nagpur fallback
      mapRef.current = new google.maps.Map(containerRef.current, {
        center,
        zoom: 11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      refreshMarkers();
    }

    async function refreshMarkers() {
      if (!mapRef.current) return;
      const google = (window as any).google;

      // clear old markers
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      if (clusterRef.current) {
        clusterRef.current.clearMarkers();
        clusterRef.current = null;
      }

      const bounds = new google.maps.LatLngBounds();

      for (const ev of events) {
        // Prefer stored coordinates
        let pos = (ev as any).locationLat && (ev as any).locationLng ? { lat: Number((ev as any).locationLat), lng: Number((ev as any).locationLng) } : parseLatLngFromGoogleUrl(ev.googleMapUrl);

        if (!pos && ev.fullAddress) {
          // try geocoding on client as a last resort
          try {
            const geocoder = new google.maps.Geocoder();
            /* eslint-disable no-await-in-loop */
            const res = await new Promise<any>((resolve, reject) =>
              geocoder.geocode({ address: ev.fullAddress }, (results: any, status: any) => {
                if (status === "OK" && results && results[0]) resolve(results[0]);
                else reject(status);
              })
            );
            pos = { lat: res.geometry.location.lat(), lng: res.geometry.location.lng() };
          } catch (e) {
            // skip if geocode fails
            continue;
          }
        }

        if (!pos) continue;

        const date = new Date(ev.date);
        const isPast = date.getTime() < Date.now();
        const color = isPast ? '#ef4444' : '#fbbf24'; // red or gold

        // Use colored pin SVG (gold for upcoming, red for past)
        const iconUrl = makePinSvgDataUri(color);
        const marker = new google.maps.Marker({
          position: pos,
          title: ev.title,
          icon: { url: iconUrl, scaledSize: new google.maps.Size(36, 36) },
        });

        const info = new google.maps.InfoWindow({
          content: `<div style="min-width:200px;padding:8px"><strong style='color:#fbbf24;display:block;margin-bottom:6px'>${ev.title}</strong><div style='font-size:12px;color:#9ca3af;margin-bottom:8px'>${new Date(ev.date).toLocaleDateString()}</div><a href="/events/${ev._id}" style="color:#111827;background:#fbbf24;padding:6px 8px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block">View event</a></div>`,
        });

        marker.addListener("click", () => {
          // open InfoWindow and center on marker for clarity
          info.open({ anchor: marker, map: mapRef.current });
          try {
            mapRef.current.panTo(marker.getPosition());
            const currentZoom = mapRef.current.getZoom();
            if (currentZoom < 13) mapRef.current.setZoom(13);
          } catch (e) {
            // ignore pan errors
          }
        });

        markersRef.current.push(marker);
        bounds.extend(pos);
      }

      // add clustering with a renderer that doesn't show numbers
      if (markersRef.current.length > 0) {
        const clusterRenderer = {
          render: ({ position }: any) => {
            const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='#0f172a' opacity='0.85' stroke='#fbbf24' stroke-width='1.5'/></svg>`;
            const icon = { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`, scaledSize: new google.maps.Size(40, 40) };
            // create a marker-like object for the cluster
            return new google.maps.Marker({ position, icon });
          }
        };
        try {
          clusterRef.current = new MarkerClusterer({ markers: markersRef.current, map: mapRef.current, renderer: clusterRenderer as any });
        } catch (e) {
          // fallback to default clusterer
          clusterRef.current = new MarkerClusterer({ markers: markersRef.current, map: mapRef.current });
        }
      }

      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, 80);
      }
    }

    // Refresh on events change
    return () => {
      // cleanup markers
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      if (clusterRef.current) {
        clusterRef.current.clearMarkers();
        clusterRef.current = null;
      }
    };
  }, [events]);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl">
        {/* legend */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#fbbf24] shadow-sm border border-white" />
            <span className="text-pearl/60 text-sm">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ef4444] shadow-sm border border-white" />
            <span className="text-pearl/60 text-sm">Past</span>
          </div>
        </div>

        <div className="w-full rounded-2xl overflow-hidden border border-gold/10 h-[200px] md:h-[280px] lg:h-[320px]">
          <div ref={containerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
