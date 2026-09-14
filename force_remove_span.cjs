const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const startAnchor = `                      <span style={{ 
                        fontWeight: 700,
                        minWidth: '60px', textAlign: 'right'
                      }}>`;
let startIdx = code.indexOf(startAnchor.replace(/\\n/g, '\\r\\n'));
if (startIdx === -1) startIdx = code.indexOf(startAnchor);

if (startIdx !== -1) {
    let endIdx = code.indexOf('</span>', startIdx);
    code = code.substring(0, startIdx) + code.substring(endIdx + 7);
    fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
    console.log("Remaining span removed");
} else {
    console.log("Not found");
}
