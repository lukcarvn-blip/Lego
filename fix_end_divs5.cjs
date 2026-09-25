const fs = require('fs');
let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('</div>')) {
        lines.splice(i, 1);
        break;
    }
}
fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
