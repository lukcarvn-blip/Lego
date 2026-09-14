const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const oldCss = `@media (max-width: 768px) {
  .product-detail-badges {
    top: auto;
    bottom: 0.5rem;
    left: 0.5rem;
    right: auto;
    flex-direction: row;
    align-items: flex-start;
    transform: scale(0.7);
    transform-origin: bottom left;
    pointer-events: none;
  }
}`;

const newCss = `@media (max-width: 768px) {
  .product-detail-badges {
    top: auto;
    bottom: 0.5rem;
    left: 50%;
    right: auto;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transform: translateX(-50%) scale(0.7);
    transform-origin: bottom center;
    pointer-events: none;
  }
}`;

if (css.includes(oldCss)) {
  css = css.replace(oldCss, newCss);
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('Successfully centered badges on mobile');
} else {
  console.log('CSS anchor not found');
}
