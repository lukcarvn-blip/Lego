const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');
code = code.replace("navigate('/leaderboard')", "navigate('/community')");
fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed ProductDetails');
