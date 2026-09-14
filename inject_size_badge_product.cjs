const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const anchor = `              <span style={{ lineHeight: 1.1 }}>3D PRINT</span>
            </div>`;

const newBadgeHtml = `              <span style={{ lineHeight: 1.1 }}>3D PRINT</span>
            </div>
            
            {/* Size Badge */}
            {selectedSize && (() => {
              const details = getSizeDetails(selectedSize);
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'none', textAlign: 'center' }}>
                  <Icons.Maximize size={22} style={{ marginBottom: '2px' }} />
                  <span style={{ lineHeight: 1.1 }}>{details.label}</span>
                  {details.height && <span style={{ fontSize: '0.45rem', opacity: 0.7, lineHeight: 1 }}>({details.height})</span>}
                </div>
              );
            })()}`;

if (code.includes(anchor)) {
  code = code.replace(anchor, newBadgeHtml);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('Successfully added Size badge to Product Details');
} else {
  console.log('Anchor not found');
}
