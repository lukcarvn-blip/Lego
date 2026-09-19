const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// Replace the generic shine with specific class
css = css.replace('.pd-badge, .flash-badge {', '.fan-cung-shine {');
css = css.replace('.pd-badge::after, .flash-badge::after {', '.fan-cung-shine::after {');

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Fixed CSS class for shine');

let tsx = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');
// Add fan-cung-shine class to the top fan badge
tsx = tsx.replace(
  'className="pd-badge hover-jump" onClick={(e) => handleTopFanClick(e, col.name)}',
  'className="pd-badge hover-jump fan-cung-shine" onClick={(e) => handleTopFanClick(e, col.name)}'
);
fs.writeFileSync('src/pages/ProductDetails.tsx', tsx, 'utf8');
console.log('Added class to Top Fan badge');
