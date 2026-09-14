const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const css = `
.flash-sale-swiper {
  container-type: inline-size;
}
.flash-badge-container {
  position: absolute;
  top: 2cqw;
  right: 2cqw;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1cqw;
  align-items: flex-end;
}
.flash-badge {
  width: 4.5cqw;
  height: 4.5cqw;
  min-width: 32px;
  min-height: 32px;
  border-radius: 0.8cqw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  text-transform: uppercase;
  pointer-events: auto;
  text-align: center;
  box-shadow: 0 0.5cqw 2cqw rgba(0,0,0,0.5);
  font-weight: 800;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.9);
}
.flash-badge svg {
  width: 1.8cqw;
  height: 1.8cqw;
  min-width: 14px;
  min-height: 14px;
  margin-bottom: 4%;
}
.flash-badge-text {
  font-size: 0.65cqw;
  line-height: 1.1;
  letter-spacing: 0.05cqw;
}
.flash-badge-subtext {
  font-size: 0.4cqw;
  opacity: 0.7;
  line-height: 1;
}

/* 3D Print badge specialized CSS */
.flash-badge-3d-wrapper {
  width: 1.5cqw;
  height: 1.5cqw;
  min-width: 12px;
  min-height: 12px;
  perspective: 200px;
  display: inline-block;
  flex-shrink: 0;
  margin-bottom: 4%;
}
.flash-badge-3d-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(-20deg) rotateY(-45deg);
}
.flash-badge-3d-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  box-sizing: border-box;
}
.flash-badge-3d-front {
  font-size: 0.5cqw;
  transform: translateZ(0.75cqw);
  color: #fff;
  background: rgba(0,0,0,0.4);
}
.flash-badge-3d-side {
  font-size: 0.35cqw;
  transform: rotateY(90deg) translateZ(0.75cqw);
  background: #fff;
  color: #000;
}
.flash-badge-3d-top {
  transform: rotateX(90deg) translateZ(0.75cqw);
  background: rgba(0,0,0,0.4);
}

@media (max-width: 768px) {
  .flash-badge-container { top: 3cqw; right: 3cqw; gap: 2cqw; }
  .flash-badge { width: 10cqw; height: 10cqw; border-radius: 1.5cqw; }
  .flash-badge svg { width: 4cqw; height: 4cqw; }
  .flash-badge-text { font-size: 1.5cqw; }
  .flash-badge-subtext { font-size: 1cqw; }
  .flash-badge-3d-wrapper { width: 3.2cqw; height: 3.2cqw; }
  .flash-badge-3d-front { font-size: 1.1cqw; transform: translateZ(1.6cqw); }
  .flash-badge-3d-side { font-size: 0.7cqw; transform: rotateY(90deg) translateZ(1.6cqw); }
  .flash-badge-3d-top { transform: rotateX(90deg) translateZ(1.6cqw); }
}
`;

if (!code.includes('.flash-badge-container')) {
  fs.appendFileSync('src/index.css', css);
  console.log('Added flash badge CSS');
}
