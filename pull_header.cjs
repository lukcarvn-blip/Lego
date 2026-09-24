const fs = require('fs');
let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

const startMainLayout = lines.findIndex(l => l.includes('<div className="community-main-layout">'));
const startHeaderSplit = lines.findIndex(l => l.includes('<div className="community-header-split">'));
const endHeaderSplit = lines.findIndex((l, i) => i > startHeaderSplit && l.includes('</div>') && lines[i-1] && lines[i-1].includes('</div>') && lines[i-2] && lines[i-2].includes('</p>'));

// Let's accurately find the end of header split.
// The header split has two divs inside: header-intro and header-vision.
let depth = 0;
let endHeaderSplitIdx = -1;
for (let i = startHeaderSplit; i < lines.length; i++) {
  if (lines[i].includes('<div')) depth += (lines[i].match(/<div/g) || []).length;
  if (lines[i].includes('</div')) depth -= (lines[i].match(/<\/div/g) || []).length;
  if (depth === 0) {
    endHeaderSplitIdx = i;
    break;
  }
}

console.log('startMainLayout:', startMainLayout);
console.log('startHeaderSplit:', startHeaderSplit);
console.log('endHeaderSplitIdx:', endHeaderSplitIdx);

if (startMainLayout !== -1 && startHeaderSplit !== -1 && endHeaderSplitIdx !== -1) {
  // Extract the header split block
  const headerSplitBlock = lines.splice(startHeaderSplit, endHeaderSplitIdx - startHeaderSplit + 1);
  
  // Now we need to insert it BEFORE community-main-layout.
  // BUT wait, after we splice, the index of startMainLayout changes?
  // Yes, it was above startHeaderSplit! So startMainLayout is unaffected by the splice (since it was at line 61, and headerSplit was at 63).
  // Wait, startHeaderSplit is 63, startMainLayout is 61. Splice happens AFTER startMainLayout.
  // So startMainLayout index is still valid.
  
  lines.splice(startMainLayout, 0, ...headerSplitBlock);
  
  fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
  console.log('Successfully pulled header-split out of main-layout!');
} else {
  console.log('Failed to find indices');
}
