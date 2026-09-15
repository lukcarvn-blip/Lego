import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Star, Trophy, Crosshair, HelpCircle, LayoutGrid, List } from 'lucide-react';
import type { Product } from '../data/mockProducts';
import type { AppUser } from '../context/StoreContext';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UniverseSpaceProps {
  user: AppUser;
  products: Product[];
  settings: any;
  language: string;
}

export const UniverseSpace: React.FC<UniverseSpaceProps> = ({ user, products, settings, language }) => {
  const navigate = useNavigate();
  const [activeCollection, setActiveCollection] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const savedProductIds = user.savedCharacters || [];
  const savedProducts = products.filter(p => savedProductIds.includes(p.id));

  const collections = useMemo(() => {
    const defaultCols = [{ name: 'All', iconName: 'Star' }];
    if (settings.collections) {
      return [...defaultCols, ...settings.collections.filter((c: any) => savedProducts.some(p => p.collection === c.name || p.category === c.name))];
    }
    return defaultCols;
  }, [settings.collections, savedProducts]);

  const filteredProducts = useMemo(() => {
    if (activeCollection === 'All') return savedProducts;
    return savedProducts.filter(p => p.collection === activeCollection || p.category === activeCollection);
  }, [activeCollection, savedProducts]);

  const getLeaderboard = (colName: string) => {
    let pool = products;
    if (colName !== 'All') {
      pool = products.filter(p => p.collection === colName || p.category === colName);
    }
    return [...pool].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);
  };

  const leaderboard = getLeaderboard(activeCollection);

  if (savedProductIds.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
        <Star size={64} style={{ margin: '0 auto 1.5rem', color: 'var(--color-text-muted)', opacity: 0.5 }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{language === 'vi' ? 'Không Gian Trống' : 'Empty Universe'}</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          {language === 'vi' ? 'Bạn chưa thêm nhân vật nào vào Không Gian Vũ Trụ. Hãy khám phá và sưu tập những nhân vật yêu thích của bạn!' : "You haven't added any characters to your Universe Space. Explore and collect your favorites!"}
        </p>
        <button className="btn-primary" onClick={() => navigate('/products')} style={{ padding: '0.8rem 2rem' }}>
          {language === 'vi' ? 'Khám phá ngay' : 'Explore Now'}
        </button>
      </div>
    );
  }

  return (
    <div className="universe-space">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Star color="#f59e0b" />
          {language === 'vi' ? 'Không Gian Vũ Trụ' : 'Universe Space'}
        </h2>
        
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: 'var(--radius-full)' }}>
          <button 
            onClick={() => setViewMode('grid')}
            style={{ background: viewMode === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: viewMode === 'grid' ? '#fff' : 'var(--color-text-muted)', padding: '0.5rem', borderRadius: 'var(--radius-full)', cursor: 'pointer' }}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            style={{ background: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: viewMode === 'list' ? '#fff' : 'var(--color-text-muted)', padding: '0.5rem', borderRadius: 'var(--radius-full)', cursor: 'pointer' }}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Collection Tabs */}
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', marginBottom: '2rem' }}>
        {collections.map(col => {
          const IconComp = (Icons as any)[col.iconName] || Icons.Folder;
          const isActive = activeCollection === col.name;
          return (
            <button
              key={col.name}
              onClick={() => setActiveCollection(col.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem',
                background: isActive ? (col.bg || 'rgba(245, 158, 11, 0.1)') : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? (col.border || '#f59e0b') : 'rgba(255,255,255,0.1)'}`,
                color: isActive ? (col.color || '#f59e0b') : 'var(--color-text-muted)',
                borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s',
                fontWeight: isActive ? 600 : 400
              }}
            >
              <IconComp size={16} />
              {col.name === 'All' ? (language === 'vi' ? 'Tất cả' : 'All') : col.name}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem', alignItems: 'start' }} className="universe-layout">
        {/* Character Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(220px, 1fr))' : '1fr', gap: '1.5rem' }}>
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(p => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel"
                style={{ overflow: 'hidden', display: viewMode === 'list' ? 'flex' : 'block', cursor: 'pointer' }}
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div style={{ width: viewMode === 'list' ? '150px' : '100%', height: viewMode === 'list' ? '100%' : '250px', position: 'relative' }}>
                  <img src={p.images[0]} alt={p.name.en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {p.alignment && (
                    <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', color: p.alignment === 'Hero' ? '#3b82f6' : (p.alignment === 'Villain' ? '#ef4444' : '#a8a29e') }}>
                      {p.alignment === 'Hero' ? <Shield size={12} /> : (p.alignment === 'Villain' ? <Crosshair size={12} /> : <HelpCircle size={12} />)}
                      {p.alignment.toUpperCase()}
                    </div>
                  )}
                  {p.powerRanking && (
                    <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.8)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={10} fill="#f59e0b" /> {p.powerRanking}
                    </div>
                  )}
                </div>
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>{p.collection || p.category}</div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name[language as keyof typeof p.name]}</h3>
                  {p.biography && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: viewMode === 'list' ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                      {p.biography[language as keyof typeof p.biography]}
                    </p>
                  )}
                  {viewMode === 'list' && p.powerRanking && (
                    <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{language === 'vi' ? 'Sức mạnh' : 'Power'}</div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${p.powerRanking}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Sidebar: Leaderboard */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#f59e0b' }}>
            <Trophy size={18} />
            {language === 'vi' ? `Top 5 ${activeCollection !== 'All' ? activeCollection : ''}` : `Top 5 ${activeCollection !== 'All' ? activeCollection : ''}`}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {leaderboard.map((char, i) => (
              <div key={char.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate(`/product/${char.id}`)}>
                <div style={{ width: '24px', textAlign: 'center', fontWeight: 900, fontSize: '1.2rem', color: i === 0 ? '#fbbf24' : (i === 1 ? '#94a3b8' : (i === 2 ? '#b45309' : 'var(--color-text-muted)')), opacity: i < 3 ? 1 : 0.5 }}>
                  #{i+1}
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: i === 0 ? '2px solid #fbbf24' : '2px solid transparent' }}>
                  <img src={char.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{char.name[language as keyof typeof char.name]}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{char.likes} {language === 'vi' ? 'Fan' : 'Fans'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .universe-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
