const fs = require('fs');

let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Development Vision') && lines[i-1].includes('Star size') && lines[i-3].includes('marginBottom: \'3rem\'')) {
    lines[i-3] = lines[i-3].replace('marginBottom: \'3rem\'', 'height: \'100%\', boxSizing: \'border-box\'');
  }
}

fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
