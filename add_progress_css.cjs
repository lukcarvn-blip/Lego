const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const newBlock = `/* Crafting progress fill animation */
@keyframes crafting-fill {
  from { width: 0%; }
  to   { width: 70%; }
}
.crafting-progress-fill {
  animation: crafting-fill 1.2s ease-out forwards;
  width: 0%;
}

`;

const anchor = '.product-detail-badges {';
if (css.includes(anchor)) {
  css = css.replace(anchor, newBlock + anchor);
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('CSS added successfully');
} else {
  // Just append to end
  css += '\n' + newBlock;
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('CSS appended to end');
}
