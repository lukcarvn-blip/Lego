const fs = require('fs');

// --- 1. Modify ProductCard.tsx ---
let cardCode = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

// Add destructuring
cardCode = cardCode.replace(
  'const { language, formatPrice, addToCart, showToast, settings } = useStore();',
  'const { language, formatPrice, addToCart, showToast, settings, user, saveCharacter, unsaveCharacter } = useStore();'
);

// Add button to the pill
const pillTarget = `<ShoppingCart size={16} />Mua ngay\n                </Link>`;
const saveButtonCard = `                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const isSaved = user?.savedCharacters?.includes(product.id);
                    if (isSaved) unsaveCharacter(product.id);
                    else saveCharacter(product.id);
                  }}
                  title={language === 'vi' ? 'Lưu sản phẩm' : 'Save product'}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px', background: user?.savedCharacters?.includes(product.id) ? 'rgba(74,222,128,0.2)' : 'rgba(0,0,0,0.7)', border: user?.savedCharacters?.includes(product.id) ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.15)', color: user?.savedCharacters?.includes(product.id) ? 'var(--color-accent)' : 'white', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(e: any) => {
                    if (!user?.savedCharacters?.includes(product.id)) e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseOut={(e: any) => {
                    if (!user?.savedCharacters?.includes(product.id)) e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
                  }}
                >
                  <Heart size={20} fill={user?.savedCharacters?.includes(product.id) ? 'var(--color-accent)' : 'none'} />
                </button>`;

cardCode = cardCode.replace(pillTarget, pillTarget + '\n' + saveButtonCard);
fs.writeFileSync('src/components/ProductCard.tsx', cardCode, 'utf8');


// --- 2. Modify ProductDetails.tsx ---
let detailsCode = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Find the Heart button block in ProductDetails and remove it from its current position
const heartStart = detailsCode.indexOf('{/* Heart Button */}');
const heartEnd = detailsCode.indexOf('</>', heartStart); // it ends before the </> of the fragment

if (heartStart !== -1 && heartEnd !== -1) {
  const heartCode = detailsCode.substring(heartStart, heartEnd);
  detailsCode = detailsCode.substring(0, heartStart) + detailsCode.substring(heartEnd);
  
  // Now we need to insert it into the Horizontal Slider Counter pill, OR create a new pill at the bottom
  // The horizontal slider counter is:
  // {/* Horizontal Slider Counter (PC Only) */}
  
  const sliderStart = detailsCode.indexOf('{/* Horizontal Slider Counter (PC Only) */}');
  
  // Wait, if displayImages.length <= 1, the slider counter doesn't render!
  // It's better to just put the save button in a floating pill at the bottom right or center.
  // The user said "góc phải trên ảnh ra đây" (move it to here).
  // "Here" in their screenshot was the bottom center pill.
  // I will just add the save button into a bottom center pill in ProductDetails.tsx as well!
  
  // Let's replace the old Heart button code with a new bottom-center floating button if there's no slider, 
  // or put it next to the slider.
  
  // Let's just create a unified bottom pill for ProductDetails:
}
