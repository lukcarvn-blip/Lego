const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target = `<div style={{ position: 'absolute', inset: '15% 0 15% 0', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', zIndex: 10 }}>
              {showcaseCharacters.map((char, idx) => (
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
                          backgroundSize: '500% 285.71428%',
                          backgroundPosition: \`\${(idx % 5) * 25}% \${((15 + Math.floor(idx / 5) * 35) / 65) * 100}%\`,
                          opacity: hoveredChar === idx ? 1 : 0,
                          transform: hoveredChar === idx ? 'scale(1.12)' : 'scale(1)',
                          transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease',
                          pointerEvents: 'none'
                        }} 
                      />`;

const replacement = `<div style={{ position: 'absolute', inset: '15% 6% 15% 6%', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', zIndex: 10 }}>
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
                      />`;

code = code.replace(target, replacement);

// We need to also find the closing tags because we added a `{` after `=>`
const endTarget = `                  </div>
                  <div className="tech-tooltip-wrapper" style={{ zIndex: 10 }}>`;
const endReplacement = `                  </div>
                  <div className="tech-tooltip-wrapper" style={{ zIndex: 10 }}>`;
                  
const fullTarget = `                  <div className="tech-tooltip-wrapper" style={{ zIndex: 10 }}>
                    <div className="tech-tooltip-inner">
                      <div className="tech-tooltip-title">{char.name}</div>
                      <div className="tech-tooltip-quote">
                        <TypewriterText text={char.quote} isActive={hoveredChar === idx} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>`;
const fullReplacement = `                  <div className="tech-tooltip-wrapper" style={{ zIndex: 10 }}>
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

code = code.replace(fullTarget, fullReplacement);

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Fixed Home.tsx showcase inset and zoom grid');
