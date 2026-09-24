const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

code = code.replace(/padding: '0 10px', /g, '');

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Removed padding: 0 10px,');
