const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const oldBtn = `            <button \r
              className="mobile-add-cart-btn"\r
              onClick={(e) => {\r
                e.preventDefault();\r
                const defaultSize = product.availableSizes?.[0] || 'Size 400';\r
                addToCart(product, defaultSize, 'PLA', 1, e);\r
                showToast(language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!');\r
              }}\r
            >\r
              <ShoppingCart size={16} />\r
              {language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}\r
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

let codeN = code.replace(/\\r\\n/g, '\\n');
const oldN = `            <button 
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

if (codeN.includes(oldN)) {
    code = codeN.replace(oldN, newBtn);
    fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
    console.log("Success");
} else {
    console.log("Failed");
}
