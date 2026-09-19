const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');
code = code.replace('className="hover-jump" \n              onClick={() => {', 'className="pd-badge hover-jump" \n              onClick={() => {');
code = code.replace('className="hover-jump"\n              onClick={() => {', 'className="pd-badge hover-jump"\n              onClick={() => {');
code = code.replace('className="hover-jump"\r\n              onClick={() => {', 'className="pd-badge hover-jump"\r\n              onClick={() => {');
code = code.replace('className="hover-jump" \r\n              onClick={() => {', 'className="pd-badge hover-jump" \r\n              onClick={() => {');
fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed pd-badge class');
