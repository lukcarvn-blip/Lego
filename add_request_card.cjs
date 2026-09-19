const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const target1 = `let displayProducts = col.products.map((p: any, i: number) => ({...p, rank: i + 1}));
                            if (displayProducts.length > 0 && displayProducts.length < 10) {`;

const replacement1 = `let displayProducts = col.products.map((p: any, i: number) => ({...p, rank: i + 1}));
                            displayProducts.push({ isRequestCard: true, id: \`request-\${col.name}\` });
                            if (displayProducts.length > 0 && displayProducts.length < 10) {`;

code = code.replace(target1, replacement1);

const target2 = `{({ isActive }) => (
                                <div onClick={() => isActive && navigate(\`/product/\${char.id}\`)}
                                style={{ 
                                  display: 'flex', flexDirection: 'column', `;

const replacement2 = `{({ isActive }) => (
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
                                    <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '66%', zIndex: 1, opacity: 0.2 }}>
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
                                  display: 'flex', flexDirection: 'column', `;

code = code.replace(target2, replacement2);

// Close the ternary operator at the end of SwiperSlide
const target3 = `</div>
                            )}
                            </SwiperSlide>`;

const replacement3 = `</div>
                                )
                            )}
                            </SwiperSlide>`;

code = code.replace(target3, replacement3);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Added request card logic to Swiper');
