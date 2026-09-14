const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const oldBlock = `                    {/* Mini Crafting Time Bar – shown in sticky cart when crafting */}
                    {isEffectivelyCrafting && (
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            <Clock size={12} color="#f59e0b" />
                            {language === 'vi' ? 'Đặt chế tác' : 'Crafting'}
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isFastCrafting ? '#ef4444' : '#4ade80' }}>
                            {craftTimeDays} {language === 'vi' ? 'ngày' : 'days'} {isFastCrafting ? '🚀' : ''}
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '99px', overflow: 'hidden' }}>
                          <div className="crafting-progress-fill" style={{ height: '100%', borderRadius: '99px', background: isFastCrafting ? 'linear-gradient(90deg,#ef4444,#f97316)' : 'linear-gradient(90deg,#4ade80,#22d3ee)' }} />
                        </div>
                      </div>
                    )}`;

const newBlock = `                    {/* Mini Crafting Time Bar – shown in sticky cart when crafting */}
                    {isEffectivelyCrafting && (
                      <div style={{ width: '100%' }}>
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
                    )}`;

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log("Successfully replaced mini crafting time bar");
} else {
  console.log("Block not found");
}
