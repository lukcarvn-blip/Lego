const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace(
  "src={prod.bannerImage || prod.images?.[0] || '/images/slider-banner.jpg'}",
  "src={prod.bannerImages?.[0] || prod.bannerImage || prod.images?.[0] || '/images/slider-banner.jpg'}"
);

code = code.replace(
  "src={product.bannerImage || product.images?.[0]}",
  "src={product.bannerImages?.[0] || product.bannerImage || product.images?.[0]}"
);

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Successfully updated bannerImage references in Home.tsx');
