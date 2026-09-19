const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// Replace the opening of the top section
const oldTopOpening = `<div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center", marginBottom: "4rem" }}>`;
const newTopOpening = `<div className="community-top-split">
            <div className="community-intro-side">`;

code = code.replace(oldTopOpening, newTopOpening);

// The end of intro texts and start of leaderboard:
const oldMiddle = `          </div>

          {/* Bảng xếp hạng */}`;
const newMiddle = `            </div>
            
            <div className="community-leaderboard-side">
              {/* Bảng xếp hạng */}`;

code = code.replace(oldMiddle, newMiddle);

// The header of Bảng xếp hạng has marginTop: '4rem', let's remove it because we use CSS gap
code = code.replace(`marginTop: '4rem'`, `marginTop: 0`);

// The end of the leaderboard section:
const oldEnd = `        </div>
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Exclusive Policies */}`;
const newEnd = `        </div>
            </div>
          </div>

          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Exclusive Policies */}`;

// Let's use regex to be safe about the end
const endRegex = /<\/div>\s*<\/div>\s*<div style=\{\{ maxWidth: '1200px', margin: '0 auto' \}\}>\s*\{\/\* Exclusive Policies \*\/\}/;
code = code.replace(endRegex, `</div>\n            </div>\n          </div>\n\n          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>\n          {/* Exclusive Policies */}`);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Replaced structure in Community.tsx');

// CSS append
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('.community-top-split')) {
  css += `
.community-top-split {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}
@media (min-width: 1024px) {
  .community-top-split {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }
}
.community-intro-side {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}
.community-leaderboard-side {
  width: 100%;
  min-width: 0;
}
`;
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('Appended CSS to index.css');
}
