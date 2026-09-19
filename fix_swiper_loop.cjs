const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const target = `{col.products.map(char => (
                            <SwiperSlide key={char.id} style={{ width: '280px', height: 'auto' }}>`;

const replacement = `{(() => {
                            let displayProducts = col.products;
                            if (displayProducts.length > 0 && displayProducts.length < 10) {
                              while (displayProducts.length < 10) {
                                displayProducts = [...displayProducts, ...col.products];
                              }
                            }
                            return displayProducts.map((char: any, idx: number) => (
                              <SwiperSlide key={\`\${char.id}-\${idx}\`} style={{ width: '280px', height: 'auto' }}>
`;

// wait, the original code doesn't have an exact match if formatting is slightly off. Let's use Regex.
code = code.replace(/\{col\.products\.map\(char\s*=>\s*\(\s*<SwiperSlide key=\{char\.id\} style=\{\{ width: '280px', height: 'auto' \}\}>/, replacement);

// We also need to close the IIFE `})()}`
// Find `</div>\n                            </SwiperSlide>\n                          ))}`
const closingTarget = /<\/div>\s*<\/SwiperSlide>\s*\)\)\}/;
const closingReplacement = `</div>
                            </SwiperSlide>
                          ))})()}`;

code = code.replace(closingTarget, closingReplacement);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Fixed Swiper missing loop items');
