const fs = require('fs');
let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

// We have 3 extra closing divs now at lines 470, 471, 472
// Let's count properly from the start
let openCount = 0;
for(let i=0; i<lines.length; i++) {
  const l = lines[i] || '';
  openCount += (l.match(/<div/g) || []).length;
  openCount -= (l.match(/<\/div/g) || []).length;
}
console.log('Final open div count:', openCount);

// If openCount is -2, we need to remove 2 </div> tags.
// Let's just remove lines 470 and 471.
lines.splice(470, 2);
fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
console.log('Removed 2 extra closing divs.');
