const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  useEffect(() => {
    if (!isAdmin) {
      document.documentElement.style.zoom = '0.9';
    } else {
      document.documentElement.style.zoom = '1';
    }
  }, [isAdmin]);`;

const replacement = `  useEffect(() => {
    if (!isAdmin) {
      document.documentElement.style.zoom = '0.9';
      document.documentElement.style.width = '111.11vw';
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.margin = '0 auto';
    } else {
      document.documentElement.style.zoom = '1';
      document.documentElement.style.width = '100%';
      document.documentElement.style.overflowX = 'auto';
      document.body.style.margin = '0';
    }
  }, [isAdmin]);`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Fixed zoom width.');
