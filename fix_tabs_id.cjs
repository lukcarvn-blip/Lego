const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const target = "<div style={{ marginTop: '2.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>";
const replacement = "<div id=\"product-tabs-section\" style={{ marginTop: '2.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>";

code = code.replace(target, replacement);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Tabs ID added');
