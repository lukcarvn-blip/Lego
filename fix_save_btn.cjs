const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// The heart button uses position:absolute top:1.5rem right:1.5rem
// On mobile, the badges go to the bottom of the image, and the heart button stays at top-right
// but it gets hidden. We need to change the heart button to be inside product-detail-badges
// OR just change its mobile positioning.

// Best fix: give the heart button a class and use CSS to show/hide properly.
// Even simpler: just change position from absolute top-right to using the badges container.

// The heart button currently has: position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 30
// We want it to appear ABOVE the badges column on mobile.
// Since we can't easily move the DOM, let's use a className and add CSS.

// Change the button style to include a class name
const oldButtonStyle = `position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 30,`;
const newButtonStyle = `position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 30,`;

if (code.includes(oldButtonStyle)) {
  code = code.replace(oldButtonStyle, newButtonStyle);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('Moved heart/+ button to top-LEFT so it doesnt overlap with badges (top-right)');
} else {
  console.log('Target not found');
}
