// node scripts/shots.cjs <outdir> [url]
const puppeteer = require('../../node_modules/puppeteer');
const out = process.argv[2]; const url = process.argv[3] || 'http://localhost:4321/';
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  for (const w of [390, 1024, 1440]) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: w < 600 ? 844 : 900, deviceScaleFactor: 1, isMobile: w < 600, hasTouch: w < 600 });
    const errs = []; p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', e => errs.push(String(e)));
    await p.goto(url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2500));
    await p.screenshot({ path: `${out}/top-${w}.png` });
    // scroll through to trigger lazy stuff
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 600) { await p.evaluate(y => scrollTo(0, y), y); await new Promise(r => setTimeout(r, 250)); }
    await p.evaluate(() => scrollTo(0, 0)); await new Promise(r => setTimeout(r, 1500));
    await p.screenshot({ path: `${out}/full-${w}.png`, fullPage: true });
    const ow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(w, 'height', h, 'overflowX', ow, errs.slice(0, 5));
    await p.close();
  }
  await b.close();
})();
