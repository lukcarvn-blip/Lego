const fs = require('fs');
let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

// Fix line 401 (index 400) - request side wrapper
if (lines[400].includes("flex: '1 1 45%'") && lines[401].includes('community-request-side')) {
  lines[400] = `          <div className="community-footer-request">`;
  console.log('Fixed request wrapper at line 401');
} else {
  console.log('Line 401:', lines[400]);
  console.log('Line 402:', lines[401]);
}

// Also fix the policies-side wrapper (line 351 -> now different after previous fix)
// Find remaining inline flex wrappers near policies
lines.forEach((l, i) => {
  if (l.includes("flex: '1 1 45%'")) {
    console.log('Remaining inline flex at line', i+1, ':', l.trim());
  }
});

// Remove redundant inner wrappers community-policies-side and community-request-side
// (they're extra wrappers inside the new footer-policies / footer-request divs)
// Find and remove the community-policies-side wrapper (it's an extra div)
const pSideIdx = lines.findIndex(l => l.includes('community-policies-side'));
if (pSideIdx !== -1) {
  lines.splice(pSideIdx, 1); // remove that line
  console.log('Removed community-policies-side wrapper');
}

const rSideIdx = lines.findIndex(l => l.includes('community-request-side'));
if (rSideIdx !== -1) {
  lines.splice(rSideIdx, 1); // remove that line
  console.log('Removed community-request-side wrapper');
}

fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
