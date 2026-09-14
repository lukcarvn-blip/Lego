const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// 1. Replace name input cell to add "auto-fix slug" button
const oldNameCell = `                      <td style={{ padding: '0.5rem' }}><input type="text" value={col.name} onChange={e => {
                        const newCols = [...(tempSettings.collections || [])];
                        newCols[idx].name = e.target.value;
                        setTempSettings({...tempSettings, collections: newCols});
                      }} style={{...inputStyle, padding: '0.4rem', fontSize: '0.85rem'}} /></td>`;

const newNameCell = `                      <td style={{ padding: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                          <input type="text" value={col.name} onChange={e => {
                            const newCols = [...(tempSettings.collections || [])];
                            newCols[idx].name = e.target.value;
                            setTempSettings({...tempSettings, collections: newCols});
                          }} style={{...inputStyle, padding: '0.4rem', fontSize: '0.85rem', flex: 1}} />
                          <button type="button" title="Tự động tạo lại link từ tên" onClick={() => {
                            const newCols = [...(tempSettings.collections || [])];
                            const slug = newCols[idx].name.toLowerCase()
                              .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                              .replace(/đ/gi, 'd')
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/^-+|-+$/g, '');
                            newCols[idx].path = '/category/' + slug;
                            setTempSettings({...tempSettings, collections: newCols});
                          }} style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)', color: '#4ade80', borderRadius: '4px', cursor: 'pointer', padding: '0.3rem 0.4rem', display: 'flex', alignItems: 'center', flexShrink: 0 }} title="Fix link">
                            <RefreshCw size={12} />
                          </button>
                        </div>
                      </td>`;

if (code.includes(oldNameCell)) {
  code = code.replace(oldNameCell, newNameCell);
  console.log('Step 1: Added auto-fix slug button');
} else {
  console.log('Step 1 FAILED');
}

// 2. Replace image URL cell to add file upload button
const oldImageCell = `                      <td style={{ padding: '0.5rem' }}><input type="text" value={col.image || ''} placeholder="https://..." onChange={e => {
                        const newCols = [...(tempSettings.collections || [])];
                        newCols[idx].image = e.target.value;
                        setTempSettings({...tempSettings, collections: newCols});
                      }} style={{...inputStyle, padding: '0.4rem', fontSize: '0.85rem'}} /></td>`;

const newImageCell = `                      <td style={{ padding: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                          <input type="text" value={col.image || ''} placeholder="https://..." onChange={e => {
                            const newCols = [...(tempSettings.collections || [])];
                            newCols[idx].image = e.target.value;
                            setTempSettings({...tempSettings, collections: newCols});
                          }} style={{...inputStyle, padding: '0.4rem', fontSize: '0.85rem', flex: 1}} />
                          <label title="Tải ảnh từ máy tính" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.4)', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', padding: '0.3rem 0.4rem', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            <ImageIcon size={12} />
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = ev => {
                                const newCols = [...(tempSettings.collections || [])];
                                newCols[idx].image = ev.target?.result as string;
                                setTempSettings({...tempSettings, collections: newCols});
                              };
                              reader.readAsDataURL(file);
                            }} />
                          </label>
                        </div>
                      </td>`;

if (code.includes(oldImageCell)) {
  code = code.replace(oldImageCell, newImageCell);
  console.log('Step 2: Added image upload button');
} else {
  console.log('Step 2 FAILED');
}

fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
console.log('Done');
