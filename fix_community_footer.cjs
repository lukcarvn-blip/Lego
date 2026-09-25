const fs = require('fs');
let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

// Line 350 (index 349): the outer flex div - change to use the CSS class
// Line 351 (index 350): the policies inner div - change flex
const l350 = lines[349];
const l351 = lines[350];

console.log('Line 350:', l350);
console.log('Line 351:', l351);

if (l350.includes('display: \'flex\'') && l350.includes('flexWrap')) {
  // Replace the outer wrapper
  lines[349] = `        <div className="community-footer-split">`;
  // Replace the policies wrapper  
  lines[350] = `          <div className="community-footer-policies">`;
  
  console.log('Fixed outer wrappers');
} else {
  console.log('Target not found at expected lines, searching...');
  lines.forEach((l, i) => {
    if (l.includes('flexWrap') && l.includes('marginBottom: \'4rem\'')) {
      console.log('Found at line', i+1, ':', l.trim());
    }
  });
}

fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
