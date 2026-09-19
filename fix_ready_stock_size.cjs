const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const lines = code.split('\n');

// 1. Update the Size Badge
const start = lines.findIndex(l => l.includes('{/* Size Badge */}'));
const end = lines.findIndex((l, i) => i > start && l.includes('})()}'));

if (start !== -1 && end !== -1) {
    const newBlock = `            {/* Size Badge */}
            {(selectedSize || (!isEffectivelyCrafting && product.dimensions)) && (() => {
              let displaySize = '';
              if (isEffectivelyCrafting && selectedSize) {
                const details = getStoreSizeDetails(selectedSize);
                displaySize = details?.heightCm ? \`\${details.heightCm}cm\` : '';
              } else if (!isEffectivelyCrafting && product.dimensions) {
                displaySize = product.dimensions;
              }
              
              if (!displaySize) return null;
              
              return (
                <div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', width: 'auto', minWidth: '75px', height: '75px', padding: '0 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center' }}>
                  <Icons.Maximize size={22} style={{ marginBottom: '2px' }} />
                  <span style={{ lineHeight: 1.1, whiteSpace: 'nowrap' }}>{displaySize}</span>
                </div>
              );
            })()}`;
    lines.splice(start, end - start + 1, ...newBlock.split('\n'));
}

// 2. Remove the old pill
const pillStart = lines.findIndex(l => l.includes('{product.dimensions && ('));
if (pillStart !== -1) {
    // The pill is about 9 lines long. Let's find the closing `)}`
    let pillEnd = -1;
    for (let i = pillStart; i < pillStart + 15; i++) {
        if (lines[i].includes(')}')) {
            pillEnd = i;
            break;
        }
    }
    if (pillEnd !== -1) {
        lines.splice(pillStart, pillEnd - pillStart + 1);
    }
}

fs.writeFileSync('src/pages/ProductDetails.tsx', lines.join('\n'), 'utf8');
console.log('Fixed ready stock size badge');
