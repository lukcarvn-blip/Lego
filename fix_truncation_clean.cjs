const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const n = s => s.replace(/\\r\\n/g, '\\n');
code = n(code);

// 1. Mobile progress padding/justify
const oldProg1 = `                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      padding: '0 0.75rem', fontSize: '0.7rem',`;
const newProg1 = `                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex', justifyContent: 'center', alignItems: 'center', 
                      padding: '0 0.5rem', fontSize: '0.7rem',`;
code = code.replace(oldProg1, newProg1);

// 2. Mobile progress text & ellipsis
const oldProg2 = `                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px' }}>
                      <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} />
                      {language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}
                    </span>
                    <span style={{ 
                      fontWeight: 700,
                      minWidth: '60px', textAlign: 'right'
                    }}>
                      {craftHovered
                        ? \`\${displayDay} \${language === 'vi' ? 'ngày' : 'days'}\`
                        : product.estimatedPrintTime.replace('days', language === 'vi' ? 'ngày' : 'days')
                      }
                    </span>`;
const newProg2 = `                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}</span>
                    </span>`;
code = code.replace(oldProg2, newProg2);

// 3. Mobile add to cart btn
const oldBtn = `            <button 
              className="mobile-add-cart-btn"
              onClick={(e) => {
                e.preventDefault();
                const defaultSize = product.availableSizes?.[0] || 'Size 400';
                addToCart(product, defaultSize, 'PLA', 1, e);
                showToast(language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!');
              }}
            >
              <ShoppingCart size={16} />
              {language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}
            </button>`;
const newBtn = `            <button 
              className="mobile-add-cart-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', overflow: 'hidden' }}
              onClick={(e) => {
                e.preventDefault();
                const defaultSize = product.availableSizes?.[0] || 'Size 400';
                addToCart(product, defaultSize, 'PLA', 1, e);
                showToast(language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!');
              }}
            >
              <ShoppingCart size={16} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}
              </span>
            </button>`;
code = code.replace(oldBtn, newBtn);

fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
console.log("Replaced with single script");
