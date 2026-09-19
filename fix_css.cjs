const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/align-items:\s*center;\s*\/\*\s*Or flex-start\s*\*\//g, 'align-items: start;');
css = css.replace(/align-items:\s*center;/g, 'align-items: start;');

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Fixed CSS align items');
