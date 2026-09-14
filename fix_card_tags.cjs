const fs = require('fs');

let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const oldLine = `<div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>`;
const newLine = `<div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: '0.5rem', marginBottom: '0.4rem', width: '100%', overflow: 'hidden' }}>`;

const oldCategoryBadge = `<span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>`;
const newCategoryBadge = `<span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1, minWidth: 0 }}>`;

const oldCollectionBadge = `<span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: col.bg || 'rgba(255,255,255,0.1)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, color: col.color || '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>`;
const newCollectionBadge = `<span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: col.bg || 'rgba(255,255,255,0.1)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, color: col.color || '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1, minWidth: 0 }}>`;

if (code.includes(oldLine)) {
  code = code.replace(oldLine, newLine);
  code = code.replace(oldCategoryBadge, newCategoryBadge);
  code = code.replace(oldCollectionBadge, newCollectionBadge);
  
  // Also we need to wrap the text inside the spans with another span so text-overflow works properly on the text while keeping the icon visible?
  // Actually text-overflow works if the inline-flex container is constrained. But the icon might squish.
  // Let's protect the icon with flexShrink: 0.
  code = code.replace(/<Shield size=\{12\} \/>/g, '<Shield size={12} style={{ flexShrink: 0 }} />');
  code = code.replace(/<Rocket size=\{12\} \/>/g, '<Rocket size={12} style={{ flexShrink: 0 }} />');
  code = code.replace(/<Crown size=\{12\} \/>/g, '<Crown size={12} style={{ flexShrink: 0 }} />');
  code = code.replace(/<Tag size=\{12\} \/>/g, '<Tag size={12} style={{ flexShrink: 0 }} />');
  code = code.replace(/<IconComponent size=\{10\} \/>/g, '<IconComponent size={10} style={{ flexShrink: 0 }} />');
  
  // Wrap {product.category} and {col.name} in a span that truncates
  code = code.replace(/\{product\.category\}/g, `<span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.category}</span>`);
  code = code.replace(/\{col\.name\}/g, `<span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.name}</span>`);
  
  fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
  console.log('Updated ProductCard.tsx tags to nowrap');
} else {
  console.log('Could not find oldLine in ProductCard.tsx');
}
