const fs = require('fs');
let code = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf8');

const originalAvatarsStr = `<div className="leaderboard-avatars-mobile-hide" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2rem' }}>
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
                    </div>`;

const newAvatarsStr = `<div className="leaderboard-avatars-mobile-hide" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2rem' }}>
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

// Safely escape and replace
code = code.split(originalAvatarsStr).join(newAvatarsStr);

fs.writeFileSync('src/pages/Leaderboard.tsx', code, 'utf8');
console.log('Successfully applied accurate replacement.');
