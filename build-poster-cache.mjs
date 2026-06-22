/**
 * 一次性脚本：从维基拉取所有片目海报 URL，写入 film-poster-urls.mjs
 * 运行: node build-poster-cache.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FILM_WIKI_EN } from './film-wiki-titles.mjs';
import { TECH_IMAGE_REFS } from './tech-image-refs.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'film-poster-urls.mjs');
const CACHE = path.join(__dirname, 'poster-fetch-cache.json');

function load() {
  try { return JSON.parse(fs.readFileSync(CACHE, 'utf8')); } catch { return {}; }
}
function save(c) { fs.writeFileSync(CACHE, JSON.stringify(c, null, 2), 'utf8'); }

async function fetchPoster(wikiTitle) {
  const slug = wikiTitle.replace(/ /g, '_');
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
      { headers: { 'User-Agent': 'AIGC-Prompt-DB/1.0' }, signal: controller.signal }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.thumbnail?.source?.replace(/\/\d+px-/, '/800px-') || data.originalimage?.source || null;
  } catch { return null; }
  finally { clearTimeout(t); }
}

const cache = load();
const films = Object.keys(FILM_WIKI_EN);
let done = 0;
for (const film of films) {
  if (cache[film]) { done++; continue; }
  const url = await fetchPoster(FILM_WIKI_EN[film]);
  if (url) cache[film] = url;
  done++;
  if (done % 5 === 0) save(cache);
  if (done % 10 === 0) console.log(`${done}/${films.length}`);
}
save(cache);

// merge TECH_IMAGE_REFS film entries
for (const [film, refs] of Object.entries(TECH_IMAGE_REFS)) {
  if (film.startsWith('《') && refs[0]?.url) cache[film] = refs[0].url;
}

const lines = ['/** 片目 → 海报/剧照 URL（自动生成，可手改） */', 'export const FILM_POSTER_URLS = {'];
for (const [film, url] of Object.entries(cache).sort((a, b) => a[0].localeCompare(b[0], 'zh'))) {
  lines.push(`  '${film}': '${url.replace(/'/g, "\\'")}',`);
}
lines.push('};', '');
fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`Wrote ${Object.keys(cache).length} posters to film-poster-urls.mjs`);
