import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';
import { recipes as recipesData } from './data/recipes';
import { premiumRecipes } from './data/recipes-v2';
import { prefectureRecipes } from './data/recipes-prefectures';
import { getRecipeMeta } from './data/recipe-meta';

const regionEnum = z.enum([
  'hokkaido', 'tohoku', 'kanto', 'chubu', 'kinki',
  'chugoku', 'shikoku', 'kyushu_okinawa',
]);

const seasonEnum = z.enum(['spring', 'summer', 'autumn', 'winter']);

const genreEnum = z.enum(['和', '洋', '中', 'エスニック', '創作']);

const cultivar = z.object({
  name: z.string(),
  region: z.string(),
});

const vegetables = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/vegetables' }),
  schema: z.object({
    slug: z.string(),
    name_ja: z.string(),
    name_en: z.string(),
    aliases: z.array(z.string()).default([]),
    seasons: z.array(seasonEnum),
    peak_months: z.array(z.number().int().min(1).max(12)),
    regions: z.array(regionEnum),
    notable_cultivars: z.array(cultivar).default([]),
    nutrition: z.array(z.string()).default([]),
    pairings: z.array(z.string()).default([]),
    storage: z.string().default(''),
    related_recipes: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

const ingredient = z.object({
  name: z.string(),
  amount: z.string(),
});

const recipeLoader: Loader = {
  name: 'recipe-bridge',
  load: async ({ store, parseData }) => {
    store.clear();
    const seen = new Set<string>();
    const allPremium = [...premiumRecipes, ...prefectureRecipes];
    for (const r of allPremium) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      const data = await parseData({
        id: r.id,
        data: {
          id: r.id,
          title: r.title,
          subtitle: r.subtitle,
          season: r.season,
          region: r.region,
          prefecture: r.prefecture,
          vegetable: [r.mainVegetable],
          time_min: r.time,
          calories: r.calories,
          servings: r.servings,
          genre: r.genre,
          difficulty: r.difficulty === 'かんたん' ? 1 : r.difficulty === 'むずかしい' ? 3 : 2,
          hero_image: r.image,
          tags: r.tags,
          story: r.story,
          ingredients: r.ingredients,
          steps: r.steps,
          pairing_wine: r.pairing_wine,
          tips: r.tips,
        },
      });
      store.set({ id: r.id, data });
    }
    for (const r of recipesData) {
      if (seen.has(r.id)) continue;
      const meta = getRecipeMeta(r.id, r.title, r.season);
      const data = await parseData({
        id: r.id,
        data: {
          id: r.id,
          title: r.title,
          subtitle: r.subtitle,
          season: r.season,
          region: meta.region,
          vegetable: [r.mainVegetable],
          time_min: r.time,
          calories: r.calories,
          servings: r.servings,
          genre: meta.genre,
          difficulty: r.difficulty === 'かんたん' ? 1 : r.difficulty === 'むずかしい' ? 3 : 2,
          hero_image: r.image,
          tags: meta.tags,
          story: meta.story,
          ingredients: r.ingredients,
          steps: r.steps,
          pairing_wine: meta.pairing_wine,
          tips: r.tips,
        },
      });
      store.set({ id: r.id, data });
    }
  },
};

const recipes = defineCollection({
  loader: recipeLoader,
  schema: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().default(''),
    season: seasonEnum,
    region: regionEnum.optional(),
    prefecture: z.string().optional(),
    vegetable: z.array(z.string()).default([]),
    time_min: z.number().int(),
    calories: z.number().int().optional(),
    servings: z.number().int().default(2),
    genre: genreEnum.default('和'),
    difficulty: z.number().int().min(1).max(3).default(2),
    hero_image: z.string(),
    tags: z.array(z.string()).default([]),
    story: z.string().default(''),
    ingredients: z.array(ingredient),
    steps: z.array(z.string()),
    pairing_wine: z.array(z.string()).default([]),
    tips: z.string().default(''),
  }),
});

export const collections = { vegetables, recipes };
