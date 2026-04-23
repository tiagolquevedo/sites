const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const fp = path.resolve('c:/Users/tiago/Downloads/site avanti oficial/app.html');
  await page.goto('file:///' + fp, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  });
  await new Promise(r => setTimeout(r, 1000));

  const sections = [
    ['hero', '.hero'],
    ['quote', '.quote-section'],
    ['features', '.features-section'],
    ['depo', '.depo-section'],
    ['team', '.team-section'],
    ['cta', '.cta-section'],
  ];

  for (const [name, sel] of sections) {
    const el = await page.$(sel);
    if (el) {
      const box = await el.boundingBox();
      await page.screenshot({
        path: path.resolve('c:/Users/tiago/Downloads/site app avanti/sec-' + name + '.png'),
        clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 2400) }
      });
      console.log('Done: ' + name);
    }
  }
  await browser.close();
})();
