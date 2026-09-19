const fs = require('fs');
const code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const bottomSplitStart = code.indexOf('<div className="community-bottom-split">');
const requestSideStart = code.indexOf('<div className="community-request-side">');
const policiesSideStart = code.indexOf('<div className="community-policies-side">');

// We know the structure is:
// <div className="community-bottom-split">
//   <div className="community-request-side"> ... </div>
//   <div className="community-policies-side"> ... </div>
// </div>

const requestCode = code.substring(requestSideStart, policiesSideStart);
// Find the end of policies block
const endOfSplit = code.indexOf('</div>\n        </motion.div>', policiesSideStart);
const policiesCode = code.substring(policiesSideStart, endOfSplit);

console.log("Request block length:", requestCode.length);
console.log("Policies block length:", policiesCode.length);

const newBottomSplit = `<div className="community-bottom-split">\n  ${policiesCode}\n  ${requestCode}`;
const oldBottomSplit = code.substring(bottomSplitStart, endOfSplit);

const newCode = code.replace(oldBottomSplit, newBottomSplit);
fs.writeFileSync('src/pages/Community.tsx', newCode, 'utf8');
console.log("Swapped successfully");
