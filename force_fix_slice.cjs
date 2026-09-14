const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const startAnchor = `                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px' }}>
                        <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} />
                        {language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}
                      </span>`;
let startIdx = code.indexOf(startAnchor.replace(/\\n/g, '\\r\\n'));
if (startIdx === -1) startIdx = code.indexOf(startAnchor);
if (startIdx === -1) {
    // try finding by just Clock
    startIdx = code.indexOf(`                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px' }}`);
    if (startIdx !== -1) {
        // move to the last one which is inside isMobile ?
        startIdx = code.lastIndexOf(`                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px' }}`);
    }
}

const endAnchor = `                      </span>`;
let endIdx = code.indexOf(endAnchor, startIdx + 200); // the second span

if (startIdx !== -1 && endIdx !== -1) {
    const newSpans = `                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}</span>
                      </span>`;
    code = code.substring(0, startIdx) + newSpans + code.substring(endIdx + endAnchor.length);
    fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
    console.log("Spans replaced");
} else {
    console.log("Spans not replaced");
}
