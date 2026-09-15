const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const importRegex = /import\s+{([^}]+)}\s+from\s+['"]lucide-react['"];/;
const match = code.match(importRegex);

if (match) {
  let imports = match[1].split(',').map(s => s.trim());
  const missing = ['Shield', 'Crosshair', 'HelpCircle', 'Zap', 'User'].filter(i => !imports.includes(i));
  
  if (missing.length > 0) {
    imports = imports.concat(missing);
    code = code.replace(importRegex, `import { ${imports.join(', ')} } from 'lucide-react';`);
    fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
    console.log('Fixed imports:', missing.join(', '));
  } else {
    console.log('No missing imports.');
  }
} else {
  console.log('Could not find lucide-react import.');
}
