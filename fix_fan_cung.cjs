const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Add confetti import
if (!code.includes("import confetti from 'canvas-confetti'")) {
    code = code.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';\nimport confetti from 'canvas-confetti';");
}

// 2. Add isTopFan state and handler right after useStore
const stateRegex = /const \{ products, .*?\} = useStore\(\);/;
const stateMatch = code.match(stateRegex);

if (stateMatch && !code.includes('const [isTopFan, setIsTopFan] = useState(false);')) {
    const hookInsertion = `
  const [isTopFan, setIsTopFan] = useState(false);
  
  const handleTopFanClick = (e: React.MouseEvent, colName: string) => {
    e.stopPropagation();
    if (isTopFan) {
      navigate('/leaderboard');
      return;
    }
    
    setIsTopFan(true);
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x, y },
      colors: ['#fbbf24', '#f59e0b', '#ffffff'],
      shapes: ['star', 'circle']
    });
    
    showToast(language === 'vi' ? 'Tuyệt vời! Bạn đã là Fan cứng của ' + colName : 'Awesome! You are now a Top Fan of ' + colName);
  };
`;
    code = code.replace(stateMatch[0], stateMatch[0] + hookInsertion);
}

// 3. Update the Collection Badge rendering
const badgeRegex = /\{\/\* Collection Badge \*\/\}.*?\}\)\(\)\}/s;
const newBadge = `{/* Collection Badge */}
            {product.collection && settings.collections?.find((c: any) => c.name === product.collection) && (() => {
              const col = settings.collections!.find((c: any) => c.name === product.collection); if (!col) return null;
              const IconComponent = Icons[col.iconName as keyof typeof Icons] as any || Icons.Folder;
              return (
                <div 
                  className="hover-jump" 
                  onClick={(e) => handleTopFanClick(e, col.name)}
                  title={language === 'vi' ? 'Nhấn để trở thành Fan cứng' : 'Click to become a Top Fan'}
                  style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', 
                    width: '75px', height: '75px', 
                    background: isTopFan ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' : (col.bg || 'rgba(255,255,255,0.1)'), 
                    border: isTopFan ? '1px solid #fef3c7' : \`1px solid \${col.border || 'rgba(255,255,255,0.2)'}\`, 
                    color: isTopFan ? '#000' : (col.color || '#fff'), 
                    borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', 
                    boxShadow: isTopFan ? '0 0 20px rgba(251, 191, 36, 0.5)' : '0 8px 32px rgba(0,0,0,0.5)', 
                    textTransform: 'uppercase', pointerEvents: 'auto', textAlign: 'center', cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <IconComponent size={22} style={{ filter: isTopFan ? 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' : 'none' }} />
                  <span style={{ lineHeight: 1.1, marginTop: '2px' }}>{col.name}</span>
                  
                  {isTopFan ? (
                    <span style={{ fontSize: '0.45rem', background: 'rgba(0,0,0,0.2)', color: '#fff', padding: '2px 6px', borderRadius: '10px', marginTop: '2px' }}>
                      {language === 'vi' ? 'FAN CỨNG' : 'TOP FAN'}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.45rem', opacity: 0.6, marginTop: '2px', borderBottom: '1px dotted rgba(255,255,255,0.4)' }}>
                      {language === 'vi' ? 'THAM GIA?' : 'JOIN FAN?'}
                    </span>
                  )}
                  
                  {isTopFan && (
                    <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#fff', color: '#f59e0b', borderRadius: '50%', padding: '2px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
                      <Icons.Crown size={12} fill="#f59e0b" />
                    </div>
                  )}
                </div>
              )
            })()}`;

if (code.match(badgeRegex)) {
    code = code.replace(badgeRegex, newBadge);
    fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
    console.log('Fixed Top Fan badge styling and behavior');
} else {
    console.log('Badge regex failed');
}
