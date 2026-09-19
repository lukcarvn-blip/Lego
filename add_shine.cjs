const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const shineCSS = `
.pd-badge, .flash-badge {
  position: relative;
  overflow: hidden;
}
.pd-badge::after, .flash-badge::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-25deg);
  animation: mirror-glint 3s infinite;
  z-index: 10;
  pointer-events: none;
}
@keyframes mirror-glint {
  0% { left: -150%; }
  15% { left: 200%; }
  100% { left: 200%; }
}
`;

code += '\n' + shineCSS;
fs.writeFileSync('src/index.css', code, 'utf8');
console.log('Added mirror shine effect');
