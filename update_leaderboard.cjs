const fs = require('fs');
let code = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf8');

// 1. Increase width from 900px to 1200px
code = code.replace("maxWidth: '900px'", "maxWidth: '1200px'");

// 2. Replace the header portion
const oldHeader = `{/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: col.color, fontWeight: 700, marginBottom: '0.25rem' }}>
                        {language === 'vi' ? 'BỘ SƯU TẬP' : 'COLLECTION'}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{col.name}</h3>
                    </div>
                    
                    {/* Total Fans */}`;

const newHeader = `{/* Info */}
                    <div style={{ width: '220px', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: col.color, fontWeight: 700, marginBottom: '0.25rem' }}>
                        {language === 'vi' ? 'BỘ SƯU TẬP' : 'COLLECTION'}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.name}</h3>
                    </div>
                    
                    {/* Character Avatars */}
                    <div className="leaderboard-avatars-mobile-hide" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {col.products.slice(0, 5).map((char: any, i: number) => (
                          <div 
                            key={char.id} 
                            style={{ 
                              width: '46px', 
                              height: '46px', 
                              borderRadius: '50%', 
                              border: '2px solid var(--glass-bg)', 
                              marginLeft: i > 0 ? '-15px' : '0',
                              zIndex: 5 - i,
                              overflow: 'hidden',
                              background: '#000',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                              position: 'relative'
                            }}
                            title={char.name[language as keyof typeof char.name]}
                          >
                            <img src={char.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                        {col.products.length > 5 && (
                          <div style={{ 
                              width: '46px', 
                              height: '46px', 
                              borderRadius: '50%', 
                              border: '2px solid var(--glass-bg)', 
                              marginLeft: '-15px',
                              zIndex: 0,
                              background: 'var(--color-bg-alt)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: 'var(--color-text-muted)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                          }}>
                            +{col.products.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Total Fans */}`;

// Normalize line endings for replacement
const normalizeRegex = (str) => {
  return str.replace(/[\\r\\n\\s]+/g, '\\s*').replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
};

const oldHeaderRegex = new RegExp(oldHeader.replace(/[\\r\\n\\s]+/g, '\\s*').replace(/[.*+?^$|()\[\]{}]/g, '\\$&'));
// The simple replace might fail if spaces don't match, let's just do a manual index search or use the exact string
code = code.split(oldHeader).join(newHeader);
// If split/join failed, try with normalized spaces (hacky but works)
if (code.indexOf("leaderboard-avatars-mobile-hide") === -1) {
  console.log("Fallback to regex replacement...");
  // ... build regex 
  const regexStr = oldHeader.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&').replace(/\\s+/g, '\\s+');
  code = code.replace(new RegExp(regexStr), newHeader);
}

fs.writeFileSync('src/pages/Leaderboard.tsx', code, 'utf8');
console.log("Updated Leaderboard.tsx");
