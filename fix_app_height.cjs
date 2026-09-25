const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      document.documentElement.style.overflowX = 'hidden';
      document.body.style.margin = '0 auto';`;

const replacement = `      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.minHeight = '111.11vh';
      document.body.style.margin = '0 auto';
      document.body.style.minHeight = '111.11vh';`;

code = code.replace(target, replacement);

const target2 = `      document.documentElement.style.overflowX = 'auto';
      document.body.style.margin = '0';`;

const replacement2 = `      document.documentElement.style.overflowX = 'auto';
      document.documentElement.style.minHeight = '100vh';
      document.body.style.margin = '0';
      document.body.style.minHeight = '100vh';`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Fixed zoom height as well.');
