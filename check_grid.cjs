const fs = require('fs');
const lines = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('className="grid"'));
for(let i=start-5; i<start+15; i++) console.log(i+1, lines[i]);
