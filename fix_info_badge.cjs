const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Add ID to tabs section
const tabsTarget = `<div style={{ marginTop: '2.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
            {/* Tab Headers */}`;
const tabsReplacement = `<div id="product-tabs-section" style={{ marginTop: '2.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
            {/* Tab Headers */}`;
if (code.includes(tabsTarget)) {
    code = code.replace(tabsTarget, tabsReplacement);
    console.log('Tabs section ID added');
}

// 2. Add Info Badge
const sizeBadgeEndRegex = /(\{\/\* Size Badge \*\/\}.*?\}\)\(\)\})/s;
const match = code.match(sizeBadgeEndRegex);
if (match) {
    const infoBadge = `
            {/* Info Badge (Scroll to tabs) */}
            <div 
              className="hover-jump" 
              onClick={() => {
                const tabsEl = document.getElementById('product-tabs-section');
                if (tabsEl) {
                  tabsEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              title={language === 'vi' ? 'Xem thông tin chi tiết' : 'View specifications'}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', width: 'auto', minWidth: '75px', height: '75px', padding: '0 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center', cursor: 'pointer' }}
            >
              <Icons.Info size={22} style={{ marginBottom: '2px' }} />
              <span style={{ fontSize: '0.55rem', lineHeight: 1.1 }}>{language === 'vi' ? 'CHI TIẾT' : 'INFO'}</span>
            </div>`;
    
    code = code.replace(match[0], match[0] + infoBadge);
    console.log('Info badge added');
} else {
    console.log('Size Badge not found');
}

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
