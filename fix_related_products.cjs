const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const oldCode = `            {products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 10).map((p, idx) => (\r\n              <div key={p.id} style={{ flex: '0 0 calc(50% - 0.5rem)', width: 'calc(50% - 0.5rem)', scrollSnapAlign: 'start' }}>\r\n                <ProductCard product={p} idx={idx} listMode={false} />\r\n              </div>\r\n            ))}`;

const newCode = `            {(() => {
              const sameCategory = products.filter(p => p.category === product.category && p.id !== product.id);
              const displayList = sameCategory.length > 0
                ? sameCategory.slice(0, 10)
                : products.filter(p => p.isReadyStock && p.stock > 0 && p.id !== product.id).slice(0, 10);
              return displayList.map((p, idx) => (
                <div key={p.id} style={{ flex: '0 0 calc(50% - 0.5rem)', width: 'calc(50% - 0.5rem)', scrollSnapAlign: 'start' }}>
                  <ProductCard product={p} idx={idx} listMode={false} />
                </div>
              ));
            })()}`;

if (code.includes(oldCode)) {
  code = code.replace(oldCode, newCode);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('SUCCESS: updated related products logic');
} else {
  // try with LF line endings  
  const oldCodeLF = `            {products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 10).map((p, idx) => (\n              <div key={p.id} style={{ flex: '0 0 calc(50% - 0.5rem)', width: 'calc(50% - 0.5rem)', scrollSnapAlign: 'start' }}>\n                <ProductCard product={p} idx={idx} listMode={false} />\n              </div>\n            ))}`;
  if (code.includes(oldCodeLF)) {
    code = code.replace(oldCodeLF, newCode);
    fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
    console.log('SUCCESS with LF: updated related products logic');
  } else {
    // Use regex
    const regex = /\{products\.filter\(p => p\.category === product\.category && p\.id !== product\.id\)\.slice\(0, 10\)\.map\(\(p, idx\) => \([\s\S]*?<\/div>\s*\)\)\}/;
    if (regex.test(code)) {
      code = code.replace(regex, newCode);
      fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
      console.log('SUCCESS with regex: updated related products logic');
    } else {
      console.log('FAIL: pattern not found');
    }
  }
}
