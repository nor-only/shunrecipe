// Supplementary metadata per recipe (region, genre, story, tags, pairing).
// Used by the Content Collections loader to project existing recipe data
// into the v2 editorial schema without rewriting recipes.ts wholesale.

import type { Season } from './vegetables';

export type Genre = '和' | '洋' | '中' | 'エスニック' | '創作';
export type RegionId =
  | 'hokkaido' | 'tohoku' | 'kanto' | 'chubu' | 'kinki'
  | 'chugoku' | 'shikoku' | 'kyushu_okinawa';

export interface RecipeMeta {
  region?: RegionId;
  genre: Genre;
  story: string;
  tags: string[];
  pairing_wine: string[];
}

// Heuristic classifier from title
function inferGenre(title: string): Genre {
  const t = title;
  if (/(ペペロン|パスタ|カプレーゼ|グラタン|ポタージュ|マリネ|ラタトゥイユ|キッシュ|アヒージョ|クリーム|プディング|レモン)/.test(t)) return '洋';
  if (/(麻婆|チンジャオ|回鍋|中華|黒酢|チャーハン|餃子)/.test(t)) return '中';
  if (/(チャンプルー|ナンプラー|タイ風|ベトナム|エスニック|ガパオ|フォー|パクチー)/.test(t)) return 'エスニック';
  return '和';
}

const seasonalRegion: Record<Season, RegionId> = {
  spring: 'kinki',
  summer: 'kanto',
  autumn: 'chubu',
  winter: 'kinki',
};

// Hand-curated overrides for the editorially prominent recipes.
const overrides: Record<string, Partial<RecipeMeta>> = {
  r_takenoko: {
    region: 'kyushu_okinawa',
    story: '掘りたてのたけのこの穂先を、丁寧に下茹でして炊き込む。春の山が目覚めた合図を、一膳のご飯に封じる。',
    tags: ['春のはじまり', '木の芽', '酒の肴'],
  },
  r_takenoko_isobe: {
    region: 'kyushu_okinawa',
    story: '青のりの磯の香りと、たけのこの節の食感。ひと口で山と海が行き来する、春の揚げ物。',
    tags: ['揚げ物', '抹茶塩'],
  },
  r_nanohana_karashi: {
    region: 'kanto',
    story: 'ほろ苦さと、からしの鼻に抜ける辛み。春の皿は、大人のための食卓にしたい。',
    tags: ['副菜', '辛子'],
  },
  r_asparagus_cheese: {
    region: 'hokkaido',
    story: '北の大地で太陽を浴びたグリーンアスパラを、香ばしく焼き上げる。初夏の食卓の立役者。',
    tags: ['前菜', 'トースター'],
  },
  r_cabbage_clam: {
    region: 'kanto',
    story: 'あさりの潮の旨味と、新キャベツの透き通る甘み。春の海辺の風景を、ひと皿に。',
    tags: ['春', 'ワンパン'],
    pairing_wine: ['Muscadet', '辛口の白'],
  },
  r_shin_tamanegi_soup: {
    region: 'shikoku',
    story: '淡路や泉州の新玉を、まるごと一つ。水とコンソメだけで引き出される、春の甘露。',
    tags: ['スープ', '春'],
  },
  r_tomato_caprese: {
    region: 'kanto',
    story: '皿の上で、赤・白・緑が静かに並ぶ。夏の前菜は、切って並べるだけで完結する。',
    tags: ['前菜', 'イタリア'],
    pairing_wine: ['Rosé', '白の軽やか'],
  },
  r_tomato_curry: {
    region: 'kanto',
    story: '水を一滴も使わない。完熟トマトと玉ねぎの水分だけで煮込む、夏のスパイスごはん。',
    tags: ['カレー', '無水調理'],
  },
  r_ratatouille: {
    region: 'kanto',
    story: 'プロヴァンスの夏野菜を、日本の八百屋の棚から。冷やしても、温めても、翌日がいちばん旨い。',
    tags: ['作り置き', '夏野菜'],
  },
  r_nasu_miso: {
    region: 'kinki',
    story: 'とろりと油を吸ったなすに、甘辛の肉味噌が絡む。白米を前にして、箸は止まらない。',
    tags: ['主菜', '夏'],
  },
  r_nasu_agebitashi: {
    region: 'kinki',
    story: '揚げたてを、冷たい出汁に沈める。暑い夜の、いちばん静かなご馳走。',
    tags: ['冷菜', '夏の常備菜'],
  },
  r_corn_rice: {
    region: 'hokkaido',
    story: '芯ごと炊き込むと、とうもろこしは米を甘くする。北海道の畑が、釜の中で香る。',
    tags: ['炊き込みご飯', '夏'],
  },
  r_edamame_rice: {
    region: 'tohoku',
    story: '山形のだだちゃ豆を、塩と一緒に炊き込む。豆の甘さと米の香りだけで成立する、夏の御膳。',
    tags: ['夏', '鶴岡'],
  },
  r_kabocha_salad: {
    region: 'hokkaido',
    story: 'ほくほくと崩れるかぼちゃに、塩気のナッツと蜂蜜を。秋の入り口の、やさしい一皿。',
    tags: ['副菜', '作り置き'],
  },
  r_kinoko_ahijo: {
    region: 'chubu',
    story: '数種のきのこを、ガーリックとオリーブオイルで。秋の晩に、パンとワインとともに。',
    tags: ['秋の夜長', 'バル'],
    pairing_wine: ['Tempranillo', 'Chardonnay'],
  },
  r_mushroom_pasta: {
    region: 'chubu',
    story: '舞茸、しめじ、えのき。数種のきのこが重なるほど、旨味は深くなる。',
    tags: ['パスタ', '秋'],
  },
  r_satsumaimo_lemon: {
    region: 'kanto',
    story: '鹿児島の紅はるかを、レモンと蜂蜜で煮る。砂糖菓子ではない、素材の甘さを楽しむ一皿。',
    tags: ['作り置き', 'デザート'],
  },
  r_renkon_kinpira: {
    region: 'chubu',
    story: 'れんこんの節と節の間に、歯触りが潜む。甘辛いきんぴらは、冬のお弁当箱の定番。',
    tags: ['副菜', 'お弁当'],
  },
  r_daikon_furofuki: {
    region: 'kinki',
    story: '昆布出汁で炊いた聖護院大根に、柚子味噌を。冬の京都の、静かな晩のごちそう。',
    tags: ['冬', '京野菜'],
  },
  r_negi_chicken_soup: {
    region: 'kanto',
    story: '下仁田の太ねぎを焦がし目がつくまで。鶏と葱だけで、冬の体は奥から温まる。',
    tags: ['スープ', '冬'],
  },
  r_hakusai_cream: {
    region: 'tohoku',
    story: '霜にあたって甘みを増した白菜を、ミルクでくたくたに。冬の夜の、甘いクリーム煮。',
    tags: ['冬', '主菜'],
  },
  r_millefeuille_nabe: {
    region: 'kinki',
    story: '白菜と豚肉を交互に重ねて、出汁で煮る。断面を見せる、冬の主役鍋。',
    tags: ['鍋', '冬'],
  },
  r_hourensou_gomaae: {
    region: 'kanto',
    story: 'すり鉢で当たった胡麻の香りが、ほうれん草の甘さを底から押し上げる。',
    tags: ['副菜', '和食の基本'],
  },
  r_broccoli_salad: {
    region: 'hokkaido',
    story: '房をほどいて、さっと塩茹でに。ドレッシングを控えめにして、冬の緑を楽しむ。',
    tags: ['副菜', '冬'],
  },
};

const seasonByRecipe: Partial<Record<string, Season>> = {};

export function getRecipeMeta(id: string, title: string, season: Season): RecipeMeta {
  const o = overrides[id] ?? {};
  return {
    region: o.region ?? seasonalRegion[season],
    genre: o.genre ?? inferGenre(title),
    story: o.story ?? '',
    tags: o.tags ?? [],
    pairing_wine: o.pairing_wine ?? [],
  };
}

void seasonByRecipe;
