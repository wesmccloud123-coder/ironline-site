function setupMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => mobileMenu.classList.toggle("open"));
  }
}

function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─────────────────────────────────────────────────────────────
// SEO — updates <title>, meta description, canonical, OG, Twitter
// from a data object. Call after finding the matching item.
// ─────────────────────────────────────────────────────────────
function populateSEO({ title, description, slug, pageFile }) {
  const fullUrl = "https://ironline-site.vercel.app/" + pageFile + "?slug=" + slug;

  const titleEl = document.getElementById("page-title");
  if (titleEl) titleEl.textContent = title + " | IronLine Systems";

  const metaDesc = document.getElementById("page-description");
  if (metaDesc) metaDesc.setAttribute("content", description);

  const canonical = document.getElementById("page-canonical");
  if (canonical) canonical.setAttribute("href", fullUrl);

  const ogTitle = document.getElementById("og-title");
  if (ogTitle) ogTitle.setAttribute("content", title + " | IronLine Systems");

  const ogDesc = document.getElementById("og-description");
  if (ogDesc) ogDesc.setAttribute("content", description);

  const ogUrl = document.getElementById("og-url");
  if (ogUrl) ogUrl.setAttribute("content", fullUrl);

  const twTitle = document.getElementById("twitter-title");
  if (twTitle) twTitle.setAttribute("content", title + " | IronLine Systems");

  const twDesc = document.getElementById("twitter-description");
  if (twDesc) twDesc.setAttribute("content", description);

  const schemaEl = document.getElementById("page-schema");
  if (schemaEl) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "url": fullUrl,
      "author": {
        "@type": "Organization",
        "name": "IronLine Systems",
        "url": "https://ironline-site.vercel.app"
      },
      "publisher": {
        "@type": "Organization",
        "name": "IronLine Systems",
        "url": "https://ironline-site.vercel.app"
      }
    };
    schemaEl.textContent = JSON.stringify(schema, null, 2);
  }
}

// ─────────────────────────────────────────────────────────────
// Renders article index list on insights.html
// ─────────────────────────────────────────────────────────────
function renderArticleList() {
  const mount = document.getElementById("articleList");
  if (!mount || !window.ARTICLE_DATA) return;

  mount.innerHTML = window.ARTICLE_DATA.map(item => `
    <article class="list-card card">
      <div class="list-card-copy">
        <div class="tag">${item.category}</div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <div class="list-card-meta">${(item.tags || []).map(tag => `<span class="pill">${tag}</span>`).join("")}</div>
      </div>
      <div><a href="article.html?slug=${item.slug}" class="btn btn-primary">Read Article</a></div>
    </article>`).join("");
}

// ─────────────────────────────────────────────────────────────
// Renders case study index list on case-studies.html
// ─────────────────────────────────────────────────────────────
function renderCaseList() {
  const mount = document.getElementById("caseList");
  if (!mount || !window.CASE_STUDY_DATA) return;

  mount.innerHTML = window.CASE_STUDY_DATA.map(item => `
    <article class="list-card card">
      <div class="list-card-copy">
        <div class="tag">${item.category}</div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <div class="list-card-meta">${(item.tags || []).map(tag => `<span class="pill">${tag}</span>`).join("")}</div>
      </div>
      <div><a href="case-study.html?slug=${item.slug}" class="btn btn-primary">View Case</a></div>
    </article>`).join("");
}

// ─────────────────────────────────────────────────────────────
// Renders individual article page (article.html?slug=...)
// ─────────────────────────────────────────────────────────────
function renderArticlePage() {
  const mount = document.getElementById("articlePage");
  if (!mount || !window.ARTICLE_DATA) return;

  const slug = getParam("slug");

  // No slug — redirect to insights index
  if (!slug) {
    window.location.replace("insights.html");
    return;
  }

  const item = window.ARTICLE_DATA.find(a => a.slug === slug);

  // Slug not found — redirect to insights index
  if (!item) {
    window.location.replace("insights.html");
    return;
  }

  // SEO
  populateSEO({
    title: item.title,
    description: item.summary,
    slug: item.slug,
    pageFile: "article.html"
  });

  // Hero — populate the H1 and supporting elements in the page-hero section
  const heroTitle = document.getElementById("article-title");
  if (heroTitle) heroTitle.textContent = item.title;

  const heroBadge = document.getElementById("article-category");
  if (heroBadge) heroBadge.textContent = item.category + " | IronLine Systems";

  const heroSummary = document.getElementById("article-summary");
  if (heroSummary) heroSummary.textContent = item.summary;

  const heroTags = document.getElementById("article-tags");
  if (heroTags) {
    heroTags.innerHTML = (item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("");
  }

  // Reveal hero (visibility:hidden until content is ready)
  const hero = document.getElementById("article-hero");
  if (hero) hero.classList.add("ready");

  // Body sections — no H1 here, the hero carries it
  const sections = (item.sections || []).map(section => `
    <div class="article-section">
      <h2>${section.heading}</h2>
      ${(section.paragraphs || []).map(p => `<p>${p}</p>`).join("")}
      ${section.bullets ? `<ul>${section.bullets.map(b => `<li>${b}</li>`).join("")}</ul>` : ""}
    </div>`).join("");

  mount.innerHTML = `
    <div class="article-body">
      ${sections}
      <div class="article-cta">
        <p>If this sounds like your business, the first step is a conversation.</p>
        <a href="contact.html" class="btn btn-primary">Get a Free Bottleneck Review</a>
        <a href="insights.html" class="btn btn-secondary">Read More Articles</a>
      </div>
    </div>`;

  // Aside — visitor-facing content, no developer notes
  const meta = document.getElementById("articleMeta");
  if (meta) {
    meta.innerHTML = `
      <div class="sidebar-card card">
        <div class="meta-block">
          <p class="meta-label">Category</p>
          <p>${item.category}</p>
        </div>
        <div class="meta-block">
          <p class="meta-label">Topics</p>
          <div class="tag-row">${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
        </div>
        <div class="meta-block">
          <p class="meta-label">Published by</p>
          <p>IronLine Systems</p>
        </div>
        <div class="meta-block">
          <a href="contact.html" class="btn btn-primary" style="width:100%;text-align:center;">Book a Strategy Call</a>
        </div>
      </div>`;
  }
}

// ─────────────────────────────────────────────────────────────
// Renders individual case study page (case-study.html?slug=...)
// ─────────────────────────────────────────────────────────────
function renderCasePage() {
  const mount = document.getElementById("casePage");
  if (!mount || !window.CASE_STUDY_DATA) return;

  const slug = getParam("slug");

  // No slug — redirect to case studies index
  if (!slug) {
    window.location.replace("case-studies.html");
    return;
  }

  const item = window.CASE_STUDY_DATA.find(cs => cs.slug === slug);

  // Slug not found — redirect to case studies index
  if (!item) {
    window.location.replace("case-studies.html");
    return;
  }

  // SEO
  populateSEO({
    title: item.title,
    description: item.summary,
    slug: item.slug,
    pageFile: "case-study.html"
  });

  // Hero — populate the H1 and supporting elements in the page-hero section
  const heroTitle = document.getElementById("case-title");
  if (heroTitle) heroTitle.textContent = item.title;

  const heroBadge = document.getElementById("case-category");
  if (heroBadge) heroBadge.textContent = item.category + " | IronLine Systems";

  const heroSummary = document.getElementById("case-summary");
  if (heroSummary) heroSummary.textContent = item.summary;

  const heroTags = document.getElementById("case-tags");
  if (heroTags) {
    heroTags.innerHTML = (item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("");
  }

  // Reveal hero
  const hero = document.getElementById("case-hero");
  if (hero) hero.classList.add("ready");

  // Body — result grid + detail paragraphs + CTA, no H1
  mount.innerHTML = `
    <div class="case-study-body">
      <div class="result-grid">
        <div class="result-box">
          <small>Problem</small>
          <strong>${item.problem_title}</strong>
          <span>${item.problem}</span>
        </div>
        <div class="result-box">
          <small>What changed</small>
          <strong>${item.change_title}</strong>
          <span>${item.change}</span>
        </div>
        <div class="result-box">
          <small>The result</small>
          <strong>${item.outcome_title}</strong>
          <span>${item.outcome}</span>
        </div>
      </div>
      <div class="article-body" style="margin-top:28px;">
        ${(item.details || []).map(detail => `<p>${detail}</p>`).join("")}
      </div>
      <div class="case-cta">
        <p>Dealing with a similar problem?</p>
        <a href="contact.html" class="btn btn-primary">Get a Free Bottleneck Review</a>
        <a href="case-studies.html" class="btn btn-secondary">See All Case Studies</a>
      </div>
    </div>`;

  // Aside — visitor-facing content, no developer notes
  const meta = document.getElementById("caseMeta");
  if (meta) {
    meta.innerHTML = `
      <div class="sidebar-card card">
        <div class="meta-block">
          <p class="meta-label">Category</p>
          <p>${item.category}</p>
        </div>
        <div class="meta-block">
          <p class="meta-label">Topics</p>
          <div class="tag-row">${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
        </div>
        <div class="meta-block">
          <p class="meta-label">Published by</p>
          <p>IronLine Systems</p>
        </div>
        <div class="meta-block">
          <a href="contact.html" class="btn btn-primary" style="width:100%;text-align:center;">Book a Strategy Call</a>
        </div>
      </div>`;
  }
}

// ─────────────────────────────────────────────────────────────
// Portfolio — unchanged from original
// ─────────────────────────────────────────────────────────────
function createPortfolioCard(item) {
  const services = (item.services || []).map(service => `<span class="pill">${service}</span>`).join("");
  const featuredBadge = item.featured ? `<span class="portfolio-flag">Featured</span>` : "";

  return `
    <article class="portfolio-card card">
      <div class="portfolio-shot" data-placeholder="${item.title}">
        ${featuredBadge}
        <img src="${item.image}" alt="${item.title} website preview" loading="lazy" data-fallback-label="${escapeHtml(item.title)}" />
        <div class="portfolio-shot-overlay">
          <div class="portfolio-shot-meta">
            <span>${item.category}</span>
            <strong>${item.slug}</strong>
          </div>
        </div>
      </div>
      <div class="portfolio-card-body">
        <div class="tag">${item.category}</div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <div class="list-card-meta">${services}</div>
        <div class="portfolio-actions">
          <button class="btn btn-secondary portfolio-quick-view" type="button" data-portfolio-quick-view="${item.slug}">Quick Preview</button>
          <a href="${item.liveUrl}" class="btn btn-primary portfolio-visit-link" target="_blank" rel="noopener noreferrer" data-portfolio-visit-site="${item.slug}">Live Demo</a>
        </div>
      </div>
    </article>`;
}

function renderPortfolioGrid() {
  const mount = document.getElementById("portfolioGrid");
  if (!mount || !window.PORTFOLIO_DATA) return;

  const featured = window.PORTFOLIO_DATA.filter(item => item.featured);
  const standard = window.PORTFOLIO_DATA.filter(item => !item.featured);
  const orderedItems = [...featured, ...standard];

  mount.innerHTML = orderedItems.map(createPortfolioCard).join("");

  mount.querySelectorAll("img[data-fallback-label]").forEach(image => {
    image.addEventListener("error", () => {
      image.closest(".portfolio-shot")?.classList.add("is-placeholder");
      image.setAttribute("alt", `${image.dataset.fallbackLabel} preview placeholder`);
      image.removeAttribute("src");
    }, { once: true });
  });
}

function getPortfolioItem(slug) {
  return (window.PORTFOLIO_DATA || []).find(item => item.slug === slug);
}

function createPortfolioDetailsMarkup(item, notice) {
  const services = (item.services || []).map(service => `<span class="pill">${service}</span>`).join("");
  const noticeMarkup = notice ? `<div class="portfolio-modal-note">${notice}</div>` : "";

  return `
    <div class="portfolio-detail-shell">
      ${noticeMarkup}
      <div class="portfolio-detail-shot ${item.image ? "" : "is-placeholder"}" data-placeholder="${item.title}">
        <img src="${item.image}" alt="${item.title} website preview" loading="lazy" data-fallback-label="${escapeHtml(item.title)}" />
        <div class="portfolio-shot-overlay">
          <div class="portfolio-shot-meta">
            <span>${item.category}</span>
            <strong>${item.slug}</strong>
          </div>
        </div>
      </div>
      <div class="portfolio-detail-copy">
        <div class="portfolio-detail-scroll">
          <div class="tag">${item.category}</div>
          <h2 id="portfolioModalTitle">${item.title}</h2>
          <p>${item.summary}</p>
          <div class="list-card-meta">${services}</div>
        </div>
        <div class="portfolio-actions portfolio-modal-actions">
          <a href="${item.liveUrl}" class="btn btn-primary portfolio-visit-link" target="_blank" rel="noopener noreferrer">Live Demo</a>
          <button class="btn btn-secondary" type="button" data-modal-close="true">Close</button>
        </div>
      </div>
    </div>`;
}

function setupPortfolioModal() {
  const modal = document.getElementById("portfolioModal");
  const modalContent = document.getElementById("portfolioModalContent");
  const closeButton = document.getElementById("portfolioModalClose");
  const grid = document.getElementById("portfolioGrid");

  if (!modal || !modalContent || !closeButton || !grid || !window.PORTFOLIO_DATA) return;

  let lastTrigger = null;
  let lockedScrollY = 0;
  const overlay = modal.querySelector(".portfolio-modal-overlay");

  function applyImageFallbacks(scope) {
    scope.querySelectorAll("img[data-fallback-label]").forEach(image => {
      image.addEventListener("error", () => {
        image.closest(".portfolio-shot, .portfolio-detail-shot")?.classList.add("is-placeholder");
        image.setAttribute("alt", `${image.dataset.fallbackLabel} preview placeholder`);
        image.removeAttribute("src");
      }, { once: true });
    });
  }

  function lockBodyScroll() {
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add("modal-open");
    document.body.style.top = `-${lockedScrollY}px`;
  }

  function unlockBodyScroll() {
    document.body.classList.remove("modal-open");
    document.body.style.top = "";
    window.scrollTo(0, lockedScrollY);
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    unlockBodyScroll();
    modalContent.innerHTML = "";

    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  function renderDetails(item, notice = "") {
    modalContent.innerHTML = createPortfolioDetailsMarkup(item, notice);
    applyImageFallbacks(modalContent);
  }

  function openModal(item, trigger) {
    lastTrigger = trigger;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    lockBodyScroll();
    renderDetails(item);
    closeButton.focus();
  }

  grid.addEventListener("click", event => {
    const visitLink = event.target.closest("[data-portfolio-visit-site]");
    if (visitLink) {
      event.stopPropagation();
      return;
    }

    const trigger = event.target.closest("[data-portfolio-quick-view]");
    if (!trigger) return;

    event.preventDefault();
    event.stopPropagation();

    const item = getPortfolioItem(trigger.dataset.portfolioQuickView);
    if (!item) return;

    openModal(item, trigger);
  });

  closeButton.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target.closest("[data-modal-close='true']")) closeModal();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}

// ─────────────────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  renderArticleList();
  renderCaseList();
  renderArticlePage();
  renderCasePage();
  renderPortfolioGrid();
  setupPortfolioModal();
});