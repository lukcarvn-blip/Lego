const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

// The mobile progress bar text already replaced in previous step? NO, I reverted git!
// I need to re-apply BOTH fixes.

// 1. Mobile progress bar
const oldProg1 = `                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      padding: '0 0.75rem', fontSize: '0.7rem',`;
const newProg1 = `                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex', justifyContent: 'center', alignItems: 'center', 
                      padding: '0 0.5rem', fontSize: '0.7rem',`;

const oldProg2 = `                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px' }}>
                      <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} />
                      {language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}
                    </span>
                    <span style={{ 
                      fontWeight: 700,
                      minWidth: '60px', textAlign: 'right'
                    }}>
                      {craftHovered
                        ? \`\${displayDay} \${language === 'vi' ? 'ngày' : 'days'}\`
                        : product.estimatedPrintTime.replace('days', language === 'vi' ? 'ngày' : 'days')
                      }
                    </span>`;
const newProg2 = `                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}</span>
                    </span>`;

// 2. Mobile add to cart button
const oldBtn1 = `className="mobile-add-cart-btn"
              onClick={(e) => {`;
const newBtn1 = `className="mobile-add-cart-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', overflow: 'hidden' }}
              onClick={(e) => {`;

const oldBtn2 = `<ShoppingCart size={16} />
              {language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}`;
const newBtn2 = `<ShoppingCart size={16} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}
              </span>`;

const n = s => s.replace(/\\r\\n/g, '\\n');
let codeN = n(code);

codeN = codeN.replace(n(oldProg1), newProg1);
codeN = codeN.replace(n(oldProg2), newProg2);
codeN = codeN.replace(n(oldBtn1), newBtn1);
codeN = codeN.replace(n(oldBtn2), newBtn2);

fs.writeFileSync('src/components/ProductCard.tsx', codeN, 'utf8');
console.log("Done");
