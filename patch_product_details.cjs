const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Add states
const statesAnchor = `const [reviewPage, setReviewPage] = useState(1);`;
const newStates = `const [reviewPage, setReviewPage] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);`;
if (code.includes(statesAnchor)) {
  code = code.replace(statesAnchor, newStates);
}

// 2. Add onSubmit function
const funcsAnchor = `const handleCloseReview = () => {`;
const newFuncs = `const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;
    setIsSubmittingReview(true);
    await addReview({
      productId: product.id,
      userId: user?.uid || '',
      userName: user?.displayName || 'Ẩn danh',
      userAvatar: user?.photoURL || undefined,
      rating: reviewRating,
      content: reviewContent
    });
    setReviewContent('');
    setReviewRating(5);
    setIsSubmittingReview(false);
  };

  const handleCloseReview = () => {`;
if (code.includes(funcsAnchor)) {
  code = code.replace(funcsAnchor, newFuncs);
}

// 3. Extract productReviews from reviews
const extractAnchor = `const productReviews = reviews ? reviews.filter(r => r.productId === product.id && r.status === 'APPROVED') : [];
  const averageRating = productReviews.length > 0 ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1) : '5.0';`;
  
// I need to add this where? Let's just put it right after the states.
code = code.replace(newStates, newStates + '\n  const productReviews = reviews ? reviews.filter(r => r.productId === product.id && r.status === \'APPROVED\') : [];\n  const averageRating = productReviews.length > 0 ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1) : \'5.0\';');

// 4. Update the "12 Review" text on the button
code = code.replace(/12 Review/g, `{productReviews.length} Review`);
// Also need to fix the stars if possible, but for now just replacing the text is good.

// 5. Replace the mock reviews UI with the real one
const oldReviewsBlockRegex = /<div style=\{\{ display: 'flex', flexDirection: 'column', gap: '1rem' \}\}>[\s\S]*?\&gt;<\/button>\s*<\/div>/;

const newReviewsBlock = `<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {productReviews.length === 0 ? (
                          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Chưa có đánh giá nào.' : 'No reviews yet.'}</p>
                        ) : (
                          productReviews.slice((reviewPage - 1) * 3, reviewPage * 3).map((r) => (
                            <div key={r.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                              <div style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '4px' }}>
                                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                              </div>
                              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#ddd' }}>"{r.content}"</p>
                              <small style={{ color: 'var(--color-text-muted)' }}>- {r.userName} • {new Date(r.createdAt).toLocaleDateString()}</small>
                            </div>
                          ))
                        )}
                      </div>
  
                      {productReviews.length > 3 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                          <button 
                            disabled={reviewPage === 1} 
                            onClick={() => setReviewPage(p => p - 1)}
                            style={{ padding: '4px 12px', background: reviewPage === 1 ? 'rgba(255,255,255,0.1)' : 'var(--color-accent)', color: reviewPage === 1 ? '#888' : '#000', borderRadius: '4px', border: 'none', cursor: reviewPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                          >&lt;</button>
                          <span style={{ fontSize: '0.9rem' }}>{reviewPage} / {Math.ceil(productReviews.length / 3)}</span>
                          <button 
                            disabled={reviewPage === Math.ceil(productReviews.length / 3)} 
                            onClick={() => setReviewPage(p => p + 1)}
                            style={{ padding: '4px 12px', background: reviewPage === Math.ceil(productReviews.length / 3) ? 'rgba(255,255,255,0.1)' : 'var(--color-accent)', color: reviewPage === Math.ceil(productReviews.length / 3) ? '#888' : '#000', borderRadius: '4px', border: 'none', cursor: reviewPage === Math.ceil(productReviews.length / 3) ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                          >&gt;</button>
                        </div>
                      )}

                      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <h4 style={{ margin: '0 0 1rem 0' }}>{language === 'vi' ? 'Viết đánh giá của bạn' : 'Write a review'}</h4>
                        {!user ? (
                          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Vui lòng đăng nhập để đánh giá sản phẩm này.' : 'Please login to review this product.'}</p>
                            <button onClick={() => { handleCloseReview(); document.getElementById('auth-btn')?.click(); }} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                              {language === 'vi' ? 'Đăng nhập' : 'Login'}
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.9rem' }}>{language === 'vi' ? 'Điểm đánh giá:' : 'Rating:'}</span>
                              {[1,2,3,4,5].map(star => (
                                <span 
                                  key={star} 
                                  onClick={() => setReviewRating(star)}
                                  style={{ cursor: 'pointer', color: star <= reviewRating ? '#fbbf24' : '#444', fontSize: '1.25rem' }}
                                >★</span>
                              ))}
                            </div>
                            <textarea
                              value={reviewContent}
                              onChange={(e) => setReviewContent(e.target.value)}
                              placeholder={language === 'vi' ? 'Nhập nội dung đánh giá...' : 'Write your review here...'}
                              rows={3}
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                              required
                            />
                            <button type="submit" disabled={isSubmittingReview || !reviewContent.trim()} className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.5rem 1.5rem', opacity: (isSubmittingReview || !reviewContent.trim()) ? 0.5 : 1 }}>
                              {isSubmittingReview ? '...' : (language === 'vi' ? 'Gửi đánh giá' : 'Submit Review')}
                            </button>
                          </form>
                        )}
                      </div>`;

code = code.replace(oldReviewsBlockRegex, newReviewsBlock);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Patched ProductDetails reviews');
