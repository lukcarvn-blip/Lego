const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');
const lines = code.split('\n');

for (let i = 590; i <= 605; i++) {
  if (lines[i] && lines[i].includes('))}')) {
    lines[i] = lines[i].replace('))}', ');})}');
    break;
  }
}

fs.writeFileSync('src/pages/Home.tsx', lines.join('\n'), 'utf8');
console.log('Fixed line 600 closing bracket by iterating');
