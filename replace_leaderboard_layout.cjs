const fs = require('fs');
let lines = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf8').split('\n');

const startIdx = lines.findIndex(l => l.includes('padding: \'0 1.5rem 1.5rem 1.5rem\', display: \'flex\', flexDirection: \'column\''));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('</motion.div>'));

if (startIdx === -1 || endIdx === -1) {
  console.log('Could not find boundaries');
  process.exit(1);
}

const replacement = `                        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem', paddingTop: '1.5rem' }}>
                          {col.products.map(char => (
                            <div 
                              key={char.id}
                              onClick={() => navigate(\`/product/\${char.id}\`)}
                              style={{ 
                                display: 'flex', flexDirection: 'column', 
                                background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid var(--glass-border)',
                                cursor: 'pointer', transition: 'all 0.3s', overflow: 'hidden', position: 'relative'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                              {/* Card Image */}
                              <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', overflow: 'hidden' }}>
                                <img src={char.images[0]} alt={char.name[language as keyof typeof char.name]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
                                
                                {/* Fan Badge over image */}
                                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '20px', border: '1px solid rgba(251, 191, 36, 0.5)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>
                                  <Star size={14} fill="#fbbf24" /> {char.likes?.toLocaleString()}
                                </div>
                                
                                {/* Alignment Badge over image */}
                                {char.alignment && (
                                  <div style={{ 
                                    position: 'absolute', top: '10px', left: '10px', 
                                    background: char.alignment === 'Hero' ? 'rgba(59, 130, 246, 0.8)' : (char.alignment === 'Villain' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(168, 162, 158, 0.8)'),
                                    backdropFilter: 'blur(4px)', padding: '4px', borderRadius: '50%', color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)', width: '28px', height: '28px'
                                  }} title={language === 'vi' ? (char.alignment === 'Hero' ? 'Chính diện' : (char.alignment === 'Villain' ? 'Phản diện' : 'Trung lập')) : char.alignment.toUpperCase()}>
                                    {char.alignment === 'Hero' ? <Shield size={14} /> : (char.alignment === 'Villain' ? <Crosshair size={14} /> : <HelpCircle size={14} />)}
                                  </div>
                                )}
                              </div>
                              
                              {/* Card Body */}
                              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.2, textAlign: 'center' }}>
                                  {char.name[language as keyof typeof char.name]}
                                </h4>
                                
                                {/* Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '8px' }}>
                                      <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{language === 'vi' ? 'Sức mạnh' : 'Power'}</span>
                                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '2px' }}><Zap size={14} /> {char.powerRanking || '??'}</span>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{language === 'vi' ? 'Phe' : 'Align'}</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: char.alignment === 'Hero' ? '#3b82f6' : (char.alignment === 'Villain' ? '#ef4444' : '#a8a29e'), display: 'flex', alignItems: 'center', gap: '2px', height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                                        {char.alignment ? (language === 'vi' ? (char.alignment === 'Hero' ? 'Chính' : (char.alignment === 'Villain' ? 'Tà' : 'Trung')) : char.alignment.substring(0,4).toUpperCase()) : '?'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>`;

lines.splice(startIdx, endIdx - startIdx, replacement);

fs.writeFileSync('src/pages/Leaderboard.tsx', lines.join('\n'), 'utf8');
console.log('Replaced layout successfully');
