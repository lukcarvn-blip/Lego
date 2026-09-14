const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

let startIdx = code.indexOf(`<div
                style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', cursor: 'default' }}
                onMouseEnter={() => setCraftHovered(true)}
                onMouseLeave={() => setCraftHovered(false)}
              >`);
if (startIdx === -1) {
  startIdx = code.indexOf(`<div\r\n                style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', cursor: 'default' }}\r\n                onMouseEnter={() => setCraftHovered(true)}\r\n                onMouseLeave={() => setCraftHovered(false)}\r\n              >`);
}

let endIdx = code.indexOf(`              </div>\n            )}`, startIdx);
if (endIdx === -1) {
    endIdx = code.indexOf(`              </div>\r\n            )}`, startIdx);
}

if (startIdx !== -1 && endIdx !== -1) {
  const newBlock = `<div
                style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', cursor: 'default' }}
                onMouseEnter={() => setCraftHovered(true)}
                onMouseLeave={() => setCraftHovered(false)}
              >
                {isMobile ? (
                  <div style={{ 
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
                  </div>
                ) : (
                  <>
                    <div style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      marginBottom: '0.5rem', fontSize: '0.7rem',
                      color: craftHovered ? '#f59e0b' : 'rgba(255,255,255,0.35)',
                      fontWeight: 600,
                      transition: 'color 0.3s ease'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        {language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}
                      </span>
                      <span style={{ 
                        color: craftHovered ? '#f59e0b' : 'rgba(255,255,255,0.35)',
                        fontWeight: 700,
                        transition: 'color 0.3s ease',
                        minWidth: '60px', textAlign: 'right'
                      }}>
                        {craftHovered
                          ? \`\${displayDay} \${language === 'vi' ? 'ngày' : 'days'}\`
                          : product.estimatedPrintTime.replace('days', language === 'vi' ? 'ngày' : 'days')
                        }
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', height: '18px', background: 'rgba(255,255,255,0.1)', 
                      borderRadius: '9px', overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: craftHovered ? '75%' : '0%',
                        height: '100%',
                        background: '#f59e0b',
                        borderRadius: '9px',
                        transition: 'width 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: craftHovered ? '0 0 12px rgba(245,158,11,0.6)' : 'none'
                      }}></div>
                    </div>
                  </>
                )}
`;

  const skipLen = `              </div>\n`.length; // or `              </div>\r\n`.length, wait we just want to replace up to `              </div>`
  
  // endIdx is the index of `              </div>\n            )}`.
  // We want to replace the `</div>` there. So we will just replace from startIdx to endIdx + `              </div>`.length.
  let lenOfEndDiv = `              </div>`.length;
  code = code.substring(0, startIdx) + newBlock + code.substring(endIdx + lenOfEndDiv);
  fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
  console.log("Success");
} else {
  console.log("Anchors not found", startIdx, endIdx);
}
