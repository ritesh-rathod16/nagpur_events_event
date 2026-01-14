#!/usr/bin/env node

require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

function parseLatLngFromGoogleUrl(url) {
  if (!url) return null;
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) return { lat: Number(atMatch[1]), lng: Number(atMatch[2]) };
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) return { lat: Number(qMatch[1]), lng: Number(qMatch[2]) };
  const dMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (dMatch) return { lat: Number(dMatch[1]), lng: Number(dMatch[2]) };
  return null;
}

async function geocodeAddress(address) {
  const key = process.env.GOOGLE_MAPS_SERVER_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === 'OK' && json.results && json.results[0]) {
        const loc = json.results[0].geometry.location;
        return { lat: Number(loc.lat), lng: Number(loc.lng) };
      }
      return null;
    } catch (e) {
      await new Promise(r => setTimeout(r, 500 * (i + 1)));
    }
  }
  return null;
}

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set in env');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();
  const eventsCol = db.collection('events');

  const cursor = eventsCol.find({ $or: [{ locationLat: null }, { locationLng: null }, { locationLat: { $exists: false } }] });
  let count = 0;

  for await (const doc of cursor) {
    const { _id, googleMapUrl, fullAddress, title, date } = doc;
    console.log(`Geocoding ${_id} - ${title}`);
    try {
      let coords = parseLatLngFromGoogleUrl(googleMapUrl);
      if (!coords && fullAddress) coords = await geocodeAddress(fullAddress);
      if (!coords) {
        console.log(' -> no coords found');
      } else {
        await eventsCol.updateOne({ _id: _id }, { $set: { locationLat: coords.lat, locationLng: coords.lng } });
        console.log(` -> saved ${coords.lat}, ${coords.lng}`);
      }
    } catch (e) {
      console.error(' -> error', e.message || e);
    }
    count++;
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('Done. Processed', count);
  await client.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});