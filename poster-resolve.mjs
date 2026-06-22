import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TMDB_POSTER_PATHS } from './tmdb-poster-paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REF_DIR = path.join(__dirname, 'ref-images');
const MANIFEST_PATH = path.join(__dirname, 'local-posters.json');

const TMDB_BASE = 'https://image.tmdb.org/t/p/w780';

function safeFileName(wiki) {
  return wiki.replace(/[^a-zA-Z0-9._-]/g, '_') + '.jpg';
}

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return {};
  }
}

export function getPosterUrl(wiki) {
  if (!wiki) return null;
  const file = safeFileName(wiki);
  const localPath = path.join(REF_DIR, file);
  if (fs.existsSync(localPath)) {
    return `./ref-images/${file}`;
  }
  const tmdb = TMDB_POSTER_PATHS[wiki];
  if (tmdb) return `${TMDB_BASE}/${tmdb}`;
  return null;
}

export function hasLocalPoster(wiki) {
  return fs.existsSync(path.join(REF_DIR, safeFileName(wiki)));
}

export function getManifest() {
  return loadManifest();
}
