const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Add state
const stateSearch = `const onAutoplayTimeLeft =`;
const stateInsert = `const [heroScanDir, setHeroScanDir] = useState<'forward' | 'reverse'>('forward');\n  const onAutoplayTimeLeft =`;
if (!code.includes('heroScanDir')) {
  code = code.replace(stateSearch, stateInsert);
}

// 2. Update Swiper props
const swiperSearch = `<Swiper
          className="hero-blog-swiper"`;
const swiperInsert = `<Swiper
          className={\`hero-blog-swiper \${heroScanDir === 'reverse' ? 'is-reverse' : ''}\`}
          onSlideNextTransitionStart={() => setHeroScanDir('forward')}
          onSlidePrevTransitionStart={() => setHeroScanDir('reverse')}`;
if (code.includes(swiperSearch)) {
  code = code.replace(swiperSearch, swiperInsert);
}

// 3. Add CSS
const cssSearch = `@keyframes sci-fi-scan {
            0% { top: 0%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
            95% { top: 100%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
            100% { top: 100%; opacity: 0; box-shadow: none; }
          }`;
const cssInsert = `@keyframes sci-fi-scan {
            0% { top: 0%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
            95% { top: 100%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
            100% { top: 100%; opacity: 0; box-shadow: none; }
          }
          @keyframes slide-reveal-reverse {
            0% { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); }
            100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
          }
          @keyframes sci-fi-scan-reverse {
            0% { top: 100%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
            95% { top: 0%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
            100% { top: 0%; opacity: 0; box-shadow: none; }
          }
          .hero-blog-swiper.is-reverse .swiper-slide-active .hero-slide-content {
            animation: slide-reveal-reverse 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .hero-blog-swiper.is-reverse .swiper-slide-active .scanner-overlay {
            animation: sci-fi-scan-reverse 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }`;

// Check for CRLF vs LF
if (code.includes(cssSearch)) {
  code = code.replace(cssSearch, cssInsert);
} else {
  code = code.replace(cssSearch.replace(/\n/g, '\r\n'), cssInsert);
}

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Updated reverse scan');
