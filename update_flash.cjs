const fs = require('fs');

let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Add state
const stateSearch = `const [heroScanDir, setHeroScanDir] = useState<'forward' | 'reverse'>('forward');`;
const stateInsert = `const [heroScanDir, setHeroScanDir] = useState<'forward' | 'reverse'>('forward');\n  const [flashScanDir, setFlashScanDir] = useState<'forward' | 'reverse'>('forward');`;
if (!code.includes('flashScanDir')) {
  code = code.replace(stateSearch, stateInsert);
}

// 2. Update flash-sale-swiper
const swiperSearch = `                <Swiper
                  modules={[Pagination, Autoplay, Navigation]}
                  spaceBetween={20}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  navigation={{ nextEl: '.flash-next', prevEl: '.flash-prev' }}
                  style={{ width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: '150px' }}
                  className="flash-sale-swiper"
                >`;
const swiperInsert = `                <Swiper
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

if (code.includes(swiperSearch)) {
  code = code.replace(swiperSearch, swiperInsert);
} else {
  code = code.replace(swiperSearch.replace(/\n/g, '\r\n'), swiperInsert);
}

// 3. Update SwiperSlide content
// Wrap the image and badge inside flash-slide-content
// Add flash-scanner-overlay
const slideContentSearch = `<div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', background: 'rgba(0,0,0,0.5)', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
                          <img 
                            src={product.bannerImages?.[0] || product.bannerImage || product.images?.[0]} 
                            alt={product.name[language as keyof typeof product.name]}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div className="flash-badge-container">`;

const slideContentInsert = `<div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', backgroundColor: '#050505', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
                          <div className="flash-scanner-overlay"></div>
                          <div className="flash-slide-content" style={{ position: 'absolute', inset: 0 }}>
                            <img 
                              src={product.bannerImages?.[0] || product.bannerImage || product.images?.[0]} 
                              alt={product.name[language as keyof typeof product.name]}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="flash-badge-container flash-hud-delayed">`;

if (code.includes(slideContentSearch)) {
  code = code.replace(slideContentSearch, slideContentInsert);
} else {
  code = code.replace(slideContentSearch.replace(/\n/g, '\r\n'), slideContentInsert);
}

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Updated Home.tsx for flash scan');
