const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const anchor1 = `                <div style={{ \r\n                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', \r\n                  marginBottom: '0.5rem'`;
const anchor2 = `                  }} />\r\n                </div>`;

let startIdx = code.indexOf(`                <div style={{ \r\n                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', \r\n                  marginBottom: '0.5rem'`);
if (startIdx === -1) {
    startIdx = code.indexOf(`                <div style={{ \n                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', \n                  marginBottom: '0.5rem'`);
}

let endIdx = code.indexOf(`                  }} />\r\n                </div>`);
if (endIdx === -1) {
    endIdx = code.indexOf(`                  }} />\n                </div>`);
}

if (startIdx !== -1 && endIdx !== -1) {
  const newBlock = `                <div style={{ 
                  width: '100%', height: '24px', background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '12px', overflow: 'hidden', position: 'relative'
                }}>
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, bottom: 0,
                    width: craftHovered ? '70%' : '15%', height: '100%',
                    background: craftHovered ? 'linear-gradient(90deg, #f59e0b, #ea580c)' : 'rgba(255,255,255,0.2)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: '12px',
                    boxShadow: craftHovered ? '0 0 10px rgba(245, 158, 11, 0.5)' : 'none'
                  }} />
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    padding: '0 0.75rem', fontSize: '0.7rem',
                    color: craftHovered ? '#fff' : 'rgba(255,255,255,0.7)',
                    fontWeight: 600,
                    transition: 'color 0.3s ease',
                    zIndex: 1,
                    textShadow: craftHovered ? '0 1px 2px rgba(0,0,0,0.8)' : 'none'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px' }}>
                      <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} />
                      {language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}
                    </span>
                    <span style={{ 
                      fontWeight: 700,
                      minWidth: '60px', textAlign: 'right'
                    }}>
                      {craftHovered
                        ? \`\${displayDay} \${language === 'vi' ? 'ngày' : 'days'}\`
                        : product.estimatedPrintTime.replace('days', language === 'vi' ? 'ngày' : 'days')
                      }
                    </span>
                  </div>
                </div>`;
  
  // endIdx points to the start of `                  }} />\r\n                </div>`. We need to skip this.
  const endingStr = code.substring(endIdx);
  const skipLen = endingStr.indexOf('</div>') + 6;
  
  code = code.substring(0, startIdx) + newBlock + code.substring(endIdx + skipLen);
  fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
  console.log("Successfully fixed ProductCard progress bar");
} else {
  console.log("Anchors not found", startIdx, endIdx);
}
