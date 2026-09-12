const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Fix old low stock alert block that's still there
const oldLowStock = code.match(/\{\/\* Low stock alert \*\/\}[\s\S]*?\n            \)\}\n          \<\/div\>/);
if (oldLowStock) {
  console.log("Found old low stock block at", code.indexOf(oldLowStock[0]));
} else {
  console.log("Pattern not found");
}

// Let's just search for the string fragment
const idx = code.indexOf('Low stock alert');
if (idx >= 0) {
  const start = code.lastIndexOf('{/* Low stock alert', idx);
  const end = code.indexOf('</div>\n            )}\n          </div>', idx);
  if (start >= 0 && end >= 0) {
    const toRemove = code.substring(start, end + '</div>\n            )}\n          </div>'.length);
    console.log("Will remove:\n", toRemove.substring(0, 200));
    code = code.replace(toRemove, '');
  } else {
    console.log("Could not find boundaries. start=", start, "end=", end);
  }
}

fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
