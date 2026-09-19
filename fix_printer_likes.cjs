const fs = require('fs');
let code = fs.readFileSync('src/data/mockProducts.ts', 'utf8');

const regex = /(category:\s*['"]3d-printer['"][\s\S]*?likes:\s*)(\d+)/g;
code = code.replace(regex, (match, p1, p2) => p1 + '0');

fs.writeFileSync('src/data/mockProducts.ts', code, 'utf8');
console.log('Reset likes for printers');
