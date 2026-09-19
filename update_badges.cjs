const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Remove pd-hud-delayed from the badges container so it doesn't animate as a whole
code = code.replace(
  /<div className="product-detail-badges pd-hud-delayed">/,
  '<div className="product-detail-badges">'
);

// 2. Add pd-badge to the class name of the badges
code = code.replace(
  /className="hover-jump"\s*\r?\n\s*onClick=\{\(e\)/g,
  'className="pd-badge hover-jump" onClick={(e)'
);

code = code.replace(
  /className="hover-jump" style=\{\{ display: 'flex'/g,
  'className="pd-badge hover-jump" style={{ display: \'flex\''
);

// 3. Remove hardcoded width: '75px', height: '75px' to allow CSS to manage it
code = code.replace(/width:\s*'75px',\s*height:\s*'75px',\s*/g, '');

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Modified ProductDetails.tsx');
