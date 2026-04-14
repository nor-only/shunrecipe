// 買い物リスト: ブラウザのlocalStorageに保存、端末内で完結。
// 将来、認証導入時にクラウド同期へ差し替え可能な抽象化。

export interface ShoppingItem {
  id: string;            // nanoid相当 (Date.now + random)
  name: string;          // 食材名
  amount?: string;       // 分量ヒント (例: "200g")
  recipe_id?: string;    // 紐付け元レシピID (任意)
  recipe_title?: string; // 表示用
  added_at: number;      // epoch ms
  checked?: boolean;     // 購入済みフラグ
}

const KEY = 'shunrecipe.shopping';

export function loadShopping(): ShoppingItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveShopping(items: ShoppingItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
  document.dispatchEvent(new CustomEvent('shopping:change', { detail: items }));
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function addToShopping(
  item: Omit<ShoppingItem, 'id' | 'added_at' | 'checked'>,
): ShoppingItem {
  const items = loadShopping();
  // 同じ name + recipe_id は二重登録しない
  const dup = items.find(
    (i) => i.name === item.name && i.recipe_id === item.recipe_id,
  );
  if (dup) return dup;
  const next: ShoppingItem = { ...item, id: uid(), added_at: Date.now(), checked: false };
  items.push(next);
  saveShopping(items);
  return next;
}

export function removeFromShopping(id: string): void {
  saveShopping(loadShopping().filter((i) => i.id !== id));
}

export function toggleChecked(id: string): void {
  saveShopping(
    loadShopping().map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
  );
}

export function clearChecked(): void {
  saveShopping(loadShopping().filter((i) => !i.checked));
}

export function clearAll(): void {
  saveShopping([]);
}

// ────────────────────────────────────────
// EC サイトへの検索URL生成
// ────────────────────────────────────────
export type ECProvider = 'amazon' | 'rakuten' | 'yahoo' | 'oisix';

export const EC_PROVIDERS: Array<{ id: ECProvider; name: string; label: string }> = [
  { id: 'amazon', name: 'Amazon', label: 'Amazon.co.jp' },
  { id: 'rakuten', name: '楽天市場', label: 'Rakuten' },
  { id: 'yahoo', name: 'Yahoo!ショッピング', label: 'Yahoo' },
  { id: 'oisix', name: 'オイシックス', label: 'Oisix' },
];

export function ecSearchUrl(provider: ECProvider, query: string): string {
  const q = encodeURIComponent(query.trim());
  switch (provider) {
    case 'amazon':
      return `https://www.amazon.co.jp/s?k=${q}&i=food-beverage`;
    case 'rakuten':
      return `https://search.rakuten.co.jp/search/mall/${q}/`;
    case 'yahoo':
      return `https://shopping.yahoo.co.jp/search?p=${q}`;
    case 'oisix':
      return `https://www.oisix.com/sc/search?q=${q}`;
  }
}
