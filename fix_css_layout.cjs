const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// just use replace with regex for the whole block
css = css.replace(/@media \(min-width: 1024px\) \{\s*\.community-top-split \{\s*grid-template-columns: 1fr 1fr;/m, 
`@media (min-width: 1024px) {
  .community-top-split {
    grid-template-columns: 4fr 6fr;`);

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Fixed CSS regex');
