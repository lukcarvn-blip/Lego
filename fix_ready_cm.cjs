const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const regexRuler = /\{product\.dimensions \|\| '\?'\}/g;
code = code.replace(regexRuler, "{product.dimensions?.match(/(\\d+\\s*cm)/i)?.[0] || product.dimensions || '?'}");

const regexBox = /\{product\.dimensions \|\| \(language === 'vi' \? 'Liên hệ' : 'Contact us'\)\}/g;
code = code.replace(regexBox, "{product.dimensions?.match(/(\\d+\\s*cm)/i)?.[0] || product.dimensions || (language === 'vi' ? 'Liên hệ' : 'Contact us')}");

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed cm extraction');
