const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const lines = code.split('\n');
// We have an extra closing div at the end. We will remove one of them.
lines.splice(lines.length - 4, 1);

fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
