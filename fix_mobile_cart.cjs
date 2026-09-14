const fs = require('fs');

// Fix 1: Update CSS - move sticky cart wrapper to bottom 0, add padding-bottom for nav
let css = fs.readFileSync('src/index.css', 'utf8');
const oldCss = `@media (max-width: 1023px) {
  .sticky-cart-wrapper {
    position: fixed;
    bottom: 65px; /* above mobile nav */
    left: 0;
    right: 0;
    z-index: 90;
    padding: 0 0.75rem;
  }
}`;
const newCss = `@media (max-width: 1023px) {
  .sticky-cart-wrapper {
    position: fixed;
    bottom: 0; /* sits at bottom, padded by nav height inside */
    left: 0;
    right: 0;
    z-index: 90;
    padding: 0 0.75rem calc(65px + 0.5rem); /* 65px = mobile nav height */
  }
}`;
if (css.includes(oldCss)) {
  css = css.replace(oldCss, newCss);
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('CSS updated successfully');
} else {
  console.log('CSS anchor not found');
}

// Fix 2: Add collapse/expand toggle for summary-note-container in ProductDetails.tsx
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Find and replace the summary-note-container to add toggle
const oldBlock = `                    {/* Summary Note */}
                    <div className="summary-note-container" style={{ width: '100%', background: 'rgba(0,0,0,0.15)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                      <div className="summary-note" style={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.8)', margin: 0, lineHeight: 1.5, textAlign: 'left' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
                          {language === 'vi' ? 'Thông tin lựa chọn:' : 'Selected options:'}
                        </div>`;

const newBlock = `                    {/* Summary Note */}
                    <div className="summary-note-container" style={{ width: '100%', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)' }}>
                      <button
                        onClick={() => setIsSummaryOpen(prev => !prev)}
                        style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgba(0,0,0,0.8)' }}
                      >
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{language === 'vi' ? 'Thông tin lựa chọn' : 'Selected options'}</span>
                        <span style={{ fontSize: '1rem', transition: 'transform 0.2s', display: 'inline-block', transform: isSummaryOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                      </button>
                      {isSummaryOpen && (
                      <div className="summary-note" style={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.8)', margin: 0, lineHeight: 1.5, textAlign: 'left', padding: '0 1rem 0.75rem' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
                        </div>`;

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  // Now close the added {isSummaryOpen &&
  // Find the closing of the old summary-note div and add the extra closing brace
  const closingAnchor = `                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (`;
  const newClosingAnchor = `                      </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (`;
  if (code.includes(closingAnchor)) {
    code = code.replace(closingAnchor, newClosingAnchor);
    console.log('Summary note closing brace fixed');
  } else {
    console.log('Could not find summary note closing anchor');
  }
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('ProductDetails.tsx updated successfully');
} else {
  console.log('Summary note anchor not found');
}
