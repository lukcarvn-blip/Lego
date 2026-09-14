const fs = require('fs');

let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /style=\{\{\s*position:\s*'absolute',\s*top:\s*0,\s*left:\s*0,\s*width:\s*'100%',\s*height:\s*'100%',\s*objectFit:\s*'cover'\s*\}\}\s*\/>/g;

code = code.replace(
  regex,
  `style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}\n                            />\n                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.85) 100%)', pointerEvents: 'none', zIndex: 1 }} />`
);

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Added vignette to slider');
