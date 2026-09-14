const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Add state for pagination
if (!code.includes('reviewPage')) {
  code = code.replace(
    `const [isReviewOverlayOpen, setIsReviewOverlayOpen] = useState(false);`,
    `const [isReviewOverlayOpen, setIsReviewOverlayOpen] = useState(false);\n  const [reviewPage, setReviewPage] = useState(1);`
  );
}

// 2. The new reviews block
const oldBlock = `{isReviewOverlayOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    position: 'absolute', inset: 0, zIndex: 50,
                    background: 'var(--color-bg)', 
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--color-accent)',
                    padding: '1.5rem', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--color-accent)' }}>{language === 'vi' ? 'Đánh giá sản phẩm' : 'Product Reviews'}</h3>
                    <button onClick={() => setIsReviewOverlayOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
                  </div>
                  
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <div style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '4px' }}>★★★★★</div>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#ddd' }}>"Sản phẩm cực kỳ chi tiết, in 3D không tì vết. Đáng từng đồng!"</p>
                      <small style={{ color: 'var(--color-text-muted)' }}>- Nguyễn Văn A</small>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <div style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '4px' }}>★★★★★</div>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#ddd' }}>"Màu sắc giống hình 100%, đóng gói hộp mica xịn xò."</p>
                      <small style={{ color: 'var(--color-text-muted)' }}>- Trần B</small>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem' }}>
                    {user ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="text" placeholder={language === 'vi' ? 'Viết đánh giá của bạn...' : 'Write your review...'} style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                        <button style={{ padding: '0 1.5rem', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{language === 'vi' ? 'Gửi' : 'Submit'}</button>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px dashed #ef4444', borderRadius: '8px' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#ef4444', fontWeight: 600 }}>{language === 'vi' ? 'Vui lòng đăng nhập để đánh giá' : 'Please login to review'}</p>
                        <button onClick={() => navigate('/auth')} style={{ padding: '0.5rem 1.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{language === 'vi' ? 'ĐĂNG NHẬP' : 'LOGIN'}</button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}`;

const newBlock = `{isReviewOverlayOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsReviewOverlayOpen(false)}
                    style={{
                      position: 'fixed', inset: 0, zIndex: 40,
                      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)'
                    }}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
                      background: 'var(--color-bg)', 
                      borderRadius: 'var(--radius-md)', border: '1px solid var(--color-accent)',
                      padding: '1.5rem', display: 'flex', flexDirection: 'column',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0, color: 'var(--color-accent)' }}>{language === 'vi' ? 'Đánh giá sản phẩm' : 'Product Reviews'}</h3>
                      <button onClick={() => setIsReviewOverlayOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {[
                        { name: 'Nguyễn Văn A', cmt: 'Sản phẩm cực kỳ chi tiết, in 3D không tì vết. Đáng từng đồng!' },
                        { name: 'Trần B', cmt: 'Màu sắc giống hình 100%, đóng gói hộp mica xịn xò.' },
                        { name: 'Hoàng C', cmt: 'Shop đóng gói siêu cẩn thận, giao hàng cũng nhanh nữa. Perfect!' },
                        { name: 'Lê D', cmt: 'Chất lượng in 3D rất tốt, nhựa cứng cáp, lên màu đẹp.' },
                        { name: 'Phạm E', cmt: 'Hơi nhỏ so với mình nghĩ nhưng độ chi tiết thì khỏi bàn.' }
                      ].slice((reviewPage - 1) * 3, reviewPage * 3).map((r, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                          <div style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '4px' }}>★★★★★</div>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#ddd' }}>"{r.cmt}"</p>
                          <small style={{ color: 'var(--color-text-muted)' }}>- {r.name}</small>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                      <button 
                        disabled={reviewPage === 1} 
                        onClick={() => setReviewPage(p => p - 1)}
                        style={{ padding: '4px 12px', background: reviewPage === 1 ? 'rgba(255,255,255,0.1)' : 'var(--color-accent)', color: reviewPage === 1 ? '#888' : '#000', borderRadius: '4px', border: 'none', cursor: reviewPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                      >&lt;</button>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{reviewPage} / 2</span>
                      <button 
                        disabled={reviewPage === 2} 
                        onClick={() => setReviewPage(p => p + 1)}
                        style={{ padding: '4px 12px', background: reviewPage === 2 ? 'rgba(255,255,255,0.1)' : 'var(--color-accent)', color: reviewPage === 2 ? '#888' : '#000', borderRadius: '4px', border: 'none', cursor: reviewPage === 2 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                      >&gt;</button>
                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                      {user ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input type="text" placeholder={language === 'vi' ? 'Viết đánh giá của bạn...' : 'Write your review...'} style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                          <button style={{ padding: '0 1.5rem', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{language === 'vi' ? 'Gửi' : 'Submit'}</button>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px dashed #ef4444', borderRadius: '8px' }}>
                          <p style={{ margin: '0 0 0.5rem 0', color: '#ef4444', fontWeight: 600 }}>{language === 'vi' ? 'Vui lòng đăng nhập để đánh giá' : 'Please login to review'}</p>
                          <button onClick={() => navigate('/auth')} style={{ padding: '0.5rem 1.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{language === 'vi' ? 'ĐĂNG NHẬP' : 'LOGIN'}</button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}`;

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
} else {
  // try replacing line endings
  code = code.replace(oldBlock.replace(/\n/g, '\r\n'), newBlock);
}

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Updated Review block');
