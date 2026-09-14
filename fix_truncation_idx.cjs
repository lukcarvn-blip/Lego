const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const n = s => s.replace(/\\r\\n/g, '\\n');
code = n(code);

// 1. Mobile progress text overlay block:
const target1 = `                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px' }}>
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

const target1_replacement = `                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}</span>
                    </span>`;

let idx1 = code.indexOf(target1);
if (idx1 !== -1) {
    code = code.substring(0, idx1) + target1_replacement + code.substring(idx1 + target1.length);
}

const target2 = `                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      padding: '0 0.75rem', fontSize: '0.7rem',`;
const target2_replacement = `                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex', justifyContent: 'center', alignItems: 'center', 
                      padding: '0 0.5rem', fontSize: '0.7rem',`;
let idx2 = code.indexOf(target2);
if (idx2 !== -1) {
    code = code.substring(0, idx2) + target2_replacement + code.substring(idx2 + target2.length);
}


// 2. Mobile add to cart button:
const btnTarget = `            {/* Mobile Add to Cart Button */}
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

const btnReplacement = `            {/* Mobile Add to Cart Button */}
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

let btnIdx = code.indexOf(btnTarget);
if (btnIdx !== -1) {
    code = code.substring(0, btnIdx) + btnReplacement + code.substring(btnIdx + btnTarget.length);
}

fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
console.log(idx1, idx2, btnIdx);
