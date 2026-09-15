const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Dispatch event
code = code.replace(/heart-burst/g, 'star-burst');

// 2. Replace Heart button
const oldButton = `                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  style={{
                    position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 30,
                    background: isLiked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)',
                    borderRadius: '50%', width: '44px', height: '44px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', backdropFilter: 'blur(5px)', transition: 'all 0.2s'
                  }}
                >
                  <Heart size={20} color={isLiked ? '#ef4444' : '#fff'} fill={isLiked ? '#ef4444' : 'none'} />
                </motion.button>`;

const newButton = `                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  style={{
                    position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 30,
                    background: isLiked ? 'rgba(245, 158, 11, 0.9)' : 'rgba(0,0,0,0.6)', 
                    border: isLiked ? '1px solid #fbbf24' : '1px solid var(--glass-border)',
                    borderRadius: '20px', padding: '8px 12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    cursor: 'pointer', backdropFilter: 'blur(5px)', transition: 'all 0.2s',
                    boxShadow: isLiked ? '0 0 15px rgba(245, 158, 11, 0.5)' : 'none'
                  }}
                >
                  <Star size={16} color="#fff" fill={isLiked ? '#fff' : 'none'} />
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{language === 'vi' ? 'Fan Cứng' : 'Top Fan'}</span>
                </motion.button>`;

code = code.replace(oldButton, newButton);

// 3. Replace Heart counter
const oldCounter = `<Heart size={18} fill="currentColor" />
                <span style={{ color: 'var(--color-text)' }}>{(product.likes || 0) * 2}</span>`;
const newCounter = `<Star size={18} fill="currentColor" />
                <span style={{ color: 'var(--color-text)' }}>{(product.likes || 0) * 2} Fan</span>`;
code = code.replace(oldCounter, newCounter);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed Fan Cung button');
