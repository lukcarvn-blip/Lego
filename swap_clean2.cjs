const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const splitStart = code.indexOf('<div className="community-bottom-split">');
const requestStart = code.indexOf('<div className="community-request-side">', splitStart);
const policiesStart = code.indexOf('<div className="community-policies-side">', splitStart);

// We want to find the exact end of policiesSide div.
// It's just before the closing </div> of community-bottom-split
// Looking at the end of file:
//           </div>
// </div>
//         </motion.div>
//       </div>

const splitEndStr = '\n        </motion.div>';
const splitEnd = code.indexOf(splitEndStr, policiesStart);

if (splitStart !== -1 && requestStart !== -1 && policiesStart !== -1 && splitEnd !== -1) {
  const requestCode = code.substring(requestStart, policiesStart);
  
  // Actually, the last closing </div> before splitEnd is the closing of community-bottom-split.
  // The structure is:
  // <div class=community-bottom-split>
  //    ...
  // </div>
  // </motion.div>
  // Let's just find the closing </div> of the community-bottom-split.
  const bottomSplitClosingIndex = code.lastIndexOf('</div>', splitEnd);
  
  const policiesCode = code.substring(policiesStart, bottomSplitClosingIndex);
  
  const newBottomSplit = code.substring(splitStart, requestStart) + policiesCode + requestCode + '</div>';
  
  const newCode = code.substring(0, splitStart) + newBottomSplit + code.substring(bottomSplitClosingIndex + 6);
  
  fs.writeFileSync('src/pages/Community.tsx', newCode, 'utf8');
  console.log("Successfully swapped Request and Policies side in Community.tsx");
} else {
  console.log("Could not find blocks properly.");
  console.log({splitStart, requestStart, policiesStart, splitEnd});
}
