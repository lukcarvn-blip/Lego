const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const oldBlock = `                <div style={{ 
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
                    width: craftHovered ? '70%' : '15%', height: '100%',
                    background: craftHovered ? 'linear-gradient(90deg, #f59e0b, #ea580c)' : 'rgba(255,255,255,0.2)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: '9px',
                    boxShadow: craftHovered ? '0 0 10px rgba(245, 158, 11, 0.5)' : 'none'
                  }} />
                </div>`;

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

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
  console.log("Successfully fixed ProductCard progress bar");
} else {
  // Try regex approach if line endings mismatch
  const startAnchor = `                <div style={{ \r\n                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',`;
  const endAnchor = `                  }} />\r\n                </div>`;
  if (code.includes(startAnchor) && code.includes(endAnchor)) {
    // ... we will use regex ...
    console.log("Found anchors but exact match failed. Need regex.");
  } else {
    console.log("Block not found");
  }
}
