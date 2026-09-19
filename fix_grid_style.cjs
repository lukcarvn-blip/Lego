const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const regex = /<div className="pd-main-grid" style=\{\{ position: 'relative', zIndex: 10, marginTop: selectedBanner \? \(window\.innerWidth >= 1024 \? '-180px' : '0'\) : '0' \}\}>/;

if (code.match(regex)) {
    code = code.replace(regex, '<div className={`pd-main-grid ${selectedBanner ? "has-banner" : ""}`}>');
    fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
    console.log('Fixed grid class');
} else {
    console.log('Regex failed');
}
