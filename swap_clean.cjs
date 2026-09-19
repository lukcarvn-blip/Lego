const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const splitStart = code.indexOf('<div className="community-bottom-split">');
const requestStart = code.indexOf('<div className="community-request-side">', splitStart);
const policiesStart = code.indexOf('<div className="community-policies-side">', splitStart);
const splitEnd = code.indexOf('</div>\n        </motion.div>', policiesStart); // End of community-bottom-split

if (splitStart !== -1 && requestStart !== -1 && policiesStart !== -1 && splitEnd !== -1) {
  // Extract blocks
  const requestCode = code.substring(requestStart, policiesStart);
  // Find where the policies code ends exactly (the end of its div)
  // Since it's the last child of bottom-split, it ends at the closing </div> of policies, which is right before splitEnd
  const policiesCode = code.substring(policiesStart, splitEnd);
  
  // Swap them
  const newBottomSplit = code.substring(splitStart, requestStart) + policiesCode + requestCode;
  const newCode = code.substring(0, splitStart) + newBottomSplit + code.substring(splitEnd);
  
  fs.writeFileSync('src/pages/Community.tsx', newCode, 'utf8');
  console.log("Successfully swapped Request and Policies side in Community.tsx");
} else {
  console.log("Could not find blocks properly.");
  console.log({splitStart, requestStart, policiesStart, splitEnd});
}
