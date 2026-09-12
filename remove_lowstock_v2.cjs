const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Find the exact block to remove using unique substrings
const startMarker = '\n            {/* Low stock alert */}\n            {products.filter(p => p.stock <= 3).length > 0 && (';
const endMarker = '            )}\n          </div>\n        )}\n\n        {/* ── ORDERS TAB';

const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker);

if (startIdx === -1) { console.log('Start marker not found'); process.exit(1); }
if (endIdx === -1) { console.log('End marker not found'); process.exit(1); }

// Keep the closing tags that are part of the dashboard tab container, just remove the alert block
const before = code.substring(0, startIdx);
const after = code.substring(endIdx);

code = before + '\n          </div>\n        )}\n\n        {/* ── ORDERS TAB' + after.substring(endMarker.length);

fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
console.log('Done! Removed low stock alert from bottom of dashboard.');
