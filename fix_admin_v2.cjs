const fs = require('fs');
let lines = fs.readFileSync('src/pages/Admin.tsx', 'utf8').split('\n');

// Lines 1658-1699 (0-indexed: 1657-1698) are broken — replace them entirely
// Lines to replace: 1658 to 1699 (1-indexed)
const newBlock = `                    <InputField label="Cân nặng">
                       <input type="text" placeholder="vd: 500g" value={editingProduct.weight || ''} onChange={e => setEditingProduct({...editingProduct, weight: e.target.value})} style={inputStyle} />
                    </InputField>
                  </div>
                </div>

                {/* Sizes / Dimensions - conditional by mode */}
                <div style={{ ...panelStyle, padding: '1rem' }}>
                  {editingProduct.isReadyStock ? (
                    <>
                      <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)', fontSize: '0.95rem' }}><LayoutGrid size={18} style={{marginRight:6}}/> Kích thước thực tế</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Nhập kích thước cụ thể của sản phẩm hàng sẵn (vd: 50cm, 30cm...)</p>
                      <input
                        type="text"
                        placeholder="vd: 50cm"
                        value={editingProduct.dimensions || ''}
                        onChange={e => setEditingProduct({...editingProduct, dimensions: e.target.value})}
                        style={{ ...inputStyle }}
                      />
                    </>
                  ) : (
                    <>
                      <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)', fontSize: '0.95rem' }}><LayoutGrid size={18} style={{marginRight:6}}/> Kích thước Chế tác</h3>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <div style={{ flex: 1, padding: '0.75rem', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-accent)' }}>1:10</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>45cm</div>
                        </div>
                        <div style={{ flex: 1, padding: '0.75rem', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-accent)' }}>1:18</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>80cm</div>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.6rem' }}>* 2 kích thước cố định cho sản phẩm Chế tác 3D.</p>
                    </>
                  )}
                </div>`;

// Replace lines 1658-1699 (0-indexed 1657-1698)
lines.splice(1657, 42, ...newBlock.split('\n'));

fs.writeFileSync('src/pages/Admin.tsx', lines.join('\n'), 'utf8');
console.log('Fixed Admin sizes section properly. Lines replaced:', newBlock.split('\n').length);
