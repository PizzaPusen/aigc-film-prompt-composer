/**
 * 从 TMDB 抓取海报并缓存到 ref-images/（同源加载，解决 wikimedia 国内不可用）
 * 运行: node sync-local-posters.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FILM_WIKI_EN } from './film-wiki-titles.mjs';
import { TMDB_POSTER_PATHS } from './tmdb-poster-paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REF_DIR = path.join(__dirname, 'ref-images');
const MANIFEST_PATH = path.join(__dirname, 'local-posters.json');
const TMDB_PATHS_FILE = path.join(__dirname, 'tmdb-poster-paths.mjs');

const SEARCH_OVERRIDES = {
  'Where_Is_the_Friend\'s_House?': 'Where Is the Friend\'s House',
  'Life,_and_Nothing_More': 'Life and Nothing More',
  'Ulysses\'_Gaze': 'Ulysses Gaze',
  'Three_Colours:_Blue': 'Three Colors Blue',
  'The_Double_Life_of_Véronique': 'The Double Life of Veronique',
  'L\'Age_d\'Or': 'L Age d Or',
  'L\'Argent_(1983_film)': 'L Argent 1983',
  'Au_revoir_les_enfants': 'Au revoir les enfants',
  'The_Good,_the_Bad_and_the_Ugly': 'The Good the Bad and the Ugly',
  'Warriors_of_the_Rainbow:_Seediq_Bale': 'Warriors of the Rainbow Seediq Bale',
  'Creation_of_the_Gods_I:_Kingdom_of_Storms': 'Creation of the Gods Kingdom of Storms',
  'The_Wandering_Earth': 'The Wandering Earth',
  'The_Wandering_Earth_2': 'The Wandering Earth 2',
  'A_Chinese_Odyssey': 'A Chinese Odyssey',
  'In_the_Heat_of_the_Sun': 'In the Heat of the Sun',
  'So_Long,_My_Son': 'So Long My Son',
  'Only_the_River_Flows': 'Only the River Flows',
  'The_Coffin_in_the_Mountain': 'The Coffin in the Mountain',
  'Let_the_Bullets_Fly': 'Let the Bullets Fly',
  'Dying_to_Survive': 'Dying to Survive',
  'B_for_Busy': 'B for Busy',
  'Angels_Wear_White': 'Angels Wear White',
  'Send_Me_to_the_Clouds': 'Send Me to the Clouds',
  'Finding_Mr._Right': 'Finding Mr Right',
  'Brotherhood_of_Blades': 'Brotherhood of Blades',
  'The_Black_Cannon_Incident': 'The Black Cannon Incident',
  'Paths_of_the_Soul': 'Paths of the Soul',
  'Black_Coal,_Thin_Ice': 'Black Coal Thin Ice',
  'The_Dead_End': 'The Dead End 2015',
  'Kill_Shot_(2019_film)': 'Jinpa 2018',
  'Blossoms_Shanghai': 'Blossoms Shanghai',
  'Neon_Genesis_Evangelion': 'Neon Genesis Evangelion Death and Rebirth'
};

function safeFileName(wiki) {
  return wiki.replace(/[^a-zA-Z0-9._-]/g, '_') + '.jpg';
}

function wikiToQuery(slug) {
  return slug
    .replace(/_/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveManifest(m) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2), 'utf8');
}

function saveTmdbPaths(paths) {
  const lines = [
    '/**',
    ' * 维基片名 → TMDB poster 文件名（image.tmdb.org 可访问，国内比 wikimedia 稳定）',
    ' * 由 sync-local-posters.mjs 自动补充写入',
    ' */',
    'export const TMDB_POSTER_PATHS = {'
  ];
  for (const [k, v] of Object.entries(paths).sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`  '${k.replace(/'/g, "\\'")}': '${v}',`);
  }
  lines.push('};', '');
  fs.writeFileSync(TMDB_PATHS_FILE, lines.join('\n'), 'utf8');
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AIGC-Prompt-DB/1.0 (poster-sync)' },
    signal: AbortSignal.timeout(12000)
  });
  if (!res.ok) return null;
  return res.text();
}

async function tmdbSearch(query) {
  const html = await fetchHtml(
    `https://www.themoviedb.org/search/movie?query=${encodeURIComponent(query)}`
  );
  if (!html) return null;
  const m = html.match(/\/movie\/(\d+)-/);
  return m ? m[1] : null;
}

async function tmdbPosterPath(id) {
  const html = await fetchHtml(`https://www.themoviedb.org/movie/${id}`);
  if (!html) return null;
  const m = html.match(/image\.tmdb\.org\/t\/p\/w\d+\/([A-Za-z0-9_.-]+\.jpg)/);
  return m ? m[1] : null;
}

async function downloadPoster(wiki, posterPath) {
  const file = safeFileName(wiki);
  const dest = path.join(REF_DIR, file);
  const url = `https://image.tmdb.org/t/p/w780/${posterPath}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AIGC-Prompt-DB/1.0' },
    signal: AbortSignal.timeout(15000)
  });
  if (!res.ok) return false;
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return true;
}

async function resolvePoster(wiki) {
  if (TMDB_POSTER_PATHS[wiki]) return TMDB_POSTER_PATHS[wiki];
  const query = SEARCH_OVERRIDES[wiki] || wikiToQuery(wiki);
  const id = await tmdbSearch(query);
  if (!id) return null;
  return tmdbPosterPath(id);
}

fs.mkdirSync(REF_DIR, { recursive: true });

const slugs = [...new Set(Object.values(FILM_WIKI_EN))];
const manifest = loadManifest();
const paths = { ...TMDB_POSTER_PATHS };
let ok = 0;
let skip = 0;
let fail = 0;

for (let i = 0; i < slugs.length; i++) {
  const wiki = slugs[i];
  const file = safeFileName(wiki);
  const dest = path.join(REF_DIR, file);

  if (fs.existsSync(dest)) {
    manifest[wiki] = { file, status: 'cached' };
    skip++;
    continue;
  }

  try {
    const posterPath = await resolvePoster(wiki);
    if (!posterPath) {
      manifest[wiki] = { file, status: 'not_found' };
      fail++;
      console.log(`[${i + 1}/${slugs.length}] MISS ${wiki}`);
      continue;
    }
    const saved = await downloadPoster(wiki, posterPath);
    if (saved) {
      paths[wiki] = posterPath;
      manifest[wiki] = { file, status: 'ok', posterPath };
      ok++;
      console.log(`[${i + 1}/${slugs.length}] OK ${wiki}`);
    } else {
      manifest[wiki] = { file, status: 'download_fail' };
      fail++;
      console.log(`[${i + 1}/${slugs.length}] FAIL ${wiki}`);
    }
  } catch (e) {
    manifest[wiki] = { file, status: 'error' };
    fail++;
    console.log(`[${i + 1}/${slugs.length}] ERR ${wiki}`);
  }

  if ((i + 1) % 5 === 0) {
    saveManifest(manifest);
    saveTmdbPaths(paths);
  }
  await new Promise((r) => setTimeout(r, 300));
}

saveManifest(manifest);
saveTmdbPaths(paths);
console.log(`Done. new=${ok} cached=${skip} fail=${fail} total=${slugs.length}`);
