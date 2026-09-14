const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');
const jumpCss = `
/* Hover Jump Effect */
.hover-jump {
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
}
.hover-jump:hover {
  translate: 0 -4px !important;
}
`;
if (!code.includes('.hover-jump')) {
  fs.appendFileSync('src/index.css', jumpCss);
  console.log('Added .hover-jump to index.css');
}
