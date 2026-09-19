const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Replace inset
code = code.replace(
  "inset: '15% 6% 15% 6%'",
  "inset: '15% 12% 15% 12%'"
);

// Replace bgPosX logic
code = code.replace(
  "const bgPosX = ((6 + c * 17.6) / 82.4) * 100;",
  "const bgPosX = ((12 + c * 15.2) / 84.8) * 100;"
);

// Replace backgroundSize
code = code.replace(
  "backgroundSize: '568.1818% 285.71428%',",
  "backgroundSize: '657.8947% 285.71428%',"
);

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Fixed zoom math to 12% inset');
