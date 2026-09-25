const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const titleColStr = '<div className="pd-title-col">';
const p1 = code.indexOf(titleColStr);
const p2 = code.indexOf('<button className="pd-review-btn"', p1);

// Inside p1 to p2, there is an </h1> and a </div>
const h1End = code.indexOf('</h1>', p1) + 5;
const titleColClosingDiv = code.indexOf('</div>', h1End);

const reviewBtnStart = p2;
const reviewBtnEnd = code.indexOf('</button>', reviewBtnStart) + 9;

// After the review btn, there is a </div> closing the pd-title-row
const rowClosingDiv = code.indexOf('</div>', reviewBtnEnd);

// Then starts the meta block
const metaStart = code.indexOf('<div style={{ display: \'flex\', alignItems: \'center\', gap: \'1rem\', color: \'var(--color-text-muted)\'', rowClosingDiv);

// Then the price block
const priceStart = code.indexOf('<div style={{ display: \'flex\', alignItems: \'baseline\', gap: \'1rem\' }}>', metaStart);

// The price block ends with a </div>. Let's find the material-size-wrapper
const materialStart = code.indexOf('<div className="material-size-wrapper"');

// The price block's closing </div> is before materialStart
// But wait, there's another closing </div> before materialStart?
// No, the main right column ends at the very end of the file.
const contentBetweenRowAndMaterial = code.substring(rowClosingDiv + 6, materialStart);
// Content contains meta, price, and maybe a </div> that closes the right column? No, the right column contains material-size-wrapper too.
// So we just take everything from metaStart to materialStart - 1

const metaAndPriceStr = code.substring(metaStart, materialStart).trim();

// Now we build the new structure
// 1. Keep everything up to h1End
// 2. Append metaAndPriceStr
// 3. Append </div> (closing pd-title-col)
// 4. Append review button
// 5. Append </div> (closing pd-title-row)
// 6. Append <div className="material-size-wrapper"...

const newBlock = `
              ${metaAndPriceStr}
              </div>
              ${code.substring(reviewBtnStart, reviewBtnEnd)}
            </div>
            
          <div className="material-size-wrapper"
`;

code = code.substring(0, h1End) + newBlock + code.substring(materialStart + 38);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Restructured cleanly!');
