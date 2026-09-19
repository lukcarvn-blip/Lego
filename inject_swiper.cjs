const fs = require('fs');

let communityCode = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// Add imports
const importBlock = `
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
`;

communityCode = communityCode.replace(
  "import * as Icons from 'lucide-react';",
  "import * as Icons from 'lucide-react';" + importBlock
);

// Replace grid with Swiper
// The grid container starts at: <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem', paddingTop: '1.5rem' }}>
const oldGridOpening = "<div style={{ padding: '0 1.5rem 1.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem', paddingTop: '1.5rem' }}>";

const newSwiperOpening = `<div style={{ padding: '0 1.5rem 2.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem', paddingTop: '1.5rem' }}>
                          <Swiper
                            effect={'coverflow'}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={'auto'}
                            coverflowEffect={{
                              rotate: 0,
                              stretch: 0,
                              depth: 150,
                              modifier: 2,
                              slideShadows: true,
                            }}
                            pagination={{ clickable: true, dynamicBullets: true }}
                            navigation={true}
                            modules={[EffectCoverflow, Pagination, Navigation]}
                            className="leaderboard-coverflow-swiper"
                          >`;

// We also need to change `{col.products.map(char => (` to `{col.products.map(char => (<SwiperSlide key={char.id} style={{ width: '280px', height: 'auto', display: 'flex' }}>`
// AND remove `key={char.id}` from the inner `div`
// AND close `</SwiperSlide>` before `))}`
// AND close `</Swiper>` before `</div>`

communityCode = communityCode.replace(oldGridOpening, newSwiperOpening);

// The inner div: `<div \n                              key={char.id}\n                              onClick={() => navigate(\`/product/\${char.id}\`)}`
const innerDivRegex = /\{\s*col\.products\.map\(char\s*=>\s*\(\s*<div\s*key=\{char\.id\}/;
communityCode = communityCode.replace(innerDivRegex, `{col.products.map(char => (\n                            <SwiperSlide key={char.id} style={{ width: '280px', height: 'auto' }}>\n                            <div onClick={() => navigate(\`/product/\${char.id}\`)}`);

// We need to find the `</div>\n                          ))}` and replace with `</div></SwiperSlide>\n                          ))}`
const closingRegex = /<\/div>\s*\)\)\}\s*<\/div>\s*<\/motion\.div>/;
communityCode = communityCode.replace(closingRegex, '</div>\n                            </SwiperSlide>\n                          ))}\n                          </Swiper>\n                        </div>\n                      </motion.div>');

fs.writeFileSync('src/pages/Community.tsx', communityCode, 'utf8');
console.log('Successfully injected Swiper into Community.tsx');

// Also append to index.css
let css = fs.readFileSync('src/index.css', 'utf8');
const swiperCSS = `
/* Leaderboard Coverflow Swiper */
.leaderboard-coverflow-swiper {
  width: 100%;
  padding-bottom: 3rem !important; /* Space for pagination */
  padding-top: 1rem !important;
}

.leaderboard-coverflow-swiper .swiper-slide {
  background-position: center;
  background-size: cover;
  width: 280px;
  height: auto;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.leaderboard-coverflow-swiper .swiper-slide-active {
  opacity: 1;
}

/* Custom Navigation colors */
.leaderboard-coverflow-swiper .swiper-button-next,
.leaderboard-coverflow-swiper .swiper-button-prev {
  color: var(--color-accent);
  background: rgba(0,0,0,0.5);
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.leaderboard-coverflow-swiper .swiper-button-next:after,
.leaderboard-coverflow-swiper .swiper-button-prev:after {
  font-size: 1.2rem;
  font-weight: bold;
}
.leaderboard-coverflow-swiper .swiper-pagination-bullet {
  background: #fff;
}
.leaderboard-coverflow-swiper .swiper-pagination-bullet-active {
  background: var(--color-accent);
}
`;

if (!css.includes('.leaderboard-coverflow-swiper')) {
  css += '\n' + swiperCSS;
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('Injected CSS for Swiper.');
}
