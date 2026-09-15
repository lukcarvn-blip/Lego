const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Add 'bio' to activeTab state
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'tags'>('desc');",
  "const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'tags' | 'bio'>('desc');"
);

// 1b. Make 'bio' default tab if description doesn't exist but bio does
code = code.replace(
  "if (product && !product.description?.[language]) {",
  "if (product && !product.description?.[language] && !product.biography?.[language as keyof typeof product.biography]) {"
);
code = code.replace(
  "setActiveTab('specs');",
  "setActiveTab(product?.biography?.[language as keyof typeof product.biography] ? 'bio' : 'specs');"
);

// 2. Add alignment badge and powerRanking display
const headerHtml = `              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>{product.name[language]}</h1>`;
const newHeaderHtml = `              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>
                {product.alignment && (
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.8rem', fontWeight: 700, padding: '4px 8px', borderRadius: '4px',
                    marginRight: '12px', verticalAlign: 'middle',
                    background: product.alignment === 'Hero' ? 'rgba(59, 130, 246, 0.15)' : (product.alignment === 'Villain' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(168, 162, 158, 0.15)'),
                    color: product.alignment === 'Hero' ? '#3b82f6' : (product.alignment === 'Villain' ? '#ef4444' : '#a8a29e'),
                    border: \`1px solid \${product.alignment === 'Hero' ? 'rgba(59,130,246,0.3)' : (product.alignment === 'Villain' ? 'rgba(239,68,68,0.3)' : 'rgba(168,162,158,0.3)')}\`
                  }}>
                    {product.alignment === 'Hero' ? <Shield size={14} /> : (product.alignment === 'Villain' ? <Crosshair size={14} /> : <HelpCircle size={14} />)}
                    {product.alignment.toUpperCase()}
                  </span>
                )}
                {product.name[language]}
              </h1>`;
code = code.replace(headerHtml, newHeaderHtml);

const skuHtml = `              {product.sku && (
                <span style={{ 
                  display: 'inline-flex', alignItems: 'center', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 600,
                  background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  SKU: {product.sku}
                </span>
              )}`;
const powerHtml = `              {product.sku && (
                <span style={{ 
                  display: 'inline-flex', alignItems: 'center', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 600,
                  background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  SKU: {product.sku}
                </span>
              )}
              {product.powerRanking && (
                <span style={{ 
                  display: 'inline-flex', alignItems: 'center', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 900,
                  background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  <Zap size={16} style={{marginRight: '8px'}} fill="#f59e0b"/> POWER {product.powerRanking}
                </span>
              )}`;
code = code.replace(skuHtml, powerHtml);

// 3. Add bio tab
const tabsHtml = `              {product.description?.[language] && (
              <button 
                onClick={() => setActiveTab('desc')}
                style={{ flex: 1, padding: '1rem', background: activeTab === 'desc' ? 'rgba(74, 222, 128, 0.1)' : 'transparent', borderBottom: activeTab === 'desc' ? '2px solid var(--color-accent)' : '2px solid transparent', color: activeTab === 'desc' ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none', whiteSpace: 'nowrap' }}
              >
                {t('description')}
              </button>
              )}`;
const newTabsHtml = `              {product.description?.[language] && (
              <button 
                onClick={() => setActiveTab('desc')}
                style={{ flex: 1, padding: '1rem', background: activeTab === 'desc' ? 'rgba(74, 222, 128, 0.1)' : 'transparent', borderBottom: activeTab === 'desc' ? '2px solid var(--color-accent)' : '2px solid transparent', color: activeTab === 'desc' ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none', whiteSpace: 'nowrap' }}
              >
                {t('description')}
              </button>
              )}
              {product.biography?.[language as keyof typeof product.biography] && (
              <button 
                onClick={() => setActiveTab('bio')}
                style={{ flex: 1, padding: '1rem', background: activeTab === 'bio' ? 'rgba(245, 158, 11, 0.1)' : 'transparent', borderBottom: activeTab === 'bio' ? '2px solid #f59e0b' : '2px solid transparent', color: activeTab === 'bio' ? '#f59e0b' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none', whiteSpace: 'nowrap' }}
              >
                {language === 'vi' ? 'Tiểu sử' : 'Biography'}
              </button>
              )}`;
code = code.replace(tabsHtml, newTabsHtml);

const descContentHtml = `                {activeTab === 'desc' && (
                  <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <p style={{ lineHeight: 1.6, color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                      {product.description[language]}
                    </p>
                  </motion.div>
                )}`;
const newDescContentHtml = `                {activeTab === 'desc' && (
                  <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <p style={{ lineHeight: 1.6, color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                      {product.description[language]}
                    </p>
                  </motion.div>
                )}
                {activeTab === 'bio' && product.biography && (
                  <motion.div key="bio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#f59e0b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={18} /> {language === 'vi' ? 'Hồ sơ nhân vật' : 'Character Profile'}
                        </h4>
                        <p style={{ lineHeight: 1.7, color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                          {product.biography[language as keyof typeof product.biography]}
                        </p>
                      </div>
                      {(product.powerRanking || product.alignment) && (
                        <div style={{ width: '200px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                          {product.alignment && (
                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>{language === 'vi' ? 'Phe phái' : 'Alignment'}</div>
                              <div style={{ color: product.alignment === 'Hero' ? '#3b82f6' : (product.alignment === 'Villain' ? '#ef4444' : '#a8a29e'), fontWeight: 700 }}>
                                {product.alignment.toUpperCase()}
                              </div>
                            </div>
                          )}
                          {product.powerRanking && (
                            <div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>{language === 'vi' ? 'Sức mạnh' : 'Power'}</div>
                              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Zap size={20} fill="#f59e0b" /> {product.powerRanking}
                              </div>
                              <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: \`\${product.powerRanking}%\`, background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }}></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}`;
code = code.replace(descContentHtml, newDescContentHtml);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Added profile features to ProductDetails.tsx');
