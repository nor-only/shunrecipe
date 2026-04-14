import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

export const prerender = false;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const SYSTEM = `あなたは SHUNRECIPE の編集部員兼、冷蔵庫の中身を見る目利きです。
入力画像を観察し、写っている食材・調味料・保存食を日本語で列挙してください。

## ルール
- 食用に関係ないもの（洗剤・タッパー・容器そのもの）は除外する
- 確信度の高いものだけを挙げる（推測で補完しない）
- 同じ食材が複数見える場合は一度だけ列挙し、おおよその数量をカッコ書き（例: 卵（約6個）、鶏もも肉（1パック））
- 旬・産地の推定はここでは行わない（後段の編集部が担当）
- 出力は**純粋なJSON**で返す。前置き・説明文は禁止。

## 出力フォーマット
{
  "items": [
    {"name": "食材名", "qty_hint": "数量ヒント（任意、分からなければ省略）"}
  ],
  "notes": "全体的に分かった傾向の短いメモ（任意、例: 和食寄りの常備菜が多い）"
}

## 見えない・曖昧な場合
- 画像に食材が一つも写っていない場合は items を空配列にする
- ぼやけて判別不能な場合は notes に「画像が不鮮明で判別困難」と書く`;

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'サーバー側で ANTHROPIC_API_KEY が未設定です。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response(JSON.stringify({ error: 'multipart/form-data を送信してください' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const file = form.get('image');
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: '画像ファイルがありません (field name: image)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return new Response(
      JSON.stringify({ error: `対応していない形式です: ${file.type}. JPEG/PNG/WebP/GIF のみ。` }),
      { status: 415, headers: { 'Content-Type': 'application/json' } },
    );
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return new Response(JSON.stringify({ error: `画像が大きすぎます (${file.size} > 5MB)` }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const data = buf.toString('base64');
  const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

  const client = new Anthropic({ apiKey: import.meta.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      system: SYSTEM,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data },
            },
            {
              type: 'text',
              text: 'この画像に写っている食材を列挙してください。',
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === 'text',
    );
    const raw = (textBlock?.text || '').trim();
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    let parsed: { items?: Array<{ name: string; qty_hint?: string }>; notes?: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return new Response(
        JSON.stringify({ error: 'AIの応答をJSONとして解釈できませんでした', raw }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const items = Array.isArray(parsed.items) ? parsed.items : [];
    const prettyList = items
      .map((i) => (i.qty_hint ? `${i.name}（${i.qty_hint}）` : i.name))
      .join('、');

    return new Response(
      JSON.stringify({
        items,
        notes: parsed.notes || '',
        ingredients_text: prettyList,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
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
        JSON.stringify({ error: 'レート制限中です。しばらくお待ちください。' }),
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
