const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

const regex = /<button\s+onClick=\{\(\) => setActiveTab\('saved_carts'\)\}.*?<\/button>/s;
const match = code.match(regex);
if (match) {
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
    
    code = code.replace(regex, match[0] + addition);
    fs.writeFileSync('src/pages/Profile.tsx', code, 'utf8');
    console.log('Button added properly');
} else {
    console.log('Regex missed');
}
