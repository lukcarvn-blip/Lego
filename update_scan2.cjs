const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const t1 = '<SwiperSlide key={prod.id}>';
const p1 = code.split(t1);

const t2 = '</SwiperSlide>';

if (p1.length > 1) {
  // Only the first one (the hero slider)
  const heroSlide = p1[1].split(t2);
  let inner = heroSlide[0];
  
  // Wrap inner content in hero-slide-content
  inner = '\n              <div className="scanner-overlay"></div>\n              <div className="hero-slide-content" style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>' 
          + inner + 
          '</div>\n            ';
          
  code = p1[0] + t1 + inner + t2 + heroSlide.slice(1).join(t2);
  
  // We need to add className="hero-blog-swiper" to the Swiper component
  code = code.replace('<Swiper\n            modules={[Pagination, Autoplay, EffectFade]}\n            effect="fade"\n            spaceBetween={0}', 
                      '<Swiper\n            className="hero-blog-swiper"\n            modules={[Pagination, Autoplay, EffectFade]}\n            effect="fade"\n            spaceBetween={0}');
  code = code.replace('<Swiper\r\n            modules={[Pagination, Autoplay, EffectFade]}\r\n            effect="fade"\r\n            spaceBetween={0}', 
                      '<Swiper\r\n            className="hero-blog-swiper"\r\n            modules={[Pagination, Autoplay, EffectFade]}\r\n            effect="fade"\r\n            spaceBetween={0}');

  fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
  console.log('Replaced dynamically');
}
