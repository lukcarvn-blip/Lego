const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
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
    align-items: start;
  }
}
.community-intro-side {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.community-leaderboard-side {
  width: 100%;
  min-width: 0;
}
`;
fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Appended proper CSS');
