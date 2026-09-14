const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// 1. Add state variables
const stateAnchor = "  const [orderSearch, setOrderSearch] = useSessionState('admin_orderSearch', '');";
if (code.includes(stateAnchor)) {
  code = code.replace(stateAnchor, stateAnchor + "\n  const [iconPickerIdx, setIconPickerIdx] = useState<number | null>(null);\n  const [iconSearch, setIconSearch] = useState('');");
  console.log("Step 1: Added state variables");
}

// 2. Replace iconName cell
const exactIconNameLine = "{{ padding: '0.5rem' }}><input type=\"text\" value={col.iconName} placeholder=\"e.g. Shield\" onChange={e => {\r\n                        const newCols = [...(tempSettings.collections || [])];\r\n                        newCols[idx].iconName = e.target.value;\r\n                        setTempSettings({...tempSettings, collections: newCols});\r\n                      }} style={{...inputStyle, padding: '0.4rem', fontSize: '0.85rem'}} /></td>";
const newIconCell = `{{ padding: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                          <input type="text" value={col.iconName} placeholder="e.g. Shield" onChange={e => {
                            const newCols = [...(tempSettings.collections || [])];
                            newCols[idx].iconName = e.target.value;
                            setTempSettings({...tempSettings, collections: newCols});
                          }} style={{...inputStyle, padding: '0.4rem', fontSize: '0.85rem', flex: 1}} />
                          <button type="button" title="Chọn Icon" onClick={() => setIconPickerIdx(idx)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', cursor: 'pointer', padding: '0.3rem 0.4rem', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            <LayoutGrid size={12} />
                          </button>
                        </div>
                      </td>`;

if (code.includes(exactIconNameLine)) {
  code = code.replace(exactIconNameLine, newIconCell);
  console.log("Step 2: Replaced iconName cell");
} else {
  console.log("Step 2: Exact string failed, trying another way");
}

fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
