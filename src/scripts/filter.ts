import Fuse from 'fuse.js';

interface RecipeEntry {
  id: string;
  title: string;
  subtitle?: string;
  season: string;
  region?: string;
  region_name?: string;
  prefectures?: string[];
  prefecture?: string;
  vegetable: string[];
  vegetable_names?: string[];
  time_min: number;
  genre: string;
  tags: string[];
  story?: string;
  el: HTMLElement;
}

interface VegEntry {
  id: string;
  name_ja: string;
  name_en: string;
  aliases: string[];
  seasons: string[];
  regions: string[];
  region_names?: string[];
  prefectures?: string[];
  cultivars: string[];
  cultivar_regions?: string[];
  el: HTMLElement;
}

type Entry = RecipeEntry | VegEntry;

function debounce<T extends (...a: any[]) => void>(fn: T, ms: number) {
  let t: number | undefined;
  return (...a: Parameters<T>) => {
    if (t !== undefined) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...a), ms);
  };
}

// カタカナ → ひらがなに正規化（検索の部分一致を日本語に優しく）
function normalizeQuery(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[\u30A1-\u30F6]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
}
function normalizeEntryText(e: any): string {
  const parts: string[] = [];
  const push = (v: unknown) => {
    if (!v) return;
    if (Array.isArray(v)) v.forEach(push);
    else if (typeof v === 'string') parts.push(v);
  };
  push(e.title); push(e.subtitle); push(e.name_ja); push(e.name_en);
  push(e.aliases); push(e.cultivars); push(e.cultivar_regions);
  push(e.tags); push(e.story); push(e.genre);
  push(e.region); push(e.region_name); push(e.region_names);
  push(e.prefecture); push(e.prefectures);
  push(e.vegetable); push(e.vegetable_names);
  return normalizeQuery(parts.join(' '));
}

function setupFilter(bar: HTMLElement) {
  const mode = (bar.dataset.mode as 'recipes' | 'vegetables') || 'recipes';
  const resultGrid = document.querySelector<HTMLElement>('[data-filter-grid]');
  const emptyEl = document.querySelector<HTMLElement>('[data-filter-empty]');
  const countEl = bar.querySelector<HTMLElement>('[data-filter-count]');
  const qInput = bar.querySelector<HTMLInputElement>('[data-filter-q]');
  if (!resultGrid || !qInput) return;

  const cards = Array.from(resultGrid.children) as HTMLElement[];
  const entries: (Entry & { _search: string })[] = cards.map((el) => {
    const raw = el.dataset.filterData || '{}';
    try {
      const d = JSON.parse(raw);
      const merged = { ...d, el } as Entry;
      return { ...merged, _search: normalizeEntryText(merged) } as Entry & { _search: string };
    } catch {
      return { el, _search: '' } as Entry & { _search: string };
    }
  });

  // Fuse はあいまい検索のフォールバックとして使用（アルファベット・綴り違いに有効）
  const fuse = new Fuse(entries, {
    keys: mode === 'recipes'
      ? ['title', 'subtitle', 'tags', 'vegetable', 'vegetable_names', 'region', 'region_name', 'prefecture', 'prefectures', 'genre', 'story']
      : ['name_ja', 'name_en', 'aliases', 'cultivars', 'cultivar_regions', 'regions', 'region_names', 'prefectures'],
    threshold: 0.45,
    ignoreLocation: true,
    minMatchCharLength: 1,
    includeScore: true,
    useExtendedSearch: false,
  });

  const state = {
    q: '',
    season: 'all',
    region: 'all',
    genres: new Set<string>(),
    time: 'all',
  };

  // --- URL <-> state ---
  function readFromUrl() {
    const sp = new URLSearchParams(window.location.search);
    state.q = sp.get('q') || '';
    state.season = sp.get('season') || 'all';
    state.region = sp.get('region') || 'all';
    state.time = sp.get('time') || 'all';
    const g = sp.get('genre');
    state.genres = new Set(g ? g.split(',').filter(Boolean) : []);
  }
  function writeToUrl() {
    const sp = new URLSearchParams();
    if (state.q) sp.set('q', state.q);
    if (state.season !== 'all') sp.set('season', state.season);
    if (state.region !== 'all') sp.set('region', state.region);
    if (state.time !== 'all') sp.set('time', state.time);
    if (state.genres.size) sp.set('genre', Array.from(state.genres).join(','));
    const qs = sp.toString();
    const url = window.location.pathname + (qs ? `?${qs}` : '');
    window.history.replaceState(null, '', url);
  }

  // --- Apply ---
  function matchesStructured(e: any) {
    if (state.season !== 'all') {
      if (mode === 'recipes') { if (e.season !== state.season) return false; }
      else { if (!e.seasons?.includes(state.season)) return false; }
    }
    if (state.region !== 'all') {
      if (mode === 'recipes') { if (e.region !== state.region) return false; }
      else { if (!e.regions?.includes(state.region)) return false; }
    }
    if (mode === 'recipes') {
      if (state.genres.size && !state.genres.has(e.genre)) return false;
      if (state.time !== 'all') {
        const t = e.time_min as number;
        if (state.time === '15' && t > 15) return false;
        if (state.time === '30' && t > 30) return false;
        if (state.time === '60' && t > 60) return false;
        if (state.time === '60+' && t <= 60) return false;
      }
    }
    return true;
  }

  function apply() {
    let pool = entries as any[];
    const rawQ = state.q.trim();
    if (rawQ) {
      // 1) 部分一致（日本語に優しい）：クエリをスペースで分割し、全トークンを含むエントリを抽出
      const tokens = normalizeQuery(rawQ).split(/\s+/).filter(Boolean);
      const substringMatches = entries.filter((e) =>
        tokens.every((t) => e._search.includes(t))
      );
      // 2) 0 件ならあいまい検索にフォールバック
      if (substringMatches.length > 0) {
        pool = substringMatches;
      } else {
        const res = fuse.search(rawQ);
        pool = res.map((r) => r.item);
      }
    }
    let visible = 0;
    const poolSet = new Set(pool.map((e: any) => e.id || e.el));
    entries.forEach((e: any) => {
      const passQ = rawQ ? poolSet.has(e.id || e.el) : true;
      const passS = matchesStructured(e);
      const show = passQ && passS;
      e.el.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (countEl) countEl.textContent = `${visible} 件 / 全 ${entries.length} 件`;
    if (emptyEl) emptyEl.style.display = visible === 0 ? '' : 'none';

    // Suggestions on zero results: relax region, then season
    if (visible === 0) {
      const relaxed = entries.filter((e: any) => {
        if (mode === 'recipes') {
          return state.season === 'all' || e.season === state.season;
        }
        return state.season === 'all' || e.seasons?.includes(state.season);
      }).slice(0, 3);
      const sugList = document.querySelector<HTMLElement>('[data-filter-suggest]');
      if (sugList) {
        sugList.innerHTML = relaxed.map((e: any) =>
          `<li><a class="ed-link" href="/${mode}/${e.id}/">${e.title || e.name_ja}<span class="arrow">——→</span></a></li>`
        ).join('');
      }
    }
  }

  // --- Wire inputs ---
  qInput.value = state.q;
  qInput.addEventListener('input', debounce(() => {
    state.q = qInput.value;
    writeToUrl();
    apply();
  }, 150));

  bar.querySelectorAll<HTMLElement>('[data-filter-group]').forEach((group) => {
    const key = group.dataset.filterGroup!;
    const multi = group.dataset.multi !== undefined;
    group.querySelectorAll<HTMLButtonElement>('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const v = btn.dataset.value!;
        if (key === 'genre') {
          if (multi) {
            if (state.genres.has(v)) state.genres.delete(v);
            else state.genres.add(v);
          }
        } else if (key === 'season') {
          state.season = v;
        } else if (key === 'region') {
          state.region = v;
        } else if (key === 'time') {
          state.time = v;
        }
        // Reflect UI
        if (key === 'genre' && multi) {
          btn.classList.toggle('is-active', state.genres.has(v));
          btn.setAttribute('aria-pressed', String(state.genres.has(v)));
        } else {
          group.querySelectorAll('button').forEach((b) => {
            const on = b.dataset.value === v;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-pressed', String(on));
          });
        }
        writeToUrl();
        apply();
      });
    });
  });

  // --- Init from URL ---
  readFromUrl();
  qInput.value = state.q;
  bar.querySelectorAll<HTMLElement>('[data-filter-group]').forEach((group) => {
    const key = group.dataset.filterGroup!;
    group.querySelectorAll<HTMLButtonElement>('button').forEach((btn) => {
      const v = btn.dataset.value!;
      let on = false;
      if (key === 'genre') on = state.genres.has(v);
      else if (key === 'season') on = state.season === v;
      else if (key === 'region') on = state.region === v;
      else if (key === 'time') on = state.time === v;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  });
  apply();
}

function bootFilter() {
  try {
    const bars = document.querySelectorAll<HTMLElement>('[data-filter-bar]');
    console.debug('[filter] init:', bars.length, 'filter bar(s)');
    bars.forEach(setupFilter);
  } catch (err) {
    console.error('[filter] boot error:', err);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootFilter);
} else {
  bootFilter();
}
