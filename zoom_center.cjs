const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove the old zoom useEffect
code = code.replace(
  /\n\n  useEffect\(\(\) => \{\n    \/\/ Apply 90% scale to the whole website except admin\n    if \(!isAdmin\) \{\n      document\.body\.style\.zoom = '0\.9';\n    \} else \{\n      document\.body\.style\.zoom = '1';\n    \}\n    return \(\) => \{ document\.body\.style\.zoom = '1'; \}\n  \}, \[isAdmin\]\);/,
  ''
);

// Wrap the main content div with a scaling wrapper
const oldDiv = `      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', opacity: isNavLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}>`;
const newDiv = `      <div style={!isAdmin ? { transform: 'scale(0.9)', transformOrigin: 'top center', width: '111.11%', marginLeft: '-5.55%' } : {}}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', opacity: isNavLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}>`;

code = code.replace(oldDiv, newDiv);

// Close the extra wrapper - find the last Footer+FloatingActions+StarBurst block
const oldClose = `        {!isAdmin && <Footer />}\r\n        {!isAdmin && <FloatingActions />}\n        <StarBurst />\r\n      </div>`;
const newClose = `        {!isAdmin && <Footer />}\r\n        {!isAdmin && <FloatingActions />}\n        <StarBurst />\r\n      </div>\n      </div>`;
code = code.replace(oldClose, newClose);

// Try \n variant
const oldClose2 = `        {!isAdmin && <Footer />}\n        {!isAdmin && <FloatingActions />}\n        <StarBurst />\n      </div>`;
const newClose2 = `        {!isAdmin && <Footer />}\n        {!isAdmin && <FloatingActions />}\n        <StarBurst />\n      </div>\n      </div>`;
code = code.replace(oldClose2, newClose2);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Done');
console.log('Has transform:', code.includes('transformOrigin'));
console.log('Has 111.11:', code.includes('111.11'));
