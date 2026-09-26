const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Add loginWithGoogle to destructuring
code = code.replace(/const { products, updateProduct, addToCart, saveCharacter, unsaveCharacter, t, language, formatPrice, showToast, settings, user, reviews, orders, addReview, getSizeMultiplier, getSizeDetails: getStoreSizeDetails } = useStore\(\);/, 
'const { products, updateProduct, addToCart, saveCharacter, unsaveCharacter, t, language, formatPrice, showToast, settings, user, reviews, orders, addReview, getSizeMultiplier, getSizeDetails: getStoreSizeDetails, loginWithGoogle } = useStore();');

// Find the save button onClick and update it
const target = `                  onClick={() => {
                    const isSaved = user?.savedCharacters?.includes(product.id);
                    if (isSaved) {
                      unsaveCharacter(product.id);
                    } else {
                      saveCharacter(product.id);
                    }
                  }}`;

const replacement = `                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      loginWithGoogle();
                      return;
                    }
                    const isSaved = user?.savedCharacters?.includes(product.id);
                    if (isSaved) {
                      unsaveCharacter(product.id);
                    } else {
                      saveCharacter(product.id);
                    }
                  }}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('Fixed ProductDetails save button');
} else {
  console.log('Target not found in ProductDetails.tsx');
}
