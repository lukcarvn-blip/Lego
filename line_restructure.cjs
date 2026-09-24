const fs = require('fs');

let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

// Arrays for the blocks
const intro = lines.slice(61, 98); // 62 to 98 (indices 61 to 97)
const leaderboard = lines.slice(98, 347); // 99 to 347 (indices 98 to 346)
const policies = lines.slice(350, 398); // 351 to 398 (indices 350 to 397)
const request = lines.slice(398, 468); // 399 to 468 (indices 398 to 467)

// The prefix is everything before 61
const prefix = lines.slice(0, 60);

// The suffix is everything after 469 (index 468)
const suffix = lines.slice(469); // from 470 onwards (index 469)

// Construct the new lines
const newLines = [
  ...prefix,
  '        <div className="community-main-layout">',
  '          <div className="community-left-col">',
  ...intro,
  ...policies,
  '          </div>',
  '          <div className="community-right-col">',
  ...leaderboard,
  ...request,
  '          </div>',
  '        </div>',
  ...suffix
];

fs.writeFileSync('src/pages/Community.tsx', newLines.join('\n'), 'utf8');
console.log('Restructured successfully using exact line indices.');
