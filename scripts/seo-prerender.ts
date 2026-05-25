import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LOCATIONS } from '../lib/locationsData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

console.log('--- TREVI SEO STATIC PRE-TEMPLATING PIPELINE ---');
console.log('Project Root:', projectRoot);
console.log('Distribution Dir:', distDir);

if (!fs.existsSync(indexHtmlPath)) {
  console.error('[FATAL ERROR] index.html not found in dist. Run vite build first.');
  process.exit(1);
}

const originalHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// Simple static routes to pre-compile shells for (ensuring fast load times and clean metadata)
const staticRoutes = [
  { path: 'privacy', title: 'Politique de Confidentialité | Trevi Car Rental', desc: 'Politique de confidentialité et de protection des données de Trevi Car Rental Maroc.' },
  { path: 'terms', title: 'Conditions Générales d\'Utilisation | Trevi Car Rental', desc: 'Conditions générales d\'utilisation et contrat de location de voiture chez Trevi Car Rental.' },
  { path: 'login', title: 'Connexion Espace Admin | Trevi Car Rental', desc: 'Connexion sécurisée à l\'espace d\'administration et tableau de bord de Trevi Car Rental.' }
];

// Helper to escape special characters for safe injection into HTML tags
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 1. Process dynamic city location pages
for (const loc of LOCATIONS) {
  console.log(`Processing SEO static tags for route: /location/${loc.slug} ...`);
  const canonicalUrl = `https://www.trevirentcarlocation.ma/location/${loc.slug}`;

  // Prepare Dynamic JSON-LD Schemas for search engines
  const carRentalSchema = {
    "@context": "https://schema.org",
    "@type": "CarRentalService",
    "name": `Trevi Car Rental ${loc.cityName}`,
    "alternateName": `Location de voiture ${loc.cityName} - Trevi Car Rental`,
    "description": loc.metaDescription,
    "url": canonicalUrl,
    "image": "https://www.trevirentcarlocation.ma/logo.png",
    "telephone": loc.phone,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": loc.branchAddress,
      "addressLocality": loc.cityName,
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": loc.latitude,
      "longitude": loc.longitude
    },
    "areaServed": {
      "@type": "City",
      "name": loc.cityName
    },
    "serviceType": "Location de voiture",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://www.instagram.com/trevi_rent_car/"
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://www.trevirentcarlocation.ma/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `Location de Voiture ${loc.cityName}`,
        "item": canonicalUrl
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": loc.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Perform tag replacements in copy of index.html shell
  let html = originalHtml;

  // Title tags
  html = html.replace(/<title>[^<]*<\/title>/g, `<title>${escapeHtml(loc.title)}</title>`);
  html = html.replace(/<meta name="title" content="[^"]*"\s*\/?>/g, `<meta name="title" content="${escapeHtml(loc.title)}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/g, `<meta property="og:title" content="${escapeHtml(loc.title)}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/g, `<meta name="twitter:title" content="${escapeHtml(loc.title)}" />`);

  // Description tags
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/g, `<meta name="description" content="${escapeHtml(loc.metaDescription)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/g, `<meta property="og:description" content="${escapeHtml(loc.metaDescription)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/g, `<meta name="twitter:description" content="${escapeHtml(loc.metaDescription)}" />`);

  // Canonical & absolute URL tags
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/g, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/g, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta name="twitter:url" content="[^"]*"\s*\/?>/g, `<meta name="twitter:url" content="${canonicalUrl}" />`);

  // Structured Data Schema injection
  html = html.replace(
    /<script type="application\/ld\+json" id="schema-car-rental">[\s\S]*?<\/script>/g,
    `<script type="application/ld+json" id="schema-car-rental">${JSON.stringify(carRentalSchema)}</script>`
  );
  html = html.replace(
    /<script type="application\/ld\+json" id="schema-breadcrumb">[\s\S]*?<\/script>/g,
    `<script type="application/ld+json" id="schema-breadcrumb">${JSON.stringify(breadcrumbSchema)}</script>`
  );
  html = html.replace(
    /<script type="application\/ld\+json" id="schema-faq">[\s\S]*?<\/script>/g,
    `<script type="application/ld+json" id="schema-faq">${JSON.stringify(faqSchema)}</script>`
  );

  // Write static file to physical output directory for this route
  const outputDir = path.join(distDir, 'location', loc.slug);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`   [SUCCESS] Saved static SEO file to ${outputPath}`);
}

// 2. Process other simple routes to improve performance and guarantee zero 404s
for (const route of staticRoutes) {
  console.log(`Processing SEO static tags for route: /${route.path} ...`);
  const canonicalUrl = `https://www.trevirentcarlocation.ma/${route.path}`;

  let html = originalHtml;

  // Title tags
  html = html.replace(/<title>[^<]*<\/title>/g, `<title>${escapeHtml(route.title)}</title>`);
  html = html.replace(/<meta name="title" content="[^"]*"\s*\/?>/g, `<meta name="title" content="${escapeHtml(route.title)}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/g, `<meta property="og:title" content="${escapeHtml(route.title)}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/g, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`);

  // Description tags
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/g, `<meta name="description" content="${escapeHtml(route.desc)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/g, `<meta property="og:description" content="${escapeHtml(route.desc)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/g, `<meta name="twitter:description" content="${escapeHtml(route.desc)}" />`);

  // Canonical & absolute URL tags
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/g, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/g, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta name="twitter:url" content="[^"]*"\s*\/?>/g, `<meta name="twitter:url" content="${canonicalUrl}" />`);

  const outputDir = path.join(distDir, route.path);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`   [SUCCESS] Saved static SEO file to ${outputPath}`);
}

console.log('--- TREVI SEO STATIC PRE-TEMPLATING COMPLETED SUCCESSFULLY ---');
