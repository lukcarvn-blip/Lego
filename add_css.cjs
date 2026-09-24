const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const newCSS = `
.community-header-split {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 4rem;
}
.community-header-intro, .community-header-vision {
  width: 100%;
}
@media (min-width: 1024px) {
  .community-header-split {
    flex-direction: row;
    gap: 4rem;
    align-items: stretch;
  }
  .community-header-intro, .community-header-vision {
    flex: 1;
    min-width: 0;
  }
}
`;

// Append to file
fs.appendFileSync('src/index.css', newCSS, 'utf8');
console.log('Appended layout to index.css');
