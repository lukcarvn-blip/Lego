const fs = require('fs');
const code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');
const lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Mua ngay') || lines[i].includes('Buy Now')) {
    console.log(`\n--- Match at line ${i+1} ---`);
    for (let j = i - 10; j <= i + 15; j++) {
      if (lines[j]) console.log(j + 1, lines[j]);
    }
  }
}
