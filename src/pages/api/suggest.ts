import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { getCollection } from 'astro:content';
import { regions } from '@data/regions';

export const prerender = false;

function corpusForSystem(
  recipes: Awaited<ReturnType<typeof getCollection<'recipes'>>>,
  vegetables: Awaited<ReturnType<typeof getCollection<'vegetables'>>>,
): string {
  // Stable (sorted by slug/id) so the cached prefix byte-matches across requests.
  const vSorted = [...vegetables].sort((a, b) => a.data.slug.localeCompare(b.data.slug));
  const rSorted = [...recipes].sort((a, b) => a.data.id.localeCompare(b.data.id));

  const vegLines = vSorted.map((v) => {
    const d = v.data;
    const cult = d.notable_cultivars.map((c) => `${c.name}(${c.region})`).join('/');
    return `- ${d.slug} | ${d.name_ja} / ${d.name_en} | season=${d.seasons.join(',')} | regions=${d.regions.join(',')} | peak_months=${d.peak_months.join('/')} | pairings=${d.pairings.join(',')} | cultivars=${cult}`;
  });

  const recLines = rSorted.map((r) => {
    const d = r.data;
    return `- ${d.id} | ${d.title} | season=${d.season} | region=${d.region ?? '-'} | genre=${d.genre} | veg=${d.vegetable.join(',')} | time=${d.time_min}min | tags=${d.tags.join(',')}`;
  });

  return [
    '# SHUNRECIPE — 内部データベース（システム側で固定・キャッシュ対象）',
    '',
    '## 野菜（slug | 和名 / 英名 | 旬・産地・在来種・相性食材）',
    ...vegLines,
    '',
    '## 既存レシピ（id | タイトル | 季節・地域・ジャンル・主菜材料・時間・タグ）',
    ...recLines,
    '',
    '## 地域マッピング',
    ...regions.map((r) => `- ${r.id}: ${r.name} — ${r.prefectures.join('・')}`),
  ].join('\n');
}

const SYSTEM_INSTRUCTIONS = `あなたは SHUNRECIPE の編集部員です。読者からの「冷蔵庫にある食材」と「住んでいる地域」の情報を受け取り、旬の野菜と組み合わせたレシピを3件提案します。

## トーン
- *Kinfolk* × *dancyu* × *minimalissimo*。静謐・余白・活版の誌面のように語る。
- 絵文字・顔文字・量産ブログ定型句（「3つのポイント」「美味しさの秘密」など）は使わない。
- 物語は80〜120字の短文で、素材の風土・時季・仕立ての核を一息で伝える。

## 判断
- 読者の地域と現在の季節（日本標準時）を踏まえ、最も旬なものから順に提案する。
- 既存レシピデータベースにマッチするものがあれば優先してIDで参照する。
- 冷蔵庫に無い食材でも、旬のものなら「追加で買うべきもの」として2点までなら足してよい。

## 出力フォーマット
**必ず純粋なJSONで返す**こと。前置きや言い訳は不要。
{
  "season": "spring" | "summer" | "autumn" | "winter",
  "region": "hokkaido" | "tohoku" | "kanto" | "chubu" | "kinki" | "chugoku" | "shikoku" | "kyushu_okinawa",
  "suggestions": [
    {
      "title": "料理名（20字以内）",
      "subtitle": "サブタイトル（30字以内、誌面の添え書き）",
      "existing_recipe_id": "r_xxx または null",
      "featured_vegetables": ["vegスラッグ", ...],
      "missing_ingredients": ["冷蔵庫に無いが追加推奨", ...],
      "story": "80〜120字の誌面本文。素材の風土と仕立ての核。",
      "time_min": 整数,
      "difficulty": 1 | 2 | 3,
      "genre": "和" | "洋" | "中" | "エスニック" | "創作",
      "steps": ["手順1を一文で", "手順2", ...]
    }
  ]
}`;

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'サーバー側で ANTHROPIC_API_KEY が未設定です。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  let body: { ingredients?: string; region?: string; season?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ingredients = (body.ingredients || '').trim();
  const region = (body.region || '').trim();
  const season = (body.season || '').trim();

  if (!ingredients) {
    return new Response(JSON.stringify({ error: '冷蔵庫の食材を入力してください。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const [recipes, vegetables] = await Promise.all([
    getCollection('recipes'),
    getCollection('vegetables'),
  ]);

  const corpus = corpusForSystem(recipes, vegetables);

  const client = new Anthropic({ apiKey: import.meta.env.ANTHROPIC_API_KEY });

  // 今日の日付・地域・季節・在庫は volatile (末尾へ)
  const today = new Date().toISOString().slice(0, 10);
  const userTurn = [
    `今日の日付: ${today}`,
    region ? `読者の地域: ${region}` : '読者の地域: 未登録',
    season ? `季節の指定: ${season}` : '季節の指定: 未指定（本日のJSTから推定）',
    '',
    '## 冷蔵庫にある食材',
    ingredients,
    '',
    '上記を踏まえ、旬との組み合わせで3件提案してください。純JSONのみで返答。',
  ].join('\n');

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      system: [
        // 大きく安定な部分 (> 4Kトークン) は先頭に置き、cache_control を刻む
        { type: 'text', text: SYSTEM_INSTRUCTIONS },
        {
          type: 'text',
          text: corpus,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userTurn }],
    });

    // 応答から最初のテキストブロックを抽出しJSONとして検証
    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === 'text',
    );
    const raw = textBlock?.text?.trim() ?? '';
    // ```json ... ``` フェンスが付いた場合に剥がす
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return new Response(
        JSON.stringify({
          error: 'AIの応答をJSONとして解釈できませんでした',
          raw,
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        result: parsed,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
          cache_read_input_tokens: response.usage.cache_read_input_tokens,
          cache_creation_input_tokens: response.usage.cache_creation_input_tokens,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return new Response(JSON.stringify({ error: 'APIキーが無効です。' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return new Response(
        JSON.stringify({ error: 'レート制限中です。しばらく待ってから再試行してください。' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } },
      );
    }
    if (err instanceof Anthropic.APIError) {
      return new Response(
        JSON.stringify({ error: `API error (${err.status}): ${err.message}` }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
