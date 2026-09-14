const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const oldCollectionBadge = `<div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: col.bg || 'rgba(255,255,255,0.1)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, color: col.color || '#fff', padding: '6px 16px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 800, backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textTransform: 'uppercase', pointerEvents: 'none' }}>
                  <IconComponent size={16} />
                  {col.name}
                </div>`;

const newCollectionBadge = `<div title={col.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', background: col.bg || 'rgba(255,255,255,0.1)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, color: col.color || '#fff', borderRadius: '12px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', pointerEvents: 'auto', cursor: 'help' }}>
                  <IconComponent size={20} />
                </div>`;

const oldCategoryBadge = `<div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, backdropFilter: 'blur(4px)', pointerEvents: 'none' }}>
                <Icons.Tag size={12} />
                {product.category.toUpperCase()}
              </div>`;

const newCategoryBadge = `<div title={product.category.toUpperCase()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '12px', backdropFilter: 'blur(4px)', pointerEvents: 'auto', cursor: 'help' }}>
                <Icons.Tag size={20} />
              </div>`;

if (code.includes(oldCollectionBadge)) {
  code = code.replace(oldCollectionBadge, newCollectionBadge);
} else {
  console.log("oldCollectionBadge not found. Let's try fallback.");
}

if (code.includes(oldCategoryBadge)) {
  code = code.replace(oldCategoryBadge, newCategoryBadge);
} else {
  console.log("oldCategoryBadge not found. Let's try fallback.");
}

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Made badges 1:1 square with rounded corners');
