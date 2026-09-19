const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

code = code.replace(
    'import { User, ShoppingBag, ShoppingCart',
    'import { Gift, User, ShoppingBag, ShoppingCart'
);

fs.writeFileSync('src/pages/Profile.tsx', code, 'utf8');
console.log('Added Gift to imports');
