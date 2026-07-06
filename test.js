import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  try {
    await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.setItem('legato_is_admin', 'true'));
    await page.goto('http://localhost:4173/hoang', { waitUntil: 'domcontentloaded' });
    // Reload after setting localStorage
    await page.reload({ waitUntil: 'domcontentloaded' });
    
    // Wait a bit to let React render and crash if it will
    await new Promise(r => setTimeout(r, 2000));
    
    // Also grab console errors from the page explicitly
    const errors = await page.evaluate(() => {
      return window.__ERRORS__ || [];
    });
    console.log('CAPTURED ERRORS:', errors);

    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    console.log('BODY HTML LENGTH:', bodyHtml.length);
    console.log('BODY HTML SUBSTRING:', bodyHtml.substring(0, 500));
  } catch (e) {
    console.error('ERROR:', e.message);
  }
  
  await browser.close();
})();
