const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the transformed wrapper with a zoom wrapper
code = code.replace(
  `<div style={!isAdmin ? { transform: 'scale(0.9)', transformOrigin: 'top center', width: '111.11%', marginLeft: '-5.55%' } : {}}>`,
  `<div style={!isAdmin ? { zoom: 0.9, width: '111.11%', margin: '0 auto', overflowX: 'hidden' } : {}}>`
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
