const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const targetStr = `            <button \r
              className="mobile-add-cart-btn"\r
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', overflow: 'hidden' }}\r
              onClick={(e) => {`;

const newStr = `            <button \r
              className="mobile-add-cart-btn"\r
              style={{ alignItems: 'center', justifyContent: 'center', gap: '0.35rem', overflow: 'hidden' }}\r
              onClick={(e) => {`;

const targetStr_lf = targetStr.replace(/\\r\\n/g, '\\n');
const newStr_lf = newStr.replace(/\\r\\n/g, '\\n');

if (code.includes(targetStr)) {
    code = code.replace(targetStr, newStr);
    console.log("Replaced with CRLF");
} else if (code.includes(targetStr_lf)) {
    code = code.replace(targetStr_lf, newStr_lf);
    console.log("Replaced with LF");
} else {
    console.log("Not found");
}

fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
