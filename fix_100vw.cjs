const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.minHeight = '111.11vh';
      document.body.style.margin = '0 auto';
      document.body.style.minHeight = '111.11vh';`;

const replacement = `      document.documentElement.style.width = '100vw';
      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.minHeight = '100vh';
      document.body.style.width = '100vw';
      document.body.style.margin = '0 auto';
      document.body.style.minHeight = '100vh';`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Set width to 100vw.');
