const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Replace the container
const oldContainer = `<div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', transform: 'scale(0.8)', transformOrigin: 'top right' }}>`;
const newContainer = `<div className="flash-badge-container">`;
code = code.replace(oldContainer, newContainer);

// Replace Collection Badge
const oldColBadge = `<div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', width: '75px', height: '75px', background: col.bg || 'rgba(255,255,255,0.1)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, color: col.color || '#fff', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textTransform: 'uppercase', pointerEvents: 'auto', textAlign: 'center' }}>
                                  <IconComponent size={24} />
                                  <span style={{ lineHeight: 1.1 }}>{col.name}</span>
                                </div>`;
const newColBadge = `<div className="flash-badge hover-jump" style={{ background: col.bg, border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, color: col.color }}>
                                  <IconComponent />
                                  <span className="flash-badge-text">{col.name}</span>
                                </div>`;
code = code.replace(oldColBadge, newColBadge);

// Replace Category Badge
const oldCatBadge = `<div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center' }}>
                                <Icons.Layers size={24} />
                                <span style={{ lineHeight: 1.1 }}>{product.category.toUpperCase()}</span>
                              </div>`;
const newCatBadge = `<div className="flash-badge hover-jump">
                                <Icons.Layers />
                                <span className="flash-badge-text">{product.category.toUpperCase()}</span>
                              </div>`;
code = code.replace(oldCatBadge, newCatBadge);

// Replace 3D Badge
const old3DBadge = `<div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center' }}>
                              <div style={{ width: '28px', height: '28px', perspective: '200px', display: 'inline-block', flexShrink: 0 }}>
                                <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateY(-45deg)' }}>
                                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, transform: 'translateZ(14px)', color: '#fff', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)' }}>3D</div>
                                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 900, transform: 'rotateY(90deg) translateZ(14px)', background: '#fff', color: '#000', boxSizing: 'border-box' }}>PRT</div>
                                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fff', transform: 'rotateX(90deg) translateZ(14px)', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)' }}></div>
                                </div>
                              </div>
                              <span style={{ lineHeight: 1.1 }}>3D PRINT</span>
                            </div>`;
const new3DBadge = `<div className="flash-badge hover-jump">
                              <div className="flash-badge-3d-wrapper">
                                <div className="flash-badge-3d-inner">
                                  <div className="flash-badge-3d-face flash-badge-3d-front">3D</div>
                                  <div className="flash-badge-3d-face flash-badge-3d-side">PRT</div>
                                  <div className="flash-badge-3d-face flash-badge-3d-top"></div>
                                </div>
                              </div>
                              <span className="flash-badge-text">3D PRINT</span>
                            </div>`;
code = code.replace(old3DBadge, new3DBadge);

// Replace Size Badge
const oldSizeBadge = `<div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center' }}>
                                  <Icons.Maximize size={22} style={{ marginBottom: '2px' }} />
                                  <span style={{ lineHeight: 1.1 }}>{details.label}</span>
                                  {details.height && <span style={{ fontSize: '0.45rem', opacity: 0.7, lineHeight: 1 }}>({details.height})</span>}
                                </div>`;
const newSizeBadge = `<div className="flash-badge hover-jump">
                                  <Icons.Maximize />
                                  <span className="flash-badge-text">{details.label}</span>
                                  {details.height && <span className="flash-badge-subtext">({details.height})</span>}
                                </div>`;
code = code.replace(oldSizeBadge, newSizeBadge);

// Handle CRLF differences
if (!code.includes('flash-badge-container')) {
  // If no match, try CRLF regex or manual fixes
  console.log('Replacing CRLF fallback...');
  code = code.replace(oldContainer.replace(/\n/g, '\r\n'), newContainer);
  code = code.replace(oldColBadge.replace(/\n/g, '\r\n'), newColBadge);
  code = code.replace(oldCatBadge.replace(/\n/g, '\r\n'), newCatBadge);
  code = code.replace(old3DBadge.replace(/\n/g, '\r\n'), new3DBadge);
  code = code.replace(oldSizeBadge.replace(/\n/g, '\r\n'), newSizeBadge);
}

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Replaced TSX');
