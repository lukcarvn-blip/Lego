const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /<div\s*style=\{\{\s*position:\s*'absolute',\s*inset:\s*0,\s*backgroundColor:\s*'rgba\(0,0,0,0\.7\)',[\s\S]*?zIndex:\s*5\s*\}\}\s*\/>/;

if (code.match(regex)) {
    code = code.replace(regex, ''); // Remove the dark overlay completely
    fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
    console.log('Removed dark overlay');
} else {
    console.log('Regex 1 failed');
}

// Next, we need to remove the char-zoom-layer completely, and maybe just give the hitbox a border on hover
const zoomRegex = /<div style=\{\{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '4px', zIndex: 1 \}\}>[\s\S]*?<\/div>\s*<\/div>/;

if (code.match(zoomRegex)) {
    code = code.replace(zoomRegex, `<div style={{ position: 'absolute', inset: 0, border: hoveredChar === idx ? '2px solid rgba(255,255,255,0.4)' : 'none', borderRadius: '8px', zIndex: 1, pointerEvents: 'none', transition: 'border 0.3s ease', boxShadow: hoveredChar === idx ? 'inset 0 0 20px rgba(255,255,255,0.2), 0 0 15px rgba(255,255,255,0.1)' : 'none' }} />`);
    fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
    console.log('Removed zoom layer and replaced with border');
} else {
    console.log('Regex 2 failed');
}

