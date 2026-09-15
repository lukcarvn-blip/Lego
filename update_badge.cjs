const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const oldCollectionBadge = `              const IconComponent = Icons[col.iconName as keyof typeof Icons] as any || Icons.Folder;
              return (
                <div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', width: '75px', height: '75px', background: col.bg || 'rgba(255,255,255,0.1)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, color: col.color || '#fff', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textTransform: 'uppercase', pointerEvents: 'auto', textAlign: 'center' }}>
                  <IconComponent size={24} />
                  <span style={{ lineHeight: 1.1 }}>{col.name}</span>
                </div>
              );`;

const newCollectionBadge = `              const IconComponent = Icons[col.iconName as keyof typeof Icons] as any || Icons.Folder;
              return (
                <div className="hover-jump" 
                  onClick={(e) => {
                    if (e && e.clientX) {
                      window.dispatchEvent(new CustomEvent('star-burst', { detail: { x: e.clientX, y: e.clientY } }));
                      handleLike();
                    }
                  }}
                  style={{ cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', width: '75px', height: '75px', background: col.bg || 'rgba(255,255,255,0.1)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, color: col.color || '#fff', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textTransform: 'uppercase', pointerEvents: 'auto', textAlign: 'center' }}
                >
                  <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#f59e0b', borderRadius: '50%', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-bg)', zIndex: 10, boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)' }}>
                     <Icons.Star size={12} color="#fff" fill="#fff" />
                  </div>
                  <IconComponent size={24} />
                  <span style={{ lineHeight: 1.1 }}>{col.name}</span>
                </div>
              );`;

code = code.replace(oldCollectionBadge, newCollectionBadge);
fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Updated Collection Badge');
