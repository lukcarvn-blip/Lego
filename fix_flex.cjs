const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const target = `  .pd-title-col {
    flex: 0 0 80%;
    max-width: 80%;
  }
  .pd-review-btn {
    flex: 0 0 20%;
    max-width: 20%;`;

const replacement = `  .pd-title-col {
    flex: 8;
    min-width: 0;
  }
  .pd-review-btn {
    flex: 2;
    min-width: 0;`;

if (code.includes('flex: 0 0 80%')) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/index.css', code, 'utf8');
    console.log('Fixed index.css flex layout.');
} else {
    console.log('Target not found in index.css');
}
