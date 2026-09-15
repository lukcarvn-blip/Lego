const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// 1. Update useSessionState for productSubTab
code = code.replace(
  `useSessionState<'list' | 'collections'>('admin_productSubTab', 'list');`,
  `useSessionState<'list' | 'collections' | 'sizes'>('admin_productSubTab', 'list');`
);

// 2. Add Tab button
const sizesTabButton = `
          <button 
            onClick={() => setProductSubTab('sizes')} 
            style={{ 
              background: productSubTab === 'sizes' ? 'var(--color-accent)' : 'transparent',
              color: productSubTab === 'sizes' ? '#000' : 'var(--color-text-muted)',
              border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
            }}
          >
            Quản lý Size
          </button>`;

code = code.replace(
  `onClick={() => setProductSubTab('collections')}`,
  `onClick={() => setProductSubTab('collections')}
          >
            Bộ sưu tập
          </button>${sizesTabButton}
          <button 
            style={{ display: 'none' }}` // Dummy replacement to fix syntax around the replaced area
);
// Actually a better way to replace the tab button:
code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
code = code.replace(
  `useSessionState<'list' | 'collections'>('admin_productSubTab', 'list');`,
  `useSessionState<'list' | 'collections' | 'sizes'>('admin_productSubTab', 'list');`
);

const collectionsBtn = `onClick={() => setProductSubTab('collections')} 
            style={{ 
              background: productSubTab === 'collections' ? 'var(--color-accent)' : 'transparent',
              color: productSubTab === 'collections' ? '#000' : 'var(--color-text-muted)',
              border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
            }}
          >
            Bộ sưu tập
          </button>`;

const newButtons = collectionsBtn + `
          <button 
            onClick={() => setProductSubTab('sizes')} 
            style={{ 
              background: productSubTab === 'sizes' ? 'var(--color-accent)' : 'transparent',
              color: productSubTab === 'sizes' ? '#000' : 'var(--color-text-muted)',
              border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
            }}
          >
            Hệ thống Size
          </button>`;

code = code.replace(collectionsBtn, newButtons);


// 3. Add Sizes Management Panel
const sizesPanel = `
      {activeTab === 'products' && productSubTab === 'sizes' && (
        <div className="fade-in">
          <div style={{ ...panelStyle, gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--color-accent)' }}>Quản lý Hệ thống Size</h3>
              <button 
                onClick={async () => {
                  await updateSettings({ sizes: tempSettings.sizes });
                  showToast('Đã lưu cài đặt Size');
                }}
                style={{ background: 'var(--color-accent)', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Lưu Hệ thống Size
              </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '0.5rem' }}>ID (Mã size)</th>
                    <th style={{ padding: '0.5rem' }}>Tên hiển thị</th>
                    <th style={{ padding: '0.5rem' }}>Hệ số giá (Multiplier)</th>
                    <th style={{ padding: '0.5rem' }}>Chiều cao (cm)</th>
                    <th style={{ padding: '0.5rem' }}>Tỉ lệ hình ảnh</th>
                    <th style={{ padding: '0.5rem', width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {(tempSettings.sizes || []).map((sz: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.5rem' }}>
                        <input type="text" value={sz.id} onChange={e => {
                          const newSizes = [...(tempSettings.sizes || [])];
                          newSizes[idx].id = e.target.value;
                          setTempSettings({...tempSettings, sizes: newSizes});
                        }} style={{...inputStyle, padding: '0.4rem', fontSize: '0.85rem'}} />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input type="text" value={sz.name} onChange={e => {
                          const newSizes = [...(tempSettings.sizes || [])];
                          newSizes[idx].name = e.target.value;
                          setTempSettings({...tempSettings, sizes: newSizes});
                        }} style={{...inputStyle, padding: '0.4rem', fontSize: '0.85rem'}} />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input type="number" step="0.1" value={sz.multiplier} onChange={e => {
                          const newSizes = [...(tempSettings.sizes || [])];
                          newSizes[idx].multiplier = parseFloat(e.target.value) || 0;
                          setTempSettings({...tempSettings, sizes: newSizes});
                        }} style={{...inputStyle, padding: '0.4rem', fontSize: '0.85rem', width: '80px'}} />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input type="number" value={sz.heightCm} onChange={e => {
                          const newSizes = [...(tempSettings.sizes || [])];
                          newSizes[idx].heightCm = parseInt(e.target.value) || 0;
                          setTempSettings({...tempSettings, sizes: newSizes});
                        }} style={{...inputStyle, padding: '0.4rem', fontSize: '0.85rem', width: '80px'}} />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input type="number" step="0.1" value={sz.scaleGraphic} onChange={e => {
                          const newSizes = [...(tempSettings.sizes || [])];
                          newSizes[idx].scaleGraphic = parseFloat(e.target.value) || 0;
                          setTempSettings({...tempSettings, sizes: newSizes});
                        }} style={{...inputStyle, padding: '0.4rem', fontSize: '0.85rem', width: '80px'}} />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <button type="button" onClick={() => {
                          const newSizes = [...(tempSettings.sizes || [])];
                          newSizes.splice(idx, 1);
                          setTempSettings({...tempSettings, sizes: newSizes});
                        }} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={() => {
                const newSizes = [...(tempSettings.sizes || [])];
                newSizes.push({ id: 'NEW_SIZE', name: 'NEW: 0-0cm', multiplier: 1, heightCm: 30, scaleGraphic: 0.8 });
                setTempSettings({...tempSettings, sizes: newSizes});
              }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}>
                <Plus size={16} /> Thêm Size
              </button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  `{activeTab === 'products' && productSubTab === 'collections' ? (`,
  `${sizesPanel}\n      {activeTab === 'products' && productSubTab === 'collections' ? (`
);


fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
console.log('Updated Admin.tsx');
