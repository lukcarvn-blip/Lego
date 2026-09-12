const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Update Settings form to full width
code = code.replace(
    '<form onSubmit={handleSaveSettings} style={{ maxWidth: \'800px\' }}>',
    '<form onSubmit={handleSaveSettings} style={{ width: \'100%\' }}>'
);

// Update Settings Header
code = code.replace(
    '<h1 style={{ fontSize: \'clamp(1.5rem,3vw,2rem)\', marginBottom: \'1.5rem\' }}><Settings size={28} style={{marginRight:8}}/> Cài đặt Website</h1>',
    `<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3.5rem', height: '3.5rem', background: 'rgba(74,222,128,0.1)', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.2)', color: 'var(--color-accent)' }}>
                  <Settings size={28} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h1 style={{ fontSize: 'clamp(1.25rem,2vw,1.5rem)', margin: 0, lineHeight: 1.2, fontWeight: 700 }}>
                    Cài đặt Website
                  </h1>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', width: '100%' }}></div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>
                    Cấu hình chung hệ thống
                  </p>
                </div>
              </div>`
);

fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
