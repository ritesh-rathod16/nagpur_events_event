#!/usr/bin/env node

require('dotenv').config();
const { MongoClient } = require('mongodb');

const mapping = [
  { title: 'Luxury Wedding Showcase', lat: 21.086992, lng: 79.064580 },
  { title: 'Nagpur Gastronomy Night', lat: 21.14990, lng: 79.08060 },
  { title: 'Orange City Music Festival', lat: 21.1485, lng: 79.0892 },
  { title: 'Futala Lake Marathon', lat: 21.1425, lng: 79.0594 },
  { title: 'Nagpur Elite Tech Summit 2024', lat: 21.0913, lng: 79.0758 },
  { title: 'Vidarbha Business Expo', lat: 21.1579, lng: 79.0914 },
];

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing in environment.');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const events = db.collection('events');

    for (const m of mapping) {
      console.log(`Searching for event matching: "${m.title}"`);
      // try exact match first
      let doc = await events.findOne({ title: { $regex: `^${escapeRegex(m.title)}$`, $options: 'i' } });
      if (!doc) {
        // fallback to contains
        doc = await events.findOne({ title: { $regex: escapeRegex(m.title), $options: 'i' } });
      }

      if (!doc) {
        console.warn(`Not found: ${m.title}`);
        continue;
      }

      const res = await events.updateOne({ _id: doc._id }, { $set: { locationLat: m.lat, locationLng: m.lng } });
      if (res.modifiedCount > 0) {
        console.log(`Updated ${m.title} -> ${m.lat}, ${m.lng} (id: ${doc._id})`);
      } else {
        console.log(`Already set or no change for ${m.title} (id: ${doc._id})`);
      }
    }

    console.log('Done.');
  } catch (e) {
    console.error('Error', e);
  } finally {
    await client.close();
  }
}

main();
