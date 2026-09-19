const fs = require('fs');
const lines = fs.readFileSync('src/pages/Home.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('className="showcase-hitbox"'));
for(let i=start; i<start+40; i++) console.log(i+1, lines[i]);
