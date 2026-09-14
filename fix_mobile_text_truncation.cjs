const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const n = s => s.replace(/\\r\\n/g, '\\n');
code = n(code);

// 1. Fix the mobile progress bar text
const oldMobileProgress = `                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      padding: '0 0.75rem', fontSize: '0.7rem',
                      color: craftHovered ? '#fff' : 'rgba(255,255,255,0.7)',
                      fontWeight: 600,
                      transition: 'color 0.3s ease',
                      zIndex: 1,
                      textShadow: craftHovered ? '0 1px 2px rgba(0,0,0,0.8)' : 'none'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px' }}>
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
                      </span>
                    </div>`;

const newMobileProgress = `                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex', justifyContent: 'center', alignItems: 'center', 
                      padding: '0 0.5rem', fontSize: '0.7rem',
                      color: craftHovered ? '#fff' : 'rgba(255,255,255,0.7)',
                      fontWeight: 600,
                      transition: 'color 0.3s ease',
                      zIndex: 1,
                      textShadow: craftHovered ? '0 1px 2px rgba(0,0,0,0.8)' : 'none'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}</span>
                      </span>
                    </div>`;

// 2. Fix the Mobile Add to Cart Button text
const oldMobileBtn = `            {/* Mobile Add to Cart Button */}
            <button 
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

const newMobileBtn = `            {/* Mobile Add to Cart Button */}
            <button 
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

let changed = false;

if (code.includes(oldMobileProgress)) {
    code = code.replace(oldMobileProgress, newMobileProgress);
    changed = true;
    console.log("Replaced mobile progress");
} else {
    console.log("Failed to find mobile progress");
}

if (code.includes(oldMobileBtn)) {
    code = code.replace(oldMobileBtn, newMobileBtn);
    changed = true;
    console.log("Replaced mobile btn");
} else {
    console.log("Failed to find mobile btn");
}

if (changed) {
    fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
}
