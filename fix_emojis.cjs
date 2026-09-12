const fs = require('fs');
let c = fs.readFileSync('src/pages/Home.tsx', 'utf8');

c = c.replace(
  "{ name: 'Star Wars', emoji: '⚔️',", 
  "{ name: 'Star Wars', icon: <Star size={24} />,"
);

c = c.replace(
  "{ name: 'Avengers', emoji: '🛡️',",
  "{ name: 'Avengers', icon: <Zap size={24} />,"
);

fs.writeFileSync('src/pages/Home.tsx', c);
