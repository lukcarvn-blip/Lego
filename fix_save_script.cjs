const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const regex1 = /const \{ products, updateProduct, addToCart, saveCharacter, unsaveCharacter, t, language, formatPrice, showToast, settings, user, reviews, orders, addReview, getSizeMultiplier, getSizeDetails: getStoreSizeDetails \} = useStore\(\);/g;
const replacement1 = 'const { products, updateProduct, addToCart, saveCharacter, unsaveCharacter, t, language, formatPrice, showToast, settings, user, reviews, orders, addReview, getSizeMultiplier, getSizeDetails: getStoreSizeDetails, loginWithGoogle } = useStore();';
code = code.replace(regex1, replacement1);

const p1 = code.indexOf("title={language === 'vi' ? 'Lưu bộ sưu tập' : 'Save to Collection'}");
if (p1 !== -1) {
  // We found the button. Now search backwards for onClick={
  const onClickPos = code.lastIndexOf('onClick={', p1);
  if (onClickPos !== -1) {
    const endPos = code.indexOf('}}', onClickPos);
    if (endPos !== -1) {
      const originalOnClick = code.substring(onClickPos, endPos + 2);
      console.log('Found onClick:', originalOnClick);
      
      const newOnClick = `onClick={(e) => {
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
      
      code = code.substring(0, onClickPos) + newOnClick + code.substring(endPos + 2);
      fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
      console.log('Saved ProductDetails.tsx');
    }
  }
} else {
  console.log("Could not find title='Lưu bộ sưu tập'");
}
