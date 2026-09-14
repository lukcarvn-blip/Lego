const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const anchor = `              </div>
            )}
          </div>`;

const newBadgeHtml = `              </div>
            )}
            
            {/* 3D Printed Badge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'none', textAlign: 'center' }}>
              <div style={{ width: '28px', height: '28px', perspective: '200px', display: 'inline-block', flexShrink: 0 }}>
                <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateY(-45deg)' }}>
                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, transform: 'translateZ(14px)', color: '#fff', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)' }}>3D</div>
                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 900, transform: 'rotateY(90deg) translateZ(14px)', background: '#fff', color: '#000', boxSizing: 'border-box' }}>PRT</div>
                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fff', transform: 'rotateX(90deg) translateZ(14px)', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)' }}></div>
                </div>
              </div>
              <span style={{ lineHeight: 1.1 }}>3D PRINT</span>
            </div>
          </div>`;

if (code.includes(anchor)) {
  code = code.replace(anchor, newBadgeHtml);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('Successfully added 3D Print badge to Product Details');
} else {
  console.log('Anchor not found');
}
