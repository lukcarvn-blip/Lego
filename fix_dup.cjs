const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace('          className="hero-blog-swiper"\n          onAutoplayTimeLeft={onAutoplayTimeLeft}', '          onAutoplayTimeLeft={onAutoplayTimeLeft}');
code = code.replace('          className="hero-blog-swiper"\r\n          onAutoplayTimeLeft={onAutoplayTimeLeft}', '          onAutoplayTimeLeft={onAutoplayTimeLeft}');

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
