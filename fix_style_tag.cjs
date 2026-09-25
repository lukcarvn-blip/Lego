const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I will use regex to find the useEffect block and replace it completely.
const regex = /useEffect\(\(\) => \{\s*if \(!isAdmin\) \{[\s\S]*?\}, \[isAdmin\]\);/m;

const replacement = `useEffect(() => {
    if (!isAdmin) {
      let style = document.getElementById('scale-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'scale-style';
        document.head.appendChild(style);
      }
      style.innerHTML = \`
        html {
          overflow-x: hidden !important;
        }
        body {
          margin: 0 !important;
          width: 111.11vw !important;
          max-width: 111.11vw !important;
          min-height: 111.11vh !important;
          transform: scale(0.9) !important;
          transform-origin: top left !important;
          overflow-x: hidden !important;
        }
        #root {
          width: 111.11vw !important;
          max-width: 111.11vw !important;
        }
      \`;
      
      // Clean up inline styles from previous iterations
      document.documentElement.style.cssText = '';
      document.body.style.cssText = '';
    } else {
      const style = document.getElementById('scale-style');
      if (style) style.remove();
    }
    
    return () => {
      // Don't remove on unmount because AppContent is always mounted, 
      // but if we need to, we can. Actually, we shouldn't because React might remount.
    };
  }, [isAdmin]);`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Injected style tag.');
