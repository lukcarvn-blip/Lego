const fs = require('fs');

// ProductDetails.tsx
let pdCode = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Use context functions instead of inline functions
pdCode = pdCode.replace(
  'const { products, addToCart, language, formatPrice, settings } = useStore();',
  'const { products, addToCart, language, formatPrice, settings, getSizeMultiplier, getSizeDetails: getStoreSizeDetails } = useStore();'
);

// Remove getSizeDetails inline func
pdCode = pdCode.replace(/const getSizeDetails = [\s\S]*?scale: 0\.8 };\n};\n/, '');

// Remove parseSizePercentage inline func
pdCode = pdCode.replace(/const parseSizePercentage = [\s\S]*?num \/ 400;\n};\n/, '');

// Replace parseSizePercentage usage
pdCode = pdCode.replace(/parseSizePercentage\(selectedSize\)/g, 'getSizeMultiplier(selectedSize)');

// Replace getSizeDetails usage
pdCode = pdCode.replace(/const sizeDetails = getSizeDetails\(selectedSize \|\| ''\);/g, `const sizeDetails = getStoreSizeDetails(selectedSize || '');`);
pdCode = pdCode.replace(/\{sizeDetails\.height\}/g, '{sizeDetails?.heightCm ? `${sizeDetails.heightCm} cm` : ""}');
pdCode = pdCode.replace(/scale=\{sizeDetails\.scale\}/g, 'scale={sizeDetails?.scaleGraphic || 0.8}');
pdCode = pdCode.replace(/\{sizeDetails\.label\}/g, '{sizeDetails?.name || ""}');

fs.writeFileSync('src/pages/ProductDetails.tsx', pdCode, 'utf8');

// Cart.tsx
let cartCode = fs.readFileSync('src/pages/Cart.tsx', 'utf8');
cartCode = cartCode.replace(
  'const { cart, removeFromCart, updateOrder, createOrder, formatPrice, language, showToast, t } = useStore();',
  'const { cart, removeFromCart, updateOrder, createOrder, formatPrice, language, showToast, t, getSizeMultiplier } = useStore();'
);
cartCode = cartCode.replace(/const parseSizePercentage = [\s\S]*?num \/ 400;\n  };\n/, '');
cartCode = cartCode.replace(/parseSizePercentage\(item\.size\)/g, 'getSizeMultiplier(item.size)');
fs.writeFileSync('src/pages/Cart.tsx', cartCode, 'utf8');

console.log('Updated Cart and ProductDetails');
