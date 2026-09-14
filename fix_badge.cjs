const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const targetStr = `<p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>`;
const newStr = `<span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>`;

const endTarget = `</p>
              
              {product.collection`;
const endNew = `</span>
              
              {product.collection`;

if (code.includes(targetStr) && code.includes('</p>')) {
    code = code.replace(targetStr, newStr);
    code = code.replace(/<\/p>\r?\n\s+\{product\.collection/, '</span>\n              \n              {product.collection');
    fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
    console.log("Success");
} else {
    console.log("Could not find targets");
}
