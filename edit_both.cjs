const fs = require('fs');

// --- 1. Modify ProductCard.tsx ---
let cardCode = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

if (!cardCode.includes('saveCharacter, unsaveCharacter')) {
  cardCode = cardCode.replace(
    'const { language, formatPrice, addToCart, showToast, settings } = useStore();',
    'const { language, formatPrice, addToCart, showToast, settings, user, saveCharacter, unsaveCharacter } = useStore();'
  );
}

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

if (!cardCode.includes('Lưu sản phẩm')) {
  cardCode = cardCode.replace(pillTarget, pillTarget + '\n' + saveButtonCard);
  fs.writeFileSync('src/components/ProductCard.tsx', cardCode, 'utf8');
}


// --- 2. Modify ProductDetails.tsx ---
let detailsCode = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Find the Heart Button block and remove its absolute top/right positioning
// We will move it into a unified bottom pill.
const oldHeartBlock = `                {/* Heart Button */}
                
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const isSaved = user?.savedCharacters?.includes(product.id);
                    if (isSaved) {
                      unsaveCharacter(product.id);
                    } else {
                      saveCharacter(product.id);
                    }
                  }}
                  style={{
                    position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 30,
                    background: user?.savedCharacters?.includes(product.id) ? 'rgba(36, 214, 115, 0.9)' : 'rgba(0,0,0,0.6)', 
                    border: user?.savedCharacters?.includes(product.id) ? '1px solid var(--color-accent)' : '1px solid var(--glass-border)',
                    borderRadius: '50%', width: '40px', height: '40px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', backdropFilter: 'blur(5px)', transition: 'all 0.2s',
                    boxShadow: user?.savedCharacters?.includes(product.id) ? '0 0 15px rgba(36, 214, 115, 0.5)' : 'none'
                  }}
                  onMouseEnter={e => { if (!user?.savedCharacters?.includes(product.id)) { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; } }}
                  onMouseLeave={e => { if (!user?.savedCharacters?.includes(product.id)) { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; } }}
                  title={language === 'vi' ? 'Lưu bộ sưu tập' : 'Save to Collection'}
                >
                  {user?.savedCharacters?.includes(product.id) ? <Icons.Check size={20} color="#fff" /> : <Plus size={20} color="#fff" />}
                </motion.button>`;

if (detailsCode.includes('top: \'1.5rem\', right: \'1.5rem\'')) {
  // Replace the old button block with nothing for now
  detailsCode = detailsCode.replace(oldHeartBlock, '');

  // Now find the Slider Counter
  const sliderCounterStr = `{/* Horizontal Slider Counter (PC Only) */}`;
  const sliderIndex = detailsCode.indexOf(sliderCounterStr);
  
  // Create a new absolute bottom pill for the save button, placing it bottom-right or inside the center pill.
  // The user says "góc phải trên ảnh ra đây" (move it to here), where "here" is the control pill.
  // I will just put the save button at the bottom-right corner of the image in ProductDetails.
  
  const newSaveButton = `                {/* Save Button (Moved to bottom right) */}
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const isSaved = user?.savedCharacters?.includes(product.id);
                    if (isSaved) unsaveCharacter(product.id);
                    else saveCharacter(product.id);
                  }}
                  style={{
                    position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 30,
                    background: user?.savedCharacters?.includes(product.id) ? 'rgba(36, 214, 115, 0.9)' : 'rgba(0,0,0,0.6)', 
                    border: user?.savedCharacters?.includes(product.id) ? '1px solid var(--color-accent)' : '1px solid var(--glass-border)',
                    borderRadius: '50%', width: '40px', height: '40px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', backdropFilter: 'blur(5px)', transition: 'all 0.2s',
                    boxShadow: user?.savedCharacters?.includes(product.id) ? '0 0 15px rgba(36, 214, 115, 0.5)' : 'none'
                  }}
                  onMouseEnter={e => { if (!user?.savedCharacters?.includes(product.id)) { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; } }}
                  onMouseLeave={e => { if (!user?.savedCharacters?.includes(product.id)) { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; } }}
                  title={language === 'vi' ? 'Lưu bộ sưu tập' : 'Save to Collection'}
                >
                  {user?.savedCharacters?.includes(product.id) ? <Icons.Check size={20} color="#fff" /> : <Heart size={20} color="#fff" />}
                </motion.button>
`;
  
  // Insert it where the old one was (but with new positioning)
  detailsCode = detailsCode.substring(0, sliderIndex) + newSaveButton + detailsCode.substring(sliderIndex);
  
  fs.writeFileSync('src/pages/ProductDetails.tsx', detailsCode, 'utf8');
}
console.log("Done");
