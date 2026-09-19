const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

code = code.replace(
  "displaySize = product.dimensions;",
  "displaySize = product.dimensions?.match(/(\\d+\\s*cm)/i)?.[0] || product.dimensions;"
);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed size badge ready stock display');
