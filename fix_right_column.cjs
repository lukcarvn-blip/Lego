const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Change width: '100%' to flex: 1 for Right Column
code = code.replace(/style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0, width: '100%' }}/g, "style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0, flex: 1 }}");

// 2. Add resize listener for isMobile
const useEffectCode = `  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);\n`;

// Insert it right after the isMobile declaration
code = code.replace(/(const \[isMobile, setIsMobile\] = useState\(window\.innerWidth < 1024\);)/, "$1\n" + useEffectCode);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed Right Column overflow and added isMobile resize listener.');
