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

  // ── 追加story: 旧レシピの editorial 加筆 ──
  r_asparagus_bacon: {
    region: 'hokkaido',
    story: 'アスパラを豚ばらで巻いて、焦げ目がつくまで。北の畑の太さを生かす、最小限の仕立て。',
    tags: ['主菜', '初夏'],
  },
  r_asparagus_soup: {
    region: 'hokkaido',
    story: 'アスパラの薄切りをバターで炒め、ミキサーへ。冷やして出せば、ホテルの朝食の一杯。',
    tags: ['冷製', '前菜'],
    pairing_wine: ['Chardonnay'],
  },
  r_cabbage_roll: {
    region: 'kanto',
    story: '葉を破らず広げる手の動きが、最初の関門。煮込む鍋は、隙間なく並べて蓋をするだけ。',
    tags: ['煮込み', '作り置き'],
  },
  r_cabbage_peperoncino: {
    region: 'kanto',
    story: '茹で汁と油を乳化させる一瞬に、春のキャベツの甘みを閉じ込める。桜えびで海の香りを足す。',
    tags: ['パスタ', '時短'],
    pairing_wine: ['Pinot Grigio'],
  },
  r_tomato: {
    region: 'kanto',
    story: '湯むきしたミニトマトを、オリーブオイルとバジルで漬ける。冷蔵庫で半日置くと、味が丸くなる。',
    tags: ['常備菜', '夏'],
  },
  r_cucumber_salad: {
    region: 'kanto',
    story: '叩いて割ったきゅうりに、ごま油と塩。切るより割るほうが、味の入り方が深い。',
    tags: ['副菜', '夏'],
  },
  r_cucumber_sunomono: {
    region: 'kanto',
    story: '輪切りを塩で揉み、甘酢に浸す。わかめとの相性は、理屈ではなく体が覚えている。',
    tags: ['小鉢', '和食'],
  },
  r_cucumber_pork_fry: {
    region: 'kanto',
    story: 'きゅうりを炒めると、シャキッとした歯触りが残る。豚薄切りと醤油だけで、白飯が走る。',
    tags: ['主菜', '夏'],
  },
  r_corn_soup: {
    region: 'hokkaido',
    story: '北の甘いとうもろこしを、芯ごと煮出してミキサーへ。裏ごしの手間の分、舌触りが応える。',
    tags: ['スープ', '夏'],
  },
  r_corn_kakiage: {
    region: 'hokkaido',
    story: '実を削いで薄衣でまとめる、夏の天ぷら。塩だけで食べたい、甘味そのものの一皿。',
    tags: ['揚げ物', '夏'],
  },
  r_edamame_garlic: {
    region: 'tohoku',
    story: 'さやの両端を切り落とし、ガーリックバターで炒る。塩は仕上げに粗塩で、指で食べる。',
    tags: ['肴', 'ビール'],
    pairing_wine: ['ピルスナー', 'ドライシェリー'],
  },
  r_edamame_salad: {
    region: 'tohoku',
    story: 'むき豆、コーン、トマト。夏野菜を角切りで揃え、オリーブオイルで和える。色だけで食欲が立つ。',
    tags: ['サラダ', '作り置き'],
  },
  r_nanohana_pasta: {
    region: 'kanto',
    story: 'アンチョビと菜の花を、茹で汁で乳化。ほろ苦さと塩気が、春のパスタを引き締める。',
    tags: ['パスタ', '春'],
    pairing_wine: ['Verdicchio'],
  },
  r_nanohana_tamagotoji: {
    region: 'kanto',
    story: '出汁で菜の花をさっと煮て、溶き卵で閉じる。蓋をして半熟で火を止めるのが肝。',
    tags: ['丼物', '和食の基本'],
  },
  r_shin_tamanegi_salad: {
    region: 'shikoku',
    story: '水にさらしすぎると、新玉の甘さが逃げる。鰹節と醤油、それだけで食卓の主役に。',
    tags: ['サラダ', '春'],
  },
  r_shin_tamanegi_sukiyaki: {
    region: 'shikoku',
    story: '新玉をくし切りに、割り下で煮含める。肉の甘みと新玉の甘みが、春の鍋で出会う。',
    tags: ['鍋', '春'],
  },
  r_pumpkin: {
    region: 'hokkaido',
    story: '皮ごと蒸して、バターと一緒に潰す。牛乳で伸ばして、器に盛る。秋のもっとも単純な一杯。',
    tags: ['スープ', '秋'],
  },
  r_kabocha_pudding: {
    region: 'hokkaido',
    story: '蒸したかぼちゃに、卵と砂糖、牛乳を合わせる。秋の野菜をデザートに昇華する、静かな技。',
    tags: ['デザート', '秋'],
  },
  r_renkon_chikuwa: {
    region: 'chubu',
    story: 'れんこんの穴にちくわを詰め、輪切りに。切り口の白と黒のリズムが、弁当箱を整える。',
    tags: ['お弁当', '副菜'],
  },
  r_renkon_salad: {
    region: 'chubu',
    story: '薄切りを甘酢に浸してから、マヨネーズで和える。二つの酸味が、れんこんの甘さを立たせる。',
    tags: ['サラダ', '作り置き'],
  },
  r_satoimo_soboro: {
    region: 'tohoku',
    story: '里芋を下茹でしてから、鶏そぼろあんをかける。柚子の皮をひとつまみ、冬の入口に。',
    tags: ['和食', '煮物'],
  },
  r_satoimo_croquette: {
    region: 'tohoku',
    story: '蒸した里芋を潰して、パン粉で揚げる。ねっとりと、ほくほくの境界を楽しむコロッケ。',
    tags: ['揚げ物', '主菜'],
  },
  r_satoimo_gratin: {
    region: 'tohoku',
    story: '里芋のとろみに、ベシャメル。和と洋が、オーブンの中で和解する秋の皿。',
    tags: ['オーブン', '主菜'],
  },
  r_satsumaimo_gratin: {
    region: 'kyushu_okinawa',
    story: '輪切りを蒸して、生クリームとチーズで焼く。鹿児島の芋の甘さが、乳脂と出会う。',
    tags: ['オーブン', '秋冬'],
    pairing_wine: ['甘口白'],
  },
  r_daikon: {
    region: 'kinki',
    story: '厚切りを昆布出汁でくたくたに。柚子味噌を一点、大根の真ん中に置いて供する。',
    tags: ['煮物', '冬'],
  },
  r_daikon_pork: {
    region: 'kanto',
    story: '大根と豚ばらを、砂糖と醤油でじっくり煮含める。一晩寝かせた翌日が、本当の完成。',
    tags: ['煮込み', '冬'],
  },
  r_daikon_scallop_salad: {
    region: 'hokkaido',
    story: '大根の千切りに、焼いた帆立を乗せる。柚子の皮を散らせば、冬の海と畑が一皿で出会う。',
    tags: ['前菜', '冬'],
  },
  r_hakusai_mapo: {
    region: 'kinki',
    story: '白菜を麻婆の具に。トロトロの葉と、ピリ辛の餡。冬の白飯に、一杯では足りない。',
    tags: ['中華', '主菜'],
  },
  r_hourensou_bacon: {
    region: 'kanto',
    story: 'ベーコンの脂でほうれん草を炒める。最後に黒胡椒を挽いて、朝食の一皿に。',
    tags: ['副菜', '朝食'],
  },
  r_hourensou_quiche: {
    region: 'kanto',
    story: 'ほうれん草と卵と生クリームを、パイ皮で包んでオーブンへ。冬の日曜のブランチ。',
    tags: ['ブランチ', 'オーブン'],
    pairing_wine: ['Chablis'],
  },
  r_broccoli_meat_fry: {
    region: 'hokkaido',
    story: 'ブロッコリーと牛肉を、オイスターソースで炒める。茎まで使い切る、中華の定番。',
    tags: ['中華', '主菜'],
  },
  r_broccoli_shrimp: {
    region: 'hokkaido',
    story: 'ブロッコリーと海老を、にんにくオイルで。素材二つだけで、皿は華やぐ。',
    tags: ['前菜', 'オイル'],
    pairing_wine: ['Sauvignon Blanc'],
  },
  r_negi_ahijo: {
    region: 'kanto',
    story: '長ねぎを四等分に、ガーリックオイルで煮る。とろけるねぎの甘みを、バゲットに預ける。',
    tags: ['バル', '冬'],
    pairing_wine: ['Tempranillo'],
  },
  r_negi_pork: {
    region: 'kanto',
    story: 'ねぎと豚を、甘辛ダレで絡める。ご飯の上にたっぷり。冬の仕事終わりの、一杯丼。',
    tags: ['丼物', '主菜'],
  },
  r_kinoko_gratin: {
    region: 'chubu',
    story: '数種のきのこを、ベシャメルで包んで焼く。秋の森の記憶を、オーブンで温める。',
    tags: ['オーブン', '秋'],
  },
  r_mushroom_pasta_v1: { // avoid collision with existing mushroom_pasta
    region: 'chubu',
    story: 'きのこを重ねて炒める。層になった旨味が、パスタに絡む秋の終わり。',
    tags: ['パスタ', '秋'],
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
