const fs = require('fs');

function fixAll(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // replace p.images[0]
  if (code.includes('p.images[0]')) {
    code = code.replace(/p\.images\[0\]/g, "p.images?.[0] || '/images/fallback-logo.jpg'");
    changed = true;
  }
  
  // replace product.images[0]
  if (code.includes('product.images[0]')) {
    code = code.replace(/product\.images\[0\]/g, "product.images?.[0] || '/images/fallback-logo.jpg'");
    changed = true;
  }
  
  // replace printer.images[0]
  if (code.includes('printer.images[0]')) {
    code = code.replace(/printer\.images\[0\]/g, "printer.images?.[0] || '/images/fallback-logo.jpg'");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Fixed', filePath);
  }
}

fixAll('src/context/StoreContext.tsx');
fixAll('src/pages/Admin.tsx');
fixAll('src/pages/Technology.tsx');
