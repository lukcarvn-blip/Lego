const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');
const lines = code.split('\n');

let startSize = lines.findIndex(l => l.includes('const getSizeDetails = '));
if (startSize > -1) {
  let endSize = lines.findIndex((l, i) => i > startSize && l === '};');
  if (endSize > -1) lines.splice(startSize, endSize - startSize + 1);
}

let startParse = lines.findIndex(l => l.includes('const parseSizePercentage = '));
if (startParse > -1) {
  let endParse = lines.findIndex((l, i) => i > startParse && l === '};');
  if (endParse > -1) lines.splice(startParse, endParse - startParse + 1);
}

code = lines.join('\n');

code = code.replace(
  'const { products, updateProduct, addToCart, t, language, formatPrice, showToast, settings, user, reviews, addReview } = useStore();',
  'const { products, updateProduct, addToCart, t, language, formatPrice, showToast, settings, user, reviews, addReview, getSizeMultiplier, getSizeDetails: getStoreSizeDetails } = useStore();'
);

code = code.split('parseSizePercentage(').join('getSizeMultiplier(');
code = code.split('getSizeDetails(').join('getStoreSizeDetails(');
code = code.split('.scale').join('?.scaleGraphic');
code = code.split('{sizeDetails?.height}').join('{sizeDetails?.heightCm ? `${sizeDetails.heightCm} cm` : ""}');
code = code.split('{sizeDetails?.label}').join('{sizeDetails?.name || ""}');
code = code.split('Math.max(...product.availableSizes.map(s => getStoreSizeDetails(s)?.scaleGraphic))').join('Math.max(...product.availableSizes.map(s => getStoreSizeDetails(s)?.scaleGraphic || 1))');

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Done fixing ProductDetails');
