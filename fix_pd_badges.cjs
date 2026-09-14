const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

const oldCss = `@media (max-width: 768px) {
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
  }`;

const newCss = `@media (max-width: 768px) {
  .product-detail-badges {
    top: auto;
    bottom: 0.5rem;
    left: 0;
    right: 0;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transform: scale(0.5);
    transform-origin: bottom center;
    pointer-events: none;
  }`;

if (css.includes(oldCss)) {
  css = css.replace(oldCss, newCss);
} else {
  // Try line by line or fallback
  css = css.replace('transform: translateX(-50%) scale(0.7);', 'transform: scale(0.5);');
  css = css.replace('left: 50%;\n    right: auto;', 'left: 0;\n    right: 0;\n    width: 100%;');
  css = css.replace('left: 50%;\r\n    right: auto;', 'left: 0;\r\n    right: 0;\r\n    width: 100%;');
}

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Updated index.css for mobile badges');
