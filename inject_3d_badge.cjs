const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /(<span style=\{\{\s*display: 'flex', alignItems: 'center', gap: '0\.3rem', color: '#fff', fontSize: '0\.65rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0\.8\s*\}\}>.*?<\/span>\s*);\s*\}\)\(\)\}/s;

const newBadgeHtml = `
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fff', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9, background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <div style={{ width: '14px', height: '14px', perspective: '100px', display: 'inline-block', flexShrink: 0, marginRight: '2px' }}>
                                  <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateY(-45deg)' }}>
                                    <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5px', fontWeight: 900, transform: 'translateZ(7px)', color: '#fff', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)' }}>3D</div>
                                    <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3px', fontWeight: 900, transform: 'rotateY(90deg) translateZ(7px)', background: '#fff', color: '#000', boxSizing: 'border-box' }}>PRT</div>
                                    <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1.5px solid #fff', transform: 'rotateX(90deg) translateZ(7px)', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)' }}></div>
                                  </div>
                                </div>
                                3D PRINTED
                              </span>`;

if (regex.test(code)) {
  code = code.replace(regex, (match) => {
    return match + newBadgeHtml;
  });
  fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
  console.log('Successfully added 3D Print badge to Hero Slider');
} else {
  console.log('Regex failed');
}
