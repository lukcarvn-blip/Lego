const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const t1 = '<Zap size={32} color="var(--color-accent)" className="flash-shake" />';
const parts = code.split(t1);
if (parts.length > 1) {
  const p2 = parts[1].replace('FLASH SALE', '<span className="lightning-text">FLASH SALE</span>');
  code = parts[0] + t1 + p2;
  const t2 = `<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>`;
  const t2_repl = `<div className="lightning-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.5rem', borderRadius: '8px', position: 'relative', marginLeft: '-1.5rem' }}>`;
  code = code.replace(t2, t2_repl);
  fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
  console.log('Replaced!');
}
