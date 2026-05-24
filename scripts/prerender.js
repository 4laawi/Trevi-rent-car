import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const locationsDataPath = path.join(projectRoot, 'lib', 'locationsData.ts');

console.log('--- TREVI CAR RENTAL PRERENDER PIPELINE ---');
console.log('Project Root:', projectRoot);
console.log('Distribution Dir:', distDir);

// 1. Dynamic Slug Extraction from locationsData.ts
let slugs = [];
try {
  const locationsContent = fs.readFileSync(locationsDataPath, 'utf-8');
  const slugRegex = /slug:\s*'([^']+)'/g;
  let match;
  while ((match = slugRegex.exec(locationsContent)) !== null) {
    slugs.push(match[1]);
  }
  // Ensure we get unique slugs
  slugs = [...new Set(slugs)];
  console.log(`Successfully extracted ${slugs.length} location slugs dynamically.`);
} catch (e) {
  console.error('Failed to read/parse locationsData.ts. Falling back to hardcoded list of locations:', e.message);
  slugs = [
    'casablanca',
    'casablanca-aeroport',
    'marrakech',
    'tanger',
    'rabat',
    'agadir',
    'fes',
    'casablanca-sans-caution',
    'casablanca-ar',
    'rabat-sale-aeroport',
    'sale'
  ];
}

const paths = [
  '/',
  '/privacy',
  '/terms',
  '/login',
  ...slugs.map(slug => `/location/${slug}`)
];

console.log(`Total routes to prerender: ${paths.length}`);
console.log(paths);

// 2. Start Lightweight HTTP Server with client-side fallback
const PORT = 5050;
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(distDir, urlPath);

  const hasExt = path.extname(urlPath) !== '';
  if (!fs.existsSync(filePath) || !hasExt) {
    if (!hasExt) {
      filePath = path.join(distDir, 'index.html');
    }
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.ico') contentType = 'image/x-icon';
    else if (ext === '.json') contentType = 'application/json';
    else if (ext === '.xml') contentType = 'application/xml';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.mp4') contentType = 'video/mp4';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, async () => {
  console.log(`Local web server started on http://localhost:${PORT}`);
  
  let browser;
  try {
    // 3. Launch Headless Chromium via Playwright
    console.log('Launching headless Chromium browser...');
    const launchOptions = { headless: true };

    // Resilience optimization: on local macOS, check if Google Chrome is installed 
    // to bypass the large Playwright Chromium download step if needed.
    const macChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    if (process.platform === 'darwin' && fs.existsSync(macChromePath)) {
      console.log(`[INFO] Found system Google Chrome at: ${macChromePath}. Using it to run headless.`);
      launchOptions.executablePath = macChromePath;
    }

    browser = await chromium.launch(launchOptions);
    const page = await browser.newPage();

    // 4. Crawl each path
    for (const p of paths) {
      const url = `http://localhost:${PORT}${p}`;
      console.log(`\n-> Prerendering route: ${p} ...`);

      // Increase navigation timeout to 30s to allow slower APIs/networks to resolve
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Wait for React initial loader to detach (hydration check)
      try {
        await page.waitForSelector('#initial-loader', { state: 'detached', timeout: 10000 });
        console.log('   [OK] Initial loader detached.');
      } catch (e) {
        console.log('   [WARN] Timeout waiting for #initial-loader to detach.');
      }

      // Special handling for dynamic Car pages: Wait for Supabase Fetch completion
      const isCarPage = p === '/' || p.startsWith('/location/');
      if (isCarPage) {
        console.log('   [INFO] Dynamic Car page detected. Waiting for Supabase cards...');
        try {
          // Wait for loader spinner (.animate-spin) to disappear
          await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 15000 });
          console.log('   [OK] React loading spinners detached.');
          
          // Verify that button elements are present
          await page.waitForSelector('button', { state: 'attached', timeout: 5000 });
          console.log('   [OK] Buttons/Cards successfully rendered in DOM.');
        } catch (e) {
          console.log('   [WARN] Could not verify complete car cards loading:', e.message);
        }
      }

      // Add small sleep for safety to allow final micro-renders to settle
      await page.waitForTimeout(1000);

      // Extract raw HTML content
      const htmlContent = await page.content();

      // Determine output directory & save index.html
      let routeOutputDir = distDir;
      if (p !== '/') {
        routeOutputDir = path.join(distDir, p);
        if (!fs.existsSync(routeOutputDir)) {
          fs.mkdirSync(routeOutputDir, { recursive: true });
        }
      }

      const outputPath = path.join(routeOutputDir, 'index.html');
      fs.writeFileSync(outputPath, htmlContent, 'utf-8');
      console.log(`   [SUCCESS] Saved static file to ${outputPath}`);
    }

    console.log('\n--- Prerendering process completed! ---');
  } catch (error) {
    console.error('\n[FATAL ERROR] Prerendering failed:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed.');
    }
    server.close();
    console.log('Temporary server stopped.');
    process.exit(0);
  }
});
