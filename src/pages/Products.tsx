import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Filter, ChevronLeft, ChevronRight, Zap, LayoutGrid, LayoutList } from 'lucide-react';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 8;

export const Products = () => {
  const { products, t, language } = useStore();
  const { categoryName } = useParams<{ categoryName?: string }>();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<string>(categoryName || 'All');
  const [activeSaleType, setActiveSaleType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sync state if URL changes
  useEffect(() => {
    if (categoryName) {
      setActiveCategory(categoryName);
      setCurrentPage(1);
    }
  }, [categoryName]);

  // Derived state: Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  
  // Pagination
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const renderBanner = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass-panel"
      style={{
        gridColumn: '1 / -1', // span full width
        background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(0,0,0,0.8))',
        border: '1px solid var(--color-accent)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        margin: '2rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />
      <Zap size={48} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
      <h2 style={{ marginBottom: '1rem', fontWeight: 800 }}>
        {language === 'vi' ? 'Sự Kiện Độc Quyền' : 'Exclusive Drop Event'}
      </h2>
      <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '600px', marginBottom: '2rem' }}>
        {language === 'vi' 
          ? 'Nhận ngay phần quà phiên bản giới hạn khi mua các sản phẩm bộ sưu tập mới. Số lượng có hạn!'
          : 'Get limited edition rewards with your next purchase of new collection items. Limited stock!'}
      </p>
      <button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
        {language === 'vi' ? 'Khám Phá Ngay' : 'Discover Now'}
      </button>
    </motion.div>
  );

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
            flexWrap: 'wrap', 
            gap: '1rem', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'var(--glass-bg)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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

        {/* Product Grid with Interspersed Banner */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{language === 'vi' ? 'Không tìm thấy sản phẩm nào' : 'No products found'}</h3>
            <button className="btn-primary" onClick={() => { setActiveCategory('All'); setActiveSaleType('All'); }}>
              {language === 'vi' ? 'Xóa bộ lọc' : 'Clear Filters'}
            </button>
          </div>
        ) : (
          <div className={viewMode === 'list' ? 'product-list' : 'product-grid'}>
            {currentProducts.map((product, idx) => {
              const showBanner = idx === 3 && viewMode === 'grid';
              return (
                <React.Fragment key={product.id}>
                  <ProductCard product={product} idx={idx} listMode={viewMode === 'list'} />
                  {showBanner && renderBanner()}
                </React.Fragment>
              );
            })}
            {currentPage === 1 && viewMode === 'grid' && currentProducts.length > 0 && currentProducts.length <= 3 && renderBanner()}
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
