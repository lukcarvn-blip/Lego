const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

code = code.replace(
  `<div style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  marginBottom: '0.5rem', fontSize: '0.7rem',
                  color: craftHovered ? '#f59e0b' : 'rgba(255,255,255,0.35)',
                  fontWeight: 600,
                  transition: 'color 0.3s ease'
                }}>`,
  `<div className="crafting-progress-labels" style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  marginBottom: '0.5rem', fontSize: '0.7rem',
                  color: craftHovered ? '#f59e0b' : 'rgba(255,255,255,0.35)',
                  fontWeight: 600,
                  transition: 'color 0.3s ease'
                }}>`
);

code = code.replace(
  `<div style={{ 
                  width: '100%', height: '18px', background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '9px', overflow: 'hidden'
                }}>`,
  `<div className="crafting-progress-bar-wrapper" style={{ 
                  width: '100%', height: '18px', background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '9px', overflow: 'hidden'
                }}>`
);

fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
console.log('Successfully injected classes to ProductCard.tsx');
