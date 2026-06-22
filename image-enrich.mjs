import { FILMS_BY_ZH } from './director-enrich.mjs';
import { FILM_WIKI_EN } from './film-wiki-titles.mjs';
import { getPosterUrl } from './poster-resolve.mjs';
import {
  TECH_IMAGE_REFS,
  TECH_FALLBACK_IMAGE,
  DIRECTOR_CATEGORY_FALLBACK
} from './tech-image-refs.mjs';

const DIRECTOR_CATEGORY_IDS = new Set([
  'director_sci_fi',
  'director_thriller',
  'director_art',
  'director_action',
  'director_masters',
  'director_chinese'
]);

function parseFilmsFromItem(item) {
  if (FILMS_BY_ZH[item.zh]) return FILMS_BY_ZH[item.zh];
  if (!item.films) return [];
  return [...item.films.matchAll(/《[^》]+》/g)].map((m) => m[0]);
}

function resolveFilmPoster(film) {
  const wiki = FILM_WIKI_EN[film];
  if (wiki) {
    const url = getPosterUrl(wiki);
    if (url) {
      return { url, caption: `${film} · 静帧/海报参考`, type: 'still' };
    }
  }
  return null;
}

export function enrichDirectorImages(item, catId) {
  const films = parseFilmsFromItem(item);
  const refImages = [];
  for (const film of films) {
    if (refImages.length >= 2) break;
    const img = resolveFilmPoster(film);
    if (img) refImages.push(img);
  }
  if (!refImages.length) {
    const fb = DIRECTOR_CATEGORY_FALLBACK[catId];
    if (fb) {
      const fbUrl = getPosterUrl('In_the_Mood_for_Love') || getPosterUrl('The_Godfather') || fb.url;
      refImages.push({
        url: fbUrl,
        caption: `${item.zh} · ${fb.caption}`,
        type: fb.type || 'still'
      });
    }
  }
  return { ...item, refImages };
}

export function enrichTechImages(item) {
  const refs = TECH_IMAGE_REFS[item.zh];
  const refImages = refs
    ? refs.map((r) => ({
        url: r.url,
        caption: r.caption || `${item.zh} · 示意图`,
        type: r.type || 'diagram'
      }))
    : [{ ...TECH_FALLBACK_IMAGE, caption: `${item.zh} · 示意参考` }];
  return { ...item, refImages };
}

export function enrichAllImages(data) {
  for (const cat of data.categories) {
    if (DIRECTOR_CATEGORY_IDS.has(cat.id)) {
      cat.items = cat.items.map((item) => enrichDirectorImages(item, cat.id));
    } else {
      cat.items = cat.items.map(enrichTechImages);
    }
  }
  return data;
}
