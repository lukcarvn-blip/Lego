const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const newCSS = `
.community-leaderboard-section {
  width: 100%;
  margin-bottom: 4rem;
}
.community-footer-split {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 4rem;
}
.community-footer-policies, .community-footer-request {
  width: 100%;
}
@media (min-width: 1024px) {
  .community-footer-split {
    flex-direction: row;
    gap: 4rem;
    align-items: stretch;
  }
  .community-footer-policies, .community-footer-request {
    flex: 1;
    min-width: 0;
  }
}
`;

fs.appendFileSync('src/index.css', newCSS, 'utf8');
console.log('Appended footer layout to index.css');
