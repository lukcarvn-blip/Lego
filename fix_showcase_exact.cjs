const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldOverlay = `<div 
              style={{
                position: 'absolute', inset: 0, 
                backgroundColor: 'rgba(0,0,0,0.7)', 
                opacity: hoveredChar !== null ? 1 : 0, 
                transition: 'opacity 0.4s ease', 
                pointerEvents: 'none', 
                zIndex: 5 
              }} 
            />`;

if (code.includes(oldOverlay)) {
    code = code.replace(oldOverlay, '');
    console.log('Removed old overlay');
} else {
    // try removing spaces
    console.log('Could not find old overlay exactly');
}

const oldZoomBlock = `<div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '4px', zIndex: 1 }}>
                     <div 
                        className="char-zoom-layer" 
                        style={{
                          position: 'absolute', 
                          inset: 0,
                          backgroundImage: \`url(\${settings.middleBannerImage || settings.middleBannerImageMobile || ''})\`,
                          backgroundSize: '657.8947% 285.71428%',
                          backgroundPosition: \`\${bgPosX}% \${bgPosY}%\`,
                          opacity: hoveredChar === idx ? 1 : 0,
                          transform: hoveredChar === idx ? 'scale(1.12)' : 'scale(1)',
                          transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease',
                          pointerEvents: 'none'
                        }} 
                      />
                  <div style={{ 
                    position: 'absolute', inset: 0, 
                    boxShadow: hoveredChar === idx ? 'inset 0 0 20px 8px rgba(0,0,0,0.8)' : 'none', 
                    borderRadius: '4px', zIndex: 2, pointerEvents: 'none',
                    transition: 'box-shadow 0.5s ease'
                  }} />
                  </div>`;

const newHighlightBlock = `<div style={{ position: 'absolute', inset: 0, border: hoveredChar === idx ? '2px solid rgba(255,255,255,0.4)' : 'none', borderRadius: '4px', zIndex: 1, pointerEvents: 'none', transition: 'border 0.3s ease', boxShadow: hoveredChar === idx ? 'inset 0 0 20px rgba(255,255,255,0.2), 0 0 15px rgba(255,255,255,0.1)' : 'none' }} />`;

if (code.includes(oldZoomBlock)) {
    code = code.replace(oldZoomBlock, newHighlightBlock);
    console.log('Replaced zoom block');
} else {
    console.log('Could not find old zoom block exactly');
}

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');

