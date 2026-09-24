const fs = require('fs');

let lines = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8').split('\n');

// Delete lines 730 to 751 (indices 730 to 751, which is length 22)
// Let's verify line 730 is <motion.button and line 751 is </motion.button>
const startIdx = 730;
const endIdx = 751;

if (lines[startIdx].includes('<motion.button') && lines[endIdx].includes('</motion.button>')) {
  lines.splice(startIdx, endIdx - startIdx + 1);
  fs.writeFileSync('src/pages/ProductDetails.tsx', lines.join('\n'), 'utf8');
  console.log('Removed Heart button from main image');
} else {
  console.log('Mismatch:');
  console.log('Start:', lines[startIdx]);
  console.log('End:', lines[endIdx]);
}
