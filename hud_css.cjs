const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const hudCss = `
          .hero-columns-container {
            opacity: 0;
            transform: translateY(15px);
            transition: opacity 0.3s ease, transform 0.3s ease;
          }
          .hero-blog-swiper .swiper-slide-active .hero-columns-container {
            animation: hud-enter 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1.5s forwards;
          }
          @keyframes hud-enter {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
`;

if (!code.includes('hud-enter')) {
  code = code.replace('@keyframes sci-fi-scan {', hudCss + '          @keyframes sci-fi-scan {');
  fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
  console.log('Added HUD css');
}
