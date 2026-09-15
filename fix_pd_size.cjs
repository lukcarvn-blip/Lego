const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

code = code.replace(/const getSizeDetails = \(sizeStr: string\) => \{[\s\S]*?\};\n/m, '');
code = code.replace(/getSizeDetails\(/g, 'getStoreSizeDetails(');
code = code.replace(/\.scale/g, '?.scaleGraphic');
code = code.replace(/Math\.max\(\.\.\.product\.availableSizes\.map\(s => getStoreSizeDetails\(s\)\?\.scaleGraphic\)\)/g, 
  "Math.max(...product.availableSizes.map(s => getStoreSizeDetails(s)?.scaleGraphic || 1))");

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed getSizeDetails in ProductDetails');
