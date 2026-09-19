const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

code = code.replace(
  '<Link to="/leaderboard"', 
  '<a href="#" onClick={(e) => { e.preventDefault(); document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" }); }}'
);
code = code.replace('</Link>', '</a>');
code = code.replace('{/* Bảng xếp hạng */}', '{/* Bảng xếp hạng */}\n          <div id="leaderboard"></div>');

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Fixed link in Community');
