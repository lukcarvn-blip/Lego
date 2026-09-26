const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

code = code.replace(/width: '100vw',\s*marginLeft: '-1rem'/g, "width: 'calc(100% + 2rem)', marginLeft: '-1rem'");

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed mobile image width');
