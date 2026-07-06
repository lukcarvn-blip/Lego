import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Filter, ChevronLeft, ChevronRight, Zap, Sparkles, LayoutGrid, LayoutList } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [isGridLoading, setIsGridLoading] = useState(false);

  const colScrollRef = useRef<HTMLDivElement>(null);
  const scrollCol = (dir: 'left' | 'right') => {
    if (colScrollRef.current) {
      const amount = dir === 'left' ? -300 : 300;
      colScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Sync state if URL changes and handle window resize for items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 640 && window.innerWidth < 1280) {
          setItemsPerPage(6); // Tablet: 3 columns, 2 rows
        } else if (window.innerWidth >= 1280) {
          setItemsPerPage(8); // Desktop: 4 columns, 2 rows
        } else {
          setItemsPerPage(6); // Mobile: 2 columns, 3 rows
        }
      }
    };
    
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
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
    let result = [...products];

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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  // Pagination
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

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
    if (cat === 'All') {
      navigate('/products');
    } else {
      navigate(`/products/${cat}`);
    }
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
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text)' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => scrollCol('right')}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text)' }}
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
                  { name: 'Marvel', emoji: '🕷️', color: '#e23636', bg: 'rgba(226,54,54,0.1)', border: 'rgba(226,54,54,0.3)', path: '/category/superheroes?q=marvel' },
                  { name: 'DC Comics', emoji: '🦇', color: '#0074e4', bg: 'rgba(0,116,228,0.1)', border: 'rgba(0,116,228,0.3)', path: '/category/superheroes?q=dc' },
                  { name: 'Star Wars', emoji: '⚔️', color: '#ffe81f', bg: 'rgba(255,232,31,0.1)', border: 'rgba(255,232,31,0.3)', path: '/category/sci-fi?q=starwars' },
                  { name: 'Harry Potter', emoji: '🧙', color: '#9c59b6', bg: 'rgba(156,89,182,0.1)', border: 'rgba(156,89,182,0.3)', path: '/category/fantasy?q=harrypotter' },
                  { name: 'Avengers', emoji: '🛡️', color: '#c0392b', bg: 'rgba(192,57,43,0.1)', border: 'rgba(192,57,43,0.3)', path: '/category/superheroes?q=avengers' },
                  { name: 'Anime', emoji: '⛩️', color: '#e91e8c', bg: 'rgba(233,30,140,0.1)', border: 'rgba(233,30,140,0.3)', path: '/category/anime' },
                  { name: 'Jurassic', emoji: '🦖', color: '#2ecc71', bg: 'rgba(46,204,113,0.1)', border: 'rgba(46,204,113,0.3)', path: '/category/sci-fi?q=jurassic' },
                  { name: 'Ninjago', emoji: '🥷', color: '#e67e22', bg: 'rgba(230,126,34,0.1)', border: 'rgba(230,126,34,0.3)', path: '/category/classic?q=ninjago' },
                  { name: 'Space', emoji: '🚀', color: '#3498db', bg: 'rgba(52,152,219,0.1)', border: 'rgba(52,152,219,0.3)', path: '/category/sci-fi?q=space' },
                  { name: 'Castle', emoji: '🏰', color: '#f39c12', bg: 'rgba(243,156,18,0.1)', border: 'rgba(243,156,18,0.3)', path: '/category/fantasy?q=castle' },
                  { name: 'City', emoji: '🏙️', color: '#1abc9c', bg: 'rgba(26,188,156,0.1)', border: 'rgba(26,188,156,0.3)', path: '/category/classic?q=city' },
                  { name: 'Technic', emoji: '⚙️', color: '#95a5a6', bg: 'rgba(149,165,166,0.1)', border: 'rgba(149,165,166,0.3)', path: '/category/classic?q=technic' },
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
                      <span className="collection-icon">{col.emoji}</span>
                      <span style={{ color: col.color, fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center' }}>
                        {col.name}
                      </span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--glass-border)', width: '100%' }} />

            {/* Bottom Row: Sort & Display Controls */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <Filter size={20} color="var(--color-text-muted)" />
                {['All', 'Superheroes', 'Sci-Fi', 'Classic'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      background: activeCategory === cat ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
                      color: activeCategory === cat ? '#000' : 'var(--color-text)',
                      fontWeight: activeCategory === cat ? 700 : 500,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {cat === 'All' ? (language === 'vi' ? 'Tất cả' : 'All') : cat}
                  </button>
                ))}
                
                <select 
                  value={activeSaleType} 
                  onChange={(e) => { setActiveSaleType(e.target.value); setCurrentPage(1); }}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--color-text)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    cursor: 'pointer'
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
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--color-text)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="newest">{language === 'vi' ? 'Mới nhất' : 'Newest'}</option>
                  <option value="price_asc">{language === 'vi' ? 'Giá: Thấp đến Cao' : 'Price: Low to High'}</option>
                  <option value="price_desc">{language === 'vi' ? 'Giá: Cao đến Thấp' : 'Price: High to Low'}</option>
                </select>
              </div>

              {/* View Mode Toggle - mobile only */}
              <div className="view-toggle-mobile" style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                  style={{ padding: '0.5rem 0.75rem', background: viewMode === 'grid' ? 'var(--color-accent)' : 'transparent', color: viewMode === 'grid' ? '#000' : 'var(--color-text-muted)', transition: 'all 0.2s', border: 'none', cursor: 'pointer' }}
                ><LayoutGrid size={18} /></button>
                <button
                  onClick={() => setViewMode('list')}
                  title="List view"
                  style={{ padding: '0.5rem 0.75rem', background: viewMode === 'list' ? 'var(--color-accent)' : 'transparent', color: viewMode === 'list' ? '#000' : 'var(--color-text-muted)', transition: 'all 0.2s', border: 'none', cursor: 'pointer' }}
                ><LayoutList size={18} /></button>
              </div>
            </div>
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
              const showAd1 = idx === 3 && viewMode === 'grid';
              const showAd2 = idx === 7 && viewMode === 'grid';

              return (
                <React.Fragment key={product.id}>
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
                      <p style={{ color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>⚡ Flash Deal</p>
                      <h3 className="ad-title minecraft-font" style={{ fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem', color: '#fff' }}>
                        {language === 'vi' ? 'Giảm 40%' : '40% OFF'}<br/>Marvel Sets
                      </h3>
                      <Link to="/category/superheroes?q=marvel" style={{ textDecoration: 'none', width: '100%', marginTop: 'auto' }}>
                        <motion.button whileHover={{ scale: 1.05 }} style={{ width: '100%', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.8rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                          {language === 'vi' ? 'Mua Ngay' : 'Shop Now'}
                        </motion.button>
                      </Link>
                    </div>
                  )}

                  {showAd2 && (
                    <div className="product-card" style={{
                      background: 'linear-gradient(135deg, #12080d 0%, #2a0a1a 100%)',
                      border: '1px solid rgba(233,30,140,0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '2rem',
                      position: 'relative',
                      boxShadow: '0 10px 30px rgba(233,30,140,0.1)',
                      height: '100%'
                    }}>
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(233,30,140,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
                      <Sparkles size={48} color="#e91e8c" style={{ marginBottom: '1.5rem' }} />
                      <p style={{ color: '#e91e8c', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>🆕 New</p>
                      <h3 className="ad-title minecraft-font" style={{ fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem', color: '#fff' }}>
                        {language === 'vi' ? 'Bộ Anime' : 'Anime Sets'}<br/>Vừa Cập Bến
                      </h3>
                      <Link to="/category/anime" style={{ textDecoration: 'none', width: '100%', marginTop: 'auto' }}>
                        <motion.button whileHover={{ scale: 1.05 }} style={{ width: '100%', background: '#e91e8c', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.8rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                          {language === 'vi' ? 'Khám Phá' : 'Explore'}
                        </motion.button>
                      </Link>
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
