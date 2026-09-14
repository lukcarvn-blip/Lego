const fs = require('fs');

// Step 1: Fix CSS - change bottom from 65px to 0, add padding-bottom
let css = fs.readFileSync('src/index.css', 'utf8');
css = css
  .replace('    bottom: 65px; /* above mobile nav */', '    bottom: 0; /* pinned to bottom edge */')
  .replace('    padding: 0 0.75rem;\r\n  }\r\n}\r\n\r\n/* Size selector', '    padding: 0 0.75rem calc(65px + 0.5rem); /* above mobile nav */\r\n  }\r\n}\r\n\r\n/* Size selector');

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('CSS fixed');

// Step 2: Add isSummaryOpen state
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Add state
if (!code.includes('isSummaryOpen')) {
  code = code.replace(
    '  const [isLightboxOpen, setIsLightboxOpen] = useState(false);',
    '  const [isLightboxOpen, setIsLightboxOpen] = useState(false);\n  const [isSummaryOpen, setIsSummaryOpen] = useState(false);'
  );
  console.log('Added isSummaryOpen state');
} else {
  console.log('isSummaryOpen already exists');
}

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
