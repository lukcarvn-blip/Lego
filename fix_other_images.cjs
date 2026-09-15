const fs = require('fs');

function fixImages(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  const regex = /item\.product\.images\[0\]/g;
  if (code.match(regex)) {
    code = code.replace(regex, "item.product.images?.[0] || '/images/fallback-logo.jpg'");
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Fixed', filePath);
  } else {
    console.log('Not found in', filePath);
  }
}

fixImages('src/pages/Admin.tsx');
fixImages('src/pages/Profile.tsx');
