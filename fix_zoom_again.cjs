const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /style\.innerHTML = `[\s\S]*?`;/m;

const replacement = `style.innerHTML = \`
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
      \`;`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Switched from transform to zoom in style tag.');
