const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// I will just replace the exact segment from line 339 to the end of the file.
// Or I can match the two blocks.
const match = code.match(/<div style=\{\{ maxWidth: '1200px', margin: '0 auto' \}\}>\s*\{\/\* Exclusive Policies \*\/\}[\s\S]*?<\/form>\s*\)\}\s*<\/div>\s*<\/div>/);
if (!match) {
  console.log("Match not found");
  process.exit(1);
}

let chunk = match[0];

// Policies block
const pMatch = chunk.match(/<div style=\{\{ maxWidth: '1200px', margin: '0 auto' \}\}>\s*(\{\/\* Exclusive Policies \*\/\}[\s\S]*?)\s*<\/div>\s*<\/div>\s*<div style=\{\{ maxWidth: "800px", margin: "0 auto" \}\}>/);
if (!pMatch) { console.log("pMatch not found"); process.exit(1); }
let policies = pMatch[1];
// adjust minmax to 200px and bottom margin to 0 for half width
policies = policies.replace("minmax(250px", "minmax(200px");
policies = policies.replace("marginBottom: '4rem'", "marginBottom: '0'");

// Request form block
const rMatch = chunk.match(/<div style=\{\{ maxWidth: "800px", margin: "0 auto" \}\}>\s*(\{\/\* Request Form \*\/\}[\s\S]*?<\/form>\s*\)\}\s*<\/div>)\s*<\/div>/);
if (!rMatch) { console.log("rMatch not found"); process.exit(1); }
let requestForm = rMatch[1];

const newChunk = `<div className="community-bottom-split">
            <div className="community-request-side">
              ${requestForm}
            </div>
            <div className="community-policies-side">
              ${policies}
            </div>
          </div>`;

code = code.replace(match[0], newChunk);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log("Swapped successfully");

// Now update CSS
let css = fs.readFileSync('src/index.css', 'utf8');
css += `
.community-bottom-split {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}
@media (min-width: 1024px) {
  .community-bottom-split {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
  }
}
.community-request-side {
  width: 100%;
}
.community-policies-side {
  width: 100%;
}
`;
fs.writeFileSync('src/index.css', css, 'utf8');
console.log("Updated CSS");
