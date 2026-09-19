const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Inject state variables
const stateHookPos = code.indexOf('const [isInitialLoad, setIsInitialLoad] = useState(true);');
if (stateHookPos !== -1 && !code.includes('policiesExpanded')) {
  const injection = `const [policiesExpanded, setPoliciesExpanded] = useState(true);
  const [craftingExpanded, setCraftingExpanded] = useState(true);\n  `;
  code = code.substring(0, stateHookPos) + injection + code.substring(stateHookPos);
}

// 2. Modify Policies Block
code = code.replace(
  /<div className="glass-panel" style={{ padding: '2\.5rem', borderRadius: '16px' }}>([\s\S]*?)<h3([^>]*)>([\s\S]*?)<\/h3>([\s\S]*?)<div className="policies-grid">([\s\S]*?)<\/div>\n          <\/div>/m,
  (match, p1, h3Attr, h3Content, p4, gridContent) => {
    return `<div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: policiesExpanded ? '2.5rem' : '0', cursor: 'pointer' }} onClick={() => setPoliciesExpanded(!policiesExpanded)}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', margin: 0 }}>
                ${h3Content.trim()}
              </h3>
              <button 
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {policiesExpanded ? <Minus size={24} /> : <Plus size={24} />}
              </button>
            </div>
            
            <AnimatePresence>
              {policiesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="policies-grid">
                    ${gridContent}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>`;
  }
);

// 3. Modify Crafting UI Block
// Find the exact boundaries of the Crafting block
const h2Start = code.indexOf(`<h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>`);
if(h2Start !== -1) {
  const h2End = code.indexOf(`</h2>`, h2Start) + 5;
  const contentStart = h2End;
  const craftEnd = code.indexOf(`</motion.div>`, contentStart);
  
  const h2Block = code.substring(h2Start, h2End);
  const contentBlock = code.substring(contentStart, craftEnd);
  
  const newH2Block = h2Block.replace(
    `<h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>`,
    `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: craftingExpanded ? '1rem' : '0', cursor: 'pointer' }} onClick={() => setCraftingExpanded(!craftingExpanded)}>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>`
  ).replace(
    `</h2>`,
    `</h2>
                <button 
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {craftingExpanded ? <Minus size={24} /> : <Plus size={24} />}
                </button>
              </div>`
  );
  
  const newContentBlock = `
              <AnimatePresence>
                {craftingExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >${contentBlock}
                  </motion.div>
                )}
              </AnimatePresence>
            `;
            
  code = code.substring(0, h2Start) + newH2Block + newContentBlock + code.substring(craftEnd);
}

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log("Successfully replaced both blocks!");
