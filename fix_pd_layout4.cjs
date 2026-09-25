const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// The layout right now is:
// <div className="pd-title-row" ...>
//   <div className="pd-title-col">
//      <h1>...</h1>
//   </div>
//   <button className="pd-review-btn" ...>...</button>
// </div>
// <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-muted)', marginBottom: '1rem', flexWrap: 'wrap' }}>...META...</div>
// <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>...PRICE...</div>

// We need to find the `</div>` that closes `pd-title-col`, and the `</div>` that closes `pd-title-row`.
// We will simply MOVE the `pd-review-btn` down, AFTER the PRICE div.
// And we will MOVE the `<div className="pd-title-row">` up, and make it encompass META and PRICE.
// Actually, the easiest way is:
// 1. Remove the `</div>` that closes `pd-title-col`
// 2. Remove the `<button className="pd-review-btn" ...> ... </button>`
// 3. Remove the `</div>` that closes `pd-title-row`
// 4. Insert `</div>` (for pd-title-col), then the `<button...>`, then `</div>` (for pd-title-row) AFTER the PRICE div.

// Let's find the PRICE div
const metaStart = code.indexOf(`<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-muted)', marginBottom: '1rem', flexWrap: 'wrap' }}>`);
const priceStart = code.indexOf(`<div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>`, metaStart);
const priceEnd = code.indexOf('</div>\n          </div>', priceStart) + 6; // closes the price flex div

if (metaStart > -1 && priceStart > -1 && priceEnd > priceStart) {
  const rowStart = code.indexOf('<div className="pd-title-row"');
  const btnStart = code.indexOf('<button className="pd-review-btn"');
  const btnEnd = code.indexOf('</button>', btnStart) + 9;
  
  // The code between btnEnd and metaStart is just `</div>` and whitespace
  const reviewBtnCode = code.substring(btnStart, btnEnd);
  
  // We need to delete from btnStart up to metaStart
  code = code.substring(0, btnStart) + code.substring(metaStart);
  
  // Now `code` doesn't have the review button or the closing `</div>` for pd-title-row (wait, does it?)
  // Let's re-calculate priceEnd in the new code
  const newPriceEnd = code.indexOf('</div>\n          </div>', priceStart - (metaStart - btnStart)) + 6;
  
  // Insert the review button and the closing `</div>` for pd-title-row AFTER newPriceEnd
  const insertCode = `
              </div>
              ${reviewBtnCode}
            </div>
  `;
  
  // Wait, we need to remove the `</div>` that closes `pd-title-col` which is right before btnStart
  // Let's just do a clean regex or manual string replacement.
  
}
