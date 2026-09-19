const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const lines = code.split('\n');
const newBlock = `            <div style={{ position: 'absolute', inset: '15% 6% 15% 6%', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', zIndex: 10 }}>
              {showcaseCharacters.map((char, idx) => {
                const c = idx % 5;
                const r = Math.floor(idx / 5);
                const bgPosX = ((6 + c * 17.6) / 82.4) * 100;
                const bgPosY = ((15 + r * 35) / 65) * 100;
                
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
                          backgroundSize: '568.1818% 285.71428%',
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
                  <div className="tech-tooltip-wrapper" style={{ zIndex: 10 }}>
                    <div className="tech-tooltip-inner">
                      <div className="tech-tooltip-title">{char.name}</div>
                      <div className="tech-tooltip-quote">
                        <TypewriterText text={char.quote} isActive={hoveredChar === idx} />
                      </div>
                    </div>
                  </div>
                </div>
              );})}
            </div>`;

lines.splice(552, 591 - 552 + 1, ...newBlock.split('\n'));
fs.writeFileSync('src/pages/Home.tsx', lines.join('\n'), 'utf8');
console.log('Replaced by line slice');
