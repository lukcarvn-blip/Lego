const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');
const lines = code.split('\n');

const start = lines.findIndex(l => l.includes('Icons.Maximize size={22}'));
if (start !== -1) {
    const newInner = `                  <span style={{ lineHeight: 1.1 }}>{details?.heightCm ? \`\${details.heightCm}cm\` : ''}</span>`;
    lines.splice(start + 1, 11, newInner);
    
    if (lines[start - 1].includes("fontSize: '0.55rem'")) {
        lines[start - 1] = lines[start - 1].replace("fontSize: '0.55rem'", "fontSize: '0.85rem'");
    }
    
    fs.writeFileSync('src/pages/ProductDetails.tsx', lines.join('\n'), 'utf8');
    console.log('Fixed Size Badge using array splice');
} else {
    console.log('Not found!');
}
