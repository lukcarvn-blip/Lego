const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const regex = /\{\!user \? \([\s\S]*?className=\"btn-primary\" style=\{\{ padding: '0\.5rem 1rem' \}\}\>[\s\S]*?<\/button>[\s\S]*?<\/div>[\s\S]*?\) : \(/m;

const replacement = `{(() => {
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

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    
    // Replace the end
    const endRegex = /(<form onSubmit=\{handleSubmitReview\}[\s\S]*?<\/form>\s*)\)\}/m;
    const endMatch = code.match(endRegex);
    if (endMatch) {
        code = code.replace(endRegex, endMatch[1] + ");\n                        })()}");
        fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
        console.log('Successfully updated review logic');
    } else {
        console.log('End regex failed');
    }
} else {
    console.log('Start regex failed');
}
