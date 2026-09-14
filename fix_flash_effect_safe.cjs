const fs = require('fs');

let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!code.includes('flashScanDir')) {
  code = code.replace(
    `const [heroScanDir, setHeroScanDir] = useState<'forward' | 'reverse'>('forward');`,
    `const [heroScanDir, setHeroScanDir] = useState<'forward' | 'reverse'>('forward');\n  const [flashScanDir, setFlashScanDir] = useState<'forward' | 'reverse'>('forward');`
  );
}

const lines = code.split('\n');
const swiperEndIdx = lines.findIndex(l => l.includes('className="flash-sale-swiper"'));

if (swiperEndIdx !== -1) {
  // Find the start of the Swiper
  let swiperStartIdx = -1;
  for (let i = swiperEndIdx; i >= 0; i--) {
    if (lines[i].includes('<Swiper')) {
      swiperStartIdx = i;
      break;
    }
  }

  if (swiperStartIdx !== -1) {
    // Replace the lines between swiperStartIdx and swiperEndIdx (inclusive)
    const newLines = `                <Swiper
                  modules={[Pagination, Autoplay, Navigation, EffectFade]}
                  effect="fade"
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  navigation={{ nextEl: '.flash-next', prevEl: '.flash-prev' }}
                  style={{ width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: '150px' }}
                  className={\`flash-sale-swiper \${flashScanDir === 'reverse' ? 'is-reverse' : ''}\`}
                  onSlideNextTransitionStart={() => setFlashScanDir('forward')}
                  onSlidePrevTransitionStart={() => setFlashScanDir('reverse')}
                >`.split('\n');
                
    // Remove old lines
    lines.splice(swiperStartIdx, swiperEndIdx - swiperStartIdx + 2, ...newLines);
    
    code = lines.join('\n');
    fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
    console.log('Successfully updated Swiper in Home.tsx');
  }
}
