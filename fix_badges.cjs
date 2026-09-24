const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

code = code.replace(
  "gap: '0.2rem', width: 'auto', minWidth: '75px', height: '75px', padding: '0 10px',",
  "gap: '0.2rem', padding: '0 10px',"
);

code = code.replace(
  "gap: '0.2rem', width: 'auto', minWidth: '75px', height: '75px', padding: '0 10px',",
  "gap: '0.2rem', padding: '0 10px',"
);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed ProductDetails badges.');
