const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Inject state variables
const stateHookPos = code.indexOf('const [isInitialLoad, setIsInitialLoad] = useState(true);');
if (stateHookPos !== -1) {
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
code = code.replace(
  /<h2([^>]*)>([\s\S]*?QUY TRÌNH CHẾ TÁC DỰ KIẾN[\s\S]*?)<\/h2>([\s\S]*?)<div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between'[\s\S]*?<\/div>\n            <\/motion\.div>/m,
  (match, h2Attr, h2Content, middleContent) => {
    // We need to match the entire rest of the block till `</motion.div>`
    // The previous regex was cut off.
    return match;
  }
);
fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
