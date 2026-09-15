const fs = require('fs');
let code = fs.readFileSync('src/components/UniverseSpace.tsx', 'utf8');

// Add X import
code = code.replace(
  "import { Shield, Zap, Star, Trophy, Crosshair, HelpCircle, LayoutGrid, List } from 'lucide-react';",
  "import { Shield, Zap, Star, Trophy, Crosshair, HelpCircle, LayoutGrid, List, X, ChevronRight } from 'lucide-react';"
);

// Add useStore import
code = code.replace(
  "import { useNavigate } from 'react-router-dom';",
  "import { useNavigate } from 'react-router-dom';\nimport { useStore } from '../context/StoreContext';"
);

// Add unsave hook
code = code.replace(
  "export const UniverseSpace: React.FC<UniverseSpaceProps> = ({ user, products, settings, language }) => {",
  "export const UniverseSpace: React.FC<UniverseSpaceProps> = ({ user, products, settings, language }) => {\n  const { unsaveCharacter } = useStore();"
);

// Always show power bar
code = code.replace(
  "{viewMode === 'list' && p.powerRanking && (",
  "{p.powerRanking && ("
);

// Add Unsave button and Leaderboard link
// We can add a "View Leaderboard" button inside the sidebar
const sidebarTitle = `<h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#f59e0b' }}>
            <Trophy size={18} />
            {language === 'vi' ? \`Top 5 \${activeCollection !== 'All' ? activeCollection : ''}\` : \`Top 5 \${activeCollection !== 'All' ? activeCollection : ''}\`}
          </h3>`;
const sidebarTitleNew = `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: '#f59e0b' }}>
              <Trophy size={18} />
              {language === 'vi' ? \`Top 5 \${activeCollection !== 'All' ? activeCollection : ''}\` : \`Top 5 \${activeCollection !== 'All' ? activeCollection : ''}\`}
            </h3>
            <button 
              onClick={() => navigate('/leaderboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
            >
              {language === 'vi' ? 'Xem tất cả' : 'View All'} <ChevronRight size={14} />
            </button>
          </div>`;
code = code.replace(sidebarTitle, sidebarTitleNew);

// Add X (unsave) button to character card
const imgWrapper = `<div style={{ width: viewMode === 'list' ? '150px' : '100%', height: viewMode === 'list' ? '100%' : '250px', position: 'relative' }}>
                  <img src={p.images[0]} alt={p.name.en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />`;
const imgWrapperNew = `<div style={{ width: viewMode === 'list' ? '150px' : '100%', height: viewMode === 'list' ? '100%' : '250px', position: 'relative' }} className="universe-card-img">
                  <img src={p.images[0]} alt={p.name.en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    onClick={(e) => { e.stopPropagation(); unsaveCharacter(p.id); }}
                    className="unsave-btn"
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s', zIndex: 10 }}
                    title={language === 'vi' ? 'Xóa khỏi bộ sưu tập' : 'Remove from collection'}
                  >
                    <X size={16} />
                  </button>`;
code = code.replace(imgWrapper, imgWrapperNew);

// Add style for unsave button hover
const styles = `<style>{\`
        @media (max-width: 900px) {`;
const newStyles = `<style>{\`
        .universe-card-img:hover .unsave-btn {
          opacity: 1 !important;
        }
        @media (max-width: 900px) {`;
code = code.replace(styles, newStyles);

fs.writeFileSync('src/components/UniverseSpace.tsx', code, 'utf8');
console.log('Updated UniverseSpace');
