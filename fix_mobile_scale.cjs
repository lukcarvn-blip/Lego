const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /style\.innerHTML = `[\s\S]*?`;/m;

const replacement = `style.innerHTML = \`
        @media (min-width: 769px) {
          html {
            overflow-x: hidden !important;
          }
          body {
            margin: 0 !important;
            width: 111.11vw !important;
            max-width: 111.11vw !important;
            min-height: 111.11vh !important;
            zoom: 0.9 !important;
            overflow-x: hidden !important;
          }
          #root {
            width: 111.11vw !important;
            max-width: 111.11vw !important;
          }
        }
      \`;`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Fixed App.tsx mobile zoom issue.');

// Now fix Heart button overlap in ProductDetails.tsx
let pdCode = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');
pdCode = pdCode.replace(/position: 'absolute',\s*top: '1\.5rem',\s*left: '1\.5rem',\s*zIndex: 30,\s*background: user\?\.savedCharacters/g, "position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 30,\n                    background: user?.savedCharacters");

fs.writeFileSync('src/pages/ProductDetails.tsx', pdCode, 'utf8');
console.log('Fixed Heart button position.');
