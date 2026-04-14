// Pre-generate OGP images at build time.
// Runs before `astro build` via prebuild script.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const OUT = 'public/og';
mkdirSync(OUT, { recursive: true });

const minchoBuf = readFileSync('node_modules/@fontsource/shippori-mincho-b1/files/shippori-mincho-b1-0-500-normal.woff');
const sansBuf = readFileSync('node_modules/@fontsource/noto-serif-jp/files/noto-serif-jp-0-500-normal.woff');
const frauncesBuf = readFileSync('node_modules/@fontsource/fraunces/files/fraunces-latin-500-normal.woff');
const monoBuf = readFileSync('node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff');

const fonts = [
  { name: 'Mincho', data: minchoBuf, weight: 500, style: 'normal' },
  { name: 'MinchoFB', data: sansBuf, weight: 500, style: 'normal' },
  { name: 'Fraunces', data: frauncesBuf, weight: 500, style: 'normal' },
  { name: 'Mono', data: monoBuf, weight: 400, style: 'normal' },
];

const BG = '#FAF8F3';
const INK = '#1C1A17';
const INK2 = '#4A463F';
const LINE = '#D9D3C3';
const ACCENT = '#A8432E';

const div = (style, children) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });

function template({ chapterNo, chapterLabel, title, subtitle, edition }) {
  return div(
    { width: '100%', height: '100%', flexDirection: 'column', background: BG, padding: '72px 88px' },
    [
      // Header
      div(
        { justifyContent: 'space-between', alignItems: 'center' },
        [
          div({ fontFamily: 'Mono', fontSize: 20, color: INK2, letterSpacing: '0.2em', textTransform: 'uppercase' }, chapterNo),
          div({ alignItems: 'center' }, [
            div({ width: 14, height: 14, background: ACCENT, marginRight: 14 }, ''),
            div({ fontFamily: 'Mincho, MinchoFB', fontSize: 22, color: INK, letterSpacing: '0.22em' }, 'SHUNRECIPE'),
          ]),
        ],
      ),
      // Rule
      div({ marginTop: 16, height: 1, background: LINE, width: '100%' }, ''),
      // Chapter label
      div({ marginTop: 28, fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: 26, color: INK2, letterSpacing: '0.04em' }, chapterLabel),
      // Title
      div(
        { marginTop: 36, fontFamily: 'Mincho, MinchoFB', fontSize: 84, color: INK, lineHeight: 1.2, letterSpacing: '0.02em', flexWrap: 'wrap' },
        title,
      ),
      // Subtitle
      subtitle
        ? div({ marginTop: 28, fontFamily: 'Mincho, MinchoFB', fontSize: 26, color: INK2, lineHeight: 1.6, letterSpacing: '0.04em' }, subtitle)
        : div({}, ''),
      // Bottom
      div(
        { marginTop: 'auto', justifyContent: 'space-between', alignItems: 'flex-end' },
        [
          div({ fontFamily: 'Mono', fontSize: 18, color: INK2, letterSpacing: '0.2em', textTransform: 'uppercase' }, edition),
          div({ fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: 22, color: INK2 }, 'a seasonal recipe journal'),
        ],
      ),
    ],
  );
}

async function render(opts, filename) {
  const svg = await satori(template(opts), { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  writeFileSync(join(OUT, filename), png);
}

const d = new Date();
const wafuMonths = ['睦月','如月','弥生','卯月','皐月','水無月','文月','葉月','長月','神無月','霜月','師走'];
const edition = `令和${d.getFullYear() - 2018}年　${wafuMonths[d.getMonth()]}`;
const seasonJp = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' };

// --- Static pages ---
const staticPages = [
  { file: 'default.png', chapterNo: 'Shun · Recipe', chapterLabel: 'A Seasonal Recipe Journal', title: '旬を知る、食を編み直す。', subtitle: '全国八地域と四季が育む野菜と、その魅力を最大限に引き出すレシピ。', edition },
  { file: 'seasonal.png', chapterNo: 'The Directory', chapterLabel: 'A directory of seasonal vegetables', title: '全国八地域と、四季の旬野菜。', subtitle: '', edition },
  { file: 'recipes.png', chapterNo: 'All Recipes', chapterLabel: 'Filter by season, region, genre', title: '季節と地域で、献立を編む。', subtitle: '', edition },
  { file: 'favorites.png', chapterNo: 'Your Shelf', chapterLabel: 'Your personal shelf', title: 'あなたの手元に、一冊のレシピ本を。', subtitle: '', edition },
];

for (const p of staticPages) {
  await render(p, p.file);
  console.log('og:', p.file);
}

// --- Recipes ---
// Load recipes from TS via a light regex (avoid TS toolchain in scripts).
function parseRecipes() {
  const src1 = readFileSync('src/data/recipes.ts', 'utf8');
  const src2 = readFileSync('src/data/recipes-v2.ts', 'utf8');
  const src = src1 + '\n' + src2;
  const items = [];
  const rx = /id:\s*["']([^"']+)["'][\s\S]*?title:\s*["']([^"']+)["'][\s\S]*?season:\s*["']([^"']+)["']/g;
  let m;
  while ((m = rx.exec(src)) !== null) items.push({ id: m[1], title: m[2], season: m[3] });
  // dedupe by id
  const seen = new Set();
  return items.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)));
}

const recipes = parseRecipes();
console.log(`og: generating ${recipes.length} recipe OGPs...`);
for (const r of recipes) {
  await render({
    chapterNo: 'Recipe · ' + r.id.replace(/^r_/, '').slice(0, 14).toUpperCase(),
    chapterLabel: `Recipe for ${seasonJp[r.season] || ''}`,
    title: r.title.length > 20 ? r.title.slice(0, 20) + '…' : r.title,
    subtitle: '',
    edition,
  }, `recipe-${r.id}.png`);
}

// --- Vegetables ---
const vegDir = 'src/content/vegetables';
const vegFiles = readdirSync(vegDir).filter((f) => f.endsWith('.md'));
console.log(`og: generating ${vegFiles.length} vegetable OGPs...`);
for (const vf of vegFiles) {
  const raw = readFileSync(join(vegDir, vf), 'utf8');
  const slugMatch = raw.match(/slug:\s*(\S+)/);
  const jaMatch = raw.match(/name_ja:\s*"([^"]+)"/);
  const enMatch = raw.match(/name_en:\s*"([^"]+)"/);
  const slug = slugMatch ? slugMatch[1] : vf.replace('.md', '');
  const ja = jaMatch ? jaMatch[1] : slug;
  const en = enMatch ? enMatch[1] : '';
  await render({
    chapterNo: 'Vegetable · ' + slug.slice(0, 12).toUpperCase(),
    chapterLabel: en,
    title: ja,
    subtitle: '',
    edition,
  }, `veg-${slug}.png`);
}

console.log('og: done');
