const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');
code = code.replace(/\\r\\n/g, '\\n');
const lines = code.split('\\n');

let isMobileProgressFound = false;
let isMobileBtnFound = false;

for (let i = 0; i < lines.length; i++) {
    // 1. Mobile progress padding/justify
    if (lines[i] && lines[i].includes("display: 'flex', justifyContent: 'space-between', alignItems: 'center',") && i+1 < lines.length && lines[i+1].includes("padding: '0 0.75rem', fontSize: '0.7rem',")) {
        lines[i] = lines[i].replace("'space-between'", "'center'");
        lines[i+1] = lines[i+1].replace("'0 0.75rem'", "'0 0.5rem'");
    }

    // 2. Mobile progress text & ellipsis
    if (lines[i] && lines[i].includes("<Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} />")) {
        if (i > 0 && lines[i-1] && lines[i-1].includes("display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px'")) {
            isMobileProgressFound = true;
            lines[i-1] = `                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>`;
            lines[i] = `                        <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} style={{ flexShrink: 0 }} />`;
            lines[i+1] = `                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}</span>`;
            
            let j = i + 3;
            if (j < lines.length && lines[j] && lines[j].includes('<span style={{')) {
                while (j < lines.length && lines[j] && !lines[j].includes('</span>') && j < i + 20) {
                    lines[j] = '';
                    j++;
                }
                if (j < lines.length) lines[j] = ''; // remove </span>
            }
        }
    }

    // 3. Mobile add to cart btn
    if (lines[i] && lines[i].includes('className="mobile-add-cart-btn"') && i+1 < lines.length && lines[i+1] && lines[i+1].includes('onClick={(e) => {')) {
        isMobileBtnFound = true;
        lines[i] = `              className="mobile-add-cart-btn"\\n              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', overflow: 'hidden' }}`;
    }

    if (lines[i] && lines[i].includes('<ShoppingCart size={16} />') && i+1 < lines.length && lines[i+1] && lines[i+1].includes("{language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}")) {
        if (isMobileBtnFound) {
            lines[i] = `              <ShoppingCart size={16} style={{ flexShrink: 0 }} />`;
            lines[i+1] = `              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>\\n                {language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}\\n              </span>`;
        }
    }
}

fs.writeFileSync('src/components/ProductCard.tsx', lines.join('\\n'), 'utf8');
console.log("Script executed.");
