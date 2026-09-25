const fs = require('fs');
let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

// The issue is that the <div className="community-footer-request"> is INSIDE the 
// <div className="glass-panel"> of "Exclusive Policies" (which starts at line 354 and hasn't been closed before line 398)
// Looking at line 397: it closes `policies-grid-half`.
// But we need to close the `glass-panel` AND `community-footer-policies` before starting `community-footer-request`.

// Currently:
// 397:   </div> (closes policies-grid-half)
// 398:           <div className="community-footer-request">

// We need to change line 397 to also close the glass-panel and the policies column!
lines[397] = `            </div>\n          </div>\n        </div>\n        <div className="community-footer-request">`;

// And we need to remove the `<div className="community-footer-request">` at line 398
lines.splice(398, 1);

fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
console.log('Fixed nesting issue.');
