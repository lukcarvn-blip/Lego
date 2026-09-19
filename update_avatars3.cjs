const fs = require('fs');
let code = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf8');

const regex = /<div className="leaderboard-avatars-mobile-hide"[^>]*>[\s\S]*?\{col\.products\.length > 5[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
// Wait, the end is:
//                           </div>
//                         )}
//                       </div>
//                     </div>

const tightRegex = /<div className="leaderboard-avatars-mobile-hide"[\s\S]*?\+\{col\.products\.length - 5\}\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>/;

const newBlock = `<div className="leaderboard-avatars-mobile-hide" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {col.products.slice(0, 10).map((char: any, i: number) => (
                          <div 
                            key={char.id} 
                            style={{ 
                              width: '46px', 
                              height: '46px', 
                              borderRadius: '10px', 
                              border: '1px solid rgba(255,255,255,0.15)', 
                              position: 'relative',
                              overflow: 'hidden',
                              background: '#000',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                              flexShrink: 0
                            }}
                            title={char.name[language as keyof typeof char.name]}
                          >
                            <img src={char.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              background: 'rgba(0,0,0,0.7)',
                              color: '#fbbf24',
                              fontSize: '0.6rem',
                              fontWeight: 900,
                              padding: '2px 4px',
                              borderBottomRightRadius: '6px',
                              zIndex: 2,
                              backdropFilter: 'blur(4px)'
                            }}>
                              #{i + 1}
                            </div>
                          </div>
                        ))}
                        {col.products.length > 10 && (
                          <div style={{ 
                              width: '46px', 
                              height: '46px', 
                              borderRadius: '10px', 
                              border: '1px solid rgba(255,255,255,0.1)', 
                              background: 'var(--color-bg-alt)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: 'var(--color-text-muted)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                          }}>
                            +{col.products.length - 10}
                          </div>
                        )}
                      </div>
                    </div>`;

if (code.match(tightRegex)) {
  code = code.replace(tightRegex, newBlock);
  fs.writeFileSync('src/pages/Leaderboard.tsx', code, 'utf8');
  console.log('Successfully replaced avatars block!');
} else {
  console.log('Failed to match!');
}
