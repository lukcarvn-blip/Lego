import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { Trophy, Star, Zap, Shield, Crosshair, Users, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Leaderboard = () => {
  const { products, settings, language } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'topFan' | 'power' | 'likes' | 'hero' | 'villain' | 'bio'>('topFan');

  const getRankColor = (index: number) => {
    if (index === 0) return '#fbbf24'; // Gold
    if (index === 1) return '#94a3b8'; // Silver
    if (index === 2) return '#b45309'; // Bronze
    return 'var(--color-text-muted)';
  };

  // Currently we use 'likes' for Top Fan and Likes as a proxy since savedCharacters count per product isn't aggregated globally in the mock data yet.
  // In a real app, 'topFan' would sort by the number of users who saved the character.
  const rankings = useMemo(() => {
    const list = [...products];
    switch (activeTab) {
      case 'topFan':
      case 'likes':
        return list.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10);
      case 'power':
        return list.filter(p => p.powerRanking).sort((a, b) => (b.powerRanking || 0) - (a.powerRanking || 0)).slice(0, 10);
      case 'hero':
        return list.filter(p => p.alignment === 'Hero').sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10);
      case 'villain':
        return list.filter(p => p.alignment === 'Villain').sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10);
      case 'bio':
        return list.filter(p => p.biography && p.biography.vi).sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10);
      default:
        return list.slice(0, 10);
    }
  }, [products, activeTab]);

  const tabs = [
    { id: 'topFan', label: language === 'vi' ? 'Được sưu tập nhiều' : 'Most Collected', icon: <Star size={18} /> },
    { id: 'power', label: language === 'vi' ? 'Sức mạnh' : 'Power Ranking', icon: <Zap size={18} /> },
    { id: 'likes', label: language === 'vi' ? 'Yêu thích' : 'Most Liked', icon: <Star size={18} /> },
    { id: 'hero', label: language === 'vi' ? 'Top Chính Diện' : 'Top Heroes', icon: <Shield size={18} /> },
    { id: 'villain', label: language === 'vi' ? 'Top Phản Diện' : 'Top Villains', icon: <Crosshair size={18} /> },
    { id: 'bio', label: language === 'vi' ? 'Hồ sơ nổi bật' : 'Featured Bios', icon: <BookOpen size={18} /> }
  ];

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
            style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', marginBottom: '1rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}
          >
            <Trophy size={48} color="#f59e0b" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
            {language === 'vi' ? 'BẢNG XẾP HẠNG VŨ TRỤ' : 'UNIVERSE LEADERBOARD'}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            {language === 'vi' 
              ? 'Khám phá những nhân vật được cộng đồng yêu thích nhất, quyền năng nhất và vĩ đại nhất trong đa vũ trụ.' 
              : 'Discover the most loved, powerful, and greatest characters in the multiverse according to the community.'}
          </motion.p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem', justifyContent: 'center' }} className="hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
                background: activeTab === tab.id ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${activeTab === tab.id ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                color: activeTab === tab.id ? '#f59e0b' : 'var(--color-text-muted)',
                borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'all 0.2s',
                whiteSpace: 'nowrap', fontWeight: activeTab === tab.id ? 700 : 500
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence mode="popLayout">
            {rankings.map((char, index) => (
              <motion.div
                key={char.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-panel hover-jump"
                onClick={() => navigate(`/product/${char.id}`)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 1.5rem', 
                  cursor: 'pointer',
                  border: index === 0 ? '1px solid #fbbf24' : (index === 1 ? '1px solid #94a3b8' : (index === 2 ? '1px solid #b45309' : '1px solid var(--glass-border)')),
                  background: index === 0 ? 'rgba(251, 191, 36, 0.05)' : 'var(--glass-bg)'
                }}
              >
                {/* Rank */}
                <div style={{ width: '40px', fontSize: '1.8rem', fontWeight: 900, color: getRankColor(index), textAlign: 'center' }}>
                  #{index + 1}
                </div>
                
                {/* Avatar */}
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${getRankColor(index)}` }}>
                  <img src={char.images[0]} alt={char.name.en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {char.collection || char.category}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {char.name[language as keyof typeof char.name]}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    {activeTab !== 'power' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        <Star size={14} color="#f59e0b" /> {char.likes || 0} {language === 'vi' ? 'Fan' : 'Fans'}
                      </div>
                    )}
                    {char.powerRanking && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                        <Zap size={14} fill="#f59e0b" /> {char.powerRanking}
                      </div>
                    )}
                    {char.alignment && (
                      <div style={{ 
                        fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                        background: char.alignment === 'Hero' ? 'rgba(59, 130, 246, 0.15)' : (char.alignment === 'Villain' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(168, 162, 158, 0.15)'),
                        color: char.alignment === 'Hero' ? '#3b82f6' : (char.alignment === 'Villain' ? '#ef4444' : '#a8a29e')
                      }}>
                        {char.alignment.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Highlight Metric */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                  {activeTab === 'power' ? (
                    <>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>POWER</div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>{char.powerRanking}</div>
                    </>
                  ) : activeTab === 'bio' ? (
                    <div style={{ color: 'var(--color-text-muted)' }}>
                      <BookOpen size={24} />
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>FANS</div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>{char.likes || 0}</div>
                    </>
                  )}
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
