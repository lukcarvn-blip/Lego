const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');
code = code.replace("Wrench} from 'lucide-react';", "Wrench, Package} from 'lucide-react';");
fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Added Package import');
