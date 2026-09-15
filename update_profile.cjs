const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

// 1. Add imports
code = code.replace(
  /import \{ ProductCard \} from '\.\.\/components\/ProductCard';/,
  `import { ProductCard } from '../components/ProductCard';
import { UniverseSpace } from '../components/UniverseSpace';
import { Sparkles } from 'lucide-react';`
);

// 2. Add 'universe' to activeTab state
// Wait, activeTab is initialized as 'dashboard'.
// We just need to add a button for it in the sidebar.

const oldSidebar = `<button 
              onClick={() => setActiveTab('saved_carts')}`;
const newSidebar = `<button 
              onClick={() => setActiveTab('universe')}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'universe' ? 'rgba(245, 158, 11, 0.1)' : 'transparent', color: activeTab === 'universe' ? '#f59e0b' : 'var(--color-text-muted)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: activeTab === 'universe' ? 600 : 400 }}
            >
              <Sparkles size={20} />
              {language === 'vi' ? 'Không Gian Vũ Trụ' : 'Universe Space'}
            </button>
            <button 
              onClick={() => setActiveTab('saved_carts')}`;
code = code.replace(oldSidebar, newSidebar);

// 3. Add the content rendering
const oldContent = `{activeTab === 'saved_carts' && <motion.div key="saved_carts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderSavedCarts()}</motion.div>}`;
const newContent = `{activeTab === 'saved_carts' && <motion.div key="saved_carts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderSavedCarts()}</motion.div>}
            {activeTab === 'universe' && <motion.div key="universe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><UniverseSpace user={user} products={products} settings={settings} language={language} /></motion.div>}`;
code = code.replace(oldContent, newContent);

fs.writeFileSync('src/pages/Profile.tsx', code, 'utf8');
console.log('Updated Profile.tsx');
