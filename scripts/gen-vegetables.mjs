// One-shot generator for vegetable markdown entries.
// Run: node scripts/gen-vegetables.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/content/vegetables';
mkdirSync(DIR, { recursive: true });

/**
 * Minimal schema mirrors content.config.ts.
 * Stories are 80-120 chars, editorial tone.
 */
const data = [
  // ── 春 ──
  { slug: 'takenoko', name_ja: 'たけのこ', name_en: 'Bamboo Shoot', aliases: ['竹の子','タケノコ'],
    seasons: ['spring'], peak_months: [3,4,5],
    regions: ['kyushu_okinawa','chugoku','shikoku','kinki'],
    notable_cultivars: [{ name:'合馬たけのこ', region:'福岡県北九州市' },{ name:'京たけのこ', region:'京都府乙訓' }],
    nutrition: ['食物繊維','カリウム','チロシン'], pairings: ['若布','木の芽','昆布','鰹節'],
    storage: '掘りたてをすぐ茹でる。糠と鷹の爪で下茹で、水に浸して冷蔵三〜四日。',
    related: ['r_takenoko','r_takenoko_isobe','r_takenoko_kinpira'], image: '/assets/images/veg_takenoko.png',
    story: '春の山が目覚めると、真っ先に届く季節の使者。掘りたてのわずか数日間にだけ宿る、えぐみを忘れた甘みがある。' },
  { slug: 'cabbage', name_ja: '新キャベツ', name_en: 'Spring Cabbage', aliases: ['春キャベツ'],
    seasons: ['spring'], peak_months: [3,4,5], regions: ['kanto','kinki','shikoku','kyushu_okinawa'],
    notable_cultivars: [{ name:'銚子春キャベツ', region:'千葉県銚子' },{ name:'神奈川三浦春キャベツ', region:'神奈川県三浦' }],
    nutrition: ['ビタミンC','ビタミンU','食物繊維'], pairings: ['あさり','ベーコン','アンチョビ','桜えび'],
    storage: '芯をくり抜き、湿らせたキッチンペーパーを詰めてポリ袋へ。冷蔵庫野菜室で一週間。',
    related: ['r_cabbage_clam','r_cabbage_roll','r_cabbage_peperoncino'], image: '/assets/images/veg_cabbage.png',
    story: '葉の巻きはゆるく、芯までみずみずしい。冬のしっかり詰まった玉とは別種と呼んでも差し支えない、春の菜。' },
  { slug: 'asparagus', name_ja: 'アスパラガス', name_en: 'Asparagus', aliases: ['グリーンアスパラ'],
    seasons: ['spring'], peak_months: [4,5,6], regions: ['hokkaido','tohoku','chubu'],
    notable_cultivars: [{ name:'ラワンぶき', region:'北海道足寄' },{ name:'佐賀春芽アスパラ', region:'佐賀県' }],
    nutrition: ['アスパラギン酸','葉酸','ルチン'], pairings: ['ベーコン','バター','半熟卵','パルミジャーノ'],
    storage: '濡れた新聞紙で包み、穂先を上にして立てて冷蔵。二〜三日で使い切る。',
    related: ['r_asparagus_cheese','r_asparagus_soup','r_asparagus_bacon'], image: '/assets/images/veg_asparagus.png',
    story: '土を割って真っすぐ伸び上がる芽の力強さは、ほかの野菜にない。太いほど甘く、畑の朝摘みは皮ごと美味い。' },
  { slug: 'nanohana', name_ja: '菜の花', name_en: 'Rapeseed Blossoms', aliases: ['なのはな'],
    seasons: ['spring'], peak_months: [2,3,4], regions: ['kanto','kinki','chugoku','shikoku','kyushu_okinawa'],
    notable_cultivars: [{ name:'千葉県房総菜花', region:'千葉県' }],
    nutrition: ['β-カロテン','ビタミンC','鉄分'], pairings: ['辛子','からすみ','白味噌','ベーコン'],
    storage: '湿らせた新聞紙で包みポリ袋へ。立てて冷蔵、できるだけ早く使い切る。',
    related: ['r_nanohana_karashi','r_nanohana_pasta','r_nanohana_tamagotoji'], image: '/assets/images/veg_nanohana.png',
    story: '蕾がほころぶ前のほろ苦さが身上。一年で最初に食卓に乗せたい、春の到来を告げる菜。' },
  { slug: 'shin_tamanegi', name_ja: '新たまねぎ', name_en: 'New Onion', aliases: ['新玉ねぎ','新玉'],
    seasons: ['spring'], peak_months: [3,4,5], regions: ['kinki','shikoku','kyushu_okinawa','kanto'],
    notable_cultivars: [{ name:'淡路島新玉ねぎ', region:'兵庫県淡路島' },{ name:'泉州新玉ねぎ', region:'大阪府泉州' }],
    nutrition: ['硫化アリル','ケルセチン','ビタミンB1'], pairings: ['鰹節','ツナ','バター','ベーコン'],
    storage: '水分が多いため冷蔵庫野菜室へ。一週間を目安に。',
    related: ['r_shin_tamanegi_soup','r_shin_tamanegi_salad','r_shin_tamanegi_sukiyaki'], image: '/assets/images/veg_shin_tamanegi.png',
    story: '辛みが抜けて、生でも齧れるほど甘い。淡路の玉は、水を足さずスープに化ける。' },
  // ── 夏 ──
  { slug: 'tomato', name_ja: 'トマト', name_en: 'Tomato', aliases: [],
    seasons: ['summer'], peak_months: [6,7,8], regions: ['hokkaido','tohoku','kanto','chubu','kinki','kyushu_okinawa'],
    notable_cultivars: [{ name:'桃太郎', region:'全国' },{ name:'アメーラ', region:'静岡県' }],
    nutrition: ['リコピン','β-カロテン','ビタミンC'], pairings: ['バジル','モッツァレラ','オリーブオイル','塩麹'],
    storage: '完熟は冷蔵、未熟は常温で追熟。冷凍で皮がするりと剥ける。',
    related: ['r_tomato','r_tomato_caprese','r_tomato_curry'], image: '/assets/images/veg_tomato.png',
    story: '太陽を浴びた夏のトマトは、冬のハウスとは別物。切った瞬間の香気だけで、献立は決まる。' },
  { slug: 'cucumber', name_ja: 'きゅうり', name_en: 'Cucumber', aliases: [],
    seasons: ['summer'], peak_months: [6,7,8], regions: ['kanto','chubu','tohoku','kyushu_okinawa'],
    notable_cultivars: [{ name:'加賀太きゅうり', region:'石川県' }],
    nutrition: ['カリウム','ビタミンK'], pairings: ['梅','みょうが','生姜','豚薄切り'],
    storage: '水気を拭いてラップで包み、ヘタを上にして立てて冷蔵。',
    related: ['r_cucumber_salad','r_cucumber_sunomono','r_cucumber_pork_fry'], image: '/assets/images/veg_cucumber.png',
    story: '九割以上が水。それ以外はすべて香り。叩いて割ると、その香りが解き放たれる。' },
  { slug: 'nasu', name_ja: 'なす', name_en: 'Eggplant', aliases: ['茄子'],
    seasons: ['summer','autumn'], peak_months: [6,7,8,9], regions: ['kanto','kinki','chubu','kyushu_okinawa','chugoku'],
    notable_cultivars: [{ name:'賀茂なす', region:'京都府' },{ name:'民田なす', region:'山形県鶴岡' },{ name:'水なす', region:'大阪府泉州' }],
    nutrition: ['ナスニン','カリウム','食物繊維'], pairings: ['味噌','ごま油','大葉','みょうが'],
    storage: '低温障害に注意。一本ずつラップで包み野菜室へ。',
    related: ['r_nasu_miso','r_nasu_agebitashi','r_ratatouille'], image: '/assets/images/veg_nasu.png',
    story: '油と相性のよさは随一。素揚げしただけで、皮の艶と身のとろみが一皿の主役になる。' },
  { slug: 'corn', name_ja: 'とうもろこし', name_en: 'Corn', aliases: ['スイートコーン'],
    seasons: ['summer'], peak_months: [6,7,8], regions: ['hokkaido','tohoku','kanto','chubu'],
    notable_cultivars: [{ name:'札幌黄', region:'北海道札幌' },{ name:'ピュアホワイト', region:'北海道' },{ name:'ゴールドラッシュ', region:'全国' }],
    nutrition: ['糖質','食物繊維','ビタミンB1'], pairings: ['バター','醤油','塩','青のり'],
    storage: '鮮度が命。届いたらその日のうちに茹でる。茹でてから冷蔵・冷凍。',
    related: ['r_corn_rice','r_corn_soup','r_corn_kakiage'], image: '/assets/images/veg_corn.png',
    story: '朝採れがすべて。畑から釜まで十五分で移せるなら、砂糖はいらない。' },
  { slug: 'edamame', name_ja: '枝豆', name_en: 'Edamame', aliases: [],
    seasons: ['summer'], peak_months: [7,8,9], regions: ['tohoku','kanto','chubu','hokkaido'],
    notable_cultivars: [{ name:'だだちゃ豆', region:'山形県鶴岡' },{ name:'丹波黒枝豆', region:'兵庫県丹波' }],
    nutrition: ['植物性タンパク','葉酸','メチオニン'], pairings: ['塩','ガーリック','ビール'],
    storage: '購入後すぐ茹でる。塩を強めに振って冷ましてから保存。',
    related: ['r_edamame_rice','r_edamame_garlic','r_edamame_salad'], image: '/assets/images/veg_edamame.png',
    story: '鶴岡のだだちゃ豆は、湯がきたての香りで嗅ぎ分けられる。夏の夜の、もっとも正しい肴。' },
  // ── 秋 ──
  { slug: 'satsumaimo', name_ja: 'さつまいも', name_en: 'Sweet Potato', aliases: [],
    seasons: ['autumn'], peak_months: [9,10,11], regions: ['kyushu_okinawa','kanto','shikoku','chubu'],
    notable_cultivars: [{ name:'紅はるか', region:'鹿児島県' },{ name:'なると金時', region:'徳島県鳴門' },{ name:'安納芋', region:'鹿児島県種子島' }],
    nutrition: ['ビタミンC','食物繊維','カリウム'], pairings: ['バター','レモン','黒胡麻','シナモン'],
    storage: '常温の冷暗所で新聞紙に包んで。冷蔵は低温障害の元。',
    related: ['r_satsumaimo_gratin','r_satsumaimo_lemon'], image: '/assets/images/veg_satsumaimo.png',
    story: '掘りたてより一、二ヶ月寝かせた方が、澱粉が糖に化けて甘くなる。秋が深まるほど本領。' },
  { slug: 'kabocha', name_ja: 'かぼちゃ', name_en: 'Japanese Pumpkin', aliases: ['南瓜'],
    seasons: ['autumn'], peak_months: [9,10,11], regions: ['hokkaido','kanto','chubu','kinki','kyushu_okinawa'],
    notable_cultivars: [{ name:'えびす', region:'北海道' },{ name:'ロロン', region:'全国' }],
    nutrition: ['β-カロテン','ビタミンE','ビタミンC'], pairings: ['バター','ナツメグ','黒胡麻','ベーコン'],
    storage: '丸ごとなら常温で数ヶ月。カット後は種とワタを除きラップで冷蔵。',
    related: ['r_kabocha_salad','r_kabocha_pudding','r_pumpkin'], image: '/assets/images/veg_kabocha.png',
    story: 'ずっしりと重く、皮が硬いものを選ぶ。切った断面の橙が濃いほど、煮ても焼いても美しい。' },
  { slug: 'kinoko', name_ja: 'きのこ類', name_en: 'Mushrooms', aliases: ['しいたけ','舞茸','しめじ'],
    seasons: ['autumn'], peak_months: [9,10,11], regions: ['hokkaido','tohoku','chubu','kinki'],
    notable_cultivars: [{ name:'信州しめじ', region:'長野県' },{ name:'岩手舞茸', region:'岩手県' }],
    nutrition: ['ビタミンD','食物繊維','β-グルカン'], pairings: ['バター','にんにく','醤油','白ワイン'],
    storage: '洗わず、キッチンペーパーに包んでポリ袋で冷蔵。冷凍で旨味が増す。',
    related: ['r_kinoko_ahijo','r_mushroom_pasta','r_kinoko_gratin'], image: '/assets/images/veg_kinoko.png',
    story: '秋の森は、見えない旨味で満ちている。数種を束ねて火を入れるほど、風味は層を増す。' },
  { slug: 'renkon', name_ja: 'れんこん', name_en: 'Lotus Root', aliases: ['蓮根'],
    seasons: ['autumn'], peak_months: [10,11,12], regions: ['chubu','kanto','kinki','kyushu_okinawa'],
    notable_cultivars: [{ name:'愛西れんこん', region:'愛知県愛西' },{ name:'岩国れんこん', region:'山口県岩国' }],
    nutrition: ['ビタミンC','食物繊維','タンニン'], pairings: ['酢','唐辛子','すり胡麻','鶏ひき肉'],
    storage: '切り口をラップで覆い、ポリ袋で冷蔵。酢水に晒すと変色を防げる。',
    related: ['r_renkon_kinpira','r_renkon_chikuwa','r_renkon_salad'], image: '/assets/images/veg_renkon.png',
    story: '節を切れば、穴の並びが涼しげに見通せる。歯触りを残すか、すり下ろすかで全く別の食材に。' },
  { slug: 'satoimo', name_ja: '里芋', name_en: 'Taro', aliases: [],
    seasons: ['autumn'], peak_months: [9,10,11], regions: ['tohoku','kanto','chubu','kinki','chugoku'],
    notable_cultivars: [{ name:'海老芋', region:'京都府' },{ name:'いものこ', region:'山形県' }],
    nutrition: ['カリウム','食物繊維','ガラクタン'], pairings: ['柚子','味噌','いかの塩辛','出汁'],
    storage: '泥付きのまま新聞紙に包み、冷暗所で。洗ったものは早めに使う。',
    related: ['r_satoimo_soboro','r_satoimo_croquette','r_satoimo_gratin'], image: '/assets/images/veg_satoimo.png',
    story: '縄文の頃から日本列島の主食のひとつだったとも言われる。ぬめりは、旨味そのもの。' },
  // ── 冬 ──
  { slug: 'daikon', name_ja: '大根', name_en: 'Daikon Radish', aliases: [],
    seasons: ['winter'], peak_months: [11,12,1,2], regions: ['hokkaido','tohoku','kanto','chubu','kinki','kyushu_okinawa'],
    notable_cultivars: [{ name:'三浦大根', region:'神奈川県三浦' },{ name:'聖護院大根', region:'京都府' },{ name:'桜島大根', region:'鹿児島県' }],
    nutrition: ['ジアスターゼ','ビタミンC','カリウム'], pairings: ['柚子味噌','鰤','豚ばら','帆立'],
    storage: '葉を切り落とし、新聞紙で包んで冷蔵。部位で使い分ける。',
    related: ['r_daikon','r_daikon_furofuki','r_daikon_scallop_salad'], image: '/assets/images/veg_daikon.png',
    story: '上から下へ、甘→煮→辛と味わいが移る。一本をどう使い切るかで、冬の段取りが見える。' },
  { slug: 'hakusai', name_ja: '白菜', name_en: 'Napa Cabbage', aliases: [],
    seasons: ['winter'], peak_months: [11,12,1,2], regions: ['hokkaido','tohoku','kanto','chubu','kinki','chugoku'],
    notable_cultivars: [{ name:'松島純二号', region:'宮城県' }],
    nutrition: ['ビタミンC','カリウム','食物繊維'], pairings: ['豚ばら','昆布出汁','柚子','胡麻油'],
    storage: '丸ごとなら新聞紙で包み冷暗所で二〜三週間。カット後は切り口をラップ。',
    related: ['r_hakusai_cream','r_hakusai_mapo','r_millefeuille_nabe'], image: '/assets/images/veg_hakusai.png',
    story: '霜に当たるほど甘くなる。重ねて煮るだけで、鍋は主役を手にする。' },
  { slug: 'hourensou', name_ja: 'ほうれん草', name_en: 'Spinach', aliases: [],
    seasons: ['winter'], peak_months: [11,12,1,2], regions: ['kanto','chubu','kinki','tohoku','chugoku'],
    notable_cultivars: [{ name:'ちぢみほうれん草', region:'宮城県・群馬県' }],
    nutrition: ['鉄分','葉酸','β-カロテン'], pairings: ['ベーコン','胡麻','バター','海苔'],
    storage: '濡らした新聞紙で根元を包み立てて冷蔵。三日以内に。',
    related: ['r_hourensou_gomaae','r_hourensou_bacon','r_hourensou_quiche'], image: '/assets/images/veg_hourensou.png',
    story: '冬採りは夏の三倍ビタミンCを蓄えるという。茹で時間は短く、根元の赤も捨てずに。' },
  { slug: 'broccoli', name_ja: 'ブロッコリー', name_en: 'Broccoli', aliases: [],
    seasons: ['winter'], peak_months: [11,12,1,2,3], regions: ['hokkaido','kanto','chubu','kinki','kyushu_okinawa'],
    notable_cultivars: [{ name:'香川ブロッコリー', region:'香川県' }],
    nutrition: ['ビタミンC','スルフォラファン','葉酸'], pairings: ['海老','アンチョビ','ゆで卵','粉チーズ'],
    storage: 'ポリ袋で野菜室へ。茎の皮を剥けば甘い。',
    related: ['r_broccoli_salad','r_broccoli_meat_fry','r_broccoli_shrimp'], image: '/assets/images/veg_broccoli.png',
    story: '房だけでなく、茎こそ甘い。冬の皿に緑を入れる、いちばん頼もしい選手。' },
  { slug: 'negi', name_ja: '長ねぎ', name_en: 'Japanese Leek', aliases: ['根深ねぎ'],
    seasons: ['winter'], peak_months: [11,12,1,2], regions: ['kanto','tohoku','chubu','hokkaido'],
    notable_cultivars: [{ name:'下仁田ねぎ', region:'群馬県下仁田' },{ name:'曲がりねぎ', region:'宮城県仙台' },{ name:'九条ねぎ', region:'京都府' }],
    nutrition: ['硫化アリル','ビタミンC','葉酸'], pairings: ['鴨','鶏','味噌','生姜'],
    storage: '新聞紙で包み冷暗所へ。カット後は小口切りで冷凍も可。',
    related: ['r_negi_chicken_soup','r_negi_pork','r_negi_ahijo'], image: '/assets/images/veg_negi.png',
    story: '下仁田の太ねぎは、じっくり焼けば甘露に変わる。冬の鍋の主役級。' },

  // ═══════ 新規追加 20件 ═══════
  // 春
  { slug: 'fukinotou', name_ja: 'ふきのとう', name_en: 'Butterbur Scape', aliases: [],
    seasons: ['spring'], peak_months: [2,3,4], regions: ['hokkaido','tohoku','chubu'],
    notable_cultivars: [{ name:'秋田ふきのとう', region:'秋田県' }],
    nutrition: ['ポリフェノール','食物繊維','カリウム'], pairings: ['味噌','天ぷら粉','くるみ'],
    storage: '泥を落として湿らせた紙で包み、ポリ袋で冷蔵。早めに使う。',
    related: [], image: '/assets/images/veg_fukinotou.png',
    story: '雪を割って最初に顔を出す芽。ほろ苦さは、冬の終わりを告げる便りそのもの。' },
  { slug: 'udo', name_ja: 'うど', name_en: 'Japanese Spikenard', aliases: ['独活'],
    seasons: ['spring'], peak_months: [3,4,5], regions: ['kanto','chubu','tohoku'],
    notable_cultivars: [{ name:'東京うど', region:'東京都立川' },{ name:'山うど', region:'長野県' }],
    nutrition: ['カリウム','食物繊維'], pairings: ['酢味噌','わかめ','練り辛子'],
    storage: '新聞紙で包み冷暗所へ。皮は捨てずにきんぴらに。',
    related: [], image: '/assets/images/veg_udo.png',
    story: '穂先、中間、皮。一本で三つの食感が楽しめる、春の山の贅沢。' },
  { slug: 'norabou', name_ja: 'のらぼう菜', name_en: 'Nobiru Greens', aliases: [],
    seasons: ['spring'], peak_months: [2,3,4], regions: ['kanto'],
    notable_cultivars: [{ name:'五日市のらぼう菜', region:'東京都あきる野' }],
    nutrition: ['β-カロテン','ビタミンC','食物繊維'], pairings: ['オイル','ベーコン','卵'],
    storage: '湿らせた新聞紙で包み立てて冷蔵。早めに使う。',
    related: [], image: '/assets/images/veg_norabou.png',
    story: '東京多摩の春の顔。菜花より苦みが淡く、炒めると甘みが立ち上がる在来種。' },
  { slug: 'usui_endou', name_ja: 'うすいえんどう', name_en: 'Usui Green Peas', aliases: ['うすい豆'],
    seasons: ['spring'], peak_months: [4,5], regions: ['kinki'],
    notable_cultivars: [{ name:'和歌山うすいえんどう', region:'和歌山県' }],
    nutrition: ['植物性タンパク','食物繊維','ビタミンB1'], pairings: ['だし','卵','薄口醤油'],
    storage: 'さやごと冷蔵。剥いたらすぐ使う。',
    related: [], image: '/assets/images/veg_usui_endou.png',
    story: '関西の春の色。翡翠のスープに仕立てると、皿の上で和歌山の畑がひらく。' },
  { slug: 'soramame', name_ja: 'そら豆', name_en: 'Broad Bean', aliases: ['空豆'],
    seasons: ['spring'], peak_months: [4,5,6], regions: ['kinki','shikoku','kyushu_okinawa'],
    notable_cultivars: [{ name:'陵西一寸', region:'愛媛県' }],
    nutrition: ['植物性タンパク','ビタミンB1','葉酸'], pairings: ['塩','ペコリーノ','レモン'],
    storage: 'さやのまま保存。剥いたらその日のうちに。',
    related: [], image: '/assets/images/veg_soramame.png',
    story: 'さやを割った瞬間の、あの緑の匂い。塩茹でだけで、春の一本は片付く。' },
  // 夏
  { slug: 'kamonasu', name_ja: '賀茂なす', name_en: 'Kamo Eggplant', aliases: [],
    seasons: ['summer'], peak_months: [6,7,8], regions: ['kinki'],
    notable_cultivars: [{ name:'京の伝統野菜・賀茂なす', region:'京都府上賀茂' }],
    nutrition: ['ナスニン','カリウム'], pairings: ['赤味噌','木の芽','白味噌','ごま油'],
    storage: '冷蔵庫野菜室、一本ずつ紙に包んで。',
    related: [], image: '/assets/images/veg_kamonasu.png',
    story: 'ぽってりと丸い、京都上賀茂の夏の象徴。厚切りにして田楽にすれば、その重量感が意味を持つ。' },
  { slug: 'manganji', name_ja: '万願寺とうがらし', name_en: 'Manganji Pepper', aliases: [],
    seasons: ['summer'], peak_months: [6,7,8,9], regions: ['kinki'],
    notable_cultivars: [{ name:'京の伝統野菜・万願寺とうがらし', region:'京都府舞鶴' }],
    nutrition: ['ビタミンC','β-カロテン'], pairings: ['ちりめんじゃこ','鰹節','醤油'],
    storage: '冷蔵庫野菜室で一週間ほど。',
    related: [], image: '/assets/images/veg_manganji.png',
    story: '辛くない大型唐辛子の代表。じゃこと炊けば、京の夏の常備菜になる。' },
  { slug: 'goya', name_ja: 'ゴーヤー', name_en: 'Bitter Melon', aliases: ['にがうり'],
    seasons: ['summer'], peak_months: [6,7,8,9], regions: ['kyushu_okinawa'],
    notable_cultivars: [{ name:'沖縄あばしゴーヤー', region:'沖縄県' }],
    nutrition: ['ビタミンC','モモルデシン','食物繊維'], pairings: ['豚肉','豆腐','卵','鰹節'],
    storage: '種とワタを除き、ポリ袋で冷蔵。',
    related: [], image: '/assets/images/veg_goya.png',
    story: '沖縄の夏を支えてきた苦味。塩揉みで角を丸め、チャンプルーで一気に食卓の中心へ。' },
  { slug: 'shishito', name_ja: 'ししとう', name_en: 'Shishito Pepper', aliases: [],
    seasons: ['summer'], peak_months: [6,7,8,9], regions: ['shikoku','kinki'],
    notable_cultivars: [{ name:'高知ししとう', region:'高知県' }],
    nutrition: ['ビタミンC','β-カロテン'], pairings: ['鰹節','醤油','塩','胡麻油'],
    storage: 'ヘタ付きのままポリ袋で冷蔵。',
    related: [], image: '/assets/images/veg_shishito.png',
    story: '十本に一本は辛い、というロシアンルーレット。焼いて塩だけで、夏の肴は仕上がる。' },
  { slug: 'dadachamame', name_ja: 'だだちゃ豆', name_en: 'Dadacha Edamame', aliases: [],
    seasons: ['summer'], peak_months: [8,9], regions: ['tohoku'],
    notable_cultivars: [{ name:'白山だだちゃ豆', region:'山形県鶴岡' }],
    nutrition: ['植物性タンパク','メチオニン','葉酸'], pairings: ['塩','冷酒'],
    storage: '購入後すぐ塩茹で。香りが命。',
    related: ['r_edamame_rice'], image: '/assets/images/veg_dadachamame.png',
    story: 'さやを開けた瞬間に、とうもろこしに似た甘香が立つ。鶴岡の土でしか作れないという。' },
  // 秋
  { slug: 'tanba_kuromame', name_ja: '丹波黒枝豆', name_en: 'Tanba Black Edamame', aliases: [],
    seasons: ['autumn'], peak_months: [10,11], regions: ['kinki'],
    notable_cultivars: [{ name:'丹波黒枝豆', region:'兵庫県丹波篠山' }],
    nutrition: ['植物性タンパク','アントシアニン','葉酸'], pairings: ['塩','冷酒','白ワイン'],
    storage: '届いたらすぐに塩茹で。',
    related: [], image: '/assets/images/veg_tanba_kuromame.png',
    story: '黒大豆の未熟な姿。粒の大きさと深い甘みは、十月の十日ほどにしか許されない。' },
  { slug: 'ebiimo', name_ja: '海老芋', name_en: 'Shrimp Taro', aliases: [],
    seasons: ['autumn'], peak_months: [10,11,12], regions: ['kinki'],
    notable_cultivars: [{ name:'京の伝統野菜・海老芋', region:'京都府' }],
    nutrition: ['カリウム','食物繊維','ガラクタン'], pairings: ['棒鱈','昆布','白味噌'],
    storage: '泥付きで新聞紙に包み冷暗所。',
    related: [], image: '/assets/images/veg_ebiimo.png',
    story: '曲がった形と縞模様を、海老にかけて。京のいも棒は、この芋のためにある。' },
  { slug: 'matsutake', name_ja: '松茸', name_en: 'Matsutake', aliases: [],
    seasons: ['autumn'], peak_months: [9,10], regions: ['chugoku','chubu','tohoku'],
    notable_cultivars: [{ name:'岡山松茸', region:'岡山県' }],
    nutrition: ['食物繊維','ビタミンD'], pairings: ['鱧','お吸い物','すだち'],
    storage: '湿らせた紙に包み冷蔵、できるだけ早く。',
    related: [], image: '/assets/images/veg_matsutake.png',
    story: '日本の秋の、香りの王者。焼いて、吸い物にして、土瓶蒸しで。香りを残す料理に徹する。' },
  { slug: 'naruto_kintoki', name_ja: 'なると金時', name_en: 'Naruto Kintoki Sweet Potato', aliases: [],
    seasons: ['autumn'], peak_months: [9,10,11,12], regions: ['shikoku'],
    notable_cultivars: [{ name:'なると金時', region:'徳島県鳴門' }],
    nutrition: ['食物繊維','ビタミンC','カリウム'], pairings: ['バター','生クリーム','シナモン'],
    storage: '新聞紙で包み常温の冷暗所へ。',
    related: [], image: '/assets/images/veg_naruto_kintoki.png',
    story: '鳴門の砂地で育つ、ほくほくと黄金の身。グラタンでも、焼き芋でも、甘さが崩れない。' },
  { slug: 'rakkasei', name_ja: '落花生', name_en: 'Peanut', aliases: ['ピーナッツ'],
    seasons: ['autumn'], peak_months: [9,10,11], regions: ['kanto'],
    notable_cultivars: [{ name:'千葉県八街落花生', region:'千葉県八街' }],
    nutrition: ['植物性タンパク','ビタミンE','食物繊維'], pairings: ['塩','味噌','蜂蜜'],
    storage: 'さやのまま乾燥させ、密閉して冷暗所。',
    related: [], image: '/assets/images/veg_rakkasei.png',
    story: '生落花生を塩茹でした時の、乳のような甘さ。収穫地でしか味わえない秋の味。' },
  // 冬
  { slug: 'kujyo_negi', name_ja: '九条ねぎ', name_en: 'Kujyo Leek', aliases: [],
    seasons: ['winter','autumn'], peak_months: [11,12,1,2], regions: ['kinki'],
    notable_cultivars: [{ name:'京の伝統野菜・九条ねぎ', region:'京都府' }],
    nutrition: ['硫化アリル','ビタミンC'], pairings: ['牡蠣','鰊','味噌','油揚げ'],
    storage: 'ぬめりは旨味。洗わず保存し使う直前に。',
    related: [], image: '/assets/images/veg_kujyo_negi.png',
    story: '青い葉にぬめりを蓄える、京の葉ねぎ。牡蠣と合わせた土手鍋は、真冬の京の晩ごはん。' },
  { slug: 'shogoin_daikon', name_ja: '聖護院大根', name_en: 'Shogoin Daikon', aliases: [],
    seasons: ['winter'], peak_months: [11,12,1,2], regions: ['kinki'],
    notable_cultivars: [{ name:'京の伝統野菜・聖護院大根', region:'京都府' }],
    nutrition: ['ジアスターゼ','ビタミンC'], pairings: ['柚子味噌','昆布','出汁'],
    storage: '新聞紙で包み冷暗所。',
    related: ['r_daikon_furofuki'], image: '/assets/images/veg_shogoin_daikon.png',
    story: '丸々と重い、京都の冬の象徴。ふろふきにすれば、昆布と柚子味噌だけで名品になる。' },
  { slug: 'yukishita_ninjin', name_ja: '雪下にんじん', name_en: 'Under-Snow Carrot', aliases: [],
    seasons: ['winter'], peak_months: [12,1,2,3], regions: ['hokkaido','tohoku'],
    notable_cultivars: [{ name:'雪下にんじん', region:'北海道・新潟県' }],
    nutrition: ['β-カロテン','食物繊維'], pairings: ['バター','クリーム','蜂蜜'],
    storage: '新聞紙で包み冷蔵。',
    related: [], image: '/assets/images/veg_yukishita_ninjin.png',
    story: '雪の下でひと冬眠る間に、甘さだけが凝縮する。冷製ポタージュにすると、橙色の季節が届く。' },
  { slug: 'seri', name_ja: 'セリ', name_en: 'Japanese Parsley', aliases: ['仙台芹'],
    seasons: ['winter','spring'], peak_months: [12,1,2,3], regions: ['tohoku'],
    notable_cultivars: [{ name:'仙台セリ', region:'宮城県名取' }],
    nutrition: ['β-カロテン','鉄分','ビタミンC'], pairings: ['鴨','鶏','昆布出汁','柚子'],
    storage: '根も食べる。湿らせた紙で包み冷蔵。',
    related: [], image: '/assets/images/veg_seri.png',
    story: '宮城の冬の鍋は、このセリのためにある。根の歯触り、葉の香り、茎の張り、全部仕事をする。' },
  { slug: 'shimonita_negi', name_ja: '下仁田ねぎ', name_en: 'Shimonita Leek', aliases: [],
    seasons: ['winter'], peak_months: [12,1,2], regions: ['kanto'],
    notable_cultivars: [{ name:'下仁田ねぎ', region:'群馬県下仁田' }],
    nutrition: ['硫化アリル','ビタミンC','食物繊維'], pairings: ['鴨','鶏','牛すじ','味噌'],
    storage: '新聞紙で包み冷暗所へ。',
    related: ['r_negi_chicken_soup'], image: '/assets/images/veg_shimonita_negi.png',
    story: '太く短く、火を入れれば甘露に変わる。殿様ねぎの異名は、伊達ではない。' },
];

const yaml = (v) => {
  if (v == null) return 'null';
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    if (typeof v[0] === 'object' && v[0] !== null) {
      return '\n' + v.map(o =>
        '  - ' + Object.entries(o).map(([k,val]) => `${k}: ${JSON.stringify(val)}`).join('\n    ')
      ).join('\n');
    }
    return '[' + v.map(x => JSON.stringify(x)).join(', ') + ']';
  }
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return JSON.stringify(v);
};

for (const v of data) {
  const lines = [];
  lines.push('---');
  lines.push(`slug: ${v.slug}`);
  lines.push(`name_ja: ${JSON.stringify(v.name_ja)}`);
  lines.push(`name_en: ${JSON.stringify(v.name_en)}`);
  lines.push(`aliases: ${yaml(v.aliases)}`);
  lines.push(`seasons: ${yaml(v.seasons)}`);
  lines.push(`peak_months: ${yaml(v.peak_months)}`);
  lines.push(`regions: ${yaml(v.regions)}`);
  if (v.notable_cultivars && v.notable_cultivars.length) {
    lines.push('notable_cultivars:');
    for (const c of v.notable_cultivars) {
      lines.push(`  - name: ${JSON.stringify(c.name)}`);
      lines.push(`    region: ${JSON.stringify(c.region)}`);
    }
  } else {
    lines.push('notable_cultivars: []');
  }
  lines.push(`nutrition: ${yaml(v.nutrition)}`);
  lines.push(`pairings: ${yaml(v.pairings)}`);
  lines.push(`storage: ${JSON.stringify(v.storage)}`);
  lines.push(`related_recipes: ${yaml(v.related)}`);
  if (v.image) lines.push(`image: ${JSON.stringify(v.image)}`);
  lines.push('---');
  lines.push('');
  lines.push(v.story);
  lines.push('');
  writeFileSync(join(DIR, `${v.slug}.md`), lines.join('\n'), 'utf8');
}

console.log(`wrote ${data.length} vegetable markdown files to ${DIR}`);
