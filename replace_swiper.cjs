const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const s = code.indexOf('className="leaderboard-coverflow-swiper"');
const e = code.indexOf('</Swiper>', s);

if(s !== -1 && e !== -1) {
  const replacement = `className="leaderboard-coverflow-swiper"
                          >
                          {(() => {
                            let displayProducts = col.products.map((p: any, i: number) => ({...p, rank: i + 1}));
                            displayProducts.push({ isRequestCard: true, id: \`request-\${col.name}\` });

                            if (displayProducts.length > 0 && displayProducts.length < 10) {
                              const original = [...displayProducts];
                              while (displayProducts.length < 10) {
                                displayProducts = [...displayProducts, ...original];
                              }
                            }
                            return displayProducts.map((char: any, idx: number) => (
                              <SwiperSlide key={\`\${char.id}-\${idx}\`} style={{ width: '280px', height: 'auto' }}>
                              {({ isActive }) => (
                                char.isRequestCard ? (
                                  <div onClick={() => {
                                      document.querySelector('.community-request-side')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="request-card-bg fan-cung-shine"
                                    style={{ 
                                      display: 'flex', flexDirection: 'column', 
                                      width: '100%', minHeight: '420px', height: '100%',
                                      borderRadius: '16px', border: '1px solid var(--color-accent)',
                                      cursor: 'pointer', transition: 'all 0.3s', overflow: 'hidden', position: 'relative',
                                      alignItems: 'center', textAlign: 'center', padding: '1.5rem'
                                    }}
                                  >
                                    <MessageSquarePlus size={32} color="var(--color-accent)" style={{ marginBottom: '1rem', zIndex: 10 }} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', zIndex: 10, textTransform: 'uppercase' }}>
                                      <Star size={16} fill="var(--color-accent)" />
                                      {language === 'vi' ? 'Fan Cứng' : 'Top Fan'}
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem', zIndex: 10, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                      {language === 'vi' ? 'NHÂN VẬT TIẾP THEO?' : 'NEXT CHARACTER?'}
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', zIndex: 10, padding: '0 0.5rem' }}>
                                      {language === 'vi' ? 'Hãy trở thành FAN CỨNG và gửi yêu cầu cho chúng tôi' : 'Become a TOP FAN and send us your request'}
                                    </p>

                                    {/* Lego Silhouette */}
                                    <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '66%', zIndex: 1, opacity: 0.15 }}>
                                      <svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                                        <rect x="35" y="10" width="30" height="25" rx="5" fill="#fff" />
                                        <rect x="42" y="5" width="16" height="5" rx="2" fill="#fff" />
                                        <path d="M 25 40 L 75 40 L 85 90 L 15 90 Z" fill="#fff" />
                                        <rect x="20" y="92" width="25" height="50" rx="3" fill="#fff" />
                                        <rect x="55" y="92" width="25" height="50" rx="3" fill="#fff" />
                                        <path d="M 20 45 Q 5 60 10 80" stroke="#fff" strokeWidth="12" strokeLinecap="round" fill="none" />
                                        <path d="M 80 45 Q 95 60 90 80" stroke="#fff" strokeWidth="12" strokeLinecap="round" fill="none" />
                                        <text x="50" y="70" fill="var(--color-accent)" fontSize="50" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">?</text>
                                      </svg>
                                    </div>

                                    {/* Button */}
                                    <button style={{ position: 'absolute', bottom: '1.5rem', left: '10%', width: '80%', padding: '0.8rem', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', zIndex: 10, cursor: 'pointer', boxShadow: '0 4px 10px rgba(74, 222, 128, 0.3)' }}>
                                      {language === 'vi' ? 'Gửi Yêu Cầu' : 'Submit Request'}
                                    </button>
                                  </div>
                                ) : (
                                  <div onClick={() => isActive && navigate(\`/product/\${char.id}\`)}
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
                                      
                                      {/* Rank Badge */}
                                      <div style={{ 
                                        position: 'absolute', top: '10px', left: '10px', zIndex: 10,
                                        background: 'var(--color-accent)', color: '#000',
                                        width: '32px', height: '32px', borderRadius: '8px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                      }}>
                                        #{char.rank}
                                      </div>

                                      {/* Alignment Badge over image */}
                                      {char.alignment && (
                                        <div style={{ 
                                          position: 'absolute', top: '48px', left: '10px', 
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
                                )
                              )}
                              </SwiperSlide>
                            ))})()}
                          `;

  const newCode = code.substring(0, s) + replacement + code.substring(e);
  fs.writeFileSync('src/pages/Community.tsx', newCode, 'utf8');
  console.log("Successfully rebuilt Swiper logic");
}
