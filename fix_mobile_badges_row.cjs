const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const oldCss = `@media (max-width: 768px) {
  .product-detail-badges {
    top: 4.5rem;
    left: 1.5rem;
    right: auto;
    align-items: flex-start;
  }
}`;

const newCss = `@media (max-width: 768px) {
  .product-detail-badges {
    top: 4.5rem;
    left: 1.5rem;
    right: auto;
    flex-direction: row;
    align-items: flex-start;
  }
}`;

if (code.includes(oldCss)) {
  code = code.replace(oldCss, newCss);
  fs.writeFileSync('src/index.css', code, 'utf8');
  console.log('Successfully updated product-detail-badges CSS for mobile');
} else {
  console.log('Could not find oldCss exactly. Trying regex...');
  const regex = /@media\s*\(max-width:\s*768px\)\s*\{\s*\.product-detail-badges\s*\{\s*top:\s*4\.5rem;\s*left:\s*1\.5rem;\s*right:\s*auto;\s*align-items:\s*flex-start;\s*\}\s*\}/;
  if (regex.test(code)) {
    code = code.replace(regex, newCss);
    fs.writeFileSync('src/index.css', code, 'utf8');
    console.log('Updated with regex');
  } else {
    console.log('Regex also failed');
  }
}
