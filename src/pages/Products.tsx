import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Filter, ChevronLeft, ChevronRight, Zap, Sparkles, LayoutGrid, LayoutList, Shield, Moon, Star, Wand2, Swords, PawPrint, Rocket, Castle, Building2, Settings , MessageSquarePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LegoHeadIcon } from '../components/LegoHeadIcon';


const DEFAULT_ITEMS_PER_PAGE = 8;

export const Products = () => {
  const { products, t, language } = useStore();
  const { categoryName } = useParams<{ categoryName?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  const [activeCategory, setActiveCategory] = useState<string>(categoryName || 'All');
  const [activeSaleType, setActiveSaleType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isGridLoading, setIsGridLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [cols, setCols] = useState(3);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const colScrollRef = useRef<HTMLDivElement>(null);
  const scrollCol = (dir: 'left' | 'right') => {
    if (colScrollRef.current) {
      const amount = dir === 'left' ? -300 : 300;
      colScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Sync state if URL changes and handle window resize for columns
  useEffect(() => {
    const updateLayout = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 768);
        if (window.innerWidth >= 1280) {
          setCols(4);
        } else if (window.innerWidth >= 640) {
          setCols(3);
        } else {
          setCols(2);
        }
      }
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);
  useEffect(() => {
    if (categoryName) {
      setActiveCategory(categoryName);
      setCurrentPage(1);
      setTimeout(() => {
        const el = document.getElementById('products-grid-top');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    }
  }, [categoryName]);

  // Loading illusion for grid updates
  useEffect(() => {
    setIsGridLoading(true);
    const timer = setTimeout(() => setIsGridLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeCategory, activeSaleType, sortBy, currentPage, viewMode, categoryName, searchQuery]);

  // Derived state: Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.category !== '3d-printer');

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.vi.toLowerCase().includes(q) || p.name.en.toLowerCase().includes(q));
    }

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (activeSaleType === 'Sale') {
      result = result.filter(p => p.saleType === 'SALE' || (p.discountPercentage ?? 0) > 0);
    } else if (activeSaleType === 'Flash Sale') {
      result = result.filter(p => p.saleType === 'FLASH_SALE');
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => {
        const aPrice = a.price * (1 - (a.discountPercentage || 0) / 100);
        const bPrice = b.price * (1 - (b.discountPercentage || 0) / 100);
        return aPrice - bPrice;
      });
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => {
        const aPrice = a.price * (1 - (a.discountPercentage || 0) / 100);
        const bPrice = b.price * (1 - (b.discountPercentage || 0) / 100);
        return bPrice - aPrice;
      });
    } else {
      // newest/default: keep original order or sort by ID
      result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }

    return result;
  }, [products, activeCategory, activeSaleType, sortBy]);

  // Page 1 = (cols * 3) items shown (2 rows + ad slot + 1 more row = 5 on mobile, 7 on tablet, 9 on desktop)
  // But the ad takes 1 slot visually so we fetch cols*3 - 1 actual products
  const firstPageItems = cols * 3 - 1; // 5 on mobile (2 cols), 8 on tablet (3 cols), 11 on desktop (4 cols)
  const subsequentPageItems = cols * 2; // 4 on mobile, 6 on tablet, 8 on desktop
  
  const totalPages = 1 + Math.ceil(Math.max(0, filteredProducts.length - firstPageItems) / subsequentPageItems);
  
  // Pagination
  const currentProducts = useMemo(() => {
    const start = currentPage === 1 ? 0 : firstPageItems + (currentPage - 2) * subsequentPageItems;
    const count = currentPage === 1 ? firstPageItems : subsequentPageItems;
    return filteredProducts.slice(start, start + count);
  }, [filteredProducts, currentPage, cols]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const el = document.getElementById('products-grid-top');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };


  return (
    <div style={{ paddingTop: '160px', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Header & Filter Bar */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>
            {language === 'vi' ? 'Cửa Hàng' : 'Shop'}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1.5rem', 
            background: 'var(--glass-bg)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--glass-border)'
          }}>
            
            {/* Top Row: Collections Slider (Replaces basic category buttons) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                  <LegoHeadIcon size={24} />
                  {language === 'vi' ? 'Bộ Sưu Tập' : 'Collections'}
                </h2>
                <span style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                  <button
                    onClick={() => scrollCol('left')}
                    className="chamfer-btn"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text)' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => scrollCol('right')}
                    className="chamfer-btn"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text)' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </span>
              </div>
              
              <div 
                ref={colScrollRef}
                style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  overflowX: 'auto', 
                  scrollSnapType: 'x mandatory', 
                  paddingBottom: '0.5rem',
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none' // IE/Edge
                }}
                className="hide-scrollbar"
              >
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
                  <Link to={col.path} key={i} style={{ textDecoration: 'none', flexShrink: 0, scrollSnapAlign: 'start' }}>
                    <motion.div
                      whileHover={{ scale: 1.05, borderColor: col.color }}
                      className="collection-box"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: col.bg,
                        border: `1px solid ${col.border}`,
                        borderRadius: 'var(--radius-md)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span className="collection-icon">{col.icon}</span>
                      <span style={{ color: col.color, fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center' }}>
                        {col.name}
                      </span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--glass-border)', width: '100%' }} />

            {/* Filter + View Controls Row */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
              {/* Filter Toggle Icon (all screens) */}
              <button 
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0.5rem 0.75rem',
                  background: showMobileFilter ? 'var(--color-accent)' : 'rgba(255,255,255,0.07)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)',
                  color: showMobileFilter ? '#000' : 'var(--color-text-muted)',
                  cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                }}
              >
                <Filter size={18} />
              </button>

              {/* View Mode Toggle */}
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--glass-border)', flexShrink: 0 }}>
                <button onClick={() => setViewMode('grid')} title="Grid view"
                  style={{ padding: '0.5rem 0.75rem', background: viewMode === 'grid' ? 'var(--color-accent)' : 'transparent', color: viewMode === 'grid' ? '#000' : 'var(--color-text-muted)', transition: 'all 0.2s', border: 'none', cursor: 'pointer' }}
                ><LayoutGrid size={18} /></button>
                <button onClick={() => setViewMode('list')} title="List view"
                  style={{ padding: '0.5rem 0.75rem', background: viewMode === 'list' ? 'var(--color-accent)' : 'transparent', color: viewMode === 'list' ? '#000' : 'var(--color-text-muted)', transition: 'all 0.2s', border: 'none', cursor: 'pointer' }}
                ><LayoutList size={18} /></button>
              </div>
            </div>

            {/* Expandable Filter Panel — 50/50 layout */}
            <AnimatePresence>
              {showMobileFilter && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden', width: '100%' }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', width: '100%', paddingTop: '0.5rem' }}>
                    {/* Tags — 70% on PC, 60% on tablet, 50% on mobile */}
                    <div style={{ flex: cols >= 4 ? '7 1 0%' : (cols === 3 ? '6 1 0%' : '5 1 0%'), display: 'flex', gap: '0.4rem', flexWrap: 'wrap', minWidth: 0 }}>
                      {['All', 'Superheroes', 'Sci-Fi', 'Classic'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => handleCategoryChange(cat)}
                          style={{
                            padding: '0.45rem 0.8rem',
                            borderRadius: '20px',
                            background: activeCategory === cat ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
                            color: activeCategory === cat ? '#000' : 'var(--color-text)',
                            fontWeight: activeCategory === cat ? 700 : 500,
                            border: 'none',
                            cursor: 'pointer',
                            flex: '1 1 auto',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s'
                          }}
                        >
                          {cat === 'All' ? (language === 'vi' ? 'Tất cả' : 'All') : cat}
                        </button>
                      ))}
                    </div>

                    {/* Selects — 30% on PC, 40% on tablet, 50% on mobile */}
                    <div style={{ flex: cols >= 4 ? '3 1 0%' : (cols === 3 ? '4 1 0%' : '5 1 0%'), display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
                      <select 
                        value={activeSaleType} 
                        onChange={(e) => { setActiveSaleType(e.target.value); setCurrentPage(1); }}
                        style={{
                          flex: 1,
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--color-text)',
                          padding: '0.45rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          outline: 'none',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        <option value="All">{language === 'vi' ? 'Loại Sale' : 'Sale Type'}</option>
                        <option value="Sale">Sale</option>
                        <option value="Flash Sale">Flash Sale</option>
                      </select>

                      <select 
                        value={sortBy} 
                        onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                        style={{
                          flex: 1,
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--color-text)',
                          padding: '0.45rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          outline: 'none',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        <option value="newest">{language === 'vi' ? 'Mới nhất' : 'Newest'}</option>
                        <option value="price_asc">{language === 'vi' ? 'Giá: Thấp đến Cao' : 'Price: Low to High'}</option>
                        <option value="price_desc">{language === 'vi' ? 'Giá: Cao đến Thấp' : 'Price: High to Low'}</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>


        <div id="products-grid-top" style={{ position: 'relative', top: '-100px' }} />
        {/* Product Grid with Interspersed Banner */}
        {isGridLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', minHeight: '400px' }}>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ marginBottom: '1.5rem' }}
            >
              <LegoHeadIcon size={56} isLoading={true} />
            </motion.div>
            <p style={{ color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Đang tải sản phẩm...' : 'Loading products...'}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{language === 'vi' ? 'Không tìm thấy sản phẩm nào' : 'No products found'}</h3>
            <button className="btn-primary" onClick={() => { setActiveCategory('All'); setActiveSaleType('All'); }}>
              {language === 'vi' ? 'Xóa bộ lọc' : 'Clear Filters'}
            </button>
          </div>
        ) : (
          <div className={viewMode === 'list' ? 'product-list' : 'product-grid'}>
            {currentProducts.map((product, idx) => {
              // Ad appears after the first full row (cols items), pushing remaining products down
              const showAd1 = idx === (cols - 1) && viewMode === 'grid' && currentPage === 1;

              return (
                <React.Fragment key={product.id}>
                  {showAd1 && (
                    <div className="product-card request-card-bg fan-cung-shine" style={{
                    display: 'flex', flexDirection: 'column', 
                    width: '100%', minHeight: '400px', height: '100%',
                    borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-accent)',
                    cursor: 'pointer', transition: 'all 0.3s', overflow: 'hidden', position: 'relative',
                    alignItems: 'center', textAlign: 'center', padding: '1.5rem'
                  }}>
                    <Link to="/community" style={{ position: 'absolute', inset: 0, zIndex: 20 }}></Link>
                    
                    <MessageSquarePlus size={32} color="var(--color-accent)" style={{ marginBottom: '1rem', zIndex: 10 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', zIndex: 10, textTransform: 'uppercase' }}>
                      <Star size={16} fill="var(--color-accent)" />
                      {language === 'vi' ? 'Fan Cứng' : 'Top Fan'}
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem', zIndex: 10, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {language === 'vi' ? 'NHÂN VẬT TIẾP THEO?' : 'NEXT CHARACTER?'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', zIndex: 10, padding: '0 0.5rem' }}>
                      {language === 'vi' ? 'Hãy trở thành FAN CỨNG và gửi yêu cầu cho chúng tôi' : 'Become a TOP FAN and send us your request'}
                    </p>

                    {/* Lego Silhouette */}
                    <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '66%', zIndex: 1, opacity: 0.15 }}>
                      <svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                        {/* Stud */}
                        <rect x="40" y="8" width="20" height="6" rx="2" fill="#fff" />
                        {/* Head */}
                        <rect x="30" y="14" width="40" height="32" rx="8" fill="#fff" />
                        {/* Neck */}
                        <rect x="42" y="46" width="16" height="4" fill="#fff" />
                        {/* Torso */}
                        <path d="M 34 50 L 66 50 L 76 95 L 24 95 Z" fill="#fff" />
                        {/* Hips */}
                        <path d="M 24 97 L 76 97 L 76 108 L 24 108 Z" fill="#fff" />
                        {/* Legs */}
                        <rect x="24" y="110" width="23" height="35" rx="3" fill="#fff" />
                        <rect x="53" y="110" width="23" height="35" rx="3" fill="#fff" />
                        {/* Arms */}
                        <path d="M 32 50 C 15 50 10 70 12 85 C 13 90 20 90 24 85 C 24 75 22 65 32 60 Z" fill="#fff" />
                        <path d="M 68 50 C 85 50 90 70 88 85 C 87 90 80 90 76 85 C 76 75 78 65 68 60 Z" fill="#fff" />
                        {/* Hands */}
                        <path d="M 16 82 C 6 82 4 98 14 98 C 22 98 24 90 18 88 C 16 87 14 92 10 90 C 8 88 8 85 10 84 C 14 82 16 86 18 86 C 22 84 20 82 16 82 Z" fill="#fff" />
                        <path d="M 84 82 C 94 82 96 98 86 98 C 78 98 76 90 82 88 C 84 87 86 92 90 90 C 92 88 92 85 90 84 C 86 82 84 86 82 86 C 78 84 80 82 84 82 Z" fill="#fff" />
                        
                        {/* Question mark */}
                        <text x="50" y="75" fill="var(--color-accent)" fontSize="42" fontWeight="900" textAnchor="middle" dominantBaseline="middle">?</text>
                      </svg>
                    </div>

                    {/* Button */}
                    <button style={{ position: 'absolute', bottom: '1.5rem', left: '10%', width: '80%', padding: '0.8rem', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', zIndex: 10, cursor: 'pointer', boxShadow: '0 4px 10px rgba(74, 222, 128, 0.3)' }}>
                      {language === 'vi' ? 'Gửi Yêu Cầu' : 'Submit Request'}
                    </button>
                  </div>
                  )}

                  <ProductCard product={product} idx={idx} listMode={viewMode === 'list'} />
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginTop: '4rem' 
          }}>
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    width: '40px', height: '40px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? 'var(--color-accent)' : 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: isActive ? '#000' : 'var(--color-text)',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {page}
                </button>
              );
            })}

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: currentPage === totalPages ? 'var(--color-text-muted)' : 'var(--color-text)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
