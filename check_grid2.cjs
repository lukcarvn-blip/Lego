const fs = require('fs');
const lines = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('pd-main-grid'));
for(let i=start-10; i<start+10; i++) console.log(i+1, lines[i]);
