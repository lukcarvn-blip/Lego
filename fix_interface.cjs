const fs = require('fs');
let ctx = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// The exported interface is missing siteTheme - add it
ctx = ctx.replace(
  "  bankOwner?: string;\n}",
  "  bankOwner?: string;\n  siteTheme?: 'dark' | 'light';\n}"
);

console.log('siteTheme added to exported interface:', ctx.includes("siteTheme?: 'dark' | 'light';"));
fs.writeFileSync('src/context/StoreContext.tsx', ctx, 'utf8');
