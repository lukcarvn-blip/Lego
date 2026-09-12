const fs = require('fs');

// Fix 1: siteTheme is in interface but NOT in the exported StoreSettings  
// The build error says "Property 'siteTheme' does not exist on type 'StoreSettings'"
// So the interface block shown above does NOT include siteTheme — let me look again
let ctx = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// There are likely TWO interface blocks - the exported one doesn't have siteTheme
// Find the exported one
const exportIdx = ctx.indexOf('export interface StoreSettings');
if (exportIdx >= 0) {
  const blockEnd = ctx.indexOf('\n}', exportIdx) + 2;
  console.log('Exported interface:\n', ctx.substring(exportIdx, blockEnd));
} else {
  console.log('No exported interface found - interface is local only');
  // Let's check what type useStore returns  
  const storeCtx = ctx.indexOf('StoreContext');
  console.log(ctx.substring(storeCtx-20, storeCtx+200));
}

// Fix 2: Sun was accidentally added to StoreContext import in Admin.tsx
// Need to move Sun to lucide-react import instead
let admin = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Fix: remove Sun from StoreContext import
admin = admin.replace('import { Sun, useStore,', 'import { useStore,');

// Fix: add Sun to lucide-react import  
admin = admin.replace(
  'import { Package, Clock, Truck,',
  'import { Sun, Package, Clock, Truck,'
);

fs.writeFileSync('src/pages/Admin.tsx', admin, 'utf8');
console.log('Admin import fixed');
