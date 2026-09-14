const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const oldBlock = `                <div style={{ \r\n                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', \r\n                  marginBottom: '0.5rem', fontSize: '0.7rem',\r\n                  color: craftHovered ? '#f59e0b' : 'rgba(255,255,255,0.35)',\r\n                  fontWeight: 600,\r\n                  transition: 'color 0.3s ease'\r\n                }}>\r\n                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>\r\n                    <Clock size={12} />\r\n                    {language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}\r\n                  </span>\r\n                  <span style={{ \r\n                    color: craftHovered ? '#f59e0b' : 'rgba(255,255,255,0.35)',\r\n                    fontWeight: 700,\r\n                    transition: 'color 0.3s ease',\r\n                    minWidth: '60px', textAlign: 'right'\r\n                  }}>\r\n                    {craftHovered\r\n                      ? \`\${displayDay} \${language === 'vi' ? 'ngày' : 'days'}\`\r\n                      : product.estimatedPrintTime.replace('days', language === 'vi' ? 'ngày' : 'days')\r\n                    }\r\n                  </span>\r\n                </div>\r\n                <div style={{ \r\n                  width: '100%', height: '18px', background: 'rgba(255,255,255,0.1)', \r\n                  borderRadius: '9px', overflow: 'hidden'\r\n                }}>\r\n                  <div style={{ \r\n                    width: craftHovered ? '75%' : '0%',\r\n                    height: '100%',\r\n                    background: '#f59e0b',\r\n                    borderRadius: '9px',\r\n                    transition: 'width 0.85s cubic-bezier(0.4, 0, 0.2, 1)',\r\n                    boxShadow: craftHovered ? '0 0 12px rgba(245,158,11,0.6)' : 'none'\r\n                  }}></div>\r\n                </div>`;

const newBlock = `                <div style={{ 
                  width: '100%', height: '24px', background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '12px', overflow: 'hidden', position: 'relative'
                }}>
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, bottom: 0,
                    width: craftHovered ? '75%' : '0%',
                    background: '#f59e0b',
                    transition: 'width 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: '12px',
                    boxShadow: craftHovered ? '0 0 12px rgba(245,158,11,0.6)' : 'none'
                  }}></div>
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

// Use normalize helper
const n = (s) => s.replace(/\\r\\n/g, '\\n');
if (n(code).includes(n(oldBlock))) {
  code = n(code).replace(n(oldBlock), newBlock);
  fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
  console.log("Success");
} else {
  console.log("Failed");
}
