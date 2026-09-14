const fs = require('fs');

function updateFile(filePath, eventCode) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Find handleLike
  // We want to insert the event dispatch only when liking (not unliking)
  // Look for:
  // setIsLiked(true);
  
  const searchStr = `setIsLiked(true);`;
  const insertStr = `setIsLiked(true);\n      ${eventCode}`;
  
  if (code.includes(searchStr) && !code.includes('heart-burst')) {
    code = code.replace(searchStr, insertStr);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Updated ' + filePath);
  }
}

const eventCode = `if (e && e.clientX) {
        window.dispatchEvent(new CustomEvent('heart-burst', { detail: { x: e.clientX, y: e.clientY } }));
      }`;

updateFile('src/components/ProductCard.tsx', eventCode);
updateFile('src/pages/ProductDetails.tsx', eventCode);
