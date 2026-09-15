const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Fix the broken Cân nặng section (the weight input got garbled)
// We need to close the InputField and div properly then replace the broken sizes block 

const broken = `                    <InputField label="Cân nặng">
                       <input type="text" placeholder="vd: 500g" value={editingProduct.weight || ''} onChange={e => setEditingProduct({...editingProduct, weight: e.target.value})} style={inputStyle} />
                           type="text"
                           value={sz}
                           onChange={e => {
                             const arr = [...(editingProduct.availableSizes || [])] as string[];
                             arr[idx] = e.target.value;
                             setEditingProduct({...editingProduct, availableSizes: arr as any});
                           }}
                           style={{ ...inputStyle, flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                         />
                         <button type="button" onClick={() => {
                           const arr = [...(editingProduct.availableSizes || [])] as string[];
                           arr.splice(idx, 1);
                           setEditingProduct({...editingProduct, availableSizes: arr as any});
                         }} style={{ padding: '0.35rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                           <Trash2 size={13} />
                         </button>
                       </div>
                     ))}
                     <button type="button" onClick={() => setEditingProduct({...editingProduct, availableSizes: [...(editingProduct.availableSizes || []), 'Size 300'] as any})}
                       style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', background: 'rgba(74,222,128,0.08)', border: '1px dashed rgba(74,222,128,0.3)', borderRadius: '4px', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                       <Plus size={13} /> Thêm kích thước
                     </button>
                   </div>
                 </div>

                 {/* Dimensions display */}
                 <div style={{ ...panelStyle, padding: '1rem' }}>
                   <h3 style={{ marginBottom: '0.875rem', color: 'var(--color-accent)', fontSize: '0.95rem' }}><LayoutDashboard size={18} style={{marginRight:6}}/> Kích thước sản phẩm</h3>
                   <InputField label="Kích thước (LxWxH)">
                     <select value={editingProduct.dimensions || ''} onChange={e => setEditingProduct({...editingProduct, dimensions: e.target.value})} style={inputStyle}>
                       <option value="">Tùy chỉnh (Nhập tay)...</option>
                       <option value="300% (21cm)">300% (21cm)</option>
                       <option value="400% (28cm)">400% (28cm)</option>
                       <option value="1000% (70cm)">1000% (70cm)</option>
                     </select>
                   </InputField>
                   {(!editingProduct.dimensions || editingProduct.dimensions === '') && (
                     <input type="text" placeholder="vd: 15x10x25cm" value={''} onChange={e => setEditingProduct({...editingProduct, dimensions: e.target.value})} style={{ ...inputStyle, marginTop: '0.5rem' }} />
                   )}
                 </div>`;

const fixed = `                    <InputField label="Cân nặng">
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

code = code.replace(broken, fixed);
fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
console.log('Fixed Admin sizes section');
