const fs = require('fs');
let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

// Problem: lines 397-399 have 3 extra closing divs (they were from removed wrappers)
// These 3 extra </div> at lines 397, 398, 399 break the structure
// We need to remove them

// Remove the 3 extra </div> at indices 396, 397, 398 (lines 397, 398, 399)
console.log('Before removal:');
console.log('Line 397:', lines[396]);
console.log('Line 398:', lines[397]);
console.log('Line 399:', lines[398]);
console.log('Line 400:', lines[399]);

if (lines[396].trim() === '</div>' && lines[397].trim() === '</div>' && lines[398].trim() === '</div>') {
  // Remove 2 extra (keep 1 for policies closing)
  lines.splice(397, 2); // remove indices 397 and 398 (lines 398, 399)
  console.log('Removed 2 extra </div> after policies section');
} else {
  console.log('Pattern not matching, showing area:');
  for (let i = 393; i < 402; i++) console.log(i+1, lines[i]);
}

fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
