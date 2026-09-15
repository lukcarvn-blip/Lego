const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /<div style=\{\{ position: 'absolute', inset: '15% 0 15% 0', display: 'grid', gridTemplateColumns: 'repeat\(5, 1fr\)', gridTemplateRows: 'repeat\(2, 1fr\)', zIndex: 10 \}\}>[\s\S]*?(?=<div className="tech-tooltip-wrapper")/;

const replacement = `{(() => {
              const insetTop = 15;
              const insetBottom = 15;
              const insetLeft = 6;
              const insetRight = 6;
              const cols = 5;
              const rows = 2;
              
              const wGrid = 100 - insetLeft - insetRight;
              const hGrid = 100 - insetTop - insetBottom;
              const wCell = wGrid / cols;
              const hCell = hGrid / rows;
              
              const bgWidth = 10000 / wCell;
              const bgHeight = 10000 / hCell;

              return (
                <div style={{ position: 'absolute', inset: \`\${insetTop}% \${insetRight}% \${insetBottom}% \${insetLeft}%\`, display: 'grid', gridTemplateColumns: \`repeat(\${cols}, 1fr)\`, gridTemplateRows: \`repeat(\${rows}, 1fr)\`, zIndex: 10 }}>
                  {showcaseCharacters.map((char, idx) => {
                    const c = idx % cols;
                    const r = Math.floor(idx / cols);
                    
                    const bgPosX = ((insetLeft + wCell * c) / (100 - wCell)) * 100;
                    const bgPosY = ((insetTop + hCell * r) / (100 - hCell)) * 100;

                    return (
                      <div 
                        key={idx} 
                        className="showcase-hitbox" 
                        style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredChar(idx)}
                        onMouseLeave={() => setHoveredChar(null)}
                      >
                        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '4px', zIndex: 1 }}>
                          <div 
                              className="char-zoom-layer" 
                              style={{
                                position: 'absolute', 
                                inset: 0,
                                backgroundImage: \`url(\${settings.middleBannerImage || settings.middleBannerImageMobile || ''})\`,
                                backgroundSize: \`\${bgWidth}% \${bgHeight}%\`,
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
                        </div>
                        `;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Fixed zoom math');
