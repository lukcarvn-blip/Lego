const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const targetStart = `<div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>`;

const startIdx = code.indexOf(targetStart);
if (startIdx !== -1) {
  const endIdx = code.indexOf('</motion.div>', startIdx);
  if (endIdx !== -1) {
    const subStr = code.substring(startIdx, endIdx);
    const lastDivIdx = subStr.lastIndexOf('</div>');
    if (lastDivIdx !== -1) {
      code = code.substring(0, startIdx) + code.substring(startIdx + lastDivIdx + 7);
      fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
      console.log('Removed old review box');
    }
  }
}
