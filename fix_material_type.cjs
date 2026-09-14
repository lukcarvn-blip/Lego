const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const anchor = `addToCart(prod, defaultSize, defaultMaterial, 1, e);`;
const newAnchor = `addToCart(prod, defaultSize, defaultMaterial as any, 1, e);`;

if (code.includes(anchor)) {
  code = code.replace(anchor, newAnchor);
  fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
  console.log('Successfully casted defaultMaterial');
} else {
  console.log('Anchor not found');
}
