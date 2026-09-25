const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const regex = /<div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '3rem' }}>([\s\S]*?)<Star size={24} \/>/g;
code = code.replace(regex, `<div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', height: '100%', boxSizing: 'border-box' }}>$1<Star size={24} />`);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
