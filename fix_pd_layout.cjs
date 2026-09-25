const fs = require('fs');

// 1. Update CSS to add mobile 8/2 layout for title+review
let css = fs.readFileSync('src/index.css', 'utf8');

const mobileReviewCSS = `
/* Product detail title row - mobile 8/2 split */
.pd-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.pd-title-col {
  flex: 1;
  min-width: 0;
}
.pd-review-btn {
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .pd-title-row {
    flex-direction: row;
    gap: 0.75rem;
    align-items: flex-start;
  }
  .pd-title-col {
    flex: 0 0 80%;
    max-width: 80%;
  }
  .pd-review-btn {
    flex: 0 0 20%;
    max-width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 100%;
  }
  .pd-review-btn > * {
    width: 80% !important;
    box-sizing: border-box;
  }
}
`;

// Append CSS before end of file
css = css + mobileReviewCSS;
fs.writeFileSync('src/index.css', css, 'utf8');
console.log('CSS updated');

// 2. Update ProductDetails.tsx to add classNames
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Add className to the outer flex div
const oldRow = `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>`;
const newRow = `<div className="pd-title-row">
              <div className="pd-title-col">
              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>`;

if (code.includes(`display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'`)) {
  // find the exact block
  const targetDiv = `style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}`;
  const idx = code.indexOf(targetDiv);
  console.log('Found target at:', idx);
  
  // Replace the outer div's style with className
  code = code.replace(
    `style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1`,
    `className="pd-title-row">
              <div className="pd-title-col">
              <h1`
  );

  // Now we need to close the pd-title-col div before the review button
  // The h1 closes, then comes the review button
  code = code.replace(
    `</h1>\r\n              \r\n              <button`,
    `</h1>\r\n              </div>\r\n              <button className="pd-review-btn"`
  );
  // Also handle \n version
  code = code.replace(
    `</h1>\n              \n              <button`,
    `</h1>\n              </div>\n              <button className="pd-review-btn"`
  );
  
  // Remove the old style from button so className can take effect
  code = code.replace(
    `<button \r\n                onClick={handleOpenReview}\r\n                style={{\r\n                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',\r\n                  padding: '0.25rem 0.5rem', background: 'transparent',\r\n                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)',\r\n                  cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0\r\n                }}`,
    `<button className="pd-review-btn"\r\n                onClick={handleOpenReview}\r\n                style={{\r\n                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',\r\n                  padding: '0.25rem 0.5rem', background: 'transparent',\r\n                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)',\r\n                  cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0\r\n                }}`
  );

  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('ProductDetails.tsx updated');
  console.log('Has pd-title-row:', code.includes('pd-title-row'));
  console.log('Has pd-title-col:', code.includes('pd-title-col'));
  console.log('Has pd-review-btn:', code.includes('pd-review-btn'));
} else {
  console.log('Target not found in ProductDetails.tsx');
}
