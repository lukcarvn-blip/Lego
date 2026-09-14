const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const anchorStart = `{/* Mini Crafting Time Bar – shown in sticky cart when crafting */}`;
const anchorEnd = `                      {/* Collapsible body */}
                      {isSummaryOpen && (
                        <div className="summary-note" style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.8)', lineHeight: 1.5, padding: '0 1rem 0.75rem' }}>`;

const startIdx = code.indexOf(anchorStart);
const endIdx = code.indexOf(`                      {/* Collapsible body */}`);

if (startIdx !== -1 && endIdx !== -1) {
  const newBlock = `{/* Summary Note */}
                    <div className="summary-note-container" style={{ width: '100%', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      {/* Toggle header - only on mobile */}
                      {isMobile && (
                        <button
                          onClick={() => setIsSummaryOpen(prev => !prev)}
                          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgba(0,0,0,0.85)' }}
                        >
                          <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{language === 'vi' ? '📋 Thông tin lựa chọn' : '📋 Selected options'}</span>
                          <span style={{ fontSize: '1rem', transition: 'transform 0.25s', display: 'inline-block', transform: isSummaryOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                        </button>
                      )}
                      
                      {/* Collapsible body */}
                      {(!isMobile || isSummaryOpen) && (
                        <div className="summary-note" style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.8)', lineHeight: 1.5, padding: isMobile ? '0 1rem 0.75rem' : '0.75rem 1rem' }}>`;
                        
  code = code.substring(0, startIdx) + newBlock + code.substring(endIdx + `                      {/* Collapsible body */}\r\n                      {isSummaryOpen && (\r\n                        <div className="summary-note" style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.8)', lineHeight: 1.5, padding: '0 1rem 0.75rem' }}>`.length);
  // Actually line endings might cause length issues.
  
}

