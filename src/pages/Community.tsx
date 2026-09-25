import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, Gift, RefreshCw, Send, Star, Layers, MessageSquarePlus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Zap, Shield, Crosshair, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


export const Community = () => {
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
  const [requestText, setRequestText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestText.trim()) {
      setIsSubmitted(true);
      setRequestText('');
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%" }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%', marginBottom: '4rem', alignItems: 'stretch' }}>
          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
          {/* Header */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', height: '100%', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
              <Layers size={24} />
              {language === 'vi' ? 'Sân chơi Mô hình Up-scale Cao cấp' : 'High-end Up-scale Model Playground'}
            </h2>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.7 }}>
              {language === 'vi' 
                ? 'Mục tiêu của chúng tôi là xây dựng một sân chơi mô hình được up-scale tương tự như các mô hình của BEARBRICK cao cấp. Chúng tôi muốn tạo ra một cộng đồng sưu tầm các mô hình độc bản được chế tác bằng công nghệ máy in 3D đa màu sắc tiên tiến nhất.' 
                : 'Our goal is to build a playground for up-scaled models similar to high-end BEARBRICKs. We want to create a collector community for unique models crafted using the most advanced multi-color 3D printing technology.'}
            </p>
          </div>
          </div>
          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
          {/* Development Vision */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', height: '100%', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
              <Star size={24} /> 
              {language === 'vi' ? 'Định Hướng Phát Triển' : 'Development Vision'}
            </h2>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '1rem' }}>
              {language === 'vi' 
                ? 'Vì đây là mô hình tự thiết kế độc quyền, lượng thiết kế hiện tại còn hạn chế. Tuy nhiên, chúng tôi cam kết sẽ phát triển thiết kế thêm nhiều nhân vật mới mỗi tháng.'
                : 'Since these are exclusive self-designed models, the current design inventory is limited. However, we are committed to developing new character designs every month.'}
            </p>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.7 }}>
              {language === 'vi'
                ? 'Các Collector (người sưu tầm) có quyền đề xuất nhân vật yêu thích. Chúng tôi sẽ tổng hợp các đề xuất đó theo bảng xếp hạng (Leaderboard) và lần lượt thực hiện chế tác dựa trên số lượng FAN CỨNG yêu cầu!'
                : 'Collectors have the right to propose their favorite characters. We will aggregate these requests into a Leaderboard and sequentially craft them based on the number of TOP FAN requests!'}
            </p>
          </div>

          
          </div>
        </div>
        <div className="community-leaderboard-section">
            <div className="community-leaderboard-side">
              {/* Bảng xếp hạng */}
          <div id="leaderboard"></div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', marginTop: 0 }}>
            <Trophy size={28} style={{ color: 'var(--color-accent)' }} />
            {language === 'vi' ? 'BẢNG XẾP HẠNG VŨ TRỤ' : 'UNIVERSE LEADERBOARD'}
          </h2>
          <div style={{ marginBottom: '4rem' }}>
            {/* List of Collections */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    <div style={{ width: '140px', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: col.color, fontWeight: 700, marginBottom: '0.25rem' }}>
                        {language === 'vi' ? 'BỘ SƯU TẬP' : 'COLLECTION'}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.name}</h3>
                    </div>
                    
                    {/* Character Avatars */}
                    <div className="leaderboard-avatars-mobile-hide" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '0.5rem', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'nowrap' }}>
                        {col.products.slice(0, 10).map((char: any, i: number) => (
                          <div 
                            key={char.id} 
                            style={{ 
                              width: '46px', 
                              height: '46px', 
                              borderRadius: '10px', 
                              border: '1px solid rgba(255,255,255,0.15)', 
                              position: 'relative',
                              overflow: 'hidden',
                              background: '#000',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                              flexShrink: 0
                            }}
                            title={char.name[language as keyof typeof char.name]}
                          >
                            <img src={char.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              background: 'rgba(0,0,0,0.7)',
                              color: '#fbbf24',
                              fontSize: '0.6rem',
                              fontWeight: 900,
                              padding: '2px 4px',
                              borderBottomRightRadius: '6px',
                              zIndex: 2,
                              backdropFilter: 'blur(4px)'
                            }}>
                              #{i + 1}
                            </div>
                          </div>
                        ))}
                        {col.products.length > 10 && (
                          <div style={{ 
                              width: '46px', 
                              height: '46px', 
                              borderRadius: '10px', 
                              border: '1px solid rgba(255,255,255,0.1)', 
                              background: 'var(--color-bg-alt)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: 'var(--color-text-muted)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                          }}>
                            +{col.products.length - 10}
                          </div>
                        )}
                      </div>
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
                        <div style={{ padding: '0 1.5rem 2.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem', paddingTop: '1.5rem' }}>
                          <Swiper
                            effect={'coverflow'}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={'auto'}
                            loop={true}
                            coverflowEffect={{
                              rotate: 0,
                              stretch: 0,
                              depth: 150,
                              modifier: 2,
                              slideShadows: true,
                            }}
                            pagination={{ clickable: true, dynamicBullets: true }}
                            navigation={false}
                            slideToClickedSlide={true}
                            modules={[EffectCoverflow, Pagination]}
                            className="leaderboard-coverflow-swiper"
                          >
                          {(() => {
                            let displayProducts = col.products.map((p: any, i: number) => ({...p, rank: i + 1}));
                            if (displayProducts.length > 0 && displayProducts.length < 10) {
                              const orig = [...displayProducts];
                              while (displayProducts.length < 10) {
                                displayProducts = [...displayProducts, ...orig];
                              }
                            }
                            return displayProducts.map((char: any, idx: number) => (
                              <SwiperSlide key={`${char.id}-${idx}`}>
                              {({ isActive }) => (
                                  <div onClick={() => isActive && navigate(`/product/${char.id}`)}
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
                                      
                                      {/* Rank Badge */}
                                      <div style={{ 
                                        position: 'absolute', top: '10px', left: '10px', zIndex: 10,
                                        background: 'var(--color-accent)', color: '#000',
                                        width: '32px', height: '32px', borderRadius: '8px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                      }}>
                                        #{char.rank}
                                      </div>

                                      {/* Alignment Badge over image */}
                                      {char.alignment && (
                                        <div style={{ 
                                          position: 'absolute', top: '48px', left: '10px', 
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
                              )}
                              </SwiperSlide>
                            ))})()}
                          </Swiper>
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
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%', marginBottom: '4rem', alignItems: 'stretch' }}>
          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
  <div className="community-policies-side">
    
          {/* Exclusive Policies */}
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem' }}>
            {language === 'vi' ? 'Đặc Quyền & Chính Sách' : 'Exclusive Policies'}
          </h2>
          
          
            <div className="policies-grid-half">
            {/* Policy 1 */}
            <div style={{ textAlign: 'center', padding: '0.5rem' }}>
              <ShieldCheck size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Bảo hành rơi vỡ' : 'Breakage Warranty'}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {language === 'vi' ? 'Bảo hành rơi vỡ 1 lần miễn phí cho mọi sản phẩm.' : '1-time free replacement/warranty for accidental breakage.'}
              </p>
            </div>
            
            {/* Policy 2 */}
            <div style={{ textAlign: 'center', padding: '0.5rem' }}>
              <Wrench size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Chế tác lại trọn đời' : 'Lifetime Re-crafting'}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {language === 'vi' ? 'Hỗ trợ chế tác lại sản phẩm với giá tốt ưu đãi trọn đời.' : 'Lifetime support for re-crafting products at a favorable price.'}
              </p>
            </div>

            {/* Policy 3 */}
            <div style={{ textAlign: 'center', padding: '0.5rem' }}>
              <Gift size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Dấu ấn cá nhân' : 'Personal Mark'}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {language === 'vi' ? 'Khắc tên miễn phí lên mô hình cho bản thân hoặc làm quà tặng.' : 'Free name engraving on the model for yourself or as a gift.'}
              </p>
            </div>

            {/* Policy 4 */}
            <div style={{ textAlign: 'center', padding: '0.5rem' }}>
              <RefreshCw size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Thu mua lại' : 'Trade-in Support'}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {language === 'vi' ? 'Hỗ trợ thu mua lại các sản phẩm tùy theo tình trạng thực tế.' : 'Support for buying back products depending on their actual condition.'}
              </p>
            </div>
          
  </div>
          </div>
          </div>
          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
<div className="community-request-side">
    
          {/* Request Form */}
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-accent)', background: 'rgba(74, 222, 128, 0.05)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0 }}>
                <MessageSquarePlus size={32} style={{ color: 'var(--color-accent)' }} />
                {language === 'vi' ? 'Gửi Đề Xuất Nhân Vật Mới' : 'Submit New Character Request'}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {language === 'vi' 
                  ? 'Hãy cho chúng tôi biết bạn muốn LEGATO chế tác nhân vật nào tiếp theo!'
                  : 'Let us know which character you want LEGATO to craft next!'}
              </p>
            </div>

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '12px' }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-accent)', color: '#000', marginBottom: '1rem' }}>
                  <ShieldCheck size={24} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
                  {language === 'vi' ? 'Đề xuất đã được ghi nhận!' : 'Request recorded!'}
                </h4>
                <p style={{ color: 'var(--color-text)' }}>
                  {language === 'vi' ? 'Cảm ơn bạn. Yêu cầu của bạn đã được thêm vào Bảng xếp hạng!' : 'Thank you. Your request has been added to the Leaderboard!'}
                </p>
                <a href="#" onClick={(e) => { e.preventDefault(); document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" }); }} style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--color-accent)', textDecoration: 'underline' }}>
                  {language === 'vi' ? 'Xem Bảng Xếp Hạng' : 'View Leaderboard'}
                </a>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <textarea 
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder={language === 'vi' ? 'Ví dụ: Tôi muốn thấy mô hình Deadpool hoặc Optimus Prime...' : 'Example: I want to see a Deadpool or Optimus Prime model...'}
                  style={{
                    width: '100%', minHeight: '120px', padding: '1rem',
                    background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)',
                    borderRadius: '8px', color: '#fff', fontSize: '1rem',
                    marginBottom: '1rem', resize: 'vertical'
                  }}
                  required
                />
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{
                    width: '100%', padding: '1rem',
                    background: 'var(--color-accent)', color: '#000',
                    border: 'none', borderRadius: '8px',
                    fontSize: '1.1rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={20} />
                  {language === 'vi' ? 'Gửi Yêu Cầu' : 'Submit Request'}
                </motion.button>
              </form>
            )}
          </div>
          
    </div>
          </div>
          </div>
        </div>
        </motion.div>
      </div>
    </div>
  );
};
