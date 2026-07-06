const fs = require('fs');
let data = fs.readFileSync('src/data/mockProducts.ts', 'utf8');
data = data.replace(/images:\s*\["([^"]+)"\]/g, (match, p1) => {
  return `images: [\n      "${p1}",\n      "${p1}",\n      "${p1}",\n      "${p1}",\n      "${p1}",\n      "${p1}",\n      "${p1}",\n      "${p1}",\n      "${p1}",\n      "${p1}"\n    ]`;
});
fs.writeFileSync('src/data/mockProducts.ts', data);
console.log('Done!');
