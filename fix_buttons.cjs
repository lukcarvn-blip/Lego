const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace(/className="hero-prev tech-box-wrapper hover-jump"/g, 'className="hero-prev tech-box-wrapper"');
code = code.replace(/className="hero-next tech-box-wrapper hover-jump"/g, 'className="hero-next tech-box-wrapper"');

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Removed hover-jump from buttons');
