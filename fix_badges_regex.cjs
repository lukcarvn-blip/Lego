const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

const regex = /\.flash-badge-container\s*\{[\s\S]*?@media \(max-width: 768px\) \{[\s\S]*?\}\s*\}/;

const newCss = `
.flash-container-wrapper {
  container-type: size;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

.flash-badge-container {
  position: absolute;
  top: 5cqh;
  right: 5cqh;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 2.5cqh;
  align-items: flex-end;
}
.flash-badge {
  width: 18cqh;
  height: 18cqh;
  border-radius: 3cqh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  text-transform: uppercase;
  pointer-events: auto;
  text-align: center;
  box-shadow: 0 1cqh 3cqh rgba(0,0,0,0.5);
  font-weight: 800;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.9);
}
.flash-badge svg {
  width: 6.5cqh;
  height: 6.5cqh;
  margin-bottom: 4%;
}
.flash-badge-text {
  font-size: 2.2cqh;
  line-height: 1.1;
  letter-spacing: 0.1cqh;
}
.flash-badge-subtext {
  font-size: 1.5cqh;
  opacity: 0.7;
  line-height: 1;
}

/* 3D Print badge specialized CSS */
.flash-badge-3d-wrapper {
  width: 5cqh;
  height: 5cqh;
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
  font-size: 1.8cqh;
  transform: translateZ(2.5cqh);
  color: #fff;
  background: rgba(0,0,0,0.4);
}
.flash-badge-3d-side {
  font-size: 1.2cqh;
  transform: rotateY(90deg) translateZ(2.5cqh);
  background: #fff;
  color: #000;
}
.flash-badge-3d-top {
  transform: rotateX(90deg) translateZ(2.5cqh);
  background: rgba(0,0,0,0.4);
}
`;

if (regex.test(css)) {
  css = css.replace(regex, newCss);
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('Replaced badge CSS with regex');
} else {
  console.log('Regex did not match!');
}
