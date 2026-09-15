const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Add saveCharacter to useStore
code = code.replace('updateProduct, addToCart,', 'updateProduct, addToCart, saveCharacter, unsaveCharacter,');

// Update the top right button from "Fan Cứng" to "Thêm vào bộ sưu tập"
const oldButton = `                <motion.button 
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
                  onMouseEnter={e => { if (!isLiked) { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; } }}
                  onMouseLeave={e => { if (!isLiked) { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; } }}
                >
                  <Star size={16} color="#fff" fill={isLiked ? '#fff' : 'none'} />
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{language === 'vi' ? 'Fan Cứng' : 'Top Fan'}</span>
                </motion.button>`;

const newButton = `                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const isSaved = user?.savedCharacters?.includes(product.id);
                    if (isSaved) {
                      unsaveCharacter(product.id);
                    } else {
                      saveCharacter(product.id);
                    }
                  }}
                  style={{
                    position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 30,
                    background: user?.savedCharacters?.includes(product.id) ? 'rgba(36, 214, 115, 0.9)' : 'rgba(0,0,0,0.6)', 
                    border: user?.savedCharacters?.includes(product.id) ? '1px solid var(--color-accent)' : '1px solid var(--glass-border)',
                    borderRadius: '20px', padding: '8px 12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    cursor: 'pointer', backdropFilter: 'blur(5px)', transition: 'all 0.2s',
                    boxShadow: user?.savedCharacters?.includes(product.id) ? '0 0 15px rgba(36, 214, 115, 0.5)' : 'none'
                  }}
                  onMouseEnter={e => { if (!user?.savedCharacters?.includes(product.id)) { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; } }}
                  onMouseLeave={e => { if (!user?.savedCharacters?.includes(product.id)) { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; } }}
                >
                  <Gift size={16} color="#fff" />
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{language === 'vi' ? (user?.savedCharacters?.includes(product.id) ? 'Đã lưu' : 'Lưu bộ sưu tập') : (user?.savedCharacters?.includes(product.id) ? 'Saved' : 'Add to Collection')}</span>
                </motion.button>`;

code = code.replace(oldButton, newButton);

// Update Collection Badges
const oldCollectionBadge = `              {product.collections && product.collections.length > 0 && product.collections.map((col: any) => (
                <div key={col.name} className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '75px', height: '75px', background: col.bg || 'rgba(255,255,255,0.05)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.15)'}\`, color: col.color || 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center' }} onClick={() => navigate(col.path || '/')}>`;

const newCollectionBadge = `              {product.collections && product.collections.length > 0 && product.collections.map((col: any) => (
                <div key={col.name} className="hover-jump" 
                  onClick={(e) => {
                    // Trigger Fan Cung burst
                    if (e && e.clientX) {
                      window.dispatchEvent(new CustomEvent('star-burst', { detail: { x: e.clientX, y: e.clientY } }));
                      handleLike();
                    }
                  }}
                  style={{ cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '75px', height: '75px', background: col.bg || 'rgba(255,255,255,0.05)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.15)'}\`, color: col.color || 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center' }}>
                  {/* Fan Cung overlay icon */}
                  <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#f59e0b', borderRadius: '50%', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-bg)', zIndex: 10 }}>
                     <Star size={10} color="#fff" fill="#fff" />
                  </div>`;

code = code.replace(oldCollectionBadge, newCollectionBadge);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Updated ProductDetails.tsx');
