import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  console.log('Navigating to http://localhost:5173/hoang...');
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('admin_tab', '"products"');
    sessionStorage.setItem('admin_isEditingProduct', 'true');
    sessionStorage.setItem('admin_editingProduct', '{}');
  });
  await page.goto('http://localhost:5173/hoang', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'product_form.png', fullPage: true });
  await new Promise(r => setTimeout(r, 2000));
  
  const html = await page.evaluate(() => document.body.innerHTML.slice(0, 500));
  console.log('HTML Snippet:', html);
  
  await browser.close();
})();
