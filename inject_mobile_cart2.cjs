const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const regex = /              <\/div>\r?\n            \)}\r?\n          <\/div>\r?\n          <\/div>\r?\n        \)}\r?\n      <\/div>/;

const newCode = `              </div>
            )}
            
            {/* Mobile Add to Cart Button */}
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
            </button>
          </div>
          </div>
        )}
      </div>`;

if (regex.test(code)) {
  code = code.replace(regex, newCode);
  fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
  console.log('Successfully injected mobile add-to-cart button into ProductCard');
} else {
  console.log('Regex not found');
}
