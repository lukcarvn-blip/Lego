const fs = require('fs');

// 1. Cart.tsx
let cartCode = fs.readFileSync('src/pages/Cart.tsx', 'utf8');

// Replace Ruler
cartCode = cartCode.replace(/📏 Size/g, `<Ruler size={14} style={{ marginRight: '4px' }} />Size`);
// Replace Spool
cartCode = cartCode.replace(/🧵 \{item\.material\}/g, `<Layers size={14} style={{ marginRight: '4px' }} />{item.material}`);
// Replace Lightning
cartCode = cartCode.replace(/⚡ \{language === 'vi' \? 'Thanh toAn ngay'/g, `<Zap size={14} style={{ marginRight: '4px', fill: 'currentColor' }} /> {language === 'vi' ? 'Thanh toán ngay'`);
cartCode = cartCode.replace(/⚡ \{language === 'vi' \? 'Thanh toán ngay'/g, `<Zap size={14} style={{ marginRight: '4px', fill: 'currentColor' }} /> {language === 'vi' ? 'Thanh toán ngay'`);

// Ensure imports for Ruler, Layers
if (!cartCode.includes('Ruler,') && !cartCode.includes(', Ruler')) {
  cartCode = cartCode.replace(/import \{([^}]+)\} from 'lucide-react';/, (match, p1) => {
    return `import {${p1}, Ruler, Layers} from 'lucide-react';`;
  });
}

fs.writeFileSync('src/pages/Cart.tsx', cartCode, 'utf8');


// 2. ProductDetails.tsx
let pdCode = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Replace Box
pdCode = pdCode.replace(/📦/g, `<Package size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />`);
// Replace Tools
pdCode = pdCode.replace(/🛠️/g, `<Wrench size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />`);

// Ensure imports
if (!pdCode.includes('Wrench,') && !pdCode.includes(', Wrench')) {
  pdCode = pdCode.replace(/import \{([^}]+)\} from 'lucide-react';/, (match, p1) => {
    return `import {${p1}, Wrench} from 'lucide-react';`; // Package is already imported
  });
}

fs.writeFileSync('src/pages/ProductDetails.tsx', pdCode, 'utf8');

console.log('Replaced Emojis with Lucide Icons');
