const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

code = code.replace(
  "slidesPerView={'auto'}",
  "slidesPerView={'auto'}\n                            loop={true}"
);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Added loop={true} to Swiper');
