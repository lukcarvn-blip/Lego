const fs = require('fs');

let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Add EffectFade import to swiper modules if missing
if (!code.includes('EffectFade')) {
  code = code.replace(/import \{ Autoplay, Navigation, Pagination \} from 'swiper\/modules';/g, "import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';");
}

// 2. Add flashScanDir state if missing
if (!code.includes('flashScanDir')) {
  code = code.replace(
    `const [heroScanDir, setHeroScanDir] = useState<'forward' | 'reverse'>('forward');`,
    `const [heroScanDir, setHeroScanDir] = useState<'forward' | 'reverse'>('forward');\n  const [flashScanDir, setFlashScanDir] = useState<'forward' | 'reverse'>('forward');`
  );
}

// 3. Update Swiper
const swiperRegex = /<Swiper[\s\S]*?className="flash-sale-swiper"\s*>/;
const newSwiper = `<Swiper
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
                >`;

if (swiperRegex.test(code)) {
  code = code.replace(swiperRegex, newSwiper);
  fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
  console.log('Successfully updated Swiper in Home.tsx');
} else {
  console.log('Could not find flash-sale-swiper to replace');
}
