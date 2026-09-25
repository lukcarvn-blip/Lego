const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      document.documentElement.style.width = '100vw';`;
const replacement = `      document.documentElement.style.width = '100%';`;
code = code.replace(target, replacement);

const target2 = `      document.body.style.width = '100vw';`;
const replacement2 = `      document.body.style.width = '100%';`;
code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Set width to 100%');
