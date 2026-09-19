const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Remove background dark overlay
const overlayRegex = /<div\s*style=\{\{\s*position: 'absolute',\s*inset: 0,\s*backgroundColor: 'rgba\(0,0,0,0\.7\)',[^>]*?zIndex: 5\s*\}\}\s*\/>/g;
if (code.match(overlayRegex)) {
    code = code.replace(overlayRegex, '');
    console.log('Removed dark overlay');
} else {
    console.log('Regex 1 failed');
}

// 2. Remove zoom block
const zoomRegex = /<div style=\{\{\s*position: 'absolute',\s*inset: 0,\s*overflow: 'hidden',\s*borderRadius: '4px',\s*zIndex: 1\s*\}\}>[\s\S]*?<div\s*className="char-zoom-layer"[\s\S]*?pointerEvents: 'none'\s*\}\}\s*\/>[\s\S]*?<div style=\{\{\s*position: 'absolute',\s*inset: 0,[\s\S]*?transition: 'box-shadow 0\.5s ease'\s*\}\}\s*\/>\s*<\/div>/g;

const newHighlightBlock = `<div style={{ position: 'absolute', inset: 0, border: hoveredChar === idx ? '2px solid rgba(255,255,255,0.4)' : 'none', borderRadius: '4px', zIndex: 1, pointerEvents: 'none', transition: 'border 0.3s ease', boxShadow: hoveredChar === idx ? 'inset 0 0 20px rgba(255,255,255,0.2), 0 0 15px rgba(255,255,255,0.1)' : 'none' }} />`;

if (code.match(zoomRegex)) {
    code = code.replace(zoomRegex, newHighlightBlock);
    console.log('Removed zoom layer and replaced with border');
} else {
    console.log('Regex 2 failed');
}

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
