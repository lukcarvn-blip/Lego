const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Inject state variables
const stateHookPos = code.indexOf('const [isInitialLoad, setIsInitialLoad] = useState(true);');
if (stateHookPos !== -1 && !code.includes('policiesExpanded')) {
  const injection = `const [policiesExpanded, setPoliciesExpanded] = useState(true);
  const [craftingExpanded, setCraftingExpanded] = useState(true);\n  `;
  code = code.substring(0, stateHookPos) + injection + code.substring(stateHookPos);
}

// 2. Policies header replacement
code = code.replace(
  /<h3 style=\{\{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem' \}\}>\s*\{language === 'vi' \? 'Đặc Quyền & Chính Sách' : 'Exclusive Policies'\}\s*<\/h3>/m,
  `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: policiesExpanded ? '2.5rem' : '0', cursor: 'pointer' }} onClick={() => setPoliciesExpanded(!policiesExpanded)}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', margin: 0 }}>
                {language === 'vi' ? 'Đặc Quyền & Chính Sách' : 'Exclusive Policies'}
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
                >`
);

// Close Policies
code = code.replace(
  /<\/p>\n              <\/div>\n            <\/div>\n          <\/div>/m,
  `</p>
              </div>
            </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>`
);


// 3. Crafting header replacement
code = code.replace(
  /<h2 style=\{\{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' \}\}>\s*<Clock size=\{20\} color="#f59e0b" \/>\s*\{language === 'vi' \? 'QUY TRÌNH CHẾ TÁC DỰ KIẾN' : 'Estimated Crafting Process'\}\s*<\/h2>/m,
  `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: craftingExpanded ? '1rem' : '0', cursor: 'pointer' }} onClick={() => setCraftingExpanded(!craftingExpanded)}>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={20} color="#f59e0b" /> 
                  {language === 'vi' ? 'QUY TRÌNH CHẾ TÁC DỰ KIẾN' : 'Estimated Crafting Process'}
                </h2>
                <button 
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {craftingExpanded ? <Minus size={24} /> : <Plus size={24} />}
                </button>
              </div>
              <AnimatePresence>
                {craftingExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >`
);

// Close Crafting
code = code.replace(
  /<\/div>\n              <\/div>\n            <\/motion\.div>/m,
  `</div>
              </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>`
);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log("Done!");
