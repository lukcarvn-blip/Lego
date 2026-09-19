const fs = require('fs');

let lines = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8').split('\n');

// 1. State hook
const stateHookPos = lines.findIndex(l => l.includes('const [isInitialLoad, setIsInitialLoad] = useState(true);'));
if (stateHookPos !== -1 && !lines.find(l => l.includes('policiesExpanded'))) {
  lines.splice(stateHookPos, 0, 
    "  const [policiesExpanded, setPoliciesExpanded] = useState(true);",
    "  const [craftingExpanded, setCraftingExpanded] = useState(true);"
  );
}

// Relocate lines
const pStart = lines.findIndex(l => l.includes('Đặc Quyền & Chính Sách')) - 1; // <h3>
lines[pStart] = `            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: policiesExpanded ? '2.5rem' : '0', cursor: 'pointer' }} onClick={() => setPoliciesExpanded(!policiesExpanded)}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', margin: 0 }}>`;

const pHeaderEnd = lines.findIndex((l, i) => i > pStart && l.includes('</h3>'));
lines[pHeaderEnd] = `              </h3>
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
                >`;

const pGridEnd = lines.findIndex((l, i) => i > pHeaderEnd && l.includes('</div>')) + 27; // We know it's around 1518. Let's find exactly `</div>` that closes `.policies-grid`
// Let's find "Thu mua lại", then down 4 lines
const pEndIndex = lines.findIndex(l => l.includes('Thu mua lại'));
const pEndDiv = pEndIndex + 4; // This is the closing div of "Thu mua lại"
// The next line is closing div of policies-grid
lines.splice(pEndDiv + 1, 0, `                </motion.div>\n              )}\n            </AnimatePresence>`);

// Crafting
const cStart = lines.findIndex(l => l.includes('QUY TRÌNH CHẾ TÁC DỰ KIẾN')) - 1; // <h2>
lines[cStart] = `              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: craftingExpanded ? '1rem' : '0', cursor: 'pointer' }} onClick={() => setCraftingExpanded(!craftingExpanded)}>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>`;

const cHeaderEnd = lines.findIndex((l, i) => i > cStart && l.includes('</h2>'));
lines[cHeaderEnd] = `                </h2>
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
                  >`;

const cEndIndex = lines.findIndex(l => l.includes('Giao Hàng'));
const cEndDiv = cEndIndex + 3; // Closing of "Giao Hàng" div
// Next line is closing of the flex container for steps
lines.splice(cEndDiv + 2, 0, `                  </motion.div>\n                )}\n              </AnimatePresence>`);

fs.writeFileSync('src/pages/ProductDetails.tsx', lines.join('\n'), 'utf8');
console.log("Replaced precisely by line insertion.");
