const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');
code = code.replace(/'Chế tác theo yêu cầu'/g, "'Đặt chế tác'");
fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed text');
