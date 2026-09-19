const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Persistence logic
// Find:
// const [isTopFan, setIsTopFan] = useState(false);
// Replace with:
const hookReplacement = `  const [isTopFan, setIsTopFan] = useState(false);
  
  useEffect(() => {
    if (product?.collection) {
      const fans = JSON.parse(localStorage.getItem('top_fans') || '[]');
      setIsTopFan(fans.includes(product.collection));
    }
  }, [product?.collection]);`;

code = code.replace(/const \[isTopFan, setIsTopFan\] = useState\(false\);/, hookReplacement);

// Find handleTopFanClick definition and inject localStorage logic
const handlerReplacement = `setIsTopFan(true);
    if (product?.collection) {
      const fans = JSON.parse(localStorage.getItem('top_fans') || '[]');
      if (!fans.includes(product.collection)) {
        fans.push(product.collection);
        localStorage.setItem('top_fans', JSON.stringify(fans));
      }
    }`;

code = code.replace(/setIsTopFan\(true\);/, handlerReplacement);

// 2. Rendering logic
// Find the rendering block for isTopFan
const renderBlock = `{isTopFan ? (
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
                  )}`;

const newRenderBlock = `{isTopFan ? (
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.45rem', background: 'rgba(0,0,0,0.2)', color: '#fff', padding: '2px 6px', borderRadius: '10px', marginTop: '2px' }}>
                      <Icons.Star size={8} fill="#fff" style={{ marginRight: '3px' }} />
                      {language === 'vi' ? 'FAN CỨNG' : 'TOP FAN'}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.45rem', opacity: 0.6, marginTop: '2px', borderBottom: '1px dotted rgba(255,255,255,0.4)' }}>
                      {language === 'vi' ? 'FAN CỨNG' : 'TOP FAN'}
                    </span>
                  )}`;

code = code.replace(renderBlock, newRenderBlock);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Applied Fan Cứng updates');
