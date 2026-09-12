import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, ChevronRight, ChevronLeft, ShieldCheck, Zap, Diamond, Sparkles, ShoppingCart, Loader2, LayoutGrid, LayoutList, ArrowRight, Shield, Moon, Star, Wand2, Swords, PawPrint, Rocket, Castle, Building2, Settings } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { LegoHeadIcon } from '../components/LegoHeadIcon';

export const Home = () => {
  const { products, blogPosts, t, language, settings, formatPrice } = useStore();
  
  const headerAnimProps = {
    initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  };

  const getInitialCols = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return 4;
      if (window.innerWidth >= 640) return 3;
      return 2;
    }
    return 3;
  };
  
  const [cols, setCols] = useState(getInitialCols());
  const initialCount = cols * 2 - 1;
  const loadStep = cols * 2;
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const updateLayout = () => {
      if (typeof window !== 'undefined') {
        const newCols = window.innerWidth >= 1280 ? 4 : (window.innerWidth >= 640 ? 3 : 2);
        if (newCols !== cols) setCols(newCols);
      }
    };
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [cols]);

  useEffect(() => {
    // Tự động cuộn sang video thứ 2 trên mobile để slider trông cân đối
    const timer = setTimeout(() => {
      if (window.innerWidth <= 768) {
        const slider = document.getElementById('video-slider');
        if (slider) {
          // Cuộn một khoảng để snap vào video thứ 2
          slider.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  const allFeaturedProducts = useMemo(() => products.filter(p => p.category !== '3d-printer'), [products]);
  const featuredProducts = allFeaturedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < allFeaturedProducts.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + loadStep);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{
        position: 'relative',
        height: '90vh',
        width: '100%',
        overflow: 'hidden',
        marginTop: '-80px', // Pull up behind navbar
      }}>
        {/*
          Hướng dẫn thay đổi Video: 
          Bạn chỉ cần thay đổi đường link trong thuộc tính `src` của thẻ <source> bên dưới 
          thành link video MP4 của bạn.
        */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundColor: '#050d05'
        }}>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            poster="/images/slider-banner.jpg"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.4,
              transform: 'translateZ(0)',
              willChange: 'transform, opacity',
              pointerEvents: 'none'
            }}
          >
            <source src={settings.heroVideoUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ thẻ video.
          </video>
        </div>

        <style>{`
          .hero-section {
            display: flex;
            align-items: flex-end;
            padding-bottom: 120px;
          }
          .hero-content {
            padding-top: 50px;
          }
          @media (min-width: 1024px) {
            .hero-section {
              align-items: center;
              padding-bottom: 0;
            }
            .hero-content {
              padding-top: 100px;
            }
          }
        `}</style>
        <div className="container hero-content" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className=" hero-title"
            style={{ lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 900 }}
          >
            {t('hero_title_1')} <br/>
            <span className="text-gradient">{t('hero_title_2')}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            {t('hero_subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/technology">
              <button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                {t('shop_now')}
              </button>
            </Link>
          </motion.div>
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '150px',
          background: 'linear-gradient(to bottom, transparent, var(--color-bg))',
          pointerEvents: 'none'
        }}></div>
      </section>

      {/* Middle Banner replacing Video Shorts Slider */}
      {(settings.middleBannerImage || settings.middleBannerImageMobile) && (
        <section className="container" style={{ paddingTop: '5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            style={{
              width: '100%',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <picture>
              {settings.middleBannerImageMobile && <source media="(max-width: 768px)" srcSet={settings.middleBannerImageMobile} />}
              <img 
                src={settings.middleBannerImage || settings.middleBannerImageMobile} 
                alt="Middle Banner" 
                style={{ width: '100%', height: 'auto', display: 'block' }} 
              />
            </picture>
          </motion.div>
        </section>
      )}

      {/* Categories Grid */}
      <motion.section
        className="container"
        style={{ paddingTop: '5rem' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="cat-collections-row">

          {/* LEFT: Khám phá danh mục */}
          <div className="cat-collections-left">
            <motion.h2 {...headerAnimProps} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <LegoHeadIcon size={32} />
              {t('explore_categories')}
            </motion.h2>
            <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(0.5rem, 1.5vw, 1.5rem)', justifyItems: 'center' }}>
              {[
                { title: t('cat_superheroes'), img: '/images/tube-superhero.png', path: '/category/Superheroes' },
                { title: t('cat_scifi'), img: '/images/tube-scifi.png', path: '/category/Sci-Fi' },
                { title: t('cat_classic'), img: '/images/tube-classic.png', path: '/category/Classic' },
              ].map((cat, idx) => (
                <Link to={cat.path} key={idx} style={{ textDecoration: 'none', width: '100%', display: 'block' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                    <motion.div
                      whileHover={{
                        scale: 1.03,
                        borderColor: 'var(--color-accent)',
                        boxShadow: '0 0 30px rgba(74, 222, 128, 0.5), inset 0 0 20px rgba(74, 222, 128, 0.3)'
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        background: 'transparent'
                      }}
                    >
                      <img src={cat.img} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'screen' }} />
                    </motion.div>
                    <h3 className="" style={{ fontWeight: 500, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text)', fontSize: 'clamp(0.6rem, 1.2vw, 0.9rem)' }}>{cat.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: Bộ sưu tập */}
          <div className="cat-collections-right">
            <motion.h2 {...headerAnimProps} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <LegoHeadIcon size={32} />
                {language === 'vi' ? 'Bộ Sưu Tập' : 'Collections'}
              </span>
              {/* Scroll arrows - only visible on mobile via CSS */}
              <span className="collections-nav" style={{ gap: '0.35rem', flexShrink: 0 }}>
                <button
                  onClick={() => {
                    const el = document.querySelector('.collections-grid') as HTMLElement;
                    if (el) el.scrollBy({ left: -200, behavior: 'smooth' });
                  }}
                  className="chamfer-btn"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', cursor: 'pointer', flexShrink: 0 }}
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => {
                    const el = document.querySelector('.collections-grid') as HTMLElement;
                    if (el) el.scrollBy({ left: 200, behavior: 'smooth' });
                  }}
                  className="chamfer-btn"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', cursor: 'pointer', flexShrink: 0 }}
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </span>
            </motion.h2>
            <div className="collections-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.5rem' }}>
              {[
                { name: 'Marvel', icon: <Shield size={24} />, color: '#e23636', bg: 'rgba(226,54,54,0.1)', border: 'rgba(226,54,54,0.3)', path: '/category/superheroes?q=marvel' },
                { name: 'DC Comics', icon: <Moon size={24} />, color: '#0074e4', bg: 'rgba(0,116,228,0.1)', border: 'rgba(0,116,228,0.3)', path: '/category/superheroes?q=dc' },
                { name: 'Star Wars', emoji: '⚔️', color: '#ffe81f', bg: 'rgba(255,232,31,0.1)', border: 'rgba(255,232,31,0.3)', path: '/category/sci-fi?q=starwars' },
                { name: 'Harry Potter', icon: <Wand2 size={24} />, color: '#9c59b6', bg: 'rgba(156,89,182,0.1)', border: 'rgba(156,89,182,0.3)', path: '/category/fantasy?q=harrypotter' },
                { name: 'Avengers', emoji: '🛡️', color: '#c0392b', bg: 'rgba(192,57,43,0.1)', border: 'rgba(192,57,43,0.3)', path: '/category/superheroes?q=avengers' },
                { name: 'Anime', icon: <Swords size={24} />, color: '#e91e8c', bg: 'rgba(233,30,140,0.1)', border: 'rgba(233,30,140,0.3)', path: '/category/anime' },
                { name: 'Jurassic', icon: <PawPrint size={24} />, color: '#2ecc71', bg: 'rgba(46,204,113,0.1)', border: 'rgba(46,204,113,0.3)', path: '/category/sci-fi?q=jurassic' },
                { name: 'Ninjago', icon: <Swords size={24} />, color: '#e67e22', bg: 'rgba(230,126,34,0.1)', border: 'rgba(230,126,34,0.3)', path: '/category/classic?q=ninjago' },
                { name: 'Space', icon: <Rocket size={24} />, color: '#3498db', bg: 'rgba(52,152,219,0.1)', border: 'rgba(52,152,219,0.3)', path: '/category/sci-fi?q=space' },
                { name: 'Castle', icon: <Castle size={24} />, color: '#f39c12', bg: 'rgba(243,156,18,0.1)', border: 'rgba(243,156,18,0.3)', path: '/category/fantasy?q=castle' },
                { name: 'City', icon: <Building2 size={24} />, color: '#1abc9c', bg: 'rgba(26,188,156,0.1)', border: 'rgba(26,188,156,0.3)', path: '/category/classic?q=city' },
                { name: 'Technic', icon: <Settings size={24} />, color: '#95a5a6', bg: 'rgba(149,165,166,0.1)', border: 'rgba(149,165,166,0.3)', path: '/category/classic?q=technic' },
              ].map((col, i) => (
                <Link to={col.path} key={i} style={{ textDecoration: 'none' }}>
                  <motion.div
                    className="col-card"
                    whileHover={{
                      scale: 1.06,
                      boxShadow: `0 0 16px ${col.color}50`,
                      borderColor: col.color,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.9rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: col.bg,
                      border: `1px solid ${col.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{col.icon}</span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                      color: col.color,
                      textAlign: 'center',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%',
                    }}>{col.name}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </motion.section>

      {/* Featured Products Grid */}
      <section className="container" style={{ paddingTop: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'nowrap', gap: '0.5rem' }}>
          <motion.h2 {...headerAnimProps} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: 'clamp(1rem, 4vw, 1.75rem)' }}>
            <LegoHeadIcon size={36} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('featured_drops')}</span>
          </motion.h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--glass-border)' }} className="view-toggle-mobile">
              <button onClick={() => setViewMode('grid')} title="Grid"
                style={{ padding: '0.4rem 0.5rem', background: viewMode === 'grid' ? 'var(--color-accent)' : 'transparent', color: viewMode === 'grid' ? '#000' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode('list')} title="List"
                style={{ padding: '0.4rem 0.5rem', background: viewMode === 'list' ? 'var(--color-accent)' : 'transparent', color: viewMode === 'list' ? '#000' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                <LayoutList size={16} />
              </button>
            </div>
            <Link to="/products" title={t('view_all')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-accent)', color: '#000', padding: '0.4rem 0.5rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) var(--radius-sm)', clipPath: 'polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px, 3px 6px, 3px 3px, 6px 3px)', transition: 'all 0.2s' }}>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Product grid with interspersed single-column ad banners */}
        <AnimatePresence mode="wait">
          <motion.div
            key={featuredProducts.length}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={viewMode === 'list' ? 'product-list' : 'product-grid'}
            style={{ position: 'relative' }}
          >
            {featuredProducts.map((product: typeof featuredProducts[0], idx: number) => {
              const showAd1 = idx === (cols - 1) && viewMode === 'grid';

              return (
                <React.Fragment key={product.id}>
                  <ProductCard product={product} idx={idx} listMode={viewMode === 'list'} />
                
                {showAd1 && (
                  <div className="product-card" style={{
                    background: 'linear-gradient(135deg, #0a1c0a 0%, #1a3a1a 100%)',
                    border: '1px solid rgba(74,222,128,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '2rem',
                    position: 'relative',
                    boxShadow: '0 10px 30px rgba(74,222,128,0.1)',
                    height: '100%'
                  }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(74,222,128,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
                    <Zap size={48} color="var(--color-accent)" style={{ marginBottom: '1.5rem' }} className="flash-shake" />
                    <p style={{ color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}><Zap size={14} style={{display:'inline-block', verticalAlign:'middle', marginRight:'4px'}}/> Flash Deal</p>
                    <h3 className="ad-title" style={{ fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem', color: '#fff' }}>
                      {language === 'vi' ? 'Giảm 40%' : '40% OFF'}<br/>Marvel Sets
                    </h3>
                    <Link to="/category/superheroes?q=marvel" style={{ textDecoration: 'none', width: '100%', marginTop: 'auto' }}>
                      <motion.button whileHover={{ scale: 1.05 }} style={{ width: '100%', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.8rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                        {language === 'vi' ? 'Mua Ngay' : 'Shop Now'}
                      </motion.button>
                    </Link>
                  </div>
                )}
              </React.Fragment>
            );
          })}
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <button 
            className="btn-primary" 
            onClick={hasMore ? handleLoadMore : undefined}
            disabled={isLoading || !hasMore}
            style={{ 
              padding: '1rem 3rem', 
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isLoading ? 0.7 : (!hasMore ? 0.5 : 1),
              cursor: (isLoading || !hasMore) ? 'not-allowed' : 'pointer',
              background: !hasMore ? 'rgba(255,255,255,0.1)' : undefined,
              color: !hasMore ? 'var(--color-text-muted)' : undefined,
              border: !hasMore ? '1px solid var(--glass-border)' : undefined,
            }}
          >
            {isLoading && <Loader2 size={20} className="animate-spin" />}
            {isLoading ? (language === 'vi' ? 'Đang tải...' : 'Loading...') : 
             (!hasMore ? (language === 'vi' ? 'Đã hết sản phẩm' : 'No More Products') : 
             (language === 'vi' ? 'Xem Thêm Sản Phẩm' : 'Load More'))}
          </button>
        </div>
      </section>


      {/* Blog Section */}
      <motion.section 
        className="container" 
        style={{ paddingTop: '5rem' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'nowrap', gap: '0.5rem' }}>
          <motion.h2 {...headerAnimProps} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: 'clamp(1rem, 4vw, 1.75rem)' }}>
            <LegoHeadIcon size={36} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('latest_news')}</span>
          </motion.h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <Link to="/news" title={language === 'vi' ? 'Xem Tất Cả' : 'View All'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-accent)', color: '#000', padding: '0.4rem 0.5rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) var(--radius-sm)', clipPath: 'polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px, 3px 6px, 3px 3px, 6px 3px)', transition: 'all 0.2s' }}>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="home-news-grid">
          {blogPosts.slice(0, 4).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link to={`/news/${post.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  className="glass-panel"
                  style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '110px', transition: 'border-color 0.3s, transform 0.25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,222,128,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: '110px', flexShrink: 0, overflow: 'hidden' }}>
                    <img src={post.image} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
                    <p style={{ color: 'var(--color-accent)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem' }}>{post.date}</p>
                    <h3 style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                      fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '0.3rem',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden'
                    }}>{post.title}</h3>
                    <p style={{
                      fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden'
                    }}>{post.excerpt}</p>
                  </div>
                  {/* Arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', paddingRight: '1rem', color: 'var(--color-accent)', flexShrink: 0 }}>
                    <ChevronRight size={20} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <style>{`
        .product-card {
          transform: translateY(0);
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(74, 222, 128, 0.15);
        }
        .hover-cart-btn:hover {
          background: var(--color-accent) !important;
          color: #000 !important;
          transform: scale(1.1);
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-3px) rotate(-3deg); }
          50% { transform: translateX(3px) rotate(3deg); }
          75% { transform: translateX(-3px) rotate(-3deg); }
          100% { transform: translateX(0); }
        }
        .flash-shake {
          animation: shake 0.6s ease-in-out infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .category-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(3, 1fr);
        }
        .category-card {
          height: 300px;
        }
        .blog-grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        }
        .home-news-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .product-card { padding: 0; gap: 0; }
        .product-title { font-size: 1.25rem; line-height: 1.3; }
        .product-price { font-size: 1.25rem; }
        .product-price-old { font-size: 0.875rem; }
        .sale-badge { padding: 0.25rem 0.75rem; font-size: 0.75rem; }
        .product-footer-badge { padding: 4px 10px; font-size: 0.875rem; }
        .why-panel { padding: 4rem; }
        .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem; }
        .why-title { font-size: 2.5rem; }

        @media (max-width: 1023px) {
          .category-card {
            height: 250px;
          }
          .blog-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
          .home-news-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 639px) {
          .category-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            margin: 0 -1rem;
            padding: 0 1rem 1rem 1rem;
            gap: 1rem;
          }
          .category-grid::-webkit-scrollbar { display: none; }
          .category-card {
            min-width: 260px;
            height: 180px;
            scroll-snap-align: center;
          }
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .home-news-grid {
            display: grid;
            grid-template-columns: calc(100% - 2rem) calc(100% - 2rem);
            grid-template-rows: 1fr 1fr;
            grid-auto-flow: column;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            margin: 0 -1rem;
            padding: 0 1rem 1rem 1rem;
            gap: 1rem;
          }
          .home-news-grid::-webkit-scrollbar { display: none; }
          .home-news-grid > div {
            scroll-snap-align: center;
          }
          
          /* Compact mobile product cards */
          .product-card { padding: 0; gap: 0; border-radius: var(--radius-md); overflow: hidden; }
          .product-header { flex-direction: column !important; gap: 0.25rem; }
          .product-price-container { flex-direction: row-reverse !important; align-items: baseline !important; justify-content: flex-end !important; gap: 0.5rem; width: 100%; }
          .product-title { font-size: 0.95rem; padding-right: 0 !important; }
          .product-price { font-size: 1.1rem; }
          .product-price-old { font-size: 0.8rem; margin-bottom: 0 !important; }
          .sale-badge { padding: 0.15rem 0.5rem; font-size: 0.65rem; }
          .product-footer-badge { padding: 2px 6px; font-size: 0.75rem; gap: 4px; }
          
          /* Why panel compact */
          .why-panel { padding: 2rem 1.5rem; }
          .why-grid { grid-template-columns: 1fr; gap: 2rem; }
          .why-title { font-size: 1.75rem; margin-bottom: 2rem !important; }
        }
      `}</style>
    </div>
  );
};
