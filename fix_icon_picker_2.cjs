const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const importAnchor = "import 'react-quill-new/dist/quill.snow.css';";
if (code.includes(importAnchor)) {
  code = code.replace(importAnchor, importAnchor + "\nimport * as LucideIcons from 'lucide-react';");
  console.log("Step 1: Added LucideIcons import");
}

const modalUI = `
      {/* Icon Picker Modal */}
      <AnimatePresence>
        {iconPickerIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setIconPickerIdx(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{ background: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><LayoutGrid size={20} /> Chọn Icon</h3>
                <button onClick={() => setIconPickerIdx(null)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              
              <input 
                type="text" 
                placeholder="Tìm kiếm icon (e.g. Shield, Star, Heart)..." 
                value={iconSearch} 
                onChange={e => setIconSearch(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: '#fff', marginBottom: '1rem' }}
              />

              <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '0.5rem', alignContent: 'start' }} className="custom-scrollbar">
                {(() => {
                  const COMMON_ICONS = ['Shield', 'Moon', 'Star', 'Wand2', 'Package', 'Clock', 'Truck', 'CheckCircle', 'Plus', 'Settings', 'LayoutDashboard', 'ShoppingBag', 'Users', 'BookOpen', 'TrendingUp', 'Search', 'Filter', 'Download', 'Eye', 'ExternalLink', 'Heart', 'Award', 'Globe', 'Zap', 'Box', 'Sparkles', 'Store', 'Palette', 'Sun', 'Sword', 'Crown', 'Target', 'Flame', 'Gem', 'Rocket', 'Map', 'Camera', 'Music', 'Video', 'Layers', 'Grid', 'Hash'];
                  
                  const filteredIcons = COMMON_ICONS.filter(name => name.toLowerCase().includes(iconSearch.toLowerCase()));
                  
                  return filteredIcons.map(name => {
                    const IconComp = (LucideIcons as any)[name];
                    if (!IconComp) return null;
                    return (
                      <button
                        key={name}
                        onClick={() => {
                          const newCols = [...(tempSettings.collections || [])];
                          newCols[iconPickerIdx].iconName = name;
                          setTempSettings({...tempSettings, collections: newCols});
                          setIconPickerIdx(null);
                        }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s', color: 'var(--color-text)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        title={name}
                      >
                        <IconComp size={24} />
                        <span style={{ fontSize: '0.65rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>{name}</span>
                      </button>
                    );
                  });
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
`;

const anchor = "        </div>\r\n      ) : (\r\n        <div className=\"fade-in\">";
if (code.includes(anchor)) {
  code = code.replace(anchor, modalUI + "\n" + anchor);
  console.log("Step 2: Added Icon Picker Modal");
} else {
  console.log("Step 2: Failed to find anchor for modal");
}

fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
