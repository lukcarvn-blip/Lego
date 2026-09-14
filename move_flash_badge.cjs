const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldStyle = "position: 'absolute', bottom: '15px', left: '15px', zIndex: 2, display: 'flex', flexDirection: 'column'";
const newStyle = "position: 'absolute', top: '10px', right: '10px', zIndex: 2, display: 'flex', flexDirection: 'column'";

if (code.includes(oldStyle)) {
  code = code.replace(oldStyle, newStyle);
  fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
  console.log('Successfully moved badge to top right');
} else {
  console.log('Could not find old style');
}
