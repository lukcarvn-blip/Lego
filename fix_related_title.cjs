const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const oldTitle = `              {language === 'vi' ? 'Sản Phẩm Liên Quan' : 'Related Products'}`;

const newTitle = `              {(() => {
                const sameCategory = products.filter(p => p.category === product.category && p.id !== product.id);
                return sameCategory.length > 0
                  ? (language === 'vi' ? 'Sản Phẩm Liên Quan' : 'Related Products')
                  : (language === 'vi' ? 'Sản Phẩm Hàng Sẵn' : 'In Stock Products');
              })()}`;

if (code.includes(oldTitle)) {
  code = code.replace(oldTitle, newTitle);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('Successfully updated related products title');
} else {
  console.log('Anchor not found');
}
