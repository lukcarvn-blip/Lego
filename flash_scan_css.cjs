const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

const newCSS = `
/* Flash Sale Horizontal Scan Effect */
@keyframes flash-reveal-forward {
  0% { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
  100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
}
@keyframes flash-scan-forward {
  0% { left: 0%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
  95% { left: 100%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
  100% { left: 100%; opacity: 0; box-shadow: none; }
}

@keyframes flash-reveal-reverse {
  0% { clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%); }
  100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
}
@keyframes flash-scan-reverse {
  0% { left: 100%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
  95% { left: 0%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
  100% { left: 0%; opacity: 0; box-shadow: none; }
}

.flash-sale-swiper .swiper-slide {
  background-color: #050505 !important;
}

.flash-sale-swiper .swiper-slide-active .flash-slide-content {
  animation: flash-reveal-forward 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.flash-sale-swiper .swiper-slide-active .flash-scanner-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #fff;
  z-index: 25;
  pointer-events: none;
  opacity: 0;
  animation: flash-scan-forward 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.flash-sale-swiper.is-reverse .swiper-slide-active .flash-slide-content {
  animation: flash-reveal-reverse 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.flash-sale-swiper.is-reverse .swiper-slide-active .flash-scanner-overlay {
  animation: flash-scan-reverse 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.flash-sale-swiper .swiper-slide-active .flash-hud-delayed {
  animation: hud-enter 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards;
  opacity: 0;
}
`;

if (!css.includes('flash-reveal-forward')) {
  fs.appendFileSync('src/index.css', newCSS);
  console.log('Added flash scan CSS to index.css');
}
