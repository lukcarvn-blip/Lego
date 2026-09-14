const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Add user to useStore
const targetUseStore = `const { products, updateProduct, addToCart, t, language, formatPrice, showToast, settings } = useStore();`;
const newUseStore = `const { products, updateProduct, addToCart, t, language, formatPrice, showToast, settings, user } = useStore();`;
if (code.includes(targetUseStore)) code = code.replace(targetUseStore, newUseStore);
else console.log("useStore target not found");

// 2. Add state
const targetState = `  const [isSummaryOpen, setIsSummaryOpen] = useState(false);`;
const newState = `  const [isSummaryOpen, setIsSummaryOpen] = useState(false);\n  const [isReviewOverlayOpen, setIsReviewOverlayOpen] = useState(false);`;
if (code.includes(targetState)) code = code.replace(targetState, newState);
else if (code.includes(targetState.replace(/\\r\\n/g, '\\n'))) code = code.replace(targetState.replace(/\\r\\n/g, '\\n'), newState.replace(/\\r\\n/g, '\\n'));
else console.log("State target not found");

// 3. Add Review Button
const targetTitle = `              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>{product.name[language]}</h1>\r
            </div>`;
const newTitle = `              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>{product.name[language]}</h1>\r
              \r
              <button \r
                onClick={() => setIsReviewOverlayOpen(true)}\r
                style={{\r
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',\r
                  padding: '0.25rem 0.5rem', background: 'transparent',\r
                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)',\r
                  cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0\r
                }}\r
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}\r
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}\r
              >\r
                <div style={{ display: 'flex', color: '#fbbf24', fontSize: '1rem', letterSpacing: '1px' }}>★★★★★</div>\r
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>12 Review</span>\r
              </button>\r
            </div>`;

if (code.includes(targetTitle)) code = code.replace(targetTitle, newTitle);
else if (code.includes(targetTitle.replace(/\\r\\n/g, '\\n'))) code = code.replace(targetTitle.replace(/\\r\\n/g, '\\n'), newTitle.replace(/\\r\\n/g, '\\n'));
else console.log("Title target not found");

// 4. Add Review Overlay inside material-size-wrapper
const targetMatWrapper = `<div className="material-size-wrapper">`;
const newMatWrapper = `<div className="material-size-wrapper" style={{ position: 'relative' }}>\r
            <AnimatePresence>\r
              {isReviewOverlayOpen && (\r
                <motion.div \r
                  initial={{ opacity: 0, scale: 0.95 }}\r
                  animate={{ opacity: 1, scale: 1 }}\r
                  exit={{ opacity: 0, scale: 0.95 }}\r
                  style={{\r
                    position: 'absolute', inset: 0, zIndex: 50,\r
                    background: 'var(--color-bg)', \r
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--color-accent)',\r
                    padding: '1.5rem', display: 'flex', flexDirection: 'column',\r
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'\r
                  }}\r
                >\r
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>\r
                    <h3 style={{ margin: 0, color: 'var(--color-accent)' }}>{language === 'vi' ? 'Đánh giá sản phẩm' : 'Product Reviews'}</h3>\r
                    <button onClick={() => setIsReviewOverlayOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>\r
                  </div>\r
                  \r
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>\r
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>\r
                      <div style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '4px' }}>★★★★★</div>\r
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#ddd' }}>"Sản phẩm cực kỳ chi tiết, in 3D không tì vết. Đáng từng đồng!"</p>\r
                      <small style={{ color: 'var(--color-text-muted)' }}>- Nguyễn Văn A</small>\r
                    </div>\r
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>\r
                      <div style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '4px' }}>★★★★★</div>\r
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#ddd' }}>"Màu sắc giống hình 100%, đóng gói hộp mica xịn xò."</p>\r
                      <small style={{ color: 'var(--color-text-muted)' }}>- Trần B</small>\r
                    </div>\r
                  </div>\r
\r
                  <div style={{ marginTop: '1.5rem' }}>\r
                    {user ? (\r
                      <div style={{ display: 'flex', gap: '0.5rem' }}>\r
                        <input type="text" placeholder={language === 'vi' ? 'Viết đánh giá của bạn...' : 'Write your review...'} style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />\r
                        <button style={{ padding: '0 1.5rem', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{language === 'vi' ? 'Gửi' : 'Submit'}</button>\r
                      </div>\r
                    ) : (\r
                      <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px dashed #ef4444', borderRadius: '8px' }}>\r
                        <p style={{ margin: '0 0 0.5rem 0', color: '#ef4444', fontWeight: 600 }}>{language === 'vi' ? 'Vui lòng đăng nhập để đánh giá' : 'Please login to review'}</p>\r
                        <button onClick={() => navigate('/auth')} style={{ padding: '0.5rem 1.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{language === 'vi' ? 'ĐĂNG NHẬP' : 'LOGIN'}</button>\r
                      </div>\r
                    )}\r
                  </div>\r
                </motion.div>\r
              )}\r
            </AnimatePresence>`;

if (code.includes(targetMatWrapper)) code = code.replace(targetMatWrapper, newMatWrapper);
else console.log("Mat wrapper target not found");

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Added review overlay');
