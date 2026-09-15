const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(
  /\.tech-box-wrapper:hover\s*\{[\s\S]*?\}/,
  `.tech-box-wrapper:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(36, 214, 115, 0.3);
}

.tech-box-wrapper.box-tr-loading:hover {
  transform: none !important;
  box-shadow: none !important;
}`
);

fs.writeFileSync('src/index.css', code, 'utf8');
console.log('Fixed CSS');
