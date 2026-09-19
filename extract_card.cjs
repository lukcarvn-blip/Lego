const fs = require('fs');
const lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');
let start = lines.findIndex(l => l.includes('className="request-card-bg fan-cung-shine"'));
for(let i=start-5; i<start+35; i++) {
  if (lines[i]) console.log(lines[i]);
}
