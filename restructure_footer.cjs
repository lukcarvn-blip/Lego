const fs = require('fs');
let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

const startMainLayout = lines.findIndex(l => l.includes('<div className="community-main-layout">'));
const startPolicies = lines.findIndex(l => l.includes('<div className="community-policies-side">'));
const endPolicies = lines.findIndex((l, i) => i > startPolicies && l.includes('</div>') && lines[i+1].includes('</div>') && lines[i+2].includes('<div className="community-right-col">'));
const startRightCol = lines.findIndex(l => l.includes('<div className="community-right-col">'));
const startLeaderboard = lines.findIndex(l => l.includes('<div className="community-leaderboard-side">'));
const startRequest = lines.findIndex((l, i) => i > startLeaderboard && l.includes('<div className="community-request-side">'));
const endRequest = lines.findIndex((l, i) => i > startRequest && l.includes('</div>') && lines[i+1] && lines[i+1].includes('</div>') && lines[i+2] && lines[i+2].includes('</div>') && lines[i+3] && lines[i+3].includes('</motion.div>'));

console.log('Main Layout:', startMainLayout);
console.log('Policies Start:', startPolicies, 'End:', endPolicies);
console.log('Right Col:', startRightCol);
console.log('Leaderboard Start:', startLeaderboard, 'End before Request:', startRequest - 1); // wait, let's parse leaderboard end
console.log('Request Start:', startRequest, 'End:', endRequest);

// Since Leaderboard is just before Request, we can define its end as startRequest - 1.
let endLeaderboard = -1;
for(let i = startRequest - 1; i > startLeaderboard; i--) {
  if (lines[i].includes('</div>')) {
    endLeaderboard = i;
    break;
  }
}
console.log('Leaderboard End:', endLeaderboard);

if (startMainLayout !== -1 && startPolicies !== -1 && endPolicies !== -1 && startLeaderboard !== -1 && endLeaderboard !== -1 && startRequest !== -1 && endRequest !== -1) {
  
  const policiesBlock = lines.slice(startPolicies, endPolicies + 1);
  const leaderboardBlock = lines.slice(startLeaderboard, endLeaderboard + 1);
  const requestBlock = lines.slice(startRequest, endRequest + 1);
  
  const prefix = lines.slice(0, startMainLayout);
  
  // Need to find what comes exactly after endRequest
  let afterRequestIdx = endRequest + 1;
  // Skip the closing tags of right-col and main-layout
  while (afterRequestIdx < lines.length && (lines[afterRequestIdx].includes('</div>') || lines[afterRequestIdx].trim() === '')) {
    afterRequestIdx++;
    if (lines[afterRequestIdx].includes('</motion.div>')) break; // Stop when we hit the outer motion div
  }
  
  const suffix = lines.slice(afterRequestIdx);
  
  const newContent = [
    ...prefix,
    '        <div className="community-leaderboard-section">',
    ...leaderboardBlock,
    '        </div>',
    '        <div className="community-footer-split">',
    '          <div className="community-footer-policies">',
    ...policiesBlock,
    '          </div>',
    '          <div className="community-footer-request">',
    ...requestBlock,
    '          </div>',
    '        </div>',
    ...suffix
  ];
  
  fs.writeFileSync('src/pages/Community.tsx', newContent.join('\n'), 'utf8');
  console.log('Successfully restructured footer layout!');
} else {
  console.log('Failed to find all bounds.');
}
