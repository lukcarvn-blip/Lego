const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /<'dashboard' \| 'orders' \| 'products' \| 'printers' \| 'blog' \| 'files' \| 'members' \| 'settings' \| 'more'>/;
const newType = "<'dashboard' | 'orders' | 'products' | 'printers' | 'blog' | 'files' | 'members' | 'reviews' | 'settings' | 'more'>";

if (code.match(regex)) {
  code = code.replace(regex, newType);
  fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
  console.log('Fixed activeTab type');
} else {
  console.log('Not found');
}
