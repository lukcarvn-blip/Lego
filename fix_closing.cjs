const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace(
  "              ))}\\n            </div>",
  "              );})}\\n            </div>"
);

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Fixed closing bracket');
