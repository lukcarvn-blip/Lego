const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

// 1. Mobile progress padding/justify
code = code.replace(
  "display: 'flex', justifyContent: 'space-between', alignItems: 'center', \n                      padding: '0 0.75rem', fontSize: '0.7rem',",
  "display: 'flex', justifyContent: 'center', alignItems: 'center', \n                      padding: '0 0.5rem', fontSize: '0.7rem',"
);
code = code.replace(
  "display: 'flex', justifyContent: 'space-between', alignItems: 'center', \r\n                      padding: '0 0.75rem', fontSize: '0.7rem',",
  "display: 'flex', justifyContent: 'center', alignItems: 'center', \r\n                      padding: '0 0.5rem', fontSize: '0.7rem',"
);

// 2. Mobile progress text & ellipsis
const oldSpans1 = `<span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px' }}>
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
const newSpans = `<span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}</span>
                      </span>`;

code = code.replace(oldSpans1, newSpans);
code = code.replace(oldSpans1.replace(/\\n/g, '\\r\\n'), newSpans);

// 3. Mobile add to cart btn
const oldBtn1 = `className="mobile-add-cart-btn"\n              onClick={(e) => {`;
const newBtn1 = `className="mobile-add-cart-btn"\n              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', overflow: 'hidden' }}\n              onClick={(e) => {`;
code = code.replace(oldBtn1, newBtn1);
code = code.replace(oldBtn1.replace(/\\n/g, '\\r\\n'), newBtn1.replace(/\\n/g, '\\r\\n'));

const oldBtnIcon1 = `<ShoppingCart size={16} />\n              {language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}`;
const newBtnIcon1 = `<ShoppingCart size={16} style={{ flexShrink: 0 }} />\n              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>\n                {language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}\n              </span>`;
code = code.replace(oldBtnIcon1, newBtnIcon1);
code = code.replace(oldBtnIcon1.replace(/\\n/g, '\\r\\n'), newBtnIcon1.replace(/\\n/g, '\\r\\n'));

fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
console.log("Forced replacement done");
