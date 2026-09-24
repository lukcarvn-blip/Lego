const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const target = `<div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
              <Layers size={40} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: '#fff' }}>
              {language === 'vi' ? 'Sân chơi Mô hình Up-scale Cao cấp' : 'High-end Up-scale Model Playground'}
            </h1>`;

const replacement = `<div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', color: 'var(--color-accent)' }}>
                <Layers size={32} />
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.3 }}>
                {language === 'vi' ? 'Sân chơi Mô hình Up-scale Cao cấp' : 'High-end Up-scale Model Playground'}
              </h2>
            </div>`;

if (code.includes('Sân chơi Mô hình Up-scale Cao cấp')) {
  // Using exact string replace might fail on indentation, so let's do a regex or just replace based on start/end strings
  
  const startIdx = code.indexOf(`<div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>`);
  const endStr = `</h1>`;
  const tempCode = code.substring(startIdx);
  const endIdx = startIdx + tempCode.indexOf(endStr) + endStr.length;
  
  const originalBlock = code.substring(startIdx, endIdx);
  
  code = code.replace(originalBlock, replacement);
  fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
  console.log('Fixed icon and header layout!');
}
