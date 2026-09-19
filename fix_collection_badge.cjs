const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const start = code.indexOf('{/* Collection Badge */}');
const end = code.indexOf('{/* Category Badge */}');

if (start !== -1 && end !== -1) {
  const block = code.substring(start, end);
  
  // We want to replace the div inside the return of Collection Badge.
  // Let's just use string replace for the entire return statement inside it.
  
  const returnStart = block.indexOf('return (');
  const returnEnd = block.indexOf(');', returnStart);
  
  if (returnStart !== -1 && returnEnd !== -1) {
    const newReturn = `return (
                <div 
                  className="hover-jump" 
                  onClick={() => {
                    showToast(language === 'vi' ? 'Đã tham gia xếp hạng Fan Cứng của ' + col.name : 'Joined Top Fan ranking for ' + col.name);
                    navigate('/leaderboard');
                  }}
                  title={language === 'vi' ? 'Nhấn để trở thành Fan cứng' : 'Click to become a Top Fan'}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', width: '75px', height: 'auto', minHeight: '85px', padding: '8px 4px', background: col.bg || 'rgba(255,255,255,0.1)', border: \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, color: col.color || '#fff', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textTransform: 'uppercase', pointerEvents: 'auto', textAlign: 'center', cursor: 'pointer' }}
                >
                  <IconComponent size={20} />
                  <span style={{ lineHeight: 1.1 }}>{col.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(0,0,0,0.3)', padding: '3px 6px', borderRadius: '4px', marginTop: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Icons.Crown size={10} color="#fbbf24" />
                    <span style={{ fontSize: '0.45rem', color: '#fbbf24' }}>{language === 'vi' ? 'FAN CỨNG' : 'TOP FAN'}</span>
                  </div>
                </div>
              )`;
              
    const newBlock = block.substring(0, returnStart) + newReturn + block.substring(returnEnd + 2);
    code = code.replace(block, newBlock);
    
    fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
    console.log('Fixed Collection Badge to be Top Fan button');
  }
}
