/**
 * SHUNRECIPE — App Controller
 */
(function () {
  "use strict";

  // ─── State ───
  const state = {
    currentView: "welcome",
    region: localStorage.getItem("shun_region") || "kanto",
    seasonFilter: null,
    recipeFilter: "all",
  };

  // ─── Helpers ───
  function getCurrentSeason() {
    const m = new Date().getMonth() + 1;
    return APP_DATA.monthSeason[m];
  }

  function getSeasonInfo(s) {
    return APP_DATA.seasonNames[s];
  }

  function getVegetablesBySeason(season) {
    return APP_DATA.vegetables.filter((v) => v.season === season);
  }

  function getVegetablesForRegion(regionId, season) {
    return APP_DATA.vegetables.filter(
      (v) => v.season === season && v.regions.includes(regionId)
    );
  }

  function getRecipesBySeason(season) {
    return APP_DATA.recipes.filter((r) => r.season === season);
  }

  function getVegetableById(id) {
    return APP_DATA.vegetables.find((v) => v.id === id);
  }

  function getRecipeById(id) {
    return APP_DATA.recipes.find((r) => r.id === id);
  }

  function getRecipesForVegetable(vegId) {
    return APP_DATA.recipes.filter((r) => r.mainVegetable === vegId);
  }

  // ─── Card Renderers ───
  function renderVegCard(v, tagLabel) {
    const info = getSeasonInfo(v.season);
    const tag = tagLabel || info.jp;
    return `
      <div class="veg-card" data-season="${v.season}" data-veg-id="${v.id}">
        <div class="veg-card__top">
          <span class="veg-card__emoji">${v.emoji}</span>
        </div>
        <div class="veg-card__body">
          <span class="veg-card__name">${v.name}</span>
          <span class="veg-card__name-en">${v.nameEn}</span>
          <span class="veg-card__season-tag" data-season="${v.season}">${tag}</span>
        </div>
      </div>`;
  }

  // ─── Navigation ───
  function navigate(viewName, params) {
    // Hide all views
    document.querySelectorAll(".view").forEach((v) => {
      v.classList.remove("is-active");
      v.classList.add("view--hidden");
    });

    const el = document.getElementById("view-" + viewName);
    if (!el) return;

    el.classList.remove("view--hidden");
    el.classList.add("is-active");
    state.currentView = viewName;

    // Update nav active state
    document.querySelectorAll(".nav__link").forEach((l) => {
      l.classList.toggle("is-active", l.dataset.navigate === viewName);
    });

    // Show/hide nav and footer based on view
    const nav = document.getElementById("nav");
    const footer = document.getElementById("appFooter");
    if (viewName === "welcome") {
      nav.style.display = "none";
      footer.style.display = "none";
    } else {
      nav.style.display = "";
      footer.style.display = "";
    }

    // Render view content
    switch (viewName) {
      case "home":
        renderHome();
        break;
      case "seasonal":
        renderSeasonal(params?.season || getCurrentSeason());
        break;
      case "vegDetail":
        renderVegDetail(params?.id);
        break;
      case "recipes":
        renderRecipes(params?.filter || "all");
        break;
      case "recipeDetail":
        renderRecipeDetail(params?.id);
        break;
      case "region":
        renderRegion();
        break;
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  }

  // ─── Render: Home ───
  function renderHome() {
    const season = getCurrentSeason();
    const info = getSeasonInfo(season);
    const regionName =
      APP_DATA.regions.find((r) => r.id === state.region)?.name || "関東";

    // Banner
    const banner = document.getElementById("seasonBanner");
    banner.dataset.season = season;
    document.getElementById("bannerSeasonEn").textContent = info.en;
    document.getElementById("bannerSeasonTitle").textContent =
      `${info.jp}の旬 — ${info.months}`;
    document.getElementById("bannerRegion").textContent =
      `📍 ${regionName}エリアの旬情報`;

    // Vegetables
    let vegs = getVegetablesForRegion(state.region, season);
    if (vegs.length === 0) vegs = getVegetablesBySeason(season);
    const vegGrid = document.getElementById("homeVegetables");
    vegGrid.innerHTML = vegs.map((v) => renderVegCard(v)).join("");

    // Recipes
    const recipes = getRecipesBySeason(season);
    const recipeGrid = document.getElementById("homeRecipes");
    recipeGrid.innerHTML = recipes
      .slice(0, 4)
      .map((r) => renderRecipeCard(r))
      .join("");

    // Attach events
    attachCardEvents();
  }

  // ─── Render: Seasonal ───
  function renderSeasonal(season) {
    state.seasonFilter = season;

    // Update tabs
    document.querySelectorAll(".season-tab").forEach((t) => {
      t.classList.toggle("is-active", t.dataset.season === season);
    });

    const vegs = getVegetablesBySeason(season);

    const container = document.getElementById("seasonalContent");
    container.innerHTML = `
      <div class="veg-grid">
        ${vegs.map((v) => renderVegCard(v, v.months.map((m) => m + "月").join("・"))).join("")}
      </div>
    `;

    attachCardEvents();
  }

  // ─── Render: Vegetable Detail ───
  function renderVegDetail(id) {
    const v = getVegetableById(id);
    if (!v) return;

    const info = getSeasonInfo(v.season);
    const recipes = getRecipesForVegetable(v.id);

    const container = document.getElementById("vegDetailContent");
    container.innerHTML = `
      <div class="veg-detail">
        <div class="veg-detail__header">
          <span class="veg-detail__emoji">${v.emoji}</span>
          <h1 class="veg-detail__name">${v.name}</h1>
          <span class="veg-detail__name-en">${v.nameEn}</span>
          <span class="veg-card__season-tag" data-season="${v.season}" style="font-size:13px;padding:4px 14px;">
            ${info.jp} ${v.months.map((m) => m + "月").join("・")}
          </span>
        </div>

        <div class="veg-detail__section">
          <h3 class="veg-detail__section-title">
            <span class="material-symbols-outlined">nutrition</span>
            栄養情報
          </h3>
          <p>${v.nutrition}</p>
        </div>

        <div class="veg-detail__section">
          <h3 class="veg-detail__section-title">
            <span class="material-symbols-outlined">search</span>
            選び方のコツ
          </h3>
          <p>${v.tips}</p>
        </div>

        <div class="veg-detail__section">
          <h3 class="veg-detail__section-title">
            <span class="material-symbols-outlined">kitchen</span>
            保存方法
          </h3>
          <p>${v.storage}</p>
        </div>

        <div class="veg-detail__section">
          <h3 class="veg-detail__section-title">
            <span class="material-symbols-outlined">lightbulb</span>
            豆知識
          </h3>
          <p>${v.facts}</p>
        </div>

        ${
          recipes.length > 0
            ? `
          <h3 class="veg-detail__related-title">この野菜を使ったレシピ</h3>
          <div class="recipe-grid">
            ${recipes.map((r) => renderRecipeCard(r)).join("")}
          </div>
        `
            : ""
        }
      </div>
    `;

    attachCardEvents();
  }

  // ─── Render: Recipes ───
  function renderRecipes(filter) {
    state.recipeFilter = filter;

    // Update filter buttons
    document.querySelectorAll(".filter-btn").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.filter === filter);
    });

    let recipes = APP_DATA.recipes;
    if (filter !== "all") {
      if (filter === "easy") {
        recipes = recipes.filter((r) => r.difficulty === "かんたん");
      } else {
        recipes = recipes.filter((r) => r.season === filter);
      }
    }

    const grid = document.getElementById("recipesGrid");
    grid.innerHTML = recipes.map((r) => renderRecipeCard(r)).join("");

    if (recipes.length === 0) {
      grid.innerHTML =
        '<p style="color:var(--c-text-faint);padding:40px 0;">該当するレシピがありません。</p>';
    }

    attachCardEvents();
  }

  // ─── Render: Recipe Detail ───
  function renderRecipeDetail(id) {
    const r = getRecipeById(id);
    if (!r) return;

    const veg = getVegetableById(r.mainVegetable);
    const vegEmoji = veg ? veg.emoji : "🍽️";

    const container = document.getElementById("recipeDetailContent");
    container.innerHTML = `
      <div class="recipe-detail">
        <div class="recipe-detail__hero" data-season="${r.season}">
          <span class="recipe-detail__emoji">${vegEmoji}</span>
          <h1 class="recipe-detail__title">${r.title}</h1>
          <p class="recipe-detail__subtitle">${r.subtitle}</p>
          <div class="recipe-detail__meta">
            <span><span class="material-symbols-outlined">schedule</span>${r.time}分</span>
            <span><span class="material-symbols-outlined">group</span>${r.servings}人分</span>
            <span><span class="material-symbols-outlined">local_fire_department</span>${r.calories}kcal</span>
            <span><span class="material-symbols-outlined">signal_cellular_alt</span>${r.difficulty}</span>
          </div>
        </div>

        <div class="recipe-detail__section">
          <h2 class="recipe-detail__section-title">材料（${r.servings}人分）</h2>
          <div class="recipe-detail__ingredients">
            ${r.ingredients
              .map(
                (ing) => `
              <div class="ingredient-row">
                <span>${ing.name}</span>
                <span class="ingredient-row__amount">${ing.amount}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="recipe-detail__section">
          <h2 class="recipe-detail__section-title">作り方</h2>
          <div class="recipe-detail__steps">
            ${r.steps
              .map(
                (step, i) => `
              <div class="recipe-step">
                <span class="recipe-step__num">${i + 1}.</span>
                <p class="recipe-step__text">${step}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        ${
          r.tips
            ? `
          <div class="recipe-detail__tip">
            <span class="material-symbols-outlined">tips_and_updates</span>
            <p><strong>コツ・ポイント：</strong>${r.tips}</p>
          </div>
        `
            : ""
        }

        ${
          veg
            ? `
          <div style="margin-top:48px;">
            <h3 class="veg-detail__related-title">この野菜をもっと知る</h3>
            <div class="veg-grid" style="max-width:240px;">
              ${renderVegCard(veg)}
            </div>
          </div>
        `
            : ""
        }
      </div>
    `;

    attachCardEvents();
  }

  // ─── Render: Region ───
  function renderRegion() {
    const select = document.getElementById("regionSelect");
    select.innerHTML = APP_DATA.regions
      .map(
        (r) => `
      <button class="region-btn ${r.id === state.region ? "is-active" : ""}" data-region="${r.id}">
        ${r.name}
      </button>
    `
      )
      .join("");

    // Attach events
    select.querySelectorAll(".region-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.region = btn.dataset.region;
        localStorage.setItem("shun_region", state.region);
        renderRegion();
      });
    });

    // Show region info
    const season = getCurrentSeason();
    const sInfo = getSeasonInfo(season);
    const regionName =
      APP_DATA.regions.find((r) => r.id === state.region)?.name || "";
    const vegs = getVegetablesForRegion(state.region, season);

    const regionInfo = document.getElementById("regionInfo");
    regionInfo.innerHTML = `
      <h3 class="region-info__title">📍 ${regionName}エリア — ${sInfo.jp}の旬野菜</h3>
      <p class="region-info__desc">
        ${regionName}エリアで今旬を迎えている野菜をご紹介します。
        地域を変更すると、ホーム画面の旬情報も更新されます。
      </p>
      <div class="veg-grid">
        ${vegs.map((v) => renderVegCard(v)).join("")}
      </div>
    `;

    attachCardEvents();
  }

  // ─── Render helpers ───
  function renderRecipeCard(r) {
    const veg = getVegetableById(r.mainVegetable);
    const emoji = veg ? veg.emoji : "🍽️";
    const info = getSeasonInfo(r.season);
    return `
      <div class="recipe-card" data-recipe-id="${r.id}">
        <div class="recipe-card__image" data-season="${r.season}">
          <span class="recipe-card__image-emoji">${emoji}</span>
          <span class="recipe-card__season-badge">${info.jp}</span>
        </div>
        <div class="recipe-card__body">
          <h3 class="recipe-card__title">${r.title}</h3>
          <p class="recipe-card__subtitle">${r.subtitle}</p>
          <div class="recipe-card__meta">
            <span><span class="material-symbols-outlined">schedule</span>${r.time}分</span>
            <span><span class="material-symbols-outlined">local_fire_department</span>${r.calories}kcal</span>
            <span><span class="material-symbols-outlined">signal_cellular_alt</span>${r.difficulty}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ─── Attach click events to dynamic cards ───
  function attachCardEvents() {
    document.querySelectorAll(".veg-card[data-veg-id]").forEach((card) => {
      card.onclick = () =>
        navigate("vegDetail", { id: card.dataset.vegId });
    });
    document.querySelectorAll(".recipe-card[data-recipe-id]").forEach((card) => {
      card.onclick = () =>
        navigate("recipeDetail", { id: card.dataset.recipeId });
    });
  }

  // ─── Init ───
  function init() {
    // Start button
    document.getElementById("startBtn")?.addEventListener("click", () => {
      navigate("home");
    });

    // Navigation links
    document.querySelectorAll("[data-navigate]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const view = el.dataset.navigate;
        navigate(view);
        // Close mobile menu if open
        document.getElementById("mobileMenu")?.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });

    // Mobile menu
    document.getElementById("menuBtn")?.addEventListener("click", () => {
      document.getElementById("mobileMenu")?.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
    document.getElementById("menuClose")?.addEventListener("click", () => {
      document.getElementById("mobileMenu")?.classList.remove("is-open");
      document.body.style.overflow = "";
    });

    // Season tabs
    document.querySelectorAll(".season-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        renderSeasonal(tab.dataset.season);
      });
    });

    // Recipe filters
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        renderRecipes(btn.dataset.filter);
      });
    });

    // Nav scroll effect
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const nav = document.getElementById("nav");
            if (nav) {
              nav.classList.toggle("is-scrolled", window.scrollY > 20);
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    // Escape key closes mobile menu
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.getElementById("mobileMenu")?.classList.remove("is-open");
        document.body.style.overflow = "";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
