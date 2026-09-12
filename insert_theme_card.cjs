const fs = require('fs');
let admin = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Use the exact CRLF aware string
const bankPanel = '<div style={panelStyle}>\r\n              <h3 style={{ marginBottom: \'1rem\', color: \'var(--color-accent)\' }}>Thông tin Ngân hàng (Thanh toán)</h3>';

const themeCard = `<div style={panelStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🎨 Giao diện
                </h3>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Chủ đề màu sắc (áp dụng toàn bộ website)</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.75rem 1.25rem', borderRadius: '10px', border: \`2px solid \${tempSettings.siteTheme !== 'light' ? 'var(--color-accent)' : 'var(--glass-border)'}\`, background: tempSettings.siteTheme !== 'light' ? 'rgba(74,222,128,0.1)' : 'transparent', transition: 'all 0.2s', flex: '1', minWidth: '140px' }}>
                    <input type="radio" name="siteTheme" value="dark" checked={tempSettings.siteTheme !== 'light'} onChange={() => setTempSettings(f => ({ ...f, siteTheme: 'dark' }))} style={{ display: 'none' }} />
                    <span style={{ fontSize: '1.2rem' }}>🌙</span> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Tối (Mặc định)</span>
                    {tempSettings.siteTheme !== 'light' && <span style={{ marginLeft: 'auto', color: 'var(--color-accent)', fontWeight: 700 }}>✓</span>}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.75rem 1.25rem', borderRadius: '10px', border: \`2px solid \${tempSettings.siteTheme === 'light' ? 'var(--color-accent)' : 'var(--glass-border)'}\`, background: tempSettings.siteTheme === 'light' ? 'rgba(74,222,128,0.1)' : 'transparent', transition: 'all 0.2s', flex: '1', minWidth: '140px' }}>
                    <input type="radio" name="siteTheme" value="light" checked={tempSettings.siteTheme === 'light'} onChange={() => setTempSettings(f => ({ ...f, siteTheme: 'light' }))} style={{ display: 'none' }} />
                    <span style={{ fontSize: '1.2rem' }}>☀️</span> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sáng</span>
                    {tempSettings.siteTheme === 'light' && <span style={{ marginLeft: 'auto', color: 'var(--color-accent)', fontWeight: 700 }}>✓</span>}
                  </label>
                </div>
              </div>

            `;

if (admin.includes(bankPanel)) {
  admin = admin.replace(bankPanel, themeCard + bankPanel);
  console.log('✓ Theme card inserted');
} else {
  console.log('✗ Still not found. Trying byte-level search...');
  // Last resort: find index and splice
  const idx = admin.indexOf('Thông tin Ngân hàng');
  const divStart = admin.lastIndexOf('\n            <div style={panelStyle}>', idx);
  admin = admin.substring(0, divStart) + '\n            ' + themeCard + admin.substring(divStart + 13); // +13 to skip '\n            '
  console.log('Spliced at index', divStart);
}

fs.writeFileSync('src/pages/Admin.tsx', admin, 'utf8');
