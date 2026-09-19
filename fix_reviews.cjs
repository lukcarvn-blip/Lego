const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const target = `                        {!user ? (
                          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Vui lòng đăng nhập để đánh giá sản phẩm này.' : 'Please login to review this product.'}</p>
                            <button onClick={() => { handleCloseReview(); document.getElementById('auth-btn')?.click(); }} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                              {language === 'vi' ? 'Đăng nhập' : 'Login'}
                            </button>
                          </div>
                        ) : (`;

const replacement = `                        {(() => {
                          const hasPurchased = user && orders?.some(order => 
                            (order.userId === user.uid || order.customerName === user.email) && 
                            order.items.some(item => item.productId === product.id)
                          );
                          
                          if (!user) {
                            return (
                              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Vui lòng đăng nhập để đánh giá sản phẩm này.' : 'Please login to review this product.'}</p>
                                <button onClick={() => { handleCloseReview(); document.getElementById('auth-btn')?.click(); }} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                  {language === 'vi' ? 'Đăng nhập' : 'Login'}
                                </button>
                              </div>
                            );
                          }
                          
                          if (!hasPurchased) {
                            return (
                              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                <p style={{ margin: '0', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Chỉ những khách hàng đã mua sản phẩm này mới có thể viết đánh giá.' : 'Only customers who have purchased this product can write a review.'}</p>
                              </div>
                            );
                          }
                          
                          return (`;

if (code.includes(target)) {
    // We also need to change the closing brace of the ternary operator
    // The original code was:
    // ) : (
    //   <form>...</form>
    // )}
    // We change it to:
    // return (
    //   <form>...</form>
    // );
    // })()}
    
    code = code.replace(target, replacement);
    
    // Now find the closing of the form block
    const formRegex = /(<form onSubmit=\{handleSubmitReview\}.*?<\/form>\s*)\)\}/s;
    const match = code.match(formRegex);
    if (match) {
        code = code.replace(match[0], match[1] + ");\n                        })()}");
        fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
        console.log('Successfully updated review logic');
    } else {
        console.log('Could not find form closing');
    }
} else {
    console.log('Target not found');
}
