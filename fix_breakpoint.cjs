const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/@media \(min-width: 769px\)/g, '@media (min-width: 1025px)');

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Fixed media query breakpoint to 1025px.');
