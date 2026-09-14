const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const anchor = `                              e.preventDefault();
                              const pr = formatPrice(prod.price, prod.discountPercentage);
                              const currentPriceStr = typeof pr.current === 'string' ? pr.current : pr.current.props.children.join('');
                              const currentPrice = parseInt(currentPriceStr.replace(/[^0-9]/g, ''));
                              addToCart({ id: prod.id, name: prod.name, price: currentPrice, image: prod.images[0], quantity: 1 });
                              showToast(language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!', 'success');
                            }}`;

const newCode = `                              e.preventDefault();
                              const defaultSize = prod.availableSizes?.[0] || 'Size 400%';
                              const defaultMaterial = prod.availableMaterials?.[0] || 'PLA';
                              addToCart(prod, defaultSize, defaultMaterial, 1, e);
                              showToast(language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!');
                            }}`;

if (code.includes(anchor)) {
  code = code.replace(anchor, newCode);
  fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
  console.log('Successfully fixed addToCart in Home.tsx');
} else {
  console.log('Anchor not found for addToCart');
}
