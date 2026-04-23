const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const filePath = path.resolve('c:/Users/tiago/Downloads/site avanti oficial/index.html');
  await page.goto('file:///' + filePath, { waitUntil: 'networkidle0' });

  // Scroll through to trigger animations
  await page.evaluate(async () => {
    for (let i = 0; i < document.body.scrollHeight; i += 100) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 1500));

  const sections = [
    { name: 'hero', selector: '#home' },
    { name: 'sports-bar', selector: null, scroll: 950 },
    { name: 'quote', selector: '.quote-section' },
    { name: 'produtos', selector: '.produtos-section' },
    { name: 'app', selector: '.app-section' },
    { name: 'assessoria', selector: '.assessoria-section' },
    { name: 'stats', selector: '.stats-section' },
    { name: 'b2b', selector: '.b2b-section' },
    { name: 'equipe', selector: '.equipe-section' },
    { name: 'cta-footer', selector: '.cta-final' },
  ];

  for (const s of sections) {
    if (s.selector) {
      const el = await page.$(s.selector);
      if (el) {
        const box = await el.boundingBox();
        await page.screenshot({
          path: `section-${s.name}.png`,
          clip: { x: 0, y: box.y, width: 1440, height: Math.min(box.height, 1200) }
        });
      }
    } else {
      await page.evaluate((y) => window.scrollTo(0, y), s.scroll);
      await new Promise(r => setTimeout(r, 300));
      await page.screenshot({ path: `section-${s.name}.png`, clip: { x: 0, y: s.scroll, width: 1440, height: 120 } });
    }
    console.log(`Done: ${s.name}`);
  }

  await browser.close();
})();
