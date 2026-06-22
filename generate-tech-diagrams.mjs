/**
 * 生成技术类示意 SVG，并写入 tech-image-refs.mjs
 * 示意图以 data URI 内嵌，避免 file:// / 中文路径下外部 SVG 加载失败
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderTechDiagram, slugify } from './tech-diagrams.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'tech-refs');
const REFS_FILE = path.join(__dirname, 'tech-image-refs.mjs');

const DIRECTOR_CATEGORY_IDS = new Set([
  'director_sci_fi',
  'director_thriller',
  'director_art',
  'director_action',
  'director_masters',
  'director_chinese'
]);

function shortCaption(item) {
  const part = item.desc?.split(/[，,。]/)[0]?.trim();
  return part || item.zh;
}

export function svgToDataUri(svg) {
  return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
}

export function syncTechDiagramRefs(categories) {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const refs = {};
  let count = 0;

  for (const cat of categories) {
    if (DIRECTOR_CATEGORY_IDS.has(cat.id)) continue;
    const catDir = path.join(OUT_DIR, cat.id);
    fs.mkdirSync(catDir, { recursive: true });

    for (const item of cat.items) {
      const slug = slugify(item.en);
      const svg = renderTechDiagram(cat.id, item);
      fs.writeFileSync(path.join(catDir, `${slug}.svg`), svg, 'utf8');
      refs[item.zh] = [
        {
          url: svgToDataUri(svg),
          caption: shortCaption(item),
          type: 'diagram'
        }
      ];
      count += 1;
    }
  }

  const fallbackSvg = renderTechDiagram('_fallback', { zh: '示意参考', en: 'fallback' });
  fs.writeFileSync(path.join(OUT_DIR, '_fallback.svg'), fallbackSvg, 'utf8');

  const fallbackImage = {
    url: svgToDataUri(fallbackSvg),
    caption: '示意参考',
    type: 'diagram'
  };

  const content = `/** 由 generate-tech-diagrams.mjs 自动生成 — SVG 以 data URI 内嵌，离线可用 */
export const TECH_IMAGE_REFS = ${JSON.stringify(refs, null, 2)};

export const TECH_FALLBACK_IMAGE = ${JSON.stringify(fallbackImage, null, 2)};

export const DIRECTOR_CATEGORY_FALLBACK = {
  director_sci_fi: { url: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_2049_poster.png', caption: '科幻影像参考', type: 'still' },
  director_thriller: { url: 'https://upload.wikimedia.org/wikipedia/en/6/63/Se7en_movie_poster.jpg', caption: '悬疑犯罪参考', type: 'still' },
  director_art: { url: 'https://upload.wikimedia.org/wikipedia/en/c/c2/In_the_Mood_for_Love_poster.png', caption: '文艺情感参考', type: 'still' },
  director_action: { url: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Mad_Max_Fury_Road.jpg', caption: '动作战争参考', type: 'still' },
  director_masters: { url: 'https://upload.wikimedia.org/wikipedia/en/7/7d/2001_A_Space_Odyssey_%281968%29_poster.jpg', caption: '影史经典参考', type: 'still' },
  director_chinese: { url: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Raise_the_Red_Lantern.jpg', caption: '华语影像参考', type: 'still' }
};
`;

  fs.writeFileSync(REFS_FILE, content, 'utf8');
  console.log(`Generated ${count} tech diagram SVGs (embedded as data URI)`);
  return count;
}
