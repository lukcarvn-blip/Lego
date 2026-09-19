const fs = require('fs');

let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

// 1. Remove the array modification block (lines 261-268)
const pushLine = lines.findIndex(l => l.includes('displayProducts.push({ isRequestCard: true'));
if (pushLine !== -1) {
  // Look for the end of the `if` block that duplicates the array
  const ifEndLine = lines.findIndex((l, i) => i > pushLine && l.includes('return displayProducts.map'));
  lines.splice(pushLine, ifEndLine - pushLine);
}

// 2. Remove the ternary condition and the request card block
const ternaryLine = lines.findIndex(l => l.includes('char.isRequestCard ? ('));
if (ternaryLine !== -1) {
  const elseLine = lines.findIndex((l, i) => i > ternaryLine && l.includes(') : ('));
  // Remove from ternaryLine to elseLine inclusive
  lines.splice(ternaryLine, (elseLine - ternaryLine) + 1);
}

// 3. Find the closing `)` at line 380 and remove it
const slideEndLine = lines.findIndex(l => l.includes('</SwiperSlide>'));
if (slideEndLine !== -1) {
  const closingParenLine = slideEndLine - 2; // Assuming line 380 is two lines before </SwiperSlide>
  if (lines[closingParenLine].trim() === ')') {
    lines.splice(closingParenLine, 1);
  }
}

fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
console.log("Successfully removed request card from Community.tsx");
