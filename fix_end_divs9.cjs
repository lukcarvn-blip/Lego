const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// I will just use a regex to replace the last </div> with nothing.
const lastDivIdx = code.lastIndexOf('</div>');
if (lastDivIdx > -1) {
    code = code.substring(0, lastDivIdx) + code.substring(lastDivIdx + 6);
    fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
    console.log('Removed last </div>');
}
