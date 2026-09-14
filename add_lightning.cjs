const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const keyframes = `
.lightning-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  border: 2px solid var(--color-accent);
  box-shadow: 0 0 10px var(--color-accent) inset, 0 0 20px var(--color-accent);
  opacity: 0;
  animation: lightning-strike 3.5s infinite;
  pointer-events: none;
}

@keyframes lightning-strike {
  0% { opacity: 0; }
  2% { opacity: 1; filter: brightness(2); }
  4% { opacity: 0; }
  6% { opacity: 1; filter: brightness(2); }
  8% { opacity: 0; }
  100% { opacity: 0; }
}

.lightning-text {
  animation: text-lightning 3.5s infinite;
}

@keyframes text-lightning {
  0% { color: #fff; text-shadow: 0 0 10px rgba(74,222,128,0.5); }
  2% { color: var(--color-accent); text-shadow: 0 0 20px var(--color-accent), 0 0 40px var(--color-accent); }
  4% { color: #fff; text-shadow: 0 0 10px rgba(74,222,128,0.5); }
  6% { color: var(--color-accent); text-shadow: 0 0 20px var(--color-accent), 0 0 40px var(--color-accent); }
  8% { color: #fff; text-shadow: 0 0 10px rgba(74,222,128,0.5); }
  100% { color: #fff; text-shadow: 0 0 10px rgba(74,222,128,0.5); }
}
`;

if (!css.includes('.lightning-wrapper')) {
  css += '\\n' + keyframes;
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('CSS updated');
}

let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');
const target = `              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>\r
              <Zap size={32} color="var(--color-accent)" className="flash-shake" />\r
              FLASH SALE\r
              </div>`;
const replace = `              <div className="lightning-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.5rem', borderRadius: '8px', position: 'relative', marginLeft: '-1.5rem' }}>\r
                <Zap size={32} color="var(--color-accent)" className="flash-shake" />\r
                <span className="lightning-text">FLASH SALE</span>\r
              </div>`;

if (code.includes(target)) {
  code = code.replace(target, replace);
  console.log('TSX updated (CRLF)');
} else if (code.includes(target.replace(/\\r\\n/g, '\\n'))) {
  code = code.replace(target.replace(/\\r\\n/g, '\\n'), replace.replace(/\\r\\n/g, '\\n'));
  console.log('TSX updated (LF)');
}

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
