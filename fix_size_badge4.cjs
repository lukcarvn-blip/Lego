const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const target = `{/* Size Badge */}
            {selectedSize && (() => {
              const details = getStoreSizeDetails(selectedSize);
              return (
                <div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center' }}>
                  <Icons.Maximize size={22} style={{ marginBottom: '2px' }} />
                  {(() => {
                    const parts = (details?.name || '').split(':');
                    const displayName = parts[0].trim();
                    const sizeText = parts.length > 1 ? parts[1].trim() : (details?.heightCm ? \`\${details.heightCm} cm\` : "");
                    return (
                      <>
                        <span style={{ lineHeight: 1.1 }}>{displayName}</span>
                        {sizeText && <span style={{ fontSize: '0.45rem', opacity: 0.7, lineHeight: 1 }}>({sizeText})</span>}
                      </>
                    );
                  })()}
                </div>
              );
            })()}`;

const replacement = `{/* Size Badge */}
            {selectedSize && (() => {
              const details = getStoreSizeDetails(selectedSize);
              if (!details) return null;
              return (
                <div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center' }}>
                  <Icons.Maximize size={22} style={{ marginBottom: '2px' }} />
                  <span style={{ lineHeight: 1.1 }}>{details.heightCm}cm</span>
                </div>
              );
            })()}`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
    console.log('Fixed exactly!');
} else {
    console.log('Target not found!');
}
