const fs = require('fs');
let code = fs.readFileSync('src/data/mockProducts.ts', 'utf8');

code = code.replace(/['`]Size 300['`]/g, "'NORMAL'");
code = code.replace(/['`]Size 400['`]/g, "'NORMAL'");
code = code.replace(/['`]Size 1000['`]/g, "'PREMIUM'");
code = code.replace(/['`]Standard['`]/g, "'NORMAL'");

code = code.replace(/availableSizes:\s*\[([^\]]+)\]/g, (match, p1) => {
  const parts = p1.split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
  const unique = [...new Set(parts)];
  return `availableSizes: [${unique.map(s => `'${s}'`).join(', ')}]`;
});

fs.writeFileSync('src/data/mockProducts.ts', code, 'utf8');
console.log('Updated mockProducts array values');
