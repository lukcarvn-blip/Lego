const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

code = code.replace(/<div style=\{\{ display: 'flex', alignItems: 'center', gap: '0\.25rem', color: '#ef4444' \}\}>/g, 
  `<div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b' }}>`);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed color');
