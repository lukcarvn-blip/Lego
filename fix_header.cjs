const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

code = code.replace(
  "width: '220px', flexShrink: 0",
  "width: '140px', flexShrink: 0"
);

code = code.replace(
  "paddingLeft: '2rem'",
  "paddingLeft: '0.5rem', overflow: 'hidden'"
);

code = code.replace(
  "gap: '0.6rem', flexWrap: 'wrap'",
  "gap: '0.6rem', flexWrap: 'nowrap'"
);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Fixed header layout');
