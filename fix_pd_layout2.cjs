const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Target the outer div and add className
const oldOuter = `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>`;

const newOuter = `<div className="pd-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="pd-title-col">
              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>`;

if (code.includes(oldOuter)) {
  code = code.replace(oldOuter, newOuter);
  console.log('Outer div fixed');
} else {
  // try with \r\n
  const oldOuterCRLF = `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>\r\n              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>`;
  if (code.includes(oldOuterCRLF)) {
    code = code.replace(oldOuterCRLF, newOuter.replace('\n', '\r\n'));
    console.log('Outer div fixed (CRLF)');
  } else {
    console.log('ERROR: outer div target not found');
    process.exit(1);
  }
}

// Now also close the pd-title-col before the review button
// The h1 ends with </h1> then comes </div> (from pd-title-col we just added) then <button
const oldClose = `</h1>\r\n              </div>\r\n              <button className="pd-review-btn"`;
const newClose = `</h1>\r\n              </div>\r\n              <button className="pd-review-btn"`;

// Only add </div> if it's not already there (our script already added it from previous run)
if (!code.includes('</div>\r\n              <button className="pd-review-btn"') && 
    !code.includes('</div>\n              <button className="pd-review-btn"')) {
  code = code.replace(
    `</h1>\r\n              \r\n              <button className="pd-review-btn"`,
    `</h1>\r\n              </div>\r\n              <button className="pd-review-btn"`
  );
  code = code.replace(
    `</h1>\n              \n              <button className="pd-review-btn"`,
    `</h1>\n              </div>\n              <button className="pd-review-btn"`
  );
  console.log('Title col closing div added');
} else {
  console.log('Title col closing div already present');
}

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Has pd-title-row:', code.includes('pd-title-row'));
console.log('Has pd-title-col:', code.includes('pd-title-col'));
console.log('Has pd-review-btn:', code.includes('pd-review-btn'));
