const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
if (!code.includes('import { Community }')) {
  code = code.replace("import { Profile } from './pages/Profile';", "import { Profile } from './pages/Profile';\nimport { Community } from './pages/Community';");
}
if (!code.includes('<Route path="/community"')) {
  code = code.replace("<Route path=\"/partnership\"", "<Route path=\"/community\" element={<Community />} />\n          <Route path=\"/partnership\"");
}
fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Added Community route');
