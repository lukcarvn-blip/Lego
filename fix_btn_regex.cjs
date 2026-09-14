const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const n = s => s.replace(/\\r\\n/g, '\\n');
code = n(code);

code = code.replace(
    /<ShoppingCart size=\{16\} \/>\\n\\s*\{language === 'vi' \? 'THÊM VÀO GIỎ' : 'ADD TO CART'\}\\n\\s*<\/button>/g,
    \`<ShoppingCart size={16} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}
              </span>
            </button>\`
);

code = code.replace(/className="mobile-add-cart-btn"\\n\\s*onClick=\\{\\(e\\)/g, 
\`className="mobile-add-cart-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', overflow: 'hidden' }}
              onClick={(e)\`);

fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
console.log("Replaced with regex");
