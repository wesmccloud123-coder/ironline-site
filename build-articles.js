/**
 * IronLine Systems — Static Article Builder
 * -----------------------------------------
 * Reads articles.js and outputs one fully-rendered .html file per article
 * into /insights/ so AI crawlers and search engines can index the content.
 *
 * Usage:
 *   node build-articles.js
 *
 * Output:
 *   /insights/<slug>.html  — one file per article
 *   /sitemap.xml           — full site sitemap
 */

const fs   = require('fs');
const path = require('path');

// Shim `window` so articles.js (written for the browser) loads in Node
global.window = {};
require('./articles.js');
const articles = global.window.ARTICLE_DATA;

// ─── SITE CONFIG ──────────────────────────────────────────────────────────────
const SITE = {
  name:    'IronLine Systems',
  tagline: 'Operational software. Automation. Systems strategy.',
  baseUrl: 'https://ironline.systems',
};

// ─── OUTPUT DIR ───────────────────────────────────────────────────────────────
const OUT_DIR = path.join(__dirname, 'insights');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Renders the sections array into readable HTML */
function renderSections(sections = []) {
  return sections.map(section => {
    const heading = section.heading
      ? `<h2>${esc(section.heading)}</h2>`
      : '';

    const paragraphs = (section.paragraphs || [])
      .map(p => `<p>${esc(p)}</p>`)
      .join('\n');

    const bullets = (section.bullets || []).length
      ? `<ul>\n${section.bullets.map(b => `  <li>${esc(b)}</li>`).join('\n')}\n</ul>`
      : '';

    return `<section>\n${heading}\n${paragraphs}\n${bullets}\n</section>`;
  }).join('\n\n');
}

/** Renders the references array into a sources list */
function renderReferences(references = []) {
  if (!references.length) return '';
  const items = references.map(ref => {
    const label = esc(ref.label || ref.source);
    const year  = ref.year ? ` (${ref.year})` : '';
    return ref.url
      ? `  <li><a href="${esc(ref.url)}" target="_blank" rel="noopener">${label}${year}</a></li>`
      : `  <li>${label}${year}</li>`;
  }).join('\n');
  return `<aside class="article-references">
  <h3>References</h3>
  <ul>
${items}
  </ul>
</aside>`;
}

/** Renders tags as spans */
function renderTags(tags = []) {
  if (!tags.length) return '';
  return tags.map(t => `<span class="tag">${esc(t)}</span>`).join(' ');
}

// ─── HTML TEMPLATE ────────────────────────────────────────────────────────────
function buildHTML(article) {
  const { slug, title, category, summary, tags, sections, references } = article;
  const url = `${SITE.baseUrl}/insights/${slug}.html`;

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": summary,
    "author": {
      "@type": "Organization",
      "name": SITE.name,
      "url": SITE.baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE.name,
      "url": SITE.baseUrl
    },
    "url": url,
    "mainEntityOfPage": url,
    "keywords": (tags || []).join(', '),
    "articleSection": category || ''
  }, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${esc(title)} | ${SITE.name}</title>
  <meta name="description" content="${esc(summary)}">
  <link rel="canonical" href="${url}">

  <!-- Open Graph -->
  <meta property="og:type"        content="article">
  <meta property="og:title"       content="${esc(title)}">
  <meta property="og:description" content="${esc(summary)}">
  <meta property="og:url"         content="${url}">
  <meta property="og:site_name"   content="${esc(SITE.name)}">
  ${category ? `<meta property="article:section" content="${esc(category)}">` : ''}
  ${(tags || []).map(t => `<meta property="article:tag" content="${esc(t)}">`).join('\n  ')}

  <!-- JSON-LD structured data -->
  <script type="application/ld+json">
${schema}
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>

  <header class="nav">
    <div class="nav-inner">
      <a href="/index.html" class="brand">
        <div class="brand-mark">IL</div>
        <div>IRONLINE SYSTEMS</div>
      </a>
      <nav class="nav-links">
        <a href="/index.html">Home</a>
        <a href="/portfolio.html">Portfolio</a>
        <a href="/insights.html" class="active">Insights</a>
        <a href="/case-studies.html">Case Studies</a>
        <a href="/contact.html">Contact</a>
      </nav>
      <div>
        <a href="/contact.html" class="btn btn-primary desktop-cta">Book a Strategy Call</a>
      </div>
    </div>
  </header>

  <main>
    <section class="page-hero">
      <div class="container page-head">
        ${category ? `<div class="badge">${esc(category)} | IronLine Systems</div>` : ''}
        <h1>${esc(title)}</h1>
        <p class="hero-sub">${esc(summary)}</p>
        ${renderTags(tags)}
      </div>
    </section>

    <section class="section" style="padding-top:0;">
      <div class="container page-layout">
        <div class="article-body">
          ${renderSections(sections)}
          <div class="article-cta">
            <p>If this sounds like your business, the first step is a conversation.</p>
            <a href="/contact.html" class="btn btn-primary">Get a Free Bottleneck Review</a>
            <a href="/insights.html" class="btn btn-secondary">Read More Articles</a>
          </div>
        </div>
        <aside>
          <div class="meta-block">
            <p class="meta-label">Category</p>
            <p>${esc(category)}</p>
          </div>
          ${tags && tags.length ? `
          <div class="meta-block">
            <p class="meta-label">Topics</p>
            <div class="tag-row">${renderTags(tags)}</div>
          </div>` : ''}
          <div class="meta-block">
            <p class="meta-label">Published by</p>
            <p>IronLine Systems</p>
          </div>
          <div class="meta-block">
            <a href="/contact.html" class="btn btn-primary" style="width:100%;text-align:center;">Book a Strategy Call</a>
          </div>
        </aside>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <div>
        <strong>${SITE.name}</strong><br>
        <span class="muted">${SITE.tagline}</span>
      </div>
      <div>&copy; ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</div>
    </div>
  </footer>

</body>
</html>`;
}

// ─── SITEMAP ──────────────────────────────────────────────────────────────────
function buildSitemap(slugs) {
  const staticPages  = ['', '/insights.html', '/case-studies.html', '/portfolio.html', '/contact.html'];
  const articlePages = slugs.map(s => `/insights/${s}.html`);

  const urls = [...staticPages, ...articlePages].map(p => `
  <url>
    <loc>${SITE.baseUrl}${p}</loc>
    <changefreq>monthly</changefreq>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
let built = 0;
const slugs = [];

for (const article of articles) {
  if (!article.slug) {
    console.warn('⚠️  Skipping article with no slug:', article.title || '(untitled)');
    continue;
  }

  const html     = buildHTML(article);
  const filePath = path.join(OUT_DIR, `${article.slug}.html`);

  fs.writeFileSync(filePath, html, 'utf8');
  slugs.push(article.slug);
  built++;
  console.log(`✅  Built: /insights/${article.slug}.html`);
}

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), buildSitemap(slugs), 'utf8');
console.log(`\n🗺️  Sitemap written: sitemap.xml (${slugs.length} articles + 5 static pages)`);
console.log(`\n🎉  Done — ${built} article${built !== 1 ? 's' : ''} built into /insights/`);
console.log(`    Commit /insights/ and sitemap.xml, then deploy to Vercel.`);
