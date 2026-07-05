import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronDown, ChevronUp, Star, Clock, Heart, ArrowLeft, Truck, Zap, ClipboardCheck, Hammer, Play, LayoutGrid, LayoutList, Rocket, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { mockProducts, type ProductSize } from '../data/mockProducts';
import { useStore, type ProductMaterial } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

const getSizeDetails = (sizeStr: string) => {
  if (sizeStr.includes('300')) return { label: '300%', height: '21 cm', scale: 0.6 };
  if (sizeStr.includes('400')) return { label: '400%', height: '28 cm', scale: 0.8 };
  if (sizeStr.includes('1000')) return { label: '1000%', height: '70 cm', scale: 1.2 };
  return { label: sizeStr, height: '', scale: 0.8 };
};

const parseSizePercentage = (sizeStr: string | null) => {
  if (!sizeStr) return 1;
  const num = parseInt(sizeStr.replace('Size ', ''), 10);
  return isNaN(num) ? 1 : num / 400;
};

const LegoSilhouette = ({ scale = 1, color = 'var(--color-text-muted)' }) => (
  <svg 
    viewBox="0 0 100 150" 
    style={{ 
      width: `${scale * 50}px`, 
      height: `${scale * 75}px`, 
      transition: 'all 0.3s' 
    }} 
    fill={color}
  >
    <rect x="38" y="5" width="24" height="10" rx="3" />
    <rect x="28" y="15" width="44" height="38" rx="8" />
    <path d="M 30 55 L 70 55 L 82 100 L 18 100 Z" />
    <path d="M 28 58 L 12 85 L 22 90 L 32 75 Z" />
    <path d="M 72 58 L 88 85 L 78 90 L 68 75 Z" />
    <circle cx="17" cy="88" r="7" />
    <circle cx="83" cy="88" r="7" />
    <rect x="23" y="102" width="24" height="43" rx="3" />
    <rect x="53" y="102" width="24" height="43" rx="3" />
  </svg>
);

const FilamentSpool = ({ color, isActive }: { color: string, isActive: boolean }) => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.5rem', transition: 'all 0.3s', filter: isActive ? `drop-shadow(0 0 10px ${color})` : 'none', opacity: isActive ? 1 : 0.5 }}>
    <ellipse cx="12" cy="5" rx="7" ry="2" fill="var(--color-surface)" />
    <ellipse cx="12" cy="19" rx="7" ry="2" fill="var(--color-surface)" />
    <path d="M6.5 5v14 M17.5 5v14" />
    <rect x="6.5" y="5" width="11" height="14" fill={color} opacity="0.2" stroke="none" />
    <path d="M6.5 8h11 M6.5 11h11 M6.5 14h11 M6.5 17h11" strokeOpacity="0.4" />
    <ellipse cx="12" cy="5" rx="2" ry="0.8" fill="var(--color-bg)" />
  </svg>
);

const AnimatedPrice = ({ priceString }: { priceString: string }) => {
  return (
    <span style={{ display: 'inline-flex' }}>
      {priceString.split('').map((char, i) => (
        <motion.span
          key={`${i}-${char}`}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--glass-border)', padding: '1rem 0' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}
      >
        <h4 style={{ fontWeight: 600 }}>{title}</h4>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, t, language, formatPrice, showToast } = useStore();
  
  const relatedRef = useRef<HTMLDivElement>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth;
      ref.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const product = mockProducts.find(p => p.id === id);
  const [viewModeRelated, setViewModeRelated] = useState<'grid' | 'list'>('grid');
  const [viewModeBestSellers, setViewModeBestSellers] = useState<'grid' | 'list'>('grid');
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(product?.availableSizes[0] || null);
  const [selectedMaterial, setSelectedMaterial] = useState<ProductMaterial>('PLA');
  const [isFastCrafting, setIsFastCrafting] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);

  const finalPriceMultiplier = parseSizePercentage(selectedSize) * (selectedMaterial === 'PETG' ? 1.2 : 1) * (isFastCrafting ? 1.1 : 1);

  const currentPriceString = product 
    ? formatPrice(product.price * finalPriceMultiplier, product.discountPercentage).current 
    : '';

  if (!product) {
    return <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>Product not found</div>;
  }

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (product && selectedSize) {
      addToCart(product, selectedSize, selectedMaterial, 1, e);
      showToast(language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!');
    }
  };

  // Determine crafting time based on size for the progress UI
  let craftTimeDays = isFastCrafting ? '1-2' : '2-4';
  if (selectedSize === 'Size 1000') craftTimeDays = isFastCrafting ? '2-4' : '5-7';

  return (
    <div className="container" style={{ paddingTop: '120px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div className="hide-scrollbar" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(0.6rem, 2vw, 0.9rem)', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)', whiteSpace: 'nowrap', overflowX: 'auto' }}>
          <span className="hover-text-primary" style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.35rem' }} onClick={() => navigate('/')}>
            <Home size={14} />
            {language === 'vi' ? 'Trang chủ' : 'Home'}
          </span>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <span className="hover-text-primary" style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => navigate(`/products/${product.category}`)}>{product.category}</span>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{product.name[language as keyof typeof product.name]}</span>
        </div>
      </div>
      <div className="pd-main-grid">
        
        {/* Left: Image Gallery */}
        <div style={{ height: '100%', position: 'relative' }}>
          <motion.div 
            className="glass-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ 
              padding: '2rem', 
              aspectRatio: '4/5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              overflow: 'hidden',
              background: 'radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.1) 0%, rgba(0,0,0,0.4) 100%)',
              position: 'relative'
            }}
          >
            {/* Sale Badges */}
            {product.saleType === 'FLASH_SALE' && (
              <div className="flash-shake" style={{
                position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 30,
                background: '#ef4444', color: '#fff', padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.5)'
              }}>
                <Zap size={18} fill="#fff" />
                FLASH SALE -{product.discountPercentage}%
              </div>
            )}
            {product.saleType === 'SALE' && (
              <div style={{
                position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 30,
                background: 'var(--color-accent)', color: '#000', padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)'
              }}>
                SALE -{product.discountPercentage}%
              </div>
            )}

            <motion.img 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              src={product.images[0]} 
              alt={product.name[language]} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 30px 30px rgba(0,0,0,0.6))'
              }} 
            />
          </motion.div>
          
          {/* Video Section below image */}
          {product.video && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginTop: '2rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}
            >
              <div style={{ padding: '0.75rem 1rem', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <Play size={16} color="var(--color-accent)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{language === 'vi' ? 'Video Thực Tế' : 'Product Video'}</span>
              </div>
              <video 
                src={product.video} 
                autoPlay 
                loop 
                muted 
                controls
                style={{ width: '100%', display: 'block', backgroundColor: '#000' }}
              />
            </motion.div>
          )}

          {/* Sticky Buy Button – left column */}
          <motion.div 
            className="sticky-cart-wrapper"
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          >
            <div 
              style={{ 
                padding: '0.75rem 1rem', width: '100%', 
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                boxShadow: '0 10px 30px rgba(74, 222, 128, 0.3)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-accent)'
              }}
            >
              {/* All 3 on same row: MUA NGAY | Price | Rocket */}
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.5rem', width: '100%' }}>
                <button 
                  onClick={handleAddToCart}
                  className="sticky-action-btn bling-btn"
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    fontSize: '1rem', fontWeight: 800,
                    background: 'rgba(0,0,0,0.2)', border: 'none', color: '#000', cursor: 'pointer',
                    padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <ShoppingBag size={20} />
                  <span>{language === 'vi' ? 'MUA NGAY' : 'BUY NOW'}</span>
                </button>
                <div 
                  className="sticky-action-price-box"
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', background: 'rgba(0,0,0,0.15)', padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)', fontSize: '1.1rem', color: '#000',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <AnimatedPrice priceString={currentPriceString} />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsFastCrafting(!isFastCrafting); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#ef4444', color: '#fff', border: 'none',
                    padding: '0 0.9rem', borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: isFastCrafting ? 'inset 0 3px 6px rgba(0,0,0,0.4)' : '0 4px 10px rgba(239,68,68,0.4)',
                    transform: isFastCrafting ? 'scale(0.96)' : 'scale(1)',
                  }}
                  title={language === 'vi' ? 'Tăng tốc chế tác (+10% phí)' : 'Fast Crafting (+10% fee)'}
                >
                  <Rocket size={20} />
                </button>
                <button
                  onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.1)', color: '#000', border: 'none',
                    padding: '0 0.5rem', borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  title={isSummaryExpanded ? "Thu gọn" : "Mở rộng"}
                >
                  {isSummaryExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </button>
              </div>
              {/* Summary Note */}
              <AnimatePresence>
                {isSummaryExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="summary-note-container" style={{ width: '100%', background: 'rgba(0,0,0,0.15)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                      <p className="summary-note" style={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.8)', margin: 0, lineHeight: 1.5, textAlign: 'left' }}>
                        {language === 'vi' ? (
                          <>Bạn đang chọn: <strong>{product.name.vi}</strong> – <strong>{selectedSize}</strong> – <strong>{selectedMaterial}</strong>. Thời gian chế tác: <strong>{craftTimeDays} ngày</strong>. {isFastCrafting ? <strong style={{ color: '#b91c1c' }}>Đã bật tăng tốc!</strong> : 'Nhấn 🚀 để tăng tốc.'}</>
                        ) : (
                          <>Selected: <strong>{product.name.en}</strong> – <strong>{selectedSize}</strong> – <strong>{selectedMaterial}</strong>. Crafting: <strong>{craftTimeDays} days</strong>. {isFastCrafting ? <strong style={{ color: '#b91c1c' }}>Fast mode ON!</strong> : 'Tap 🚀 to speed up.'}</>
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Right: Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0, width: '100%' }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>{product.name[language]}</h1>
              <button style={{ padding: '0.5rem', background: 'var(--glass-bg)', borderRadius: '50%', border: '1px solid var(--glass-border)' }}>
                <Heart size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                <Star size={18} fill="currentColor" />
                <span style={{ color: 'var(--color-text)' }}>{product.rating}</span>
              </div>
              <span>({product.reviews} reviews)</span>
              <span>•</span>
              <span style={{ color: 'var(--color-accent)' }}>{product.stock} in stock</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, color: formatPrice(product.price * finalPriceMultiplier, product.discountPercentage).isOnSale ? '#ef4444' : 'var(--color-accent)' }}>
                <AnimatedPrice priceString={formatPrice(product.price * finalPriceMultiplier, product.discountPercentage).current} />
              </div>
              {formatPrice(product.price * finalPriceMultiplier, product.discountPercentage).isOnSale && (
                <div style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                  {formatPrice(product.price * finalPriceMultiplier, product.discountPercentage).original}
                </div>
              )}
            </div>
          </div>

          <div className="material-size-wrapper">
            <div style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', height: '100%' }}>
            <h3 style={{ marginBottom: '1rem' }}>{language === 'vi' ? 'Chất liệu' : 'Material'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', overflow: 'hidden' }}>
              {/* PLA Option */}
              <button 
                onClick={() => setSelectedMaterial('PLA')}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${selectedMaterial === 'PLA' ? 'var(--color-accent)' : 'var(--glass-border)'}`,
                  background: selectedMaterial === 'PLA' ? 'rgba(74, 222, 128, 0.1)' : 'var(--color-surface)',
                  color: selectedMaterial === 'PLA' ? 'var(--color-accent)' : 'var(--color-text)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden', minWidth: 0
                }}
              >
                <FilamentSpool color={selectedMaterial === 'PLA' ? '#4ade80' : 'var(--color-text-muted)'} isActive={selectedMaterial === 'PLA'} />
                <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>PLA</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Mặc định' : 'Default'}</span>
              </button>

              {/* PETG Option */}
              <button 
                onClick={() => setSelectedMaterial('PETG')}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${selectedMaterial === 'PETG' ? '#fbbf24' : 'var(--glass-border)'}`,
                  background: selectedMaterial === 'PETG' ? 'rgba(251, 191, 36, 0.1)' : 'var(--color-surface)',
                  color: selectedMaterial === 'PETG' ? '#fbbf24' : 'var(--color-text)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden', minWidth: 0
                }}
              >
                <FilamentSpool color={selectedMaterial === 'PETG' ? '#fbbf24' : 'var(--color-text-muted)'} isActive={selectedMaterial === 'PETG'} />
                <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>PETG</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>+20% {language === 'vi' ? 'Giá' : 'Price'}</span>
              </button>
            </div>

            {/* Explanation Box */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, wordBreak: 'break-word', wordWrap: 'break-word' }}>
              {language === 'vi' ? (
                <>
                  {selectedMaterial === 'PLA' && (
                    <p><strong style={{ color: 'var(--color-text)' }}>PLA (Polylactic Acid):</strong> Nhựa phân hủy sinh học thân thiện với môi trường, nguồn gốc từ tinh bột ngô. Cho độ nét in cực cao, màu sắc đẹp, phù hợp trưng bày trong nhà. Giá thành rẻ hơn.</p>
                  )}
                  {selectedMaterial === 'PETG' && (
                    <p><strong style={{ color: 'var(--color-text)' }}>PETG (Polyethylene Terephthalate Glycol):</strong> Độ bền vật lý cao hơn, dẻo dai và chịu nhiệt tốt hơn PLA. Phù hợp nếu bạn cần mô hình chắc chắn hơn hoặc để gần cửa sổ có nắng. Giá cao hơn 20%.</p>
                  )}
                </>
              ) : (
                <>
                  {selectedMaterial === 'PLA' && (
                    <p><strong style={{ color: 'var(--color-text)' }}>PLA (Polylactic Acid):</strong> Eco-friendly, biodegradable plastic derived from corn starch. Offers ultra-high print detail and beautiful colors, perfect for indoor display. Lower cost.</p>
                  )}
                  {selectedMaterial === 'PETG' && (
                    <p><strong style={{ color: 'var(--color-text)' }}>PETG:</strong> Higher physical durability, more flexible, and better heat resistance than PLA. Suitable if you need a sturdier model or plan to place it near sunny windows. Costs 20% more.</p>
                  )}
                </>
              )}
            </div>
          </div>

            <div style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', height: '100%' }}>
            <h3 style={{ marginBottom: '1rem' }}>{t('size')}</h3>
            <div className="size-options-container" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'nowrap', alignItems: 'flex-end', paddingTop: '1rem' }}>
              {product.availableSizes.map(size => {
                const isSelected = selectedSize === size;
                const sizeDetails = getSizeDetails(size);
                return (
                  <button 
                    key={size}
                    className="size-option-btn"
                    onClick={() => setSelectedSize(size)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '0.5rem',
                      padding: '1rem',
                      height: '180px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isSelected ? 'var(--color-accent)' : 'var(--glass-border)'}`,
                      background: isSelected ? 'rgba(74, 222, 128, 0.1)' : 'var(--color-surface)',
                      color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
                      <LegoSilhouette scale={sizeDetails.scale} color={isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)'} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.25rem', color: isSelected ? 'var(--color-accent)' : 'var(--color-text)' }}>
                        {sizeDetails.label}
                      </span>
                      <span style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {sizeDetails.height}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            </div>
          </div>

          {/* Crafting Progress Bar UI */}
          <div style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="#f59e0b" /> 
              {language === 'vi' ? 'QUY TRÌNH CHẾ TÁC DỰ KIẾN' : 'Estimated Crafting Process'}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {language === 'vi' ? `Tổng thời gian: khoảng ${craftTimeDays} ngày` : `Total time: approx ${craftTimeDays} days`}
            </p>
            
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', padding: '0 5%' }}>
              {/* Line behind steps */}
              <div style={{ position: 'absolute', top: '20px', left: '15%', right: '15%', height: '12px', background: 'var(--glass-border)', zIndex: 0, borderRadius: '6px' }}>
                 {/* Animated fill line */}
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '50%' }}
                   transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                   style={{ height: '100%', background: '#f59e0b', borderRadius: '6px', boxShadow: '0 0 14px rgba(245,158,11,0.6)' }}
                 />
              </div>
              
              {/* Step 1: Order Placed */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.75rem', width: '80px' }}>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', boxShadow: '0 0 15px rgba(74, 222, 128, 0.4)' }}
                >
                  <ClipboardCheck size={24} />
                </motion.div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', display: 'block' }}>
                    {language === 'vi' ? 'Đặt Hàng' : 'Order Placed'}
                  </span>
                </div>
              </div>

              {/* Step 2: Crafting */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.75rem', width: '80px' }}>
                <motion.div 
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-surface)', border: '2px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}
                >
                  <Hammer size={24} />
                </motion.div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', display: 'block' }}>
                    {language === 'vi' ? 'Chế Tác' : 'Crafting'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    ({craftTimeDays} {language === 'vi' ? 'ngày' : 'days'})
                  </span>
                </div>
              </div>

              {/* Step 3: Shipped */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.75rem', width: '80px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-surface)', border: '2px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                  <Truck size={24} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block' }}>
                    {language === 'vi' ? 'Giao Hàng' : 'Shipped'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Buy button moved to left column */}

          <div style={{ marginTop: '2rem' }}>
            <AccordionItem title={t('description')} defaultOpen={true}>
              {product.description[language]}
            </AccordionItem>
            <AccordionItem title={t('specifications')}>
              <ul>
                <li>{t('spec_material')}: {t('material_val')}</li>
                <li>{t('spec_finish')}: {t('finish_val')}</li>
                <li>{t('size')}: 300% (21cm), 400% (28cm), 1000% (70cm)</li>
                <li>{t('spec_weight')}: {t('weight_val')}</li>
              </ul>
            </AccordionItem>
          </div>

          {/* Tags */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text-muted)', marginRight: '0.5rem' }}>Tags:</span>
            {['Mô Hình Lắp Ráp', 'Lego 3D', 'Decor', product.category].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)' }}>
                #{tag}
              </span>
            ))}
          </div>

        </motion.div>
      </div>

      {/* Related Products & Best Sellers (50/50 Split) */}
      <div className="bottom-split-container">
        {/* Related Products */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontWeight: 700 }}>
              {language === 'vi' ? 'Sản Phẩm Liên Quan' : 'Related Products'}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => scrollSlider(relatedRef, 'left')}
                style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.07)', borderRadius: '50%', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scrollSlider(relatedRef, 'right')}
                style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.07)', borderRadius: '50%', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div 
            ref={relatedRef}
            className="hide-scrollbar"
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              overflowX: 'auto', 
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              paddingBottom: '1rem'
            }}
          >
            {mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 10).map((p, idx) => (
              <div key={p.id} style={{ flex: '0 0 calc(50% - 0.5rem)', width: 'calc(50% - 0.5rem)', scrollSnapAlign: 'start' }}>
                <ProductCard product={p} idx={idx} listMode={false} />
              </div>
            ))}
          </div>
        </div>
        {/* Best Sellers */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontWeight: 700 }}>
              {language === 'vi' ? 'Sản Phẩm Bán Chạy' : 'Best Sellers'}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => scrollSlider(bestSellersRef, 'left')}
                style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.07)', borderRadius: '50%', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scrollSlider(bestSellersRef, 'right')}
                style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.07)', borderRadius: '50%', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div 
            ref={bestSellersRef}
            className="hide-scrollbar"
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              overflowX: 'auto', 
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              paddingBottom: '1rem'
            }}
          >
            {[...mockProducts].sort((a, b) => b.likes - a.likes).filter(p => p.id !== product.id).slice(0, 10).map((p, idx) => (
              <div key={p.id} style={{ flex: '0 0 calc(50% - 0.5rem)', width: 'calc(50% - 0.5rem)', scrollSnapAlign: 'start' }}>
                <ProductCard product={p} idx={idx} listMode={false} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .bottom-split-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        @keyframes btn-shine {
          0% { left: -100%; opacity: 0; }
          15% { left: 100%; opacity: 0.8; }
          100% { left: 100%; opacity: 0; }
        }
        .bling-btn {
          position: relative;
          overflow: hidden;
        }
        .bling-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent);
          transform: skewX(-20deg);
          animation: btn-shine 5s infinite;
        }
        .size-option-btn {
          width: auto;
          flex: 1;
        }
        .sticky-cart-wrapper {
          position: sticky;
          bottom: 20px;
          z-index: 50;
          margin-top: 2rem;
        }
        .material-size-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 1280px) {
          .material-size-wrapper {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 1023px) {
          .sticky-cart-wrapper {
            position: fixed;
            bottom: 20px;
            left: 1rem;
            right: 1rem;
            z-index: 999;
            margin: 0;
            padding: 0;
          }
          .container {
            padding-bottom: 40px !important;
          }
        }
        @media (max-width: 768px) {
          .sticky-cart-wrapper {
            bottom: 80px;
          }
          .container {
            padding-bottom: 60px !important;
          }
        }
        @media (max-width: 639px) {
          .size-options-container {
            gap: 0.5rem !important;
            flex-wrap: nowrap !important;
          }
          .size-option-btn {
            width: auto !important;
            min-width: 0 !important;
            flex: 1 !important;
            padding: 1rem 0.25rem !important;
          }
          .size-option-btn .size-text {
            font-size: 1.1rem !important;
          }
          .size-option-btn .height-text {
            font-size: 0.75rem !important;
          }
        }
        @media (min-width: 1024px) {
          .bottom-split-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
          .bottom-split-container .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        /* Hide view toggle on tablet and desktop */
        @media (min-width: 640px) {
          .view-toggle-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
