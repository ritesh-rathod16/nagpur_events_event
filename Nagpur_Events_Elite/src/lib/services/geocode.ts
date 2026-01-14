import fetch from 'node-fetch';

export function parseLatLngFromGoogleUrl(url?: string): { lat: number; lng: number } | null {
  if (!url) return null;
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) return { lat: Number(atMatch[1]), lng: Number(atMatch[2]) };
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) return { lat: Number(qMatch[1]), lng: Number(qMatch[2]) };
  const dMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (dMatch) return { lat: Number(dMatch[1]), lng: Number(dMatch[2]) };
  return null;
}

async function fetchWithRetry(url: string, attempts = 3, delayMs = 500): Promise<any> {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try {
      const timeoutMs = 5000;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } finally {
        clearTimeout(id);
      }
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const key = process.env.GOOGLE_MAPS_SERVER_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;
  try {
    const json = await fetchWithRetry(url, 3, 400);
    if (json.status === 'OK' && json.results && json.results[0]) {
      const loc = json.results[0].geometry.location;
      return { lat: Number(loc.lat), lng: Number(loc.lng) };
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function geocodeEventData(googleMapUrl?: string, fullAddress?: string) {
  const fromUrl = parseLatLngFromGoogleUrl(googleMapUrl);
  if (fromUrl) return fromUrl;
  if (fullAddress) {
    const fromAddr = await geocodeAddress(fullAddress);
    return fromAddr;
  }
  return null;
}
