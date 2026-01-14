const fs = require('fs');
const path = require('path');
const fetch = globalThis.fetch || require('node-fetch');

const files = [
  { name: 'Roboto-Regular.ttf', urlCandidates: [
      'https://raw.githubusercontent.com/google/fonts/main/apache/roboto/Roboto-Regular.ttf',
      'https://cdn.jsdelivr.net/gh/google/fonts@main/apache/roboto/Roboto-Regular.ttf'
    ]
  },
  { name: 'Roboto-Bold.ttf', urlCandidates: [
      'https://raw.githubusercontent.com/google/fonts/main/apache/roboto/Roboto-Bold.ttf',
      'https://cdn.jsdelivr.net/gh/google/fonts@main/apache/roboto/Roboto-Bold.ttf'
    ]
  },
];

async function fetchAny(cands) {
  for (const url of cands) {
    try {
      const r = await fetch(url);
      if (r.ok) return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      // try next
    }
  }
  throw new Error('All candidates failed');
}

async function run() {
  const outDir = path.join(process.cwd(), 'public', 'fonts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  for (const f of files) {
    const dest = path.join(outDir, f.name);
    try {
      console.log('Downloading', f.name);
      try {
        const buf = await fetchAny(f.urlCandidates);
        fs.writeFileSync(dest, buf);
        console.log('Saved to', dest);
      } catch (err) {
        console.error('Failed to download any candidate URL for', f.name, err);
      }
    } catch (err) {
      console.error('Failed to download', f.url, err);
    }
  }
  console.log('Done.');
}

run().catch(err=>{ console.error(err); process.exit(1); });