const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const lines = code.split('\n');
const start = lines.findIndex(l => l.includes('{/* Size Badge */}'));
const end = lines.findIndex((l, i) => i > start && l.includes('})()}'));

if (start !== -1 && end !== -1) {
    const newBlock = `            {/* Size Badge */}
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
    lines.splice(start, end - start + 1, ...newBlock.split('\n'));
    fs.writeFileSync('src/pages/ProductDetails.tsx', lines.join('\n'), 'utf8');
    console.log('Fixed Size Badge');
} else {
    console.log('Could not find Size Badge block');
}
