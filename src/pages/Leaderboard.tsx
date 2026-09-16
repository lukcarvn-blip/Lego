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
                        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem', paddingTop: '1.5rem' }}>
                          {col.products.map(char => (
                            <div 
                              key={char.id}
                              onClick={() => navigate(`/product/${char.id}`)}
                              style={{ 
                                display: 'flex', gap: '1rem', padding: '1rem', 
                                background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
                                cursor: 'pointer', transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                            >
                              <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--glass-border)' }}>
                                <img src={char.images[0]} alt={char.name[language as keyof typeof char.name]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{char.name[language as keyof typeof char.name]}</h4>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: '#fbbf24', fontWeight: 600 }}>
                                    <Star size={14} fill="#fbbf24" /> {char.likes?.toLocaleString()} Fan
                                  </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                  {char.alignment && (
                                    <span style={{ 
                                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                                      fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                                      background: char.alignment === 'Hero' ? 'rgba(59, 130, 246, 0.15)' : (char.alignment === 'Villain' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(168, 162, 158, 0.15)'),
                                      color: char.alignment === 'Hero' ? '#3b82f6' : (char.alignment === 'Villain' ? '#ef4444' : '#a8a29e'),
                                      border: `1px solid ${char.alignment === 'Hero' ? 'rgba(59,130,246,0.3)' : (char.alignment === 'Villain' ? 'rgba(239,68,68,0.3)' : 'rgba(168,162,158,0.3)')}`
                                    }}>
                                      {char.alignment === 'Hero' ? <Shield size={12} /> : (char.alignment === 'Villain' ? <Crosshair size={12} /> : <HelpCircle size={12} />)}
                                      {language === 'vi' 
                                        ? (char.alignment === 'Hero' ? 'Chính diện' : (char.alignment === 'Villain' ? 'Phản diện' : 'Trung lập')) 
                                        : char.alignment.toUpperCase()}
                                    </span>
                                  )}
                                  
                                  {char.powerRanking && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                                      <Zap size={12} />
                                      {language === 'vi' ? 'Sức mạnh:' : 'Power:'} {char.powerRanking}/100
                                    </span>
                                  )}
                                </div>
                                
                                {char.biography && (
                                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {char.biography[language as keyof typeof char.biography]}
                                  </p>
                                )}
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
