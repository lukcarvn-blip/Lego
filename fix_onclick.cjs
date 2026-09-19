const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const regex = /<div onClick=\{\(\) => navigate\(`\/product\/\$\{char\.id\}`\)\}\s*onClick=\{\(\) => navigate\(`\/product\/\$\{char\.id\}`\)\}/g;
code = code.replace(regex, '<div onClick={() => navigate(`/product/${char.id}`)}');

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Fixed duplicate onClick in Community.tsx');
