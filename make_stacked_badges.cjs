const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const oldCollectionBadge = `<div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: col.bg || 'rgba(255,255,255,0.1)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, borderLeft: \`3px solid \${col.color || '#fff'}\`, color: col.color || '#fff', padding: '6px 14px', clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textTransform: 'uppercase', pointerEvents: 'none' }}>
                  <IconComponent size={14} />
                  {col.name}
                </div>`;

const newCollectionBadge = `<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', width: '75px', height: '75px', background: col.bg || 'rgba(255,255,255,0.1)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, color: col.color || '#fff', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textTransform: 'uppercase', pointerEvents: 'none', textAlign: 'center' }}>
                  <IconComponent size={24} />
                  <span style={{ lineHeight: 1.1 }}>{col.name}</span>
                </div>`;

const oldCategoryBadge = `<div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderLeft: '3px solid rgba(255,255,255,0.7)', color: 'rgba(255,255,255,0.9)', padding: '6px 14px', clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', backdropFilter: 'blur(12px)', pointerEvents: 'none' }}>
                <Icons.Tag size={14} />
                {product.category.toUpperCase()}
              </div>`;

const newCategoryBadge = `<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'none', textAlign: 'center' }}>
                <Icons.Layers size={24} />
                <span style={{ lineHeight: 1.1 }}>{product.category.toUpperCase()}</span>
              </div>`;

if (code.includes(oldCollectionBadge)) {
  code = code.replace(oldCollectionBadge, newCollectionBadge);
} else {
  console.log("oldCollectionBadge not found. Checking regex...");
}

if (code.includes(oldCategoryBadge)) {
  code = code.replace(oldCategoryBadge, newCategoryBadge);
} else {
  console.log("oldCategoryBadge not found. Checking regex...");
}

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Made badges 1:1 stacked square with text and updated category icon to Layers');
