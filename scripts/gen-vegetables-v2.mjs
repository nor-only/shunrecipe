// Second batch of vegetable entries — 20 more to reach 60 target.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/content/vegetables';
mkdirSync(DIR, { recursive: true });

const data = [
  // ══════ 春 5件 ══════
  { slug: 'gyoja_ninniku', name_ja: '行者にんにく', name_en: 'Alpine Leek', aliases: ['アイヌねぎ','キトビロ'],
    seasons: ['spring'], peak_months: [4,5], regions: ['hokkaido','tohoku'],
    notable_cultivars: [{ name:'北海道行者にんにく', region:'北海道' },{ name:'羅臼行者にんにく', region:'北海道羅臼' }],
    nutrition: ['アリシン','β-カロテン','ビタミンK'], pairings: ['豚ばら','卵','醤油','酢味噌'],
    storage: '湿らせた紙で根元を包み立てて冷蔵。醤油漬けで長期保存。',
    related: [], image: '',
    story: '修験者が山ごもりの栄養源にしたと伝わる、北の春の滋養。ひと束で厨房が香る、稀少な山菜。' },
  { slug: 'tarano_me', name_ja: 'たらの芽', name_en: 'Angelica Tree Bud', aliases: ['タラノメ'],
    seasons: ['spring'], peak_months: [3,4,5], regions: ['tohoku','hokkaido','chubu'],
    notable_cultivars: [{ name:'山形たらの芽', region:'山形県' }],
    nutrition: ['β-カロテン','ビタミンE','食物繊維'], pairings: ['天ぷら粉','塩','酢味噌'],
    storage: '湿らせた紙に包み、立てて冷蔵。二日以内に。',
    related: [], image: '',
    story: '山菜の王と称される、春の渓谷の宝。衣を薄くつけて揚げれば、ほろ苦さが塩で整う。' },
  { slug: 'kogomi', name_ja: 'こごみ', name_en: 'Fiddlehead Fern', aliases: ['クサソテツ'],
    seasons: ['spring'], peak_months: [3,4,5], regions: ['tohoku','hokkaido','chubu'],
    notable_cultivars: [{ name:'秋田こごみ', region:'秋田県' }],
    nutrition: ['β-カロテン','食物繊維','ビタミンC'], pairings: ['胡麻','鰹節','マヨネーズ','酢味噌'],
    storage: '湿らせた新聞紙で包みポリ袋へ。早めに使う。',
    related: [], image: '',
    story: 'くるりと巻いた芽先が春の記号。くせが少なく、胡麻和えでも天ぷらでも失敗しない入門の山菜。' },
  { slug: 'wasabi', name_ja: 'わさび', name_en: 'Wasabi', aliases: ['山葵'],
    seasons: ['spring','winter'], peak_months: [2,3,4,5], regions: ['chubu'],
    notable_cultivars: [{ name:'安曇野わさび', region:'長野県安曇野' },{ name:'伊豆天城わさび', region:'静岡県伊豆' }],
    nutrition: ['アリルイソチオシアネート','ビタミンC'], pairings: ['刺身','蕎麦','塩','鰹節'],
    storage: '湿らせた紙に包み冷蔵。鮫皮で下ろしたてが本領。',
    related: [], image: '',
    story: '清流でしか育たない、日本固有の辛味。鋸歯のある茎は花わさびとして、醤油漬けで春の肴に。' },
  { slug: 'uruui', name_ja: 'うるい', name_en: 'Hosta Shoot', aliases: ['ギボウシ'],
    seasons: ['spring'], peak_months: [3,4,5], regions: ['tohoku','chubu'],
    notable_cultivars: [{ name:'山形うるい', region:'山形県' }],
    nutrition: ['ビタミンC','β-カロテン','カリウム'], pairings: ['酢味噌','鰹節','からし'],
    storage: '湿らせた紙で包み冷蔵。さっと茹でて保存も可。',
    related: [], image: '',
    story: 'ぬめりと歯切れが同居する、山形の春菜。アクが少なく、生でも食べられる数少ない山菜。' },

  // ══════ 夏 5件 ══════
  { slug: 'minden_nasu', name_ja: '民田なす', name_en: 'Minden Eggplant', aliases: [],
    seasons: ['summer'], peak_months: [7,8,9], regions: ['tohoku'],
    notable_cultivars: [{ name:'民田なす', region:'山形県鶴岡' }],
    nutrition: ['ナスニン','カリウム'], pairings: ['塩','赤しそ','鰹節'],
    storage: '一本ずつ紙に包み冷蔵庫野菜室へ。',
    related: [], image: '',
    story: '山形鶴岡で四百年伝わる、一口大の小茄子。硬めの皮がぬか漬けの歯切れを支える、在来の夏。' },
  { slug: 'togan', name_ja: '冬瓜', name_en: 'Winter Melon', aliases: ['とうがん'],
    seasons: ['summer'], peak_months: [6,7,8,9], regions: ['kinki','kyushu_okinawa','shikoku'],
    notable_cultivars: [{ name:'沖縄島冬瓜', region:'沖縄県' },{ name:'奈良冬瓜', region:'奈良県' }],
    nutrition: ['カリウム','ビタミンC','食物繊維'], pairings: ['鶏','海老','生姜','昆布出汁'],
    storage: '丸ごと冷暗所で数ヶ月。切ったら種を除きラップで冷蔵。',
    related: [], image: '',
    story: '夏に採れて冬まで持つ、名前と実態が逆転した瓜。透きとおるまで炊けば、夏の上品な椀種に。' },
  { slug: 'moroheiya', name_ja: 'モロヘイヤ', name_en: 'Molokhia', aliases: [],
    seasons: ['summer'], peak_months: [6,7,8,9], regions: ['kyushu_okinawa','kanto'],
    notable_cultivars: [{ name:'長崎モロヘイヤ', region:'長崎県' }],
    nutrition: ['β-カロテン','カルシウム','ビタミンK'], pairings: ['鰹節','醤油','豆腐','オクラ'],
    storage: '湿らせた紙で包み冷蔵。茹でて冷凍も可。',
    related: [], image: '',
    story: 'エジプトの王家が愛したと伝わる、栄養価の極地。刻むほどに粘りが立ち、夏バテの体を持ち上げる。' },
  { slug: 'shimanto_nasu', name_ja: '四万十なす', name_en: 'Shimanto Eggplant', aliases: [],
    seasons: ['summer'], peak_months: [6,7,8,9], regions: ['shikoku'],
    notable_cultivars: [{ name:'四万十なす', region:'高知県四万十' }],
    nutrition: ['ナスニン','カリウム','食物繊維'], pairings: ['ごま油','味噌','大葉','みょうが'],
    storage: '一本ずつ紙に包み、野菜室で。',
    related: [], image: '',
    story: '四万十川の陽と水が育てる、艶のある長なす。皮が薄く、焼きなすにすると甘みが立ちのぼる。' },
  { slug: 'myouga', name_ja: 'みょうが', name_en: 'Myoga Ginger', aliases: ['茗荷'],
    seasons: ['summer','autumn'], peak_months: [6,7,8,9,10], regions: ['kanto','shikoku','chubu'],
    notable_cultivars: [{ name:'高知みょうが', region:'高知県' }],
    nutrition: ['α-ピネン','カリウム'], pairings: ['素麺','冷奴','味噌汁','甘酢漬け'],
    storage: '湿らせた紙で包み冷蔵。甘酢漬けで長期保存。',
    related: [], image: '',
    story: '花蕾を食べる、日本固有の香味。刻んで冷や汁に散らせば、夏の体温は一段下がる。' },

  // ══════ 秋 5件 ══════
  { slug: 'maitake', name_ja: '舞茸', name_en: 'Maitake Mushroom', aliases: ['マイタケ'],
    seasons: ['autumn'], peak_months: [9,10,11], regions: ['tohoku','chubu'],
    notable_cultivars: [{ name:'岩手舞茸', region:'岩手県' },{ name:'新潟舞茸', region:'新潟県' }],
    nutrition: ['β-グルカン','ビタミンD','食物繊維'], pairings: ['バター','醤油','天ぷら粉','牛肉'],
    storage: '洗わず紙に包み冷蔵。房に裂いて冷凍で旨味倍増。',
    related: [], image: '',
    story: '見つけた者が舞ったと伝わる、秋の森の発見。房を手で裂き、強火で焼けば香りの塔が立つ。' },
  { slug: 'tanba_kuri', name_ja: '丹波栗', name_en: 'Tanba Chestnut', aliases: [],
    seasons: ['autumn'], peak_months: [9,10], regions: ['kinki'],
    notable_cultivars: [{ name:'丹波栗', region:'兵庫県丹波篠山' }],
    nutrition: ['糖質','カリウム','ビタミンC'], pairings: ['米','砂糖','醤油','バター'],
    storage: '鬼皮のまま冷蔵。冷水に浸けて沈むものを選ぶ。',
    related: [], image: '',
    story: '粒が大きく、甘みが濃い。丹波の秋は、この栗と黒枝豆で完結すると地元の誰もが口を揃える。' },
  { slug: 'yuzu', name_ja: 'ゆず', name_en: 'Yuzu Citrus', aliases: ['柚子'],
    seasons: ['autumn','winter'], peak_months: [10,11,12,1], regions: ['shikoku','kinki'],
    notable_cultivars: [{ name:'北川村ゆず', region:'高知県北川村' },{ name:'水尾ゆず', region:'京都府水尾' }],
    nutrition: ['ビタミンC','ヘスペリジン'], pairings: ['大根','白味噌','七味','蜂蜜'],
    storage: '冷蔵で一〜二週間。皮は刻んで冷凍保存。',
    related: ['r_shogoin_furofuki'], image: '',
    story: '秋から冬への橋渡し役。皮を散らすだけで、煮物も汁物も一段位が上がる、香りの名脇役。' },
  { slug: 'horikawa_gobo', name_ja: '堀川ごぼう', name_en: 'Horikawa Burdock', aliases: [],
    seasons: ['autumn','winter'], peak_months: [10,11,12,1], regions: ['kinki'],
    notable_cultivars: [{ name:'京の伝統野菜・堀川ごぼう', region:'京都府' }],
    nutrition: ['食物繊維','イヌリン','ポリフェノール'], pairings: ['鶏','海老','出汁','白味噌'],
    storage: '土付きのまま新聞紙で包み冷暗所。',
    related: [], image: '',
    story: '空洞の中に具を詰める、京の伝統ごぼう。詰め物料理はもちろん、単に炊いても香りが立ちのぼる。' },
  { slug: 'sudachi', name_ja: 'すだち', name_en: 'Sudachi Citrus', aliases: [],
    seasons: ['autumn'], peak_months: [8,9,10], regions: ['shikoku'],
    notable_cultivars: [{ name:'徳島すだち', region:'徳島県' }],
    nutrition: ['ビタミンC','クエン酸'], pairings: ['焼き魚','松茸','蕎麦','焼酎'],
    storage: '冷蔵で二週間。絞って氷キューブで冷凍も可。',
    related: [], image: '',
    story: '徳島の秋の柑橘。一滴落とすだけで、焼き魚の皿の上に四国の山河が広がる。' },

  // ══════ 冬 5件 ══════
  { slug: 'miura_daikon', name_ja: '三浦大根', name_en: 'Miura Daikon', aliases: [],
    seasons: ['winter'], peak_months: [11,12,1,2], regions: ['kanto'],
    notable_cultivars: [{ name:'三浦大根', region:'神奈川県三浦' }],
    nutrition: ['ジアスターゼ','ビタミンC','食物繊維'], pairings: ['鰤','牛すじ','帆立','柚子'],
    storage: '葉を落とし新聞紙で包み冷蔵。',
    related: [], image: '',
    story: '下ぶくれの形と、きめ細かな肉質。三浦半島の冬の潮風が、煮崩れない甘い大根を育てる。' },
  { slug: 'kyou_mizuna', name_ja: '京水菜', name_en: 'Kyoto Mizuna', aliases: ['水菜'],
    seasons: ['winter'], peak_months: [11,12,1,2], regions: ['kinki'],
    notable_cultivars: [{ name:'京の伝統野菜・壬生水菜', region:'京都府' }],
    nutrition: ['ビタミンC','β-カロテン','カルシウム'], pairings: ['豚しゃぶ','揚げ','豆腐','柚子'],
    storage: '湿らせた紙で根元を包み立てて冷蔵。',
    related: [], image: '',
    story: '千年続く京都の畑菜。生でも、くたくたに煮ても。はりはり鍋の主役はこの水菜でなくてはならない。' },
  { slug: 'kintoki_ninjin', name_ja: '金時にんじん', name_en: 'Kintoki Carrot', aliases: ['京にんじん'],
    seasons: ['winter'], peak_months: [11,12,1,2], regions: ['kinki'],
    notable_cultivars: [{ name:'京の伝統野菜・金時にんじん', region:'京都府' }],
    nutrition: ['β-カロテン','リコピン','食物繊維'], pairings: ['ごぼう','白味噌','おせち','煮染め'],
    storage: '新聞紙で包み冷蔵。',
    related: [], image: '',
    story: '深い朱が、京のおせちの皿に張りを与える。西洋にんじんより香りが強く、飾り切りが映える。' },
  { slug: 'nozawana', name_ja: '野沢菜', name_en: 'Nozawa Greens', aliases: [],
    seasons: ['winter','autumn'], peak_months: [10,11,12,1], regions: ['chubu'],
    notable_cultivars: [{ name:'信州野沢菜', region:'長野県野沢温泉' }],
    nutrition: ['β-カロテン','ビタミンC','食物繊維'], pairings: ['ご飯','ちりめんじゃこ','胡麻油','おにぎり'],
    storage: '浅漬けは冷蔵一週間、本漬けは低温発酵で半年。',
    related: [], image: '',
    story: '野沢温泉の雪と共に漬けられる、信州の冬の保存食。湯が沸けば、茶碗の横に一箸添える。' },
  { slug: 'hiroshimana', name_ja: '広島菜', name_en: 'Hiroshima Greens', aliases: [],
    seasons: ['winter'], peak_months: [11,12,1,2], regions: ['chugoku'],
    notable_cultivars: [{ name:'広島菜', region:'広島県安佐' }],
    nutrition: ['ビタミンC','β-カロテン','食物繊維'], pairings: ['ご飯','胡麻油','かつお節','おにぎり'],
    storage: '浅漬けで冷蔵一週間。',
    related: [], image: '',
    story: '野沢菜、高菜と並ぶ日本三大漬菜の一。広島の冬の朝食に、炊きたての白飯と共に。' },
];

const yaml = (v) => {
  if (v == null) return 'null';
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    return '[' + v.map(x => JSON.stringify(x)).join(', ') + ']';
  }
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

console.log(`wrote ${data.length} vegetables (v2 batch) to ${DIR}`);
