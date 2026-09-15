const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { Profile } from './pages/Profile';",
  "import { Profile } from './pages/Profile';\nimport { Leaderboard } from './pages/Leaderboard';"
);

code = code.replace(
  '<Route path="/profile" element={<Profile />} />',
  '<Route path="/profile" element={<Profile />} />\n          <Route path="/leaderboard" element={<Leaderboard />} />'
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Added Leaderboard route to App.tsx');
