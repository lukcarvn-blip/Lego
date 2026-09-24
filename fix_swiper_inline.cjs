const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

code = code.replace(
  /<SwiperSlide key=\{`\$\{char\.id\}-\$\{idx\}`\} style=\{\{ width: '280px', height: 'auto' \}\}>/g,
  '<SwiperSlide key={`${char.id}-${idx}`}>'
);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Fixed Community.tsx inline style');
