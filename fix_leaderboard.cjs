const fs = require('fs');
let code = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf8');
code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');
fs.writeFileSync('src/pages/Leaderboard.tsx', code, 'utf8');
