import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.resolve(__dirname, '../build');
const indexHtmlPath = path.join(buildDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('Error: build/index.html not found. Run build first.');
  process.exit(1);
}

// Import SEO data from source
const seoDataPath = path.resolve(__dirname, '../src/data/seoData.js');
let seoContent = fs.readFileSync(seoDataPath, 'utf-8');

// Simple extractor for seoDataByPath from seoData.js
// Or we can evaluate or directly import it since it's pure JS
const { seoDataByPath, defaultSEO, SITE_NAME, SITE_URL } = await import('../src/data/seoData.js');

const originalHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

console.log('Generating pre-rendered SEO HTML files for all public routes...');

let generatedCount = 0;

for (const [routePath, seo] of Object.entries(seoDataByPath)) {
  if (routePath === '/') {
    // Update root index.html with root SEO
    let rootHtml = originalHtml;
    rootHtml = rootHtml.replace(/<title>.*?<\/title>/i, `<title>${seo.title}</title>`);
    rootHtml = rootHtml.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${seo.description}" />`);
    rootHtml = rootHtml.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${seo.title}" />`);
    rootHtml = rootHtml.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${seo.description}" />`);
    rootHtml = rootHtml.replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:title" content="${seo.title}" />`);
    rootHtml = rootHtml.replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:description" content="${seo.description}" />`);
    fs.writeFileSync(indexHtmlPath, rootHtml, 'utf-8');
    generatedCount++;
    continue;
  }

  const cleanPath = routePath.startsWith('/') ? routePath.slice(1) : routePath;
  const targetDir = path.join(buildDir, cleanPath);
  const targetFile = path.join(targetDir, 'index.html');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const pageCanonical = `${SITE_URL}${routePath}`;
  let pageHtml = originalHtml;

  // Replace Title
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${seo.title}</title>`);

  // Replace Description
  pageHtml = pageHtml.replace(
    /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta name="description" content="${seo.description}" />`
  );

  // Replace Keywords
  if (seo.keywords) {
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']keywords["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="keywords" content="${seo.keywords}" />`
    );
  }

  // Replace or inject Canonical Link
  if (/<link\s+rel=["']canonical["'].*?\/?>/i.test(pageHtml)) {
    pageHtml = pageHtml.replace(
      /<link\s+rel=["']canonical["'].*?\/?>/i,
      `<link rel="canonical" href="${pageCanonical}" />`
    );
  } else {
    pageHtml = pageHtml.replace('</head>', `  <link rel="canonical" href="${pageCanonical}" />\n</head>`);
  }

  // Replace OG tags
  pageHtml = pageHtml.replace(
    /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:title" content="${seo.title}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:description" content="${seo.description}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:url" content="${pageCanonical}" />`
  );

  // Replace Twitter tags
  pageHtml = pageHtml.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta name="twitter:title" content="${seo.title}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta name="twitter:description" content="${seo.description}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta\s+name=["']twitter:url["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta name="twitter:url" content="${pageCanonical}" />`
  );

  fs.writeFileSync(targetFile, pageHtml, 'utf-8');
  generatedCount++;
}

console.log(`Successfully generated ${generatedCount} SEO-optimized route HTML files!`);
