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

function renderArticlePage() {
  const mount = document.getElementById("articlePage");
  if (!mount || !window.ARTICLE_DATA) return;

  const slug = getParam("slug") || window.ARTICLE_DATA[0]?.slug;
  const item = window.ARTICLE_DATA.find(a => a.slug === slug);

  if (!item) {
    mount.innerHTML = `<div class="empty-state card"><h3>Article not found</h3><p class="muted">Check the slug in the URL or add the article to articles.js.</p></div>`;
    return;
  }

  const sections = (item.sections || []).map(section => `
    <h2>${section.heading}</h2>
    ${(section.paragraphs || []).map(paragraph => `<p>${paragraph}</p>`).join("")}
    ${section.bullets ? `<ul>${section.bullets.map(bullet => `<li>${bullet}</li>`).join("")}</ul>` : ""}`).join("");

  mount.innerHTML = `
    <article class="article-shell card">
      <div class="tag">${item.category}</div>
      <h1 class="article-title">${item.title}</h1>
      <p class="muted">${item.summary}</p>
      <div class="list-card-meta" style="margin:18px 0 6px;">${(item.tags || []).map(tag => `<span class="pill">${tag}</span>`).join("")}</div>
      <div class="article-body">${sections}</div>
    </article>`;

  const meta = document.getElementById("articleMeta");
  if (meta) {
    meta.innerHTML = `<div class="sidebar-card card"><h3>Article Notes</h3><div class="meta-list"><div class="pill">Slug: ${item.slug}</div><div class="pill">Category: ${item.category}</div><div class="pill">Tags: ${(item.tags || []).join(", ")}</div></div><p style="margin-top:18px;">To add a new article, duplicate an object in <strong>articles.js</strong>.</p></div>`;
  }
}

function renderCasePage() {
  const mount = document.getElementById("casePage");
  if (!mount || !window.CASE_STUDY_DATA) return;

  const slug = getParam("slug") || window.CASE_STUDY_DATA[0]?.slug;
  const item = window.CASE_STUDY_DATA.find(caseStudy => caseStudy.slug === slug);

  if (!item) {
    mount.innerHTML = `<div class="empty-state card"><h3>Case study not found</h3><p class="muted">Check the slug in the URL or add the case to case-studies.js.</p></div>`;
    return;
  }

  mount.innerHTML = `
    <article class="article-shell card">
      <div class="tag">${item.category}</div>
      <h1 class="article-title">${item.title}</h1>
      <p class="muted">${item.summary}</p>
      <div class="list-card-meta" style="margin:18px 0 18px;">${(item.tags || []).map(tag => `<span class="pill">${tag}</span>`).join("")}</div>
      <div class="result-grid">
        <div class="result-box"><small>Problem</small><strong>${item.problem_title}</strong><span>${item.problem}</span></div>
        <div class="result-box"><small>What changed</small><strong>${item.change_title}</strong><span>${item.change}</span></div>
        <div class="result-box"><small>Outcome</small><strong>${item.outcome_title}</strong><span>${item.outcome}</span></div>
      </div>
      <div class="article-body" style="margin-top:28px;">${(item.details || []).map(detail => `<p>${detail}</p>`).join("")}</div>
    </article>`;

  const meta = document.getElementById("caseMeta");
  if (meta) {
    meta.innerHTML = `<div class="sidebar-card card"><h3>Case Notes</h3><div class="meta-list"><div class="pill">Slug: ${item.slug}</div><div class="pill">Category: ${item.category}</div><div class="pill">Tags: ${(item.tags || []).join(", ")}</div></div><p style="margin-top:18px;">To add a new case study, duplicate an object in <strong>case-studies.js</strong>.</p></div>`;
  }
}

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
          <button class="btn btn-secondary portfolio-quick-view" type="button" data-portfolio-quick-view="${item.slug}">Quick View</button>
          <a href="${item.liveUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Visit Site</a>
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
        <div class="tag">${item.category}</div>
        <h2 id="portfolioModalTitle">${item.title}</h2>
        <p>${item.summary}</p>
        <div class="list-card-meta">${services}</div>
        <div class="portfolio-actions">
          <a href="${item.liveUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Open Live Site</a>
          <button class="btn btn-secondary" type="button" data-modal-close="true">Close</button>
        </div>
      </div>
    </div>`;
}

function createPortfolioIframeMarkup(item) {
  return `
    <div class="portfolio-iframe-shell">
      <div class="portfolio-iframe-bar">
        <div>
          <div class="tag">${item.category}</div>
          <h2 id="portfolioModalTitle">${item.title}</h2>
        </div>
        <a href="${item.liveUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Open Live Site</a>
      </div>
      <div class="portfolio-iframe-frame">
        <iframe
          src="${item.iframeUrl}"
          title="${item.title} quick view"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
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
  let iframeFallbackTimer = null;

  function applyImageFallbacks(scope) {
    scope.querySelectorAll("img[data-fallback-label]").forEach(image => {
      image.addEventListener("error", () => {
        image.closest(".portfolio-shot, .portfolio-detail-shot")?.classList.add("is-placeholder");
        image.setAttribute("alt", `${image.dataset.fallbackLabel} preview placeholder`);
        image.removeAttribute("src");
      }, { once: true });
    });
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalContent.innerHTML = "";

    if (iframeFallbackTimer) {
      window.clearTimeout(iframeFallbackTimer);
      iframeFallbackTimer = null;
    }

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
    document.body.classList.add("modal-open");

    if (item.modalType === "iframe" && item.iframeUrl) {
      modalContent.innerHTML = createPortfolioIframeMarkup(item);

      const iframe = modalContent.querySelector("iframe");
      let loaded = false;

      iframeFallbackTimer = window.setTimeout(() => {
        if (!loaded) {
          renderDetails(item, "Quick View fell back to a details layout because the live page could not be embedded cleanly.");
          iframeFallbackTimer = null;
        }
      }, 1800);

      iframe.addEventListener("load", () => {
        loaded = true;
        if (iframeFallbackTimer) {
          window.clearTimeout(iframeFallbackTimer);
          iframeFallbackTimer = null;
        }
      }, { once: true });

      iframe.addEventListener("error", () => {
        renderDetails(item, "Quick View fell back to a details layout because the embedded preview was unavailable.");
        if (iframeFallbackTimer) {
          window.clearTimeout(iframeFallbackTimer);
          iframeFallbackTimer = null;
        }
      }, { once: true });
    } else {
      renderDetails(item);
    }

    closeButton.focus();
  }

  grid.addEventListener("click", event => {
    const trigger = event.target.closest("[data-portfolio-quick-view]");
    if (!trigger) return;

    const item = getPortfolioItem(trigger.dataset.portfolioQuickView);
    if (!item) return;

    openModal(item, trigger);
  });

  modal.addEventListener("click", event => {
    if (event.target.closest("[data-modal-close='true']")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  renderArticleList();
  renderCaseList();
  renderArticlePage();
  renderCasePage();
  renderPortfolioGrid();
  setupPortfolioModal();
});
