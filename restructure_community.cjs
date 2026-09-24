const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// We want to replace the structure:
// <div className="community-top-split">
//   <div className="community-intro-side">...</div>
//   <div className="community-leaderboard-side">...</div>
// </div>
// <div className="community-bottom-split">
//   <div className="community-policies-side">...</div>
//   <div className="community-request-side">...</div>
// </div>
//
// WITH:
// <div className="community-main-layout">
//   <div className="community-left-col">
//     <div className="community-intro-side">...</div>
//     <div className="community-policies-side">...</div>
//   </div>
//   <div className="community-right-col">
//     <div className="community-leaderboard-side">...</div>
//     <div className="community-request-side">...</div>
//   </div>
// </div>

// Step 1: Replace community-top-split
code = code.replace(
  /<div className="community-top-split">\s*<div className="community-intro-side">/,
  '<div className="community-main-layout">\n          <div className="community-left-col">\n            <div className="community-intro-side">'
);

// Step 2: The end of intro-side is followed by community-leaderboard-side.
// We want to close left-col and open right-col? No, wait!
// The intro-side ends, then leaderboard-side begins. 
// We want to move leaderboard-side to the right-col!
// It's easier to extract the 4 blocks of code!

const extractBlock = (className) => {
  const startIdx = code.indexOf(`<div className="${className}">`);
  if (startIdx === -1) return null;
  
  let depth = 0;
  let endIdx = -1;
  
  // simple parser
  const searchStr = code.substring(startIdx);
  const divRegex = /<\/?div[^>]*>/g;
  let match;
  
  while ((match = divRegex.exec(searchStr)) !== null) {
    if (match[0].startsWith('<div')) depth++;
    else if (match[0].startsWith('</div')) depth--;
    
    if (depth === 0) {
      endIdx = startIdx + match.index + match[0].length;
      break;
    }
  }
  
  return {
    start: startIdx,
    end: endIdx,
    content: code.substring(startIdx, endIdx)
  };
};

const intro = extractBlock('community-intro-side');
const leaderboard = extractBlock('community-leaderboard-side');
const policies = extractBlock('community-policies-side');
const request = extractBlock('community-request-side');

if (intro && leaderboard && policies && request) {
  // Find the exact span of the top and bottom splits
  const topSplitStart = code.indexOf('<div className="community-top-split">');
  const bottomSplitStart = code.indexOf('<div className="community-bottom-split">');
  
  // The total area to replace is from topSplitStart to the end of bottom split.
  // We can just find the end of bottom split.
  let bottomSplitEnd = code.indexOf('</div>', request.end); // rough, but request is the last child
  
  // Reconstruct
  const newStructure = `
        <div className="community-main-layout">
          <div className="community-left-col">
            ${intro.content}
            ${policies.content}
          </div>
          <div className="community-right-col">
            ${leaderboard.content}
            ${request.content}
          </div>
        </div>
  `;
  
  // Replace the old chunk
  // Wait, bottomSplitEnd might be tricky. Let's just do a string replacement of the exact old structure!
  const prefix = code.substring(0, topSplitStart);
  
  // Find the end of the bottom split by parsing it
  let depth = 0;
  let bottomEndIdx = -1;
  const searchStr = code.substring(bottomSplitStart);
  const divRegex = /<\/?div[^>]*>/g;
  let match;
  while ((match = divRegex.exec(searchStr)) !== null) {
    if (match[0].startsWith('<div')) depth++;
    else if (match[0].startsWith('</div')) depth--;
    if (depth === 0) {
      bottomEndIdx = bottomSplitStart + match.index + match[0].length;
      break;
    }
  }
  
  const suffix = code.substring(bottomEndIdx);
  
  code = prefix + newStructure + suffix;
  fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
  console.log('Successfully restructured Community.tsx');
} else {
  console.log('Failed to extract blocks');
}
