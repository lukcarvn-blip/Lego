const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const oldCss = `.product-detail-banner.is-initial-load .pd-hud-delayed {
              animation-delay: 3.5s !important;
              animation-fill-mode: both !important;
            }
            .pd-hud-delayed {
              opacity: 0;
              transform: translateY(15px);
              animation: hud-enter 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1.5s forwards;
            }`;

const newCss = `.product-detail-banner.is-initial-load .pd-hud-delayed {
              animation-delay: 3.8s !important;
              animation-fill-mode: both !important;
            }
            .pd-hud-delayed {
              opacity: 0;
              transform: translateY(15px);
              animation: hud-enter 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1.8s forwards;
            }`;

if (code.includes(oldCss)) {
  code = code.replace(oldCss, newCss);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('Fixed HUD delay');
} else {
  console.log('Match not found');
}
