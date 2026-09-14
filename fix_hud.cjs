const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('@keyframes hud-enter')) {
  css += `\n\n@keyframes hud-enter {\n  0% { opacity: 0; transform: translateY(15px); }\n  100% { opacity: 1; transform: translateY(0); }\n}\n`;
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('Added hud-enter to index.css');
}

let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');
if (home.includes('@keyframes hud-enter')) {
  home = home.replace(/@keyframes hud-enter {\s*0% { opacity: 0; transform: translateY\(15px\); }\s*100% { opacity: 1; transform: translateY\(0\); }\s*}/g, '');
  fs.writeFileSync('src/pages/Home.tsx', home, 'utf8');
  console.log('Removed hud-enter from Home.tsx');
}
