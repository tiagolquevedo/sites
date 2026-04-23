const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  
  const pageDesktop = await browser.newPage();
  await pageDesktop.setViewport({ width: 1440, height: 900 });
  const filePath = path.resolve('c:/Users/tiago/Downloads/site avanti oficial/index.html');
  await pageDesktop.goto('file:///' + filePath, { waitUntil: 'networkidle0' });

  // Wait for fonts + initial render
  await new Promise(r => setTimeout(r, 1500));

  // Scroll slowly to trigger all IntersectionObservers + our fallback
  const height = await pageDesktop.evaluate(() => document.body.scrollHeight);
  for (let i = 0; i <= height; i += 120) {
    await pageDesktop.evaluate((y) => window.scrollTo(0, y), i);
    await new Promise(r => setTimeout(r, 40));
  }

  // Wait for timeout fallback (600ms) + animations to finish
  await new Promise(r => setTimeout(r, 1500));
  await pageDesktop.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));

  await pageDesktop.screenshot({ path: 'screenshot-desktop.png', fullPage: true });
  console.log('Desktop done');

  // Mobile
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await pageMobile.goto('file:///' + filePath, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const heightM = await pageMobile.evaluate(() => document.body.scrollHeight);
  for (let i = 0; i <= heightM; i += 100) {
    await pageMobile.evaluate((y) => window.scrollTo(0, y), i);
    await new Promise(r => setTimeout(r, 40));
  }
  await new Promise(r => setTimeout(r, 1500));
  await pageMobile.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));

  await pageMobile.screenshot({ path: 'screenshot-mobile.png', fullPage: true });
  console.log('Mobile done');

  await browser.close();
})();
