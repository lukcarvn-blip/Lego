const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const regex = /const handleTopFanClick = \(e: React\.MouseEvent, colName: string\) => \{\s*e\.stopPropagation\(\);\s*if \(isTopFan\) \{/;

const replacement = `const handleTopFanClick = (e: React.MouseEvent, colName: string) => {
    e.stopPropagation();
    if (!user) {
      loginWithGoogle();
      return;
    }
    if (isTopFan) {`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('Fixed handleTopFanClick with regex');
} else {
  console.log('Target not found for handleTopFanClick regex');
}
