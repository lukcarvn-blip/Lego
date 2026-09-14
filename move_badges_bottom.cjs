const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const oldCss = `@media (max-width: 768px) {
  .product-detail-badges {
    top: 4.5rem;
    left: 1.5rem;
    right: auto;
    flex-direction: row;
    align-items: flex-start;
  }
}`;

const newCss = `@media (max-width: 768px) {
  .product-detail-badges {
    top: auto;
    bottom: 0.5rem;
    left: 0.5rem;
    right: auto;
    flex-direction: row;
    align-items: flex-start;
    transform: scale(0.5);
    transform-origin: bottom left;
  }
}`;

if (code.includes(oldCss)) {
  code = code.replace(oldCss, newCss);
  fs.writeFileSync('src/index.css', code, 'utf8');
  console.log('Successfully updated product-detail-badges CSS for mobile');
} else {
  console.log('Could not find oldCss exactly.');
}
