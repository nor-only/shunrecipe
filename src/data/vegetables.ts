// Legacy module — now only exports shared types.
// Vegetable content lives in src/content/vegetables/*.md as a Content Collection.
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export const seasonLabels: Record<Season, { jp: string; en: string; months: string }> = {
  spring: { jp: '春', en: 'Spring', months: '3月〜5月' },
  summer: { jp: '夏', en: 'Summer', months: '6月〜8月' },
  autumn: { jp: '秋', en: 'Autumn', months: '9月〜11月' },
  winter: { jp: '冬', en: 'Winter', months: '12月〜2月' },
};

export function monthToSeason(m: number): Season {
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

export function getCurrentSeason(): Season {
  return monthToSeason(new Date().getMonth() + 1);
}
