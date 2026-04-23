const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  const fp = path.resolve('c:/Users/tiago/Downloads/site avanti oficial/app.html');
  await page.goto('file:///' + fp, { waitUntil: 'networkidle0' });
  await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')); });
  await new Promise(r => setTimeout(r, 800));

  const heroEl = await page.$('.hero');
  const heroBox = await heroEl.boundingBox();
  await page.screenshot({ path: path.resolve('c:/Users/tiago/Downloads/site app avanti/sec-hero-m.png'), clip: { x: 0, y: 0, width: 390, height: Math.min(heroBox.height, 950) } });

  const featEl = await page.$('.features-section');
  const featBox = await featEl.boundingBox();
  await page.screenshot({ path: path.resolve('c:/Users/tiago/Downloads/site app avanti/sec-feat-m.png'), clip: { x: 0, y: featBox.y, width: 390, height: Math.min(featBox.height, 2200) } });

  await browser.close();
  console.log('done');
})();
