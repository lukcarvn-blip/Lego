const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const regex = /\/\*\ 3D hover group effect: dim siblings when one card is hovered \*\/\r?\n\.product-grid:has\(\.product-card-wrapper:hover\) \.product-card-wrapper:not\(:hover\) \{\r?\n\s+opacity: 0\.45;\r?\n\s+filter: blur\(1\.5px\) brightness\(0\.6\);\r?\n\s+transform: scale\(0\.96\);\r?\n\s+transition: opacity 0\.35s ease, filter 0\.35s ease, transform 0\.35s ease;\r?\n\}\r?\n/;

if (code.match(regex)) {
    code = code.replace(regex, '');
    fs.writeFileSync('src/index.css', code, 'utf8');
    console.log('Removed hover dimming effect');
} else {
    // try fallback simpler replacement
    const regex2 = /\.product-grid:has\(\.product-card-wrapper:hover\) \.product-card-wrapper:not\(:hover\) \{[\s\S]*?\}/;
    if (code.match(regex2)) {
        code = code.replace(regex2, '');
        fs.writeFileSync('src/index.css', code, 'utf8');
        console.log('Removed hover dimming effect using fallback');
    } else {
        console.log('Regex failed');
    }
}
