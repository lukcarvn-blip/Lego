const fs = require('fs');
const lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

const startIntro = lines.findIndex(l => l.includes('<div className="community-intro-side">'));
// We know intro-side is around lines 62-97 in our previous edit!
console.log('startIntro:', startIntro);
for (let i = startIntro; i < startIntro + 40; i++) {
  console.log(i, lines[i]);
}
