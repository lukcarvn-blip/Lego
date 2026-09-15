const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace(/inset: '15% 10% 15% 10%'/g, "inset: '15% 0 15% 0'");
code = code.replace(/backgroundSize: '625% 285\.71428%'/g, "backgroundSize: '500% 285.71428%'");

const oldPos = 'backgroundPosition: `${((10 + (idx % 5) * 16) / 84) * 100}% ${((15 + Math.floor(idx / 5) * 35) / 65) * 100}%`';
const newPos = 'backgroundPosition: `${(idx % 5) * 25}% ${((15 + Math.floor(idx / 5) * 35) / 65) * 100}%`';
code = code.replace(oldPos, newPos);

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Fixed background position math');
