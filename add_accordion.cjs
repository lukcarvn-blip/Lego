const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Inject state variables
const stateHookPos = code.indexOf('const [isInitialLoad, setIsInitialLoad] = useState(true);');
if (stateHookPos !== -1) {
  const injection = `const [policiesExpanded, setPoliciesExpanded] = useState(true);
  const [craftingExpanded, setCraftingExpanded] = useState(true);\n  `;
  code = code.substring(0, stateHookPos) + injection + code.substring(stateHookPos);
} else {
  console.log("Could not find state hook position.");
  process.exit(1);
}

// 2. Modify Policies Block
const polStart = code.indexOf(`{/* Exclusive Policies */}`);
const polEnd = code.indexOf(`</motion.div>`, polStart) + `</motion.div>`.length;

let polBlock = code.substring(polStart, polEnd);

polBlock = polBlock.replace(
  `<h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem' }}>`,
  `<h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', margin: 0 }}>`
);

polBlock = polBlock.replace(
  `{language === 'vi' ? 'Đặc Quyền & Chính Sách' : 'Exclusive Policies'}\n            </h3>`,
  `{language === 'vi' ? 'Đặc Quyền & Chính Sách' : 'Exclusive Policies'}
            </h3>
            <button 
              onClick={() => setPoliciesExpanded(!policiesExpanded)}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {policiesExpanded ? <Minus size={24} /> : <Plus size={24} />}
            </button>`
);

polBlock = polBlock.replace(
  `<div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>\n            <h3`,
  `<div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: policiesExpanded ? '2.5rem' : '0' }}>
            <h3`
);

polBlock = polBlock.replace(
  `</button>`,
  `</button>
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

// We need to wrap the grid inside AnimatePresence
polBlock = polBlock.replace(
  `</div>\n          </div>\n          </motion.div>`,
  `</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </motion.div>`
);

code = code.substring(0, polStart) + polBlock + code.substring(polEnd);

// 3. Modify Crafting UI Block
const craftStart = code.indexOf(`{/* Crafting Progress Bar UI */}`);
const craftEnd = code.indexOf(`</motion.div>`, craftStart) + `</motion.div>`.length;

let craftBlock = code.substring(craftStart, craftEnd);

craftBlock = craftBlock.replace(
  `{language === 'vi' ? 'QUY TRÌNH CHẾ TÁC DỰ KIẾN' : 'Estimated Crafting Process'}\n              </h2>`,
  `{language === 'vi' ? 'QUY TRÌNH CHẾ TÁC DỰ KIẾN' : 'Estimated Crafting Process'}
              </h2>
              <button 
                onClick={() => setCraftingExpanded(!craftingExpanded)}
                style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {craftingExpanded ? <Minus size={24} /> : <Plus size={24} />}
              </button>`
);

craftBlock = craftBlock.replace(
  `<h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>`,
  `<div style={{ display: 'flex', alignItems: 'center', marginBottom: craftingExpanded ? '1rem' : '0' }}>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>`
);

craftBlock = craftBlock.replace(
  `</button>`,
  `</button>
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

craftBlock = craftBlock.replace(
  `</div>\n            </motion.div>`,
  `</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>`
);

code = code.substring(0, craftStart) + craftBlock + code.substring(craftEnd);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log("Applied accordion changes to ProductDetails.tsx");
