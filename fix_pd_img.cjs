const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// The DOM looks like:
// <div className="pd-slide-content" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
//   {/* Inner dark vignette for breadcrumb visibility */}
//   <div style={{...}}></div>
// </div>
// ... later ...
// <img src={selectedBanner} ... />

const slideContentStart = `<div className="pd-slide-content" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>`;
const imgTag = `<img src={selectedBanner} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />`;

// First, remove the imgTag wherever it currently is
code = code.replace(imgTag, '');

// Then, insert it right after slideContentStart
code = code.replace(slideContentStart, slideContentStart + '\n            ' + imgTag);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed img tag position');
