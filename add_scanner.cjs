const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const keyframesCSS = `
          @keyframes sci-fi-scan {
            0% { top: -10%; opacity: 0; }
            15% { opacity: 1; box-shadow: 0 0 40px 10px var(--color-accent); }
            50% { opacity: 1; box-shadow: 0 0 60px 15px var(--color-accent); background: #fff; }
            85% { opacity: 1; box-shadow: 0 0 40px 10px var(--color-accent); }
            100% { top: 110%; opacity: 0; }
          }
          .scanner-overlay {
            position: absolute;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--color-accent);
            z-index: 25;
            pointer-events: none;
            opacity: 0;
            animation: sci-fi-scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }`;

// Insert CSS
if (code.includes('hero-pagination {')) {
  code = code.replace('.hero-pagination {', keyframesCSS + '\n          .hero-pagination {');
}

const scannerDiv = `
          {/* Initial Scan Effect */}
          <div className="scanner-overlay"></div>
`;

// Insert div
const targetSwiper = `          style={{ width: '100%', height: '70vh', minHeight: '600px', backgroundColor: 'var(--color-bg)' }}
        >`;

if (code.includes(targetSwiper)) {
  code = code.replace(targetSwiper, targetSwiper + '\n' + scannerDiv);
} else if (code.includes(targetSwiper.replace(/\\r\\n/g, '\\n'))) {
  code = code.replace(targetSwiper.replace(/\\r\\n/g, '\\n'), targetSwiper.replace(/\\r\\n/g, '\\n') + '\n' + scannerDiv);
}

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Scanner added');
