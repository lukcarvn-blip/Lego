const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldBlock = `<div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                            padding: '2rem 1.5rem 1.5rem',
                            display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 1
                          }}>
                            <h3 style={{ color: 'white', margin: 0, fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {product.name[language as keyof typeof product.name]}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span style={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                {formatPrice(product.price, product.discountPercentage).current}
                              </span>
                              <span style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through', fontSize: '0.9rem' }}>
                                {formatPrice(product.price).original}
                              </span>
                            </div>
                          </div>`;

const newBlock = `{product.collection && settings.collections?.find(c => c.name === product.collection) && (() => {
                            const col = settings.collections.find(c => c.name === product.collection)!;
                            const IconComponent = (Icons as any)[col.iconName] || Icons.Folder;
                            return (
                              <div style={{ position: 'absolute', bottom: '15px', left: '15px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', width: '60px', height: '60px', background: col.bg || 'rgba(255,255,255,0.1)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, color: col.color || '#fff', borderRadius: '10px', fontSize: '0.45rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', textTransform: 'uppercase', pointerEvents: 'none', textAlign: 'center' }}>
                                <IconComponent size={20} />
                                <span style={{ lineHeight: 1.1 }}>{col.name}</span>
                              </div>
                            );
                          })()}`;

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
  console.log('Successfully updated Flash Sale banner');
} else {
  console.log('Could not find oldBlock. Let me try regex.');
  // Regex approach
  const regex = /<div style=\{\{\s*position: 'absolute', bottom: 0, left: 0, right: 0,\s*background: 'linear-gradient.*?<\/div>\s*<\/div>/s;
  if (regex.test(code)) {
      code = code.replace(regex, newBlock);
      fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
      console.log('Successfully updated Flash Sale banner with regex');
  } else {
      console.log('Regex also failed');
  }
}
