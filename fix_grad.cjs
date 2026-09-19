const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const targetGrad = "background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)',";
const newGrad = "background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%, transparent 50%, #050505 100%)',";

code = code.replace(targetGrad, newGrad);
fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Gradient updated');
