const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      document.body.style.margin = '0';
      document.body.style.width = '111.11vw';
      document.body.style.minHeight = '111.11vh';
      document.body.style.transform = 'scale(0.9)';
      document.body.style.transformOrigin = 'top left';
      document.body.style.overflowX = 'hidden';`;

const replacement = `      document.body.style.margin = '0';
      document.body.style.setProperty('width', '111.11vw', 'important');
      document.body.style.setProperty('max-width', '111.11vw', 'important');
      document.body.style.minHeight = '111.11vh';
      document.body.style.transform = 'scale(0.9)';
      document.body.style.transformOrigin = 'top left';
      document.body.style.overflowX = 'hidden';`;

code = code.replace(target, replacement);

const target2 = `      document.body.style.width = '';
      document.body.style.minHeight = '';
      document.body.style.transform = '';
      document.body.style.transformOrigin = '';
      document.body.style.overflowX = '';
      document.body.style.margin = '0';`;

const replacement2 = `      document.body.style.removeProperty('width');
      document.body.style.removeProperty('max-width');
      document.body.style.minHeight = '';
      document.body.style.transform = '';
      document.body.style.transformOrigin = '';
      document.body.style.overflowX = '';
      document.body.style.margin = '0';`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Fixed max-width override.');
