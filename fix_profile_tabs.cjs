const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

const target = `            <button 
              onClick={() => setActiveTab('saved_carts')}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'saved_carts' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'saved_carts' ? 'white' : 'var(--color-text-muted)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <ShoppingCart size={20} />
              {language === 'vi' ? 'Giỏ hàng đang lưu' : 'Saved Carts'}
              {savedCarts.length > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ff9800', color: '#000', padding: '0.15rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {savedCarts.length}
                </span>
              )}
            </button>`;

const addition = `
            <button 
              onClick={() => setActiveTab('universe')}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'universe' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'universe' ? 'white' : 'var(--color-text-muted)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <Gift size={20} />
              {language === 'vi' ? 'Bộ sưu tập đã lưu' : 'Saved Collection'}
              {(user.savedCharacters?.length || 0) > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--color-accent)', color: '#000', padding: '0.15rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {user.savedCharacters.length}
                </span>
              )}
            </button>`;

code = code.replace(target, target + addition);
fs.writeFileSync('src/pages/Profile.tsx', code, 'utf8');
console.log('Added Saved Collection tab');
