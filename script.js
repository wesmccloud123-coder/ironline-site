
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
    ${(section.paragraphs || []).map(p => `<p>${p}</p>`).join("")}
    ${section.bullets ? `<ul>${section.bullets.map(b => `<li>${b}</li>`).join("")}</ul>` : ""}`).join("");
  mount.innerHTML = `
    <article class="article-shell card">
      <div class="tag">${item.category}</div>
      <h1 class="article-title">${item.title}</h1>
      <p class="muted">${item.summary}</p>
      <div class="list-card-meta" style="margin:18px 0 6px;">${(item.tags || []).map(tag => `<span class="pill">${tag}</span>`).join("")}</div>
      <div class="article-body">${sections}</div>
    </article>`;
  const meta = document.getElementById("articleMeta");
  if (meta) meta.innerHTML = `<div class="sidebar-card card"><h3>Article Notes</h3><div class="meta-list"><div class="pill">Slug: ${item.slug}</div><div class="pill">Category: ${item.category}</div><div class="pill">Tags: ${(item.tags || []).join(", ")}</div></div><p style="margin-top:18px;">To add a new article, duplicate an object in <strong>articles.js</strong>.</p></div>`;
}
function renderCasePage() {
  const mount = document.getElementById("casePage");
  if (!mount || !window.CASE_STUDY_DATA) return;
  const slug = getParam("slug") || window.CASE_STUDY_DATA[0]?.slug;
  const item = window.CASE_STUDY_DATA.find(c => c.slug === slug);
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
      <div class="article-body" style="margin-top:28px;">${(item.details || []).map(d => `<p>${d}</p>`).join("")}</div>
    </article>`;
  const meta = document.getElementById("caseMeta");
  if (meta) meta.innerHTML = `<div class="sidebar-card card"><h3>Case Notes</h3><div class="meta-list"><div class="pill">Slug: ${item.slug}</div><div class="pill">Category: ${item.category}</div><div class="pill">Tags: ${(item.tags || []).join(", ")}</div></div><p style="margin-top:18px;">To add a new case study, duplicate an object in <strong>case-studies.js</strong>.</p></div>`;
}
document.addEventListener("DOMContentLoaded", () => { setupMenu(); renderArticleList(); renderCaseList(); renderArticlePage(); renderCasePage(); });
