const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Replace inset (Top Right Bottom Left)
code = code.replace(
  "inset: '15% 12% 15% 12%'",
  "inset: '15% 2% 15% 22%'"
);

// Replace bgPosX logic
code = code.replace(
  "const bgPosX = ((12 + c * 15.2) / 84.8) * 100;",
  "const bgPosX = ((22 + c * 15.2) / 84.8) * 100;"
);

// bgSize remains 657.8947% because width is still 76% (100 - 22 - 2)

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Shifted grid right by 10% (L=22, R=2)');
