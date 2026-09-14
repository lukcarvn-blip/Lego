const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace('<Swiper\n          modules={[Autoplay, Navigation, EffectFade]}\n          effect="fade"\n          spaceBetween={0}',
                    '<Swiper\n          className="hero-blog-swiper"\n          modules={[Autoplay, Navigation, EffectFade]}\n          effect="fade"\n          spaceBetween={0}');
code = code.replace('<Swiper\r\n          modules={[Autoplay, Navigation, EffectFade]}\r\n          effect="fade"\r\n          spaceBetween={0}',
                    '<Swiper\r\n          className="hero-blog-swiper"\r\n          modules={[Autoplay, Navigation, EffectFade]}\r\n          effect="fade"\r\n          spaceBetween={0}');

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Fixed Swiper className');
