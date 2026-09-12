const fs = require('fs');

// Check StoreContext
let ctx = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');
console.log('siteTheme in interface:', ctx.includes('siteTheme'));
console.log('useEffect in ctx:', ctx.includes('Apply theme CSS class'));

// The interface is exported but siteTheme may not have been added there
const ifaceIdx = ctx.indexOf('interface StoreSettings {');
const ifaceEnd = ctx.indexOf('}', ifaceIdx);
console.log('Interface block:\n', ctx.substring(ifaceIdx, ifaceEnd+1));

// Check Admin.tsx for Sun
let admin = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
const importLine = admin.split('\n').find(l => l.includes('StoreContext'));
console.log('\nAdmin import from StoreContext:', importLine ? importLine.trim() : 'NOT FOUND');
const lucideImport = admin.split('\n').find(l => l.includes('lucide-react'));
console.log('Admin lucide import:', lucideImport ? lucideImport.trim() : 'NOT FOUND');
