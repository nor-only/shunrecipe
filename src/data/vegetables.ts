export interface Vegetable {
  id: string;
  name: string;
  nameEn: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  months: number[];
  emoji: string;
  nutrition: string;
  tips: string;
  storage: string;
  facts: string;
  regions: string[];
}

export const vegetables: Vegetable[] = [
  // ── 春 ──
  { id: "takenoko", name: "たけのこ", nameEn: "Bamboo Shoot", season: "spring", months: [3,4,5], emoji: "\u{1F38B}", nutrition: "食物繊維が豊富で、カリウム、ビタミンB群を含みます。低カロリーでダイエットにも最適。", tips: "切り口が白く、穂先が黄色いものが新鮮。小ぶりで重みのあるものを選びましょう。", storage: "茹でてから水に浸し、冷蔵庫で保存。水は毎日取り替えて3〜4日以内に使い切りましょう。", facts: "旬の時期は栄養価が最も高く、えぐみも少ない。掘りたてほど美味しい。", regions: ["kanto","kinki","kyushu","chugoku"] },
  { id: "cabbage", name: "新キャベツ", nameEn: "Spring Cabbage", season: "spring", months: [3,4,5], emoji: "\u{1F96C}", nutrition: "ビタミンCが豊富で、胃の粘膜を保護するビタミンU（キャベジン）を含みます。", tips: "葉が柔らかく巻きがゆるいものが春キャベツの特徴。ずっしり重いものを選んで。", storage: "芯をくり抜き、湿らせたキッチンペーパーを詰めてポリ袋に入れ冷蔵庫へ。", facts: "通常のキャベツに比べて水分が多く柔らかいため、生食サラダに最適です。", regions: ["kanto","chubu","kinki","chugoku","kyushu"] },
  { id: "asparagus", name: "アスパラガス", nameEn: "Asparagus", season: "spring", months: [4,5,6], emoji: "\u{1F33F}", nutrition: "アスパラギン酸が疲労回復に効果的。葉酸、ビタミンK、ルチンも豊富。", tips: "穂先がしまっていて、茎が太く真っすぐなものが良品。切り口がみずみずしいものを。", storage: "濡れた新聞紙で包み、穂先を上にして立てて冷蔵庫の野菜室へ。2〜3日で使い切って。", facts: "北海道産が有名ですが、佐賀県や長野県も主要産地。グリーンとホワイトがあります。", regions: ["hokkaido","tohoku","kanto","chubu"] },
  { id: "nanohana", name: "菜の花", nameEn: "Rapeseed Blossoms", season: "spring", months: [2,3,4], emoji: "\u{1F33C}", nutrition: "β-カロテン、ビタミンC、鉄分が非常に豊富。ほうれん草以上の栄養価を誇ります。", tips: "蕾がしっかり閉じていて、茎にハリがあるものが新鮮。花が咲いていると苦味が強い。", storage: "湿らせた新聞紙で包みポリ袋に入れ冷蔵庫へ。できるだけ早く使い切りましょう。", facts: "春を告げる野菜の代表格。ほろ苦さが大人の味わいで、おひたしや天ぷらに最適。", regions: ["kanto","kinki","chugoku","shikoku","kyushu"] },
  { id: "shin_tamanegi", name: "新たまねぎ", nameEn: "New Onion", season: "spring", months: [3,4,5], emoji: "\u{1F9C5}", nutrition: "硫化アリルが血液をサラサラにし、ビタミンB1の吸収を助けます。ケルセチンも豊富。", tips: "表面にツヤがあり、押してみて硬いものを選びましょう。芽が出ていないものが良品。", storage: "通常のたまねぎと違い水分が多いので、冷蔵庫の野菜室で保存。1週間を目安に。", facts: "水にさらす時間は短めに。辛みが少ないのでスライスして生食が美味しい。", regions: ["kanto","kinki","shikoku","kyushu"] },
  // ── 夏 ──
  { id: "tomato", name: "トマト", nameEn: "Tomato", season: "summer", months: [6,7,8], emoji: "\u{1F345}", nutrition: "リコピンが豊富で抗酸化作用が高い。旬の時期はβ-カロテン含有量が約2倍に。ビタミンCも豊富。", tips: "ヘタが緑色でピンとしていて、全体が均一に赤いものを。ずっしり重いものが糖度が高い。", storage: "常温で追熟させてから冷蔵庫へ。冷凍保存も可能で、凍ったまま料理に使えます。", facts: "旬のトマトは冬のハウス栽培と比べてリコピンが約3倍。太陽の恵みが詰まっています。", regions: ["hokkaido","tohoku","kanto","chubu","kinki","kyushu"] },
  { id: "cucumber", name: "きゅうり", nameEn: "Cucumber", season: "summer", months: [6,7,8], emoji: "\u{1F952}", nutrition: "カリウムが豊富でむくみ解消に。水分が約95%で夏の水分補給にも。ビタミンKも含有。", tips: "イボがしっかりしていてチクチクするものが新鮮。太さが均一で色が濃いものを選んで。", storage: "水分を拭き取り、ラップで包んで冷蔵庫の野菜室へ。ヘタを上にして立てて保存。", facts: "世界で最もカロリーの低い野菜としてギネスに登録。体を冷やす効果があり夏にぴったり。", regions: ["kanto","chubu","tohoku","kyushu"] },
  { id: "nasu", name: "なす", nameEn: "Eggplant", season: "summer", months: [6,7,8,9], emoji: "\u{1F346}", nutrition: "ナスニンというポリフェノールが豊富で抗酸化作用が高い。カリウム、食物繊維も含有。", tips: "ヘタのトゲがしっかりしていて痛いくらいのものが新鮮。皮にツヤとハリがあるものを。", storage: "1本ずつラップで包み、冷蔵庫の野菜室へ。5℃以下は低温障害を起こすので注意。", facts: "「秋なすは嫁に食わすな」は、美味しすぎるからという説も。焼き・揚げ・煮、何でも合います。", regions: ["kanto","kinki","chubu","kyushu","chugoku"] },
  { id: "corn", name: "とうもろこし", nameEn: "Corn", season: "summer", months: [6,7,8], emoji: "\u{1F33D}", nutrition: "糖質、ビタミンB1、B2、食物繊維が豊富。エネルギー補給に最適な夏野菜。", tips: "ヒゲが褐色で多いものが実が充実。皮が鮮やかな緑色で、粒にツヤがあるものを。", storage: "収穫後は糖度がどんどん落ちるので、すぐに茹でるのがベスト。茹でてから冷蔵・冷凍保存。", facts: "朝採りが最も甘い。茹でる時は水から入れて沸騰後3〜5分がベスト。", regions: ["hokkaido","tohoku","kanto","chubu"] },
  { id: "edamame", name: "枝豆", nameEn: "Edamame", season: "summer", months: [6,7,8], emoji: "\u{1FADB}", nutrition: "良質なタンパク質、ビタミンB1、葉酸、鉄分が豊富。メチオニンがアルコール分解を助けます。", tips: "さやの色が鮮やかな緑で、産毛がしっかり付いているものを。粒が大きく膨らんでいるものが◎。", storage: "購入後すぐに茹でるのがベスト。茹でた後は冷凍保存で約1ヶ月持ちます。", facts: "大豆の未熟な状態が枝豆。ビールのお供は理にかなっていて、メチオニンが肝機能を助けます。", regions: ["tohoku","kanto","chubu","hokkaido"] },
  // ── 秋 ──
  { id: "satsumaimo", name: "さつまいも", nameEn: "Sweet Potato", season: "autumn", months: [9,10,11], emoji: "\u{1F360}", nutrition: "ビタミンC、食物繊維、カリウムが豊富。加熱してもビタミンCが壊れにくいのが特徴。", tips: "表面にツヤがあり、ひげ根の跡が少なく均一な形のものを。ずっしり重いものが良品。", storage: "新聞紙で包み、常温の冷暗所で保存。冷蔵庫は低温障害を起こすのでNG。", facts: "収穫後1〜2ヶ月寝かせると、デンプンが糖に変わり甘みが増します。", regions: ["kanto","kyushu","shikoku","chubu"] },
  { id: "kabocha", name: "かぼちゃ", nameEn: "Japanese Pumpkin", season: "autumn", months: [9,10,11], emoji: "\u{1F383}", nutrition: "β-カロテンが非常に豊富で、ビタミンE、ビタミンCも。免疫力向上に効果的。", tips: "ヘタが乾燥してコルク状になっているものが完熟。ずっしり重く、皮が硬いものを。", storage: "丸ごとなら常温で2〜3ヶ月保存可能。カットしたら種とワタを除き、ラップで冷蔵庫へ。", facts: "冬至にかぼちゃを食べる風習は、栄養豊富で風邪予防になることから。保存性も高い。", regions: ["hokkaido","kanto","chubu","kinki","kyushu"] },
  { id: "kinoko", name: "きのこ類", nameEn: "Mushrooms", season: "autumn", months: [9,10,11], emoji: "\u{1F344}", nutrition: "ビタミンD、食物繊維、ビタミンB群が豊富。低カロリーでダイエットにも最適。", tips: "しいたけは肉厚で傘が開ききっていないもの。まいたけは色が濃く、パリッとしたものを。", storage: "水洗いはNG。キッチンペーパーで包み、ポリ袋に入れて冷蔵庫の野菜室へ。冷凍で旨味UP。", facts: "冷凍すると細胞が壊れて旨味成分が出やすくなります。調理時は凍ったまま使って。", regions: ["hokkaido","tohoku","kanto","chubu","kinki"] },
  { id: "renkon", name: "れんこん", nameEn: "Lotus Root", season: "autumn", months: [10,11,12], emoji: "\u{1FAB7}", nutrition: "ビタミンC、食物繊維、ポリフェノール（タンニン）が豊富。胃腸の調子を整える効果も。", tips: "切り口が白く、穴が小さく均一なものを。ずっしり重みがあり、節と節の間が長いものが◎。", storage: "切り口をラップで包み、ポリ袋に入れて冷蔵庫へ。酢水に浸けると変色を防げます。", facts: "穴が空いているので「先が見通せる」縁起物として、おせち料理に欠かせない食材。", regions: ["kanto","chubu","kinki","chugoku","kyushu"] },
  { id: "satoimo", name: "里芋", nameEn: "Taro", season: "autumn", months: [9,10,11], emoji: "\u{1F954}", nutrition: "カリウム、食物繊維が豊富。ぬめり成分のガラクタンが免疫力を高める効果。", tips: "表面の縞模様がはっきりしていて、ふっくら丸いものを。泥付きの方が鮮度が長持ち。", storage: "泥付きのまま新聞紙で包み、冷暗所で保存。洗ったものは冷蔵庫で3〜4日以内に。", facts: "日本人と里芋の付き合いは稲作よりも古く、縄文時代から栽培されていたとも。", regions: ["tohoku","kanto","chubu","kinki","chugoku"] },
  // ── 冬 ──
  { id: "daikon", name: "大根", nameEn: "Daikon Radish", season: "winter", months: [11,12,1,2], emoji: "\u{1F955}", nutrition: "消化酵素ジアスターゼが胃腸の働きを助ける。ビタミンC、カリウムも豊富。葉にはβ-カロテンも。", tips: "ずっしり重く、表面にハリとツヤがあるものを。ヒゲ根が少なく真っすぐなものが良品。", storage: "葉を切り落とし、新聞紙で包んで冷蔵庫へ。大きい場合はカットしてラップで保存。", facts: "上部は甘みが強くサラダに、中央は煮物に、下部は辛みが強く大根おろしに最適。", regions: ["hokkaido","tohoku","kanto","chubu","kinki","kyushu"] },
  { id: "hakusai", name: "白菜", nameEn: "Napa Cabbage", season: "winter", months: [11,12,1,2], emoji: "\u{1F96C}", nutrition: "ビタミンC、カリウム、食物繊維が豊富。水分が約95%で低カロリー。鍋料理に最適。", tips: "葉が白くて厚みがあり、持つとずっしり重いものを。外葉がしっかり巻いているものが◎。", storage: "丸ごとなら新聞紙で包み冷暗所で2〜3週間。カットしたものはラップで冷蔵庫へ。", facts: "霜に当たると甘みが増す。鍋料理で使うとビタミンCがスープに溶け出し、余さず摂取できます。", regions: ["hokkaido","tohoku","kanto","chubu","kinki","chugoku"] },
  { id: "hourensou", name: "ほうれん草", nameEn: "Spinach", season: "winter", months: [11,12,1,2], emoji: "\u{1F96C}", nutrition: "鉄分、葉酸、β-カロテン、ビタミンCが豊富。冬採りは夏採りの約3倍のビタミンCを含有。", tips: "葉が肉厚で濃い緑色のものを。根元がピンク色のものは甘みが強い良品。", storage: "湿らせた新聞紙で包み、根を下にして立てて冷蔵庫へ。3日以内に使い切るのがベスト。", facts: "旬の冬のほうれん草は栄養価が格段に高い。茹で時間は30秒〜1分で十分です。", regions: ["kanto","chubu","kinki","tohoku","chugoku"] },
  { id: "broccoli", name: "ブロッコリー", nameEn: "Broccoli", season: "winter", months: [11,12,1,2,3], emoji: "\u{1F966}", nutrition: "ビタミンC含有量はレモン以上。β-カロテン、ビタミンK、葉酸、スルフォラファンも豊富。", tips: "蕾が小さく密集して紫がかっているものが栄養価が高い。茎も栄養豊富なので食べて。", storage: "ポリ袋に入れ冷蔵庫の野菜室へ。小房に分けて茹でてから冷凍保存も可能。", facts: "2026年から「指定野菜」に昇格。茎には蕾以上のビタミンCが含まれています。", regions: ["hokkaido","kanto","chubu","kinki","kyushu"] },
  { id: "negi", name: "長ねぎ", nameEn: "Japanese Leek", season: "winter", months: [11,12,1,2], emoji: "\u{1F9C5}", nutrition: "硫化アリルが血行促進・殺菌効果。ビタミンC、葉酸も含有。風邪予防に効果的。", tips: "白い部分が長く、弾力があるものを。緑と白の境界がはっきりしているものが良品。", storage: "新聞紙で包み冷暗所へ。カットしたものはラップで冷蔵庫へ。小口切りで冷凍も◎。", facts: "関東では白い部分、関西では青い部分を好んで食べる文化の違いがあります。", regions: ["kanto","tohoku","chubu","hokkaido"] },
];

export const seasonNames = {
  spring: { jp: "春", en: "Spring", months: "3月〜5月", color: "#22c55e" },
  summer: { jp: "夏", en: "Summer", months: "6月〜8月", color: "#ef4444" },
  autumn: { jp: "秋", en: "Autumn", months: "9月〜11月", color: "#d97706" },
  winter: { jp: "冬", en: "Winter", months: "12月〜2月", color: "#7c3aed" },
} as const;

export type Season = keyof typeof seasonNames;

export const monthSeason: Record<number, Season> = {
  1: "winter", 2: "winter", 3: "spring", 4: "spring",
  5: "spring", 6: "summer", 7: "summer", 8: "summer",
  9: "autumn", 10: "autumn", 11: "autumn", 12: "winter",
};

export function getCurrentSeason(): Season {
  const m = new Date().getMonth() + 1;
  return monthSeason[m];
}

export function getVegetablesBySeason(season: Season): Vegetable[] {
  return vegetables.filter(v => v.season === season);
}

export function getVegetableById(id: string): Vegetable | undefined {
  return vegetables.find(v => v.id === id);
}
