const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const mobileBadgeCss = `
@media (max-width: 768px) {
  .flash-badge-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3cqh;
  }
  .flash-badge {
    width: 28cqh;
    height: 28cqh;
    border-radius: 4cqh;
  }
  .flash-badge svg {
    width: 10cqh;
    height: 10cqh;
  }
  .flash-badge-text {
    font-size: 3.2cqh;
  }
  .flash-badge-subtext {
    font-size: 2.2cqh;
  }
  .flash-badge-3d-wrapper {
    width: 8cqh;
    height: 8cqh;
  }
  .flash-badge-3d-front {
    font-size: 2.6cqh;
    transform: translateZ(4cqh);
  }
  .flash-badge-3d-side {
    font-size: 1.8cqh;
    transform: rotateY(90deg) translateZ(4cqh);
  }
  .flash-badge-3d-top {
    transform: rotateX(90deg) translateZ(4cqh);
  }
}
`;

// Insert it right after the existing flash-badge-3d-top block
const insertionPoint = css.indexOf('.flash-badge-3d-top {');
if (insertionPoint !== -1) {
  const blockEnd = css.indexOf('}', insertionPoint);
  if (blockEnd !== -1) {
    const before = css.substring(0, blockEnd + 1);
    const after = css.substring(blockEnd + 1);
    css = before + '\n' + mobileBadgeCss + after;
    fs.writeFileSync('src/index.css', css, 'utf8');
    console.log('Appended mobile flash badge CSS');
  }
}
