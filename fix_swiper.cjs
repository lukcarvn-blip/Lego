const fs = require('fs');

let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

const lineIndex = lines.findIndex(l => l.includes('let displayProducts = col.products.map'));

if (lineIndex !== -1) {
  const insert = `                            let displayProducts = col.products.map((p: any, i: number) => ({...p, rank: i + 1}));
                            if (displayProducts.length > 0 && displayProducts.length < 10) {
                              const orig = [...displayProducts];
                              while (displayProducts.length < 10) {
                                displayProducts = [...displayProducts, ...orig];
                              }
                            }`;
  lines[lineIndex] = insert;
  fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
  console.log('Fixed Swiper loop glitch');
} else {
  console.log('Could not find line');
}
