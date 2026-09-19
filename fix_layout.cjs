const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const regex = /<div className="pd-main-grid">/;
if (code.match(regex)) {
    code = code.replace(regex, `<div className="pd-main-grid" style={{ position: 'relative', zIndex: 10, marginTop: selectedBanner ? (window.innerWidth >= 1024 ? '-180px' : '0') : '0' }}>`);
    fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
    console.log('Grid margin updated');
} else {
    console.log('Regex failed');
}
