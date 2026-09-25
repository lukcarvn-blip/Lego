const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

code = code.replace(
  /<div className="community-header-split">/,
  `<div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%', marginBottom: '4rem', alignItems: 'stretch' }}>`
);

code = code.replace(
  /<div className="community-header-intro">/,
  `<div style={{ flex: '1 1 45%', minWidth: '300px' }}>`
);

code = code.replace(
  /<div className="community-header-vision">/,
  `<div style={{ flex: '1 1 45%', minWidth: '300px' }}>`
);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Done header');
