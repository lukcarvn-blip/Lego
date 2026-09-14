const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const regexRuler = /\{isMobile \? <Ruler[\s\S]*?\/> : (<span className="stat-label">.*?<\/span>)\}/g;
const regexPalette = /\{isMobile \? <Palette[\s\S]*?\/> : (<span className="stat-label">.*?<\/span>)\}/g;
const regexPackage = /\{isMobile \? <Package[\s\S]*?\/> : (<span className="stat-label".*?>.*?<\/span>)\}/g;
const regexShoppingCart = /\{isMobile \? <ShoppingCart[\s\S]*?\/> : (<span className="stat-label">.*?<\/span>)\}/g;

code = code.replace(regexRuler, '$1');
code = code.replace(regexPalette, '$1');
code = code.replace(regexPackage, '$1');
code = code.replace(regexShoppingCart, '$1');

fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
console.log('Updated ProductCard.tsx stats to always show text');
