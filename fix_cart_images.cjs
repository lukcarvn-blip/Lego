const fs = require('fs');

let code = fs.readFileSync('src/pages/Cart.tsx', 'utf8');

const regex = /<img src=\{item\.product\.images\[0\]\}/g;
if (code.match(regex)) {
  code = code.replace(regex, `<img src={item.product.images?.[0] || '/images/fallback-logo.jpg'}`);
  fs.writeFileSync('src/pages/Cart.tsx', code, 'utf8');
  console.log('Fixed Cart images bug');
} else {
  console.log('Match not found');
}
