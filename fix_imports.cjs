const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

code = code.replace("from 'lucide-react';", "from 'lucide-react';\nimport { Shield, Crosshair, Zap, User, HelpCircle } from 'lucide-react';");

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Added missing lucide-react imports');
