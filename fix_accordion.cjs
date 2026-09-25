const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// The first one is at line 1496:
// <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
// The second one is at line 1568:
// style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}

code = code.replace(
  '<div className="glass-panel" style={{ padding: \'2.5rem\', borderRadius: \'16px\' }}>',
  '<div className="glass-panel" style={{ padding: \'1.5rem\', borderRadius: \'16px\' }}>'
);

code = code.replace(
  `style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}`,
  `className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}`
);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Synchronized accordion panel styles.');
