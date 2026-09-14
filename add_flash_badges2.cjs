const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const getSizeDetailsFn = `
const getSizeDetails = (sizeStr: string) => {
  if (sizeStr.includes('300')) return { label: '300%', height: '21 cm', scale: 0.6 };
  if (sizeStr.includes('400')) return { label: '400%', height: '28 cm', scale: 0.8 };
  if (sizeStr.includes('1000')) return { label: '1000%', height: '70 cm', scale: 1.2 };
  return { label: sizeStr, height: '', scale: 0.8 };
};
`;

if (!code.includes('getSizeDetails')) {
  code = code.replace('const showcaseCharacters', getSizeDetailsFn + 'const showcaseCharacters');
}

const t1 = '{product.collection && settings.collections?.find(c => c.name === product.collection) && (() => {';
const t2 = '})()}';

const replaceBadges = `<div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', transform: 'scale(0.8)', transformOrigin: 'top right' }}>
                            {/* Collection Badge */}
                            {product.collection && settings.collections?.find((c: any) => c.name === product.collection) && (() => {
                              const col = settings.collections!.find((c: any) => c.name === product.collection); if (!col) return null;
                              const IconComponent = (Icons as any)[col.iconName] || Icons.Folder;
                              return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', width: '75px', height: '75px', background: col.bg || 'rgba(255,255,255,0.1)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, color: col.color || '#fff', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textTransform: 'uppercase', pointerEvents: 'none', textAlign: 'center' }}>
                                  <IconComponent size={24} />
                                  <span style={{ lineHeight: 1.1 }}>{col.name}</span>
                                </div>
                              );
                            })()}

                            {/* Category Badge */}
                            {product.category && (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'none', textAlign: 'center' }}>
                                <Icons.Layers size={24} />
                                <span style={{ lineHeight: 1.1 }}>{product.category.toUpperCase()}</span>
                              </div>
                            )}
                            
                            {/* 3D Printed Badge */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'none', textAlign: 'center' }}>
                              <div style={{ width: '28px', height: '28px', perspective: '200px', display: 'inline-block', flexShrink: 0 }}>
                                <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateY(-45deg)' }}>
                                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, transform: 'translateZ(14px)', color: '#fff', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)' }}>3D</div>
                                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 900, transform: 'rotateY(90deg) translateZ(14px)', background: '#fff', color: '#000', boxSizing: 'border-box' }}>PRT</div>
                                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fff', transform: 'rotateX(90deg) translateZ(14px)', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)' }}></div>
                                </div>
                              </div>
                              <span style={{ lineHeight: 1.1 }}>3D PRINT</span>
                            </div>
                            
                            {/* Size Badge */}
                            {product.availableSizes?.[0] && (() => {
                              const details = getSizeDetails(product.availableSizes[0]);
                              return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'none', textAlign: 'center' }}>
                                  <Icons.Maximize size={22} style={{ marginBottom: '2px' }} />
                                  <span style={{ lineHeight: 1.1 }}>{details.label}</span>
                                  {details.height && <span style={{ fontSize: '0.45rem', opacity: 0.7, lineHeight: 1 }}>({details.height})</span>}
                                </div>
                              );
                            })()}
                          </div>`;

const searchStart = code.indexOf('className="flash-sale-swiper"');
const startIdx = code.indexOf(t1, searchStart);
if (startIdx !== -1) {
  const endIdx = code.indexOf(t2, startIdx) + t2.length;
  code = code.substring(0, startIdx) + replaceBadges + code.substring(endIdx);
  fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
  console.log('Replaced dynamically');
} else {
  console.log('Not found after flash-sale-swiper');
}
