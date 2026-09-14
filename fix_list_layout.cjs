const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const startStr = `<div
                  onMouseEnter={() => setCraftHovered(true)}
                  onMouseLeave={() => setCraftHovered(false)}
                  style={{ cursor: 'default' }}
                >
                  <span style={{ fontSize: '0.62rem', color: craftHovered ? '#f59e0b' : 'rgba(255,255,255,0.3)', fontWeight: 600, transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.3rem' }}>
                    <Clock size={10} />{craftHovered ? \`\${displayDay} ngày\` : product.estimatedPrintTime.replace('days', 'ngày')}
                  </span>
                  <div style={{ width: '100%', height: '18px', background: 'rgba(255,255,255,0.08)', borderRadius: '9px', overflow: 'hidden' }}>
                    <div style={{ width: craftHovered ? '75%' : '0%', height: '100%', background: '#f59e0b', borderRadius: '9px', transition: 'width 0.85s cubic-bezier(0.4,0,0.2,1)', boxShadow: craftHovered ? '0 0 10px rgba(245,158,11,0.5)' : 'none' }} />
                  </div>
                </div>`;

const newStr = `<div
                  onMouseEnter={() => setCraftHovered(true)}
                  onMouseLeave={() => setCraftHovered(false)}
                  style={{ cursor: 'default' }}
                >
                  {isMobile ? (
                    <div style={{ 
                      width: '100%', height: '20px', background: 'rgba(255,255,255,0.08)', 
                      borderRadius: '10px', overflow: 'hidden', position: 'relative'
                    }}>
                      <div style={{ 
                        position: 'absolute', top: 0, left: 0, bottom: 0,
                        width: craftHovered ? '75%' : '0%', height: '100%', 
                        background: '#f59e0b', borderRadius: '10px', 
                        transition: 'width 0.85s cubic-bezier(0.4,0,0.2,1)', 
                        boxShadow: craftHovered ? '0 0 10px rgba(245,158,11,0.5)' : 'none' 
                      }} />
                      <div style={{ 
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                        padding: '0 0.5rem', fontSize: '0.62rem',
                        color: craftHovered ? '#fff' : 'rgba(255,255,255,0.7)',
                        fontWeight: 600, transition: 'color 0.3s ease', zIndex: 1,
                        textShadow: craftHovered ? '0 1px 2px rgba(0,0,0,0.8)' : 'none'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Clock size={10} color={craftHovered ? '#fcd34d' : 'currentColor'} />
                          {language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}
                        </span>
                        <span>{craftHovered ? \`\${displayDay} ngày\` : product.estimatedPrintTime.replace('days', 'ngày')}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontSize: '0.62rem', color: craftHovered ? '#f59e0b' : 'rgba(255,255,255,0.3)', fontWeight: 600, transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.3rem' }}>
                        <Clock size={10} />{craftHovered ? \`\${displayDay} ngày\` : product.estimatedPrintTime.replace('days', 'ngày')}
                      </span>
                      <div style={{ width: '100%', height: '18px', background: 'rgba(255,255,255,0.08)', borderRadius: '9px', overflow: 'hidden' }}>
                        <div style={{ width: craftHovered ? '75%' : '0%', height: '100%', background: '#f59e0b', borderRadius: '9px', transition: 'width 0.85s cubic-bezier(0.4,0,0.2,1)', boxShadow: craftHovered ? '0 0 10px rgba(245,158,11,0.5)' : 'none' }} />
                      </div>
                    </>
                  )}
                </div>`;

const n = s => s.replace(/\\r\\n/g, '\\n');
if (n(code).includes(n(startStr))) {
    code = n(code).replace(n(startStr), newStr);
    fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
    console.log("List layout success");
} else {
    console.log("List layout fail");
}
