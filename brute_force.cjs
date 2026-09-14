const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const target1 = `                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', \r
                      padding: '0 0.75rem', fontSize: '0.7rem',`;
const new1 = `                      display: 'flex', justifyContent: 'center', alignItems: 'center', \r
                      padding: '0 0.5rem', fontSize: '0.7rem',`;

const target1_lf = target1.replace(/\\r\\n/g, '\\n');
const new1_lf = new1.replace(/\\r\\n/g, '\\n');

if (code.includes(target1)) code = code.replace(target1, new1);
if (code.includes(target1_lf)) code = code.replace(target1_lf, new1_lf);

const target2 = `                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px' }}>\r
                        <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} />\r
                        {language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}\r
                      </span>\r
                      <span style={{ \r
                        fontWeight: 700,\r
                        minWidth: '60px', textAlign: 'right'\r
                      }}>\r
                        {craftHovered\r
                          ? \`\${displayDay} \${language === 'vi' ? 'ngày' : 'days'}\`\r
                          : product.estimatedPrintTime.replace('days', language === 'vi' ? 'ngày' : 'days')\r
                        }\r
                      </span>`;
const new2 = `                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>\r
                        <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} style={{ flexShrink: 0 }} />\r
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}</span>\r
                      </span>`;

const target2_lf = target2.replace(/\\r\\n/g, '\\n');
const new2_lf = new2.replace(/\\r\\n/g, '\\n');

if (code.includes(target2)) code = code.replace(target2, new2);
if (code.includes(target2_lf)) code = code.replace(target2_lf, new2_lf);

const target3 = `            <button \r
              className="mobile-add-cart-btn"\r
              onClick={(e) => {`;
const new3 = `            <button \r
              className="mobile-add-cart-btn"\r
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', overflow: 'hidden' }}\r
              onClick={(e) => {`;

const target3_lf = target3.replace(/\\r\\n/g, '\\n');
const new3_lf = new3.replace(/\\r\\n/g, '\\n');

if (code.includes(target3)) code = code.replace(target3, new3);
if (code.includes(target3_lf)) code = code.replace(target3_lf, new3_lf);

const target4 = `              <ShoppingCart size={16} />\r
              {language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}\r
            </button>`;
const new4 = `              <ShoppingCart size={16} style={{ flexShrink: 0 }} />\r
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>\r
                {language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}\r
              </span>\r
            </button>`;

const target4_lf = target4.replace(/\\r\\n/g, '\\n');
const new4_lf = new4.replace(/\\r\\n/g, '\\n');

if (code.includes(target4)) code = code.replace(target4, new4);
if (code.includes(target4_lf)) code = code.replace(target4_lf, new4_lf);

fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
console.log("Brute force applied");
