const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target1 = `<Zap size={32} color="var(--color-accent)" className="flash-shake" />\\r\\n              FLASH SALE\\r\\n              </div>`;
const replace1 = `<Zap size={32} color="var(--color-accent)" className="flash-shake" />\\r\\n              <span className="lightning-text">FLASH SALE</span>\\r\\n              </div>`;

const target2 = `<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>`;
const replace2 = `<div className="lightning-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.5rem', borderRadius: '8px', position: 'relative', marginLeft: '-1.5rem' }}>`;

let matched = false;

if (code.includes(target1.replace(/\\\\r\\\\n/g, '\\r\\n'))) {
    code = code.replace(target1.replace(/\\\\r\\\\n/g, '\\r\\n'), replace1.replace(/\\\\r\\\\n/g, '\\r\\n'));
    matched = true;
} else if (code.includes(target1.replace(/\\\\r\\\\n/g, '\\n'))) {
    code = code.replace(target1.replace(/\\\\r\\\\n/g, '\\n'), replace1.replace(/\\\\r\\\\n/g, '\\n'));
    matched = true;
}

if (matched) {
    if (code.includes(target2)) {
        code = code.replace(target2, replace2); // first match only
    }
    fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
    console.log('TSX updated');
} else {
    console.log('Not matched');
}
