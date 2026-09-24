const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const regex = /\.community-top-split \{[\s\S]*?\.community-request-side \{\s*width: 100%;\s*\}/;

const replacement = `.community-main-layout {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 4rem;
}
.community-left-col, .community-right-col {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
@media (min-width: 1024px) {
  .community-main-layout {
    flex-direction: row;
    gap: 4rem;
    align-items: flex-start;
  }
  .community-left-col {
    flex: 4;
    min-width: 0;
  }
  .community-right-col {
    flex: 6;
    min-width: 0;
  }
}
.community-intro-side {
  width: 100%;
}
.community-leaderboard-side {
  width: 100%;
}
.community-policies-side {
  width: 100%;
}
.community-request-side {
  width: 100%;
}`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/index.css', code, 'utf8');
  console.log('Fixed index.css');
} else {
  console.log('Regex did not match.');
}
