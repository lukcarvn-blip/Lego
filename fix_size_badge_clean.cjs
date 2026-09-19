const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// The exact inner block that we want to replace:
const targetInner = `{(() => {
                    const parts = (details?.name || '').split(':');
                    const displayName = parts[0].trim();
                    const sizeText = parts.length > 1 ? parts[1].trim() : (details?.heightCm ? \`\${details.heightCm} cm\` : "");
                    return (
                      <>
                        <span style={{ lineHeight: 1.1 }}>{displayName}</span>
                        {sizeText && <span style={{ fontSize: '0.45rem', opacity: 0.7, lineHeight: 1 }}>({sizeText})</span>}
                      </>
                    );
                  })()}`;

const replacementInner = `<span style={{ lineHeight: 1.1 }}>{details?.heightCm ? \`\${details.heightCm}cm\` : ''}</span>`;

if (code.includes(targetInner)) {
    code = code.replace(targetInner, replacementInner);
    
    // Also change the font size from 0.55rem to 0.85rem in that div
    const divTarget = `fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)'`;
    const divReplacement = `fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)'`;
    code = code.replace(divTarget, divReplacement);
    
    fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
    console.log('Fixed Size Badge cleanly!');
} else {
    console.log('Target Inner not found!');
}
