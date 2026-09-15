const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

const target = `.tech-box-wrapper {
  position: absolute;`;

const replacement = `.tech-box-wrapper {
  position: absolute;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease;
}

.tech-box-wrapper:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.9), 0 0 15px rgba(36, 214, 115, 0.4);`;

if (css.includes(target) && !css.includes('.tech-box-wrapper:hover')) {
  css = css.replace(target, replacement);
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('Added hover effect');
} else {
  console.log('Not found or already added');
}
