const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const sizesTab = `
          <button 
            onClick={() => setProductSubTab('sizes')} 
            style={{ 
              background: productSubTab === 'sizes' ? 'var(--color-accent)' : 'transparent', 
              color: productSubTab === 'sizes' ? '#000' : 'var(--color-text-muted)', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px', 
              cursor: 'pointer', 
              fontWeight: 600, 
              whiteSpace: 'nowrap',
              transition: 'all 0.2s' 
            }}
          >
            Hệ thống Size
          </button>`;

code = code.replace(/(onClick=\{\(\) => setProductSubTab\('collections'\)\}[\s\S]*?<\/button>)/, '$1\n' + sizesTab);
fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
console.log('Added sizes tab button');
