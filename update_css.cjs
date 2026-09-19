const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

// Append new CSS
const newCSS = `

@keyframes badge-bounce-zoom {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.15); }
  75% { opacity: 1; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}

.pd-badge {
  width: 75px;
  height: 75px;
  opacity: 0;
  animation: badge-bounce-zoom 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.pd-badge:nth-child(1) { animation-delay: 0.1s; }
.pd-badge:nth-child(2) { animation-delay: 0.2s; }
.pd-badge:nth-child(3) { animation-delay: 0.3s; }
.pd-badge:nth-child(4) { animation-delay: 0.4s; }
.pd-badge:nth-child(5) { animation-delay: 0.5s; }
.pd-badge:nth-child(6) { animation-delay: 0.6s; }

.product-detail-banner.is-initial-load .pd-badge:nth-child(1) { animation-delay: 2.1s; }
.product-detail-banner.is-initial-load .pd-badge:nth-child(2) { animation-delay: 2.2s; }
.product-detail-banner.is-initial-load .pd-badge:nth-child(3) { animation-delay: 2.3s; }
.product-detail-banner.is-initial-load .pd-badge:nth-child(4) { animation-delay: 2.4s; }
.product-detail-banner.is-initial-load .pd-badge:nth-child(5) { animation-delay: 2.5s; }
.product-detail-banner.is-initial-load .pd-badge:nth-child(6) { animation-delay: 2.6s; }

@media (max-width: 768px) {
  .product-detail-badges {
    top: auto !important;
    bottom: 2rem !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
    width: 90% !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .pd-badge {
    flex: 1;
    min-width: 0;
    max-width: 75px;
    height: auto;
    aspect-ratio: 1/1;
  }
}
`;

code += newCSS;
fs.writeFileSync('src/index.css', code, 'utf8');
console.log('Appended badge CSS');
