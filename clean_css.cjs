const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(/\.hero-blog-swiper \.swiper-slide \{ pointer-events: none; \}\r?\n\.hero-blog-swiper \.swiper-slide-active \{ pointer-events: auto; \}\r?\n/g, '');

fs.writeFileSync('src/index.css', code, 'utf8');
