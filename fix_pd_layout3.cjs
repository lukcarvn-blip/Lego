const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Currently, the structure is:
// <div className="pd-title-row">
//   <div className="pd-title-col">
//     <h1 ...> ... </h1>
//   </div>
//   <button className="pd-review-btn"> ... </button>
// </div>
// <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-muted)'... /* META */
// ... </div>
// <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}> /* PRICE */
// ... </div>

// We want to change it to:
// <div className="pd-title-row">
//   <div className="pd-title-col">
//     <h1 ...> ... </h1>
//     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-muted)'... /* META */
//     ... </div>
//     <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}> /* PRICE */
//     ... </div>
//   </div>
//   <button className="pd-review-btn"> ... </button>
// </div>

// Step 1: Remove the </div> and the <button className="pd-review-btn">...</button></div> from its current position
const rowStart = code.indexOf('<div className="pd-title-row"');
const colStart = code.indexOf('<div className="pd-title-col">', rowStart);
const btnStart = code.indexOf('<button className="pd-review-btn"', colStart);
const btnEnd = code.indexOf('</button>', btnStart) + 9;
const rowEnd = code.indexOf('</div>', btnEnd) + 6;

const btnAndEndCode = code.substring(btnStart, rowEnd);

// Step 2: Extract the Meta and Price block
const priceEndIdx = code.indexOf('</div>\n\n          <div className="material-size-wrapper"', rowEnd);
const metaAndPrice = code.substring(rowEnd, priceEndIdx);

// Step 3: Reconstruct
const newBlock = `
              <div className="pd-title-col">
` + code.substring(colStart + 30, btnStart) + metaAndPrice + `
              </div>
` + btnAndEndCode.replace('</div>', '') + `
            </div>
`;

code = code.substring(0, colStart) + newBlock.trim() + code.substring(priceEndIdx);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Restructured title, meta, price and review button.');
