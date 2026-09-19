const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const regex = /<motion\.button\s*onClick=\{toggleSaveToCollection\}[^]*?<\/motion\.button>/m;
const match = code.match(regex);
if (match) {
    const replacement = `                <motion.button 
                  onClick={toggleSaveToCollection}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ 
                    position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10,
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
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
    console.log('Regex replace success');
} else {
    console.log('Regex not matched');
}
