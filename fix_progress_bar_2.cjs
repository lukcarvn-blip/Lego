const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const anchor1 = "{/* Mini Crafting Time Bar – shown in sticky cart when crafting */}";
const anchor2 = "{/* Summary Note */}";

const startIdx = code.indexOf(anchor1);
const endIdx = code.indexOf(anchor2);

if (startIdx !== -1 && endIdx !== -1) {
  const newBlock = `{/* Mini Crafting Time Bar – shown in sticky cart when crafting */}
                    {isEffectivelyCrafting && (
                      <div style={{ width: '100%', marginBottom: '0.5rem' }}>
                        <div style={{ width: '100%', height: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '99px', overflow: 'hidden', position: 'relative' }}>
                          <div className="crafting-progress-fill" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, borderRadius: '99px', background: isFastCrafting ? 'linear-gradient(90deg,#ef4444,#f97316)' : 'linear-gradient(90deg, rgba(74,222,128,0.8), rgba(34,211,238,0.8))' }} />
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.75rem', zIndex: 1 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: '#fff', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                              <Clock size={12} color="#fcd34d" />
                              {language === 'vi' ? 'Đặt chế tác' : 'Crafting'}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                              {craftTimeDays} {language === 'vi' ? 'ngày' : 'days'} {isFastCrafting ? '🚀' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    `;
  
  code = code.substring(0, startIdx) + newBlock + code.substring(endIdx);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log("Successfully replaced mini crafting time bar");
} else {
  console.log("Anchors not found");
}
