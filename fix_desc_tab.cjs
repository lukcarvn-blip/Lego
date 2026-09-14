const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Wrap the desc tab button with a conditional check
const oldDescBtn = `              <button \r
                onClick={() => setActiveTab('desc')}\r
                style={{ flex: 1, padding: '1rem', background: activeTab === 'desc' ? 'rgba(74, 222, 128, 0.1)' : 'transparent', borderBottom: activeTab === 'desc' ? '2px solid var(--color-accent)' : '2px solid transparent', color: activeTab === 'desc' ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none', whiteSpace: 'nowrap' }}\r
              >\r
                {t('description')}\r
              </button>`;

const newDescBtn = `              {product.description?.[language] && (\r
              <button \r
                onClick={() => setActiveTab('desc')}\r
                style={{ flex: 1, padding: '1rem', background: activeTab === 'desc' ? 'rgba(74, 222, 128, 0.1)' : 'transparent', borderBottom: activeTab === 'desc' ? '2px solid var(--color-accent)' : '2px solid transparent', color: activeTab === 'desc' ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none', whiteSpace: 'nowrap' }}\r
              >\r
                {t('description')}\r
              </button>\r
              )}`;

if (code.includes(oldDescBtn)) {
  code = code.replace(oldDescBtn, newDescBtn);
  console.log('Step 1: Wrapped desc tab button');
} else {
  // Try without \r
  const oldAlt = `              <button \n                onClick={() => setActiveTab('desc')}\n                style={{ flex: 1, padding: '1rem', background: activeTab === 'desc' ? 'rgba(74, 222, 128, 0.1)' : 'transparent', borderBottom: activeTab === 'desc' ? '2px solid var(--color-accent)' : '2px solid transparent', color: activeTab === 'desc' ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none', whiteSpace: 'nowrap' }}\n              >\n                {t('description')}\n              </button>`;
  if (code.includes(oldAlt)) {
    const newAlt = `              {product.description?.[language] && (\n              <button \n                onClick={() => setActiveTab('desc')}\n                style={{ flex: 1, padding: '1rem', background: activeTab === 'desc' ? 'rgba(74, 222, 128, 0.1)' : 'transparent', borderBottom: activeTab === 'desc' ? '2px solid var(--color-accent)' : '2px solid transparent', color: activeTab === 'desc' ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none', whiteSpace: 'nowrap' }}\n              >\n                {t('description')}\n              </button>\n              )}`;
    code = code.replace(oldAlt, newAlt);
    console.log('Step 1 (alt): Wrapped desc tab button');
  } else {
    console.log('Step 1 FAILED: Could not find desc button');
  }
}

// 2. Add useEffect to auto-switch tab - insert after isSummaryOpen state line
const oldStateBlock = `  const [isSummaryOpen, setIsSummaryOpen] = useState(false);\r\n\r\n  useEffect`;
const newStateBlock = `  const [isSummaryOpen, setIsSummaryOpen] = useState(false);\r\n\r\n  // Auto-switch to specs tab if no description\r\n  useEffect(() => {\r\n    if (product && !product.description?.[language]) {\r\n      setActiveTab('specs');\r\n    }\r\n  }, [product?.id, language]);\r\n\r\n  useEffect`;

if (code.includes(oldStateBlock)) {
  code = code.replace(oldStateBlock, newStateBlock);
  console.log('Step 2: Added auto-switch useEffect');
} else {
  console.log('Step 2 FAILED: Could not find state block anchor');
}

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Done');
