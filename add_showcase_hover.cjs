const fs = require('fs');

let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Add dim overlay after picture
const picStr = `</picture>`;
const dimOverlay = `
            <div 
              style={{
                position: 'absolute', inset: 0, 
                backgroundColor: 'rgba(0,0,0,0.7)', 
                opacity: hoveredChar !== null ? 1 : 0, 
                transition: 'opacity 0.4s ease', 
                pointerEvents: 'none', 
                zIndex: 5 
              }} 
            />`;

if (code.includes('</picture>')) {
  code = code.replace(picStr, picStr + dimOverlay);
}

// 2. Add char-zoom-layer inside showcase-hitbox
const hitboxStart = `<div className="tech-tooltip-wrapper">`;
const zoomLayer = `
                  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '4px', zIndex: 1 }}>
                     <div 
                        className="char-zoom-layer" 
                        style={{
                          position: 'absolute', 
                          inset: '-2px', // Slight overlap to prevent seams
                          backgroundImage: \`url(\${settings.middleBannerImage || settings.middleBannerImageMobile || ''})\`,
                          backgroundSize: '625% 285.71428%',
                          backgroundPosition: \`\${((10 + (idx % 5) * 16) / 84) * 100}% \${((15 + Math.floor(idx / 5) * 35) / 65) * 100}%\`,
                          opacity: hoveredChar === idx ? 1 : 0,
                          transform: hoveredChar === idx ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                          pointerEvents: 'none'
                        }} 
                      />
                  </div>
                  <div className="tech-tooltip-wrapper" style={{ zIndex: 10 }}>`;

if (code.includes(hitboxStart)) {
  code = code.replace(hitboxStart, zoomLayer);
}

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Showcase hover effect added');
