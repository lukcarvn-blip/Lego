const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

code = code.replace("textAlign: 'center', marginBottom: '3rem'", "textAlign: 'left', marginBottom: '3rem'");
code = code.replace("textAlign: 'center', marginBottom: '2rem', marginTop: 0", "textAlign: 'left', marginBottom: '2rem', marginTop: 0"); // BẢNG XẾP HẠNG VŨ TRỤ header

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Fixed text aligns');
