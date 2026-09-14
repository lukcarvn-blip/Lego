const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Change handleLike signature
code = code.replace('const handleLike = () => {', 'const handleLike = (e?: React.MouseEvent) => {');

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Updated handleLike signature');
