import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { Trophy, Star, Zap, Shield, Crosshair, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';

export const Leaderboard = () => {
  const { products, settings, language } = useStore();
  const navigate = useNavigate();
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);

  const getRankColor = (index: number) => {
    if (index === 0) return '#fbbf24'; // Gold
    if (index === 1) return '#94a3b8'; // Silver
    if (index === 2) return '#b45309'; // Bronze
    return 'var(--color-text-muted)';
  };

  // Group and rank collections
  const collectionRankings = useMemo(() => {
    if (!settings.collections) return [];
    
    const rankings = settings.collections.map(col => {
      const colProducts = products.filter(p => p.collection === col.name);
      const totalFans = colProducts.reduce((sum, p) => sum + (p.likes || 0), 0);
      return {
        ...col,
        totalFans,
        products: colProducts.sort((a, b) => (b.likes || 0) - (a.likes || 0))
      };
    }).filter(c => c.totalFans > 0); // Only show collections with fans
    
    return rankings.sort((a, b) => b.totalFans - a.totalFans);
  }, [products, settings.collections]);

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
              ? 'Khám phá những bộ sưu tập được cộng đồng yêu thích nhất trong đa vũ trụ.' 
              : 'Discover the most loved collections in the multiverse according to the community.'}
          </motion.p>
        </div>

        {/* List of Collections */}
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {collectionRankings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--glass-bg)', borderRadius: '12px' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Chưa có dữ liệu xếp hạng.' : 'No ranking data available.'}</p>
            </div>
          )}
          
          <AnimatePresence mode="popLayout">
            {collectionRankings.map((col, index) => {
              const IconComponent = Icons[col.iconName as keyof typeof Icons] as any || Icons.Folder;
              const isExpanded = expandedCollection === col.name;
              
              return (
                <motion.div
                  key={col.name}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass-panel"
                  style={{ 
                    overflow: 'hidden',
                    border: index === 0 ? '1px solid #fbbf24' : (index === 1 ? '1px solid #94a3b8' : (index === 2 ? '1px solid #b45309' : '1px solid var(--glass-border)')),
                    background: index === 0 ? 'rgba(251, 191, 36, 0.05)' : 'var(--glass-bg)'
                  }}
                >
                  {/* Collection Header (Clickable) */}
                  <div 
                    onClick={() => setExpandedCollection(isExpanded ? null : col.name)}
                    style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 1.5rem', cursor: 'pointer' }}
                  >
                    {/* Rank */}
                    <div style={{ width: '40px', fontSize: '1.8rem', fontWeight: 900, color: getRankColor(index), textAlign: 'center' }}>
                      #{index + 1}
                    </div>
                    
                    {/* Collection Icon */}
                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: col.bg, border: `1px solid ${col.border}`, color: col.color }}>
                      <IconComponent size={32} />
                    </div>
                    
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: col.color, fontWeight: 700, marginBottom: '0.25rem' }}>
                        {language === 'vi' ? 'BỘ SƯU TẬP' : 'COLLECTION'}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{col.name}</h3>
                    </div>
                    
                    {/* Total Fans */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>FANS</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {col.totalFans.toLocaleString()}
                        <Star size={20} fill="#fbbf24" color="#fbbf24" />
                      </div>
                    </div>
                    
                    {/* Expand Toggle */}
                    <div style={{ marginLeft: '1rem', color: 'var(--color-text-muted)' }}>
                      {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>
                  
                  {/* Expanded Content (Characters) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem', paddingTop: '1.5rem' }}>
                          {col.products.map(char => (
                            <div 
                              key={char.id}
                              onClick={() => navigate(`/product/${char.id}`)}
                              style={{ 
                                display: 'flex', flexDirection: 'column', 
                                background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid var(--glass-border)',
                                cursor: 'pointer', transition: 'all 0.3s', overflow: 'hidden', position: 'relative'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                              {/* Card Image */}
                              <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', overflow: 'hidden' }}>
                                <img src={char.images[0]} alt={char.name[language as keyof typeof char.name]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
                                
                                {/* Fan Badge over image */}
                                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '20px', border: '1px solid rgba(251, 191, 36, 0.5)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>
                                  <Star size={14} fill="#fbbf24" /> {char.likes?.toLocaleString()}
                                </div>
                                
                                {/* Alignment Badge over image */}
                                {char.alignment && (
                                  <div style={{ 
                                    position: 'absolute', top: '10px', left: '10px', 
                                    background: char.alignment === 'Hero' ? 'rgba(59, 130, 246, 0.8)' : (char.alignment === 'Villain' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(168, 162, 158, 0.8)'),
                                    backdropFilter: 'blur(4px)', padding: '4px', borderRadius: '50%', color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)', width: '28px', height: '28px'
                                  }} title={language === 'vi' ? (char.alignment === 'Hero' ? 'Chính diện' : (char.alignment === 'Villain' ? 'Phản diện' : 'Trung lập')) : char.alignment.toUpperCase()}>
                                    {char.alignment === 'Hero' ? <Shield size={14} /> : (char.alignment === 'Villain' ? <Crosshair size={14} /> : <HelpCircle size={14} />)}
                                  </div>
                                )}
                              </div>
                              
                              {/* Card Body */}
                              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.2, textAlign: 'center' }}>
                                  {char.name[language as keyof typeof char.name]}
                                </h4>
                                
                                {/* Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '8px' }}>
                                      <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{language === 'vi' ? 'Sức mạnh' : 'Power'}</span>
                                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '2px' }}><Zap size={14} /> {char.powerRanking || '??'}</span>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{language === 'vi' ? 'Phe' : 'Align'}</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: char.alignment === 'Hero' ? '#3b82f6' : (char.alignment === 'Villain' ? '#ef4444' : '#a8a29e'), display: 'flex', alignItems: 'center', gap: '2px', height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                                        {char.alignment ? (language === 'vi' ? (char.alignment === 'Hero' ? 'Chính' : (char.alignment === 'Villain' ? 'Tà' : 'Trung')) : char.alignment.substring(0,4).toUpperCase()) : '?'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
