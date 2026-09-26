import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Clock, Zap, Sparkles, ShoppingCart, Shield, Rocket, Crown, Tag, X, ChevronLeft, ChevronRight, Ruler, Palette, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

interface ProductCardProps {
  product: any;
  idx?: number;
  listMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, idx = 0, listMode = false }) => {
  const { language, formatPrice, addToCart, showToast, settings, user, saveCharacter, unsaveCharacter } = useStore();
  const [craftHovered, setCraftHovered] = useState(false);
  const [displayDay, setDisplayDay] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scrolling when gallery is open
  useEffect(() => {
    if (showGallery) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showGallery]);

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideDirection(1);
    setGalleryIndex((prev) => (prev + 1) % (product.images?.length || 1));
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideDirection(-1);
    setGalleryIndex((prev) => (prev - 1 + (product.images?.length || 1)) % (product.images?.length || 1));
  };

  // Parse the max day number from estimatedPrintTime e.g. "2-4 days" → 4
  const parseMaxDay = (time: string) => {
    const match = time.match(/(\d+)(?:\s*-\s*(\d+))?/);
    if (!match) return 4;
    return parseInt(match[2] || match[1]);
  };
  const maxDay = parseMaxDay(product.estimatedPrintTime);

  useEffect(() => {
    if (craftHovered) {
      // Animate counter with RAF - runs over 800ms
      const duration = 800;
      const startTime = performance.now();
      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOut
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayDay(Math.round(eased * maxDay));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setDisplayDay(0);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [craftHovered, maxDay]);

  return (
    <motion.div 
      key={product.id}
      className="product-card-wrapper"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
    >
      {/* Remove whole card Link, only link the title */}
      <div style={{ display: 'block', height: '100%', cursor: 'default', minWidth: 0 }}>
        {listMode ? (
          <div className="glass-panel" style={{
            display: 'flex', flexDirection: 'row', overflow: 'hidden',
            height: 'clamp(120px, 30vw, 160px)', position: 'relative', gap: 0,
            border: '1px solid var(--glass-border)', transition: 'border-color 0.3s',
            width: '100%', minWidth: 0
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,222,128,0.35)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'}
          >
            {/* Thumbnail */}
            <motion.div style={{
              flex: '0 0 35%', maxWidth: '160px',
              background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, rgba(0,0,0,0.5) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative'
            }}
              initial="rest"
              whileHover={isMobile ? undefined : "hover"}
            whileTap={isMobile ? undefined : "hover"}
            animate="rest"
            >
              {/* Badges Container */}
              <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                {product.saleType === 'FLASH_SALE' && (
                  <div style={{ background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700 }}>FLASH</div>
                )}
                {product.saleType === 'SALE' && (
                  <div style={{ background: 'var(--color-accent)', color: '#000', padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700 }}>SALE</div>
                )}
                <div style={{ 
                  background: 'rgba(0,0,0,0.6)', borderRadius: '20px', padding: '2px 6px', 
                  display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  <Heart size={10} fill="#ef4444" color="#ef4444" />
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>{product.likes?.toLocaleString()}</span>
                </div>
              </div>

              {/* LED Running Border Effect */}
              <motion.div
                variants={{
                  rest: { opacity: 0 },
                  hover: { opacity: 1 }
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 12,
                  pointerEvents: 'none',
                  borderRadius: 'inherit',
                  padding: '3px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  style={{
                    position: 'absolute',
                    top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
                    backgroundImage: `url(${product.images?.[0] || product.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(20px) saturate(2) brightness(1.2)',
                  WebkitMaskImage: 'conic-gradient(from 0deg, transparent 50%, black 85%, black 100%)',
                  maskImage: 'conic-gradient(from 0deg, transparent 50%, black 85%, black 100%)'
                  }}
                />
              </motion.div>

              <motion.img src={product.images?.[0] || product.image} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt={product.name[language as keyof typeof product.name]}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowGallery(true); setGalleryIndex(0); }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ 
                  width: '100%', height: '100%', objectFit: 'cover', 
                  cursor: 'pointer' 
                }} 
              />
            </motion.div>

            {/* Info */}
            <div style={{ flex: '1 1 auto', minWidth: 0, padding: isMobile ? '0.75rem' : '1rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
              <div style={{ minWidth: 0, width: '100%' }}>
                <p style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{product.category?.toUpperCase()}</p>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', minWidth: 0 }}>
                  <h3 className="product-title" style={{ fontWeight: 600, fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.2s', width: '100%' }}>
                    {product.name[language as keyof typeof product.name]}
                  </h3>
                </Link>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)', color: formatPrice(product.price, product.discountPercentage).isOnSale ? '#ef4444' : 'var(--color-accent)' }}>
                    {formatPrice(product.price, product.discountPercentage).current}
                  </span>
                  {formatPrice(product.price, product.discountPercentage).isOnSale && (
                    <span style={{ color: 'var(--color-text-muted)', textDecoration: 'line-through', fontSize: '0.6rem' }}>
                      {formatPrice(product.price, product.discountPercentage).original}
                    </span>
                  )}
                </div>
              </div>
              {/* Craft time or Ready Stock Info */}
              {product.isReadyStock ? (
                <div className="card-stats-grid">
                  <div className="stat-item" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="stat-label">{language === 'vi' ? 'Size:' : 'Size:'}</span>
                    <span className="stat-value">{product.availableSizes?.[0] ? product.availableSizes[0].replace('Size ', '') + '%' : (product.dimensions?.split(' ')[0] || '300%')}</span>
                  </div>
                  <div className="stat-item" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="stat-label">{language === 'vi' ? 'Nhựa:' : 'Mat:'}</span>
                    <span className="stat-value">{product.availableMaterials?.[0] || 'PLA'}</span>
                  </div>
                  <div className="stat-item" style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                    <span className="stat-label" style={{ color: 'rgba(74, 222, 128, 0.8)' }}>{language === 'vi' ? 'Sẵn:' : 'Stock:'}</span>
                    <span className="stat-value" style={{ color: '#4ade80' }}>{product.stock || 1}</span>
                  </div>
                  <div className="stat-item" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="stat-label">{language === 'vi' ? 'Mua:' : 'Sold:'}</span>
                    <span className="stat-value">{(product as any).sales || 0}</span>
                  </div>
                </div>
              ) : (
                <div
                  onMouseEnter={() => setCraftHovered(true)}
                  onMouseLeave={() => setCraftHovered(false)}
                  style={{ cursor: 'default' }}
                >
                  <span style={{ fontSize: '0.62rem', color: craftHovered ? '#f59e0b' : 'rgba(255,255,255,0.3)', fontWeight: 600, transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.3rem' }}>
                    <Clock size={10} />{craftHovered ? `${displayDay} ngày` : product.estimatedPrintTime.replace('days', 'ngày')}
                  </span>
                  <div style={{ width: '100%', height: '18px', background: 'rgba(255,255,255,0.08)', borderRadius: '9px', overflow: 'hidden' }}>
                    <div style={{ width: craftHovered ? '75%' : '0%', height: '100%', background: '#f59e0b', borderRadius: '9px', transition: 'width 0.85s cubic-bezier(0.4,0,0.2,1)', boxShadow: craftHovered ? '0 0 10px rgba(245,158,11,0.5)' : 'none' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── GRID CARD LAYOUT (original) ── */
          <div className="glass-panel product-card" style={{
            display: 'flex', flexDirection: 'column',
            height: '100%', position: 'relative', overflow: 'hidden', minWidth: 0
          }}>
          <motion.div 
            initial="rest"
            whileHover={isMobile ? undefined : "hover"}
            whileTap={isMobile ? undefined : "hover"}
            animate="rest"
            style={{ 
            width: '100%',
          flexShrink: 0,
          aspectRatio: '1/1', 
            borderRadius: 'var(--radius-md)', 
            overflow: 'hidden', 
            background: 'radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.15) 0%, rgba(0,0,0,0.5) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            position: 'relative'
          }}>
            {/* Badges Container */}
            <div style={{ 
              position: 'absolute', top: '10px', left: '10px', zIndex: 10,
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem'
            }}>
              {/* Sale Badges */}
              {product.saleType === 'FLASH_SALE' && (
                <div className="flash-shake sale-badge" style={{ 
                  background: 'linear-gradient(45deg, #ef4444, #f97316)', color: 'white',
                  borderRadius: '20px', fontWeight: 'bold', padding: '4px 10px', fontSize: '0.7rem',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  boxShadow: '0 0 15px rgba(239,68,68,0.5)'
                }}>
                  <Zap size={14} fill="currentColor" />
                  FLASH SALE -{product.discountPercentage}%
                </div>
              )}
              {product.saleType === 'NORMAL_SALE' && (
                <div className="sale-badge" style={{ 
                  background: 'var(--color-accent)', color: '#000', padding: '4px 10px', fontSize: '0.7rem',
                  borderRadius: '20px', fontWeight: 'bold'
                }}>
                  SALE -{product.discountPercentage}%
                </div>
              )}

              {/* Likes Badge - Under Sale Badge */}
              <div className="sale-badge" style={{ 
                display: 'flex', alignItems: 'center', gap: '0.25rem', 
                color: '#ef4444', fontWeight: 600, fontSize: '0.75rem',
                background: 'rgba(20, 20, 20, 0.8)', padding: '4px 10px',
                borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.3)',
                backdropFilter: 'blur(4px)'
              }}>
                <Heart size={12} fill="#ef4444" />
                <span>{product.likes.toLocaleString()}</span>
              </div>
            </div>


            {/* LED Running Border Effect */}
            <motion.div
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 }
              }}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 12,
                pointerEvents: 'none',
                borderRadius: 'inherit',
                padding: '3px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                overflow: 'hidden'
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                style={{
                  position: 'absolute',
                  top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
                  backgroundImage: `url(${product.images?.[0] || product.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(20px) saturate(2) brightness(1.2)',
                  WebkitMaskImage: 'conic-gradient(from 0deg, transparent 50%, black 85%, black 100%)',
                  maskImage: 'conic-gradient(from 0deg, transparent 50%, black 85%, black 100%)'
                }}
              />
            </motion.div>

            <motion.img 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowGallery(true); setGalleryIndex(0); }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              src={product.images?.[0] || product.image}
              onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }}
              alt={product.name[language as keyof typeof product.name]}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer', zIndex: 0 }}
            />
            
            {/* Quick Add To Cart - Cyber Slide-Up Style */}
            
            {/* Rest State Icon & Price Badge (Desktop Only) */}
            <motion.div
              className="desktop-action"
              variants={{
                rest: { opacity: 1, scale: 1 },
                hover: { opacity: 0, scale: 0.8 }
              }}
              style={{
                position: 'absolute', bottom: '1rem', right: '1rem',
                background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)',
                padding: '0.4rem 0.8rem', borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                zIndex: 15
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: formatPrice(product.price, product.discountPercentage).isOnSale ? '#ef4444' : 'var(--color-accent)' }}>
                  {formatPrice(product.price, product.discountPercentage).current}
                </span>
                {formatPrice(product.price, product.discountPercentage).isOnSale && (
                  <span style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'line-through', fontSize: '0.65rem' }}>
                    {formatPrice(product.price, product.discountPercentage).original}
                  </span>
                )}
              </div>
              <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.2)' }} />
              <ShoppingCart size={16} color="#fff" />
            </motion.div>
            

            {/* Hover State Slide-Up Panel */}
            {!isMobile && (
              <motion.div
                variants={{
                  rest: { y: '100%', opacity: 0 },
                  hover: { y: 0, opacity: 1 }
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  padding: '3rem 1rem 1rem 1rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(74, 222, 128, 0.15) 70%, transparent 100%)',
                  display: 'flex',
                  justifyContent: 'center',
                  zIndex: 20
                }}
              >
                <button 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigating to ProductDetails
                    const defaultSize = product.availableSizes?.[0] || 'Size 400';
                    addToCart(product, defaultSize, 'PLA', 1, e);
      showToast(language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!');
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '0.8rem', 
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-accent)',
                    color: '#000',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(74, 222, 128, 0.4)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <ShoppingCart size={18} />
                  {language === 'vi' ? 'Mua Hàng Ngay' : 'Buy Now'}
                </button>
              </motion.div>
            )}
          </motion.div>
          
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1rem', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: '0.5rem', marginBottom: '0.4rem', width: '100%', overflow: 'hidden' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1, minWidth: 0 }}>
                {product.category.toLowerCase() === 'superheroes' && <Shield size={12} style={{ flexShrink: 0 }} />}
                {product.category.toLowerCase() === 'sci-fi' && <Rocket size={12} style={{ flexShrink: 0 }} />}
                {product.category.toLowerCase() === 'classic' && <Crown size={12} style={{ flexShrink: 0 }} />}
                {['superheroes', 'sci-fi', 'classic'].indexOf(product.category.toLowerCase()) === -1 && <Tag size={12} style={{ flexShrink: 0 }} />}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.category}</span>
              </span>
              
              {product.collection && settings.collections?.find((c: any) => c.name === product.collection) && (() => {
                const col = settings.collections!.find((c: any) => c.name === product.collection); if (!col) return null;
                const IconComponent = Icons[col.iconName as keyof typeof Icons] as any || Icons.Folder;
                return (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: col.bg || 'rgba(255,255,255,0.1)', border: `1px solid ${col.border || 'rgba(255,255,255,0.2)'}`, color: col.color || '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1, minWidth: 0 }}>
                    <IconComponent size={10} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.name}</span>
                  </span>
                );
              })()}
            </div>
            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', minWidth: 0 }}>
              <h3 className="product-title" style={{ 
                
                fontWeight: 600, 
                marginBottom: '0.5rem',
                whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                transition: 'color 0.2s',
                width: '100%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
              >
                {product.name[language as keyof typeof product.name]}
              </h3>
            </Link>
            
            <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.1rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: formatPrice(product.price, product.discountPercentage).isOnSale ? '#ef4444' : 'var(--color-accent)' }}>
                {formatPrice(product.price, product.discountPercentage).current}
              </span>
              {formatPrice(product.price, product.discountPercentage).isOnSale && (
                <span style={{ color: 'var(--color-text-muted)', textDecoration: 'line-through', fontSize: '0.65rem' }}>
                  {formatPrice(product.price, product.discountPercentage).original}
                </span>
              )}
            </div>

            <div style={{ flex: 1 }}></div>

            {product.isReadyStock ? (
              <div className="card-stats-grid" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="stat-item" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="stat-label">{language === 'vi' ? 'Size:' : 'Size:'}</span>
                  <span className="stat-value">{product.availableSizes?.[0] ? product.availableSizes[0].replace('Size ', '') + '%' : (product.dimensions?.split(' ')[0] || '300%')}</span>
                </div>
                <div className="stat-item" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="stat-label">{language === 'vi' ? 'Nhựa:' : 'Mat:'}</span>
                  <span className="stat-value">{product.availableMaterials?.[0] || 'PLA'}</span>
                </div>
                <div className="stat-item" style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                  <span className="stat-label" style={{ color: 'rgba(74, 222, 128, 0.8)' }}>{language === 'vi' ? 'Sẵn:' : 'Stock:'}</span>
                  <span className="stat-value" style={{ color: '#4ade80' }}>{product.stock || 1}</span>
                </div>
                <div className="stat-item" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="stat-label">{language === 'vi' ? 'Mua:' : 'Sold:'}</span>
                  <span className="stat-value">{(product as any).sales || 0}</span>
                </div>
              </div>
            ) : (
              <div
                style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', cursor: 'default' }}
                onMouseEnter={() => setCraftHovered(true)}
                onMouseLeave={() => setCraftHovered(false)}
              >
                {isMobile ? (
                  <div style={{ 
                    width: '100%', height: '24px', background: 'rgba(255,255,255,0.1)', 
                    borderRadius: '12px', overflow: 'hidden', position: 'relative'
                  }}>
                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, bottom: 0,
                      width: craftHovered ? '75%' : '0%',
                      background: '#f59e0b',
                      transition: 'width 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: '12px',
                      boxShadow: craftHovered ? '0 0 12px rgba(245,158,11,0.6)' : 'none'
                    }}></div>
                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex', justifyContent: 'center', alignItems: 'center', 
                      padding: '0 0.5rem', fontSize: '0.7rem',
                      color: craftHovered ? '#fff' : 'rgba(255,255,255,0.7)',
                      fontWeight: 600,
                      transition: 'color 0.3s ease',
                      zIndex: 1,
                      textShadow: craftHovered ? '0 1px 2px rgba(0,0,0,0.8)' : 'none'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Clock size={12} color={craftHovered ? '#fcd34d' : 'currentColor'} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      marginBottom: '0.5rem', fontSize: '0.7rem',
                      color: craftHovered ? '#f59e0b' : 'rgba(255,255,255,0.35)',
                      fontWeight: 600,
                      transition: 'color 0.3s ease'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        {language === 'vi' ? 'ĐẶT CHẾ TÁC' : 'PRE-ORDER'}
                      </span>
                      <span style={{ 
                        color: craftHovered ? '#f59e0b' : 'rgba(255,255,255,0.35)',
                        fontWeight: 700,
                        transition: 'color 0.3s ease',
                        minWidth: '60px', textAlign: 'right'
                      }}>
                        {craftHovered
                          ? `${displayDay} ${language === 'vi' ? 'ngày' : 'days'}`
                          : product.estimatedPrintTime.replace('days', language === 'vi' ? 'ngày' : 'days')
                        }
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', height: '18px', background: 'rgba(255,255,255,0.1)', 
                      borderRadius: '9px', overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: craftHovered ? '75%' : '0%',
                        height: '100%',
                        background: '#f59e0b',
                        borderRadius: '9px',
                        transition: 'width 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: craftHovered ? '0 0 12px rgba(245,158,11,0.6)' : 'none'
                      }}></div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Mobile Add to Cart Button */}
            <button 
              className="mobile-add-cart-btn"
              style={{ alignItems: 'center', justifyContent: 'center', gap: '0.35rem', overflow: 'hidden' }}
              onClick={(e) => {
                e.preventDefault();
                const defaultSize = product.availableSizes?.[0] || 'Size 400';
                addToCart(product, defaultSize, 'PLA', 1, e);
                showToast(language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!');
              }}
            >
              <ShoppingCart size={16} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flexShrink: 1 }}>
                {language === 'vi' ? 'THÊM VÀO GIỎ' : 'ADD TO CART'}
              </span>
            </button>
          </div>
          </div>
        )}
      </div>

      {/* Cool Image Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
            onClick={() => setShowGallery(false)}
          >
            <div style={{ position: 'relative', width: '100%', height: isMobile ? '80vh' : '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>

              
              {/* Prev / Next blurred images for mobile */}
              {isMobile && product.images?.length > 1 && (
                <>
                  <motion.img 
                    src={product.images[(galleryIndex - 1 + product.images?.length) % product.images?.length]}
                    style={{ position: 'absolute', left: '-60%', width: '70%', height: '70%', objectFit: 'contain', filter: 'blur(5px)', opacity: 0.3, zIndex: 1, pointerEvents: 'none' }}
                  />
                  <motion.img 
                    src={product.images[(galleryIndex + 1) % product.images?.length]}
                    style={{ position: 'absolute', right: '-60%', width: '70%', height: '70%', objectFit: 'contain', filter: 'blur(5px)', opacity: 0.3, zIndex: 1, pointerEvents: 'none' }}
                  />
                </>
              )}

              <AnimatePresence mode="popLayout">
                <motion.img
                  key={galleryIndex}
                  src={product.images[galleryIndex]}
                  drag={isMobile ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;
                    if (swipe < -50 || offset.x < -50) handleNextImage(e as any);
                    else if (swipe > 50 || offset.x > 50) handlePrevImage(e as any);
                  }}
                  initial={{ opacity: 0, scale: 0.8, x: isMobile ? slideDirection * 100 : 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: isMobile ? 0.8 : 1.2, x: isMobile ? -slideDirection * 100 : 0, filter: 'blur(10px)' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  style={{ maxHeight: '100%', maxWidth: '90%', objectFit: 'contain', filter: 'drop-shadow(0 20px 30px rgba(74,222,128,0.2))', cursor: isMobile ? 'grab' : 'default', zIndex: 10 }}
                  whileTap={isMobile ? { cursor: 'grabbing' } : undefined}
                />
              </AnimatePresence>

              <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 20, alignItems: 'stretch' }}>
                {/* Prev/Next only if multiple images */}
                {!isMobile && product.images?.length > 1 && (
                  <>
                    <button onClick={handlePrevImage} style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px', padding: '0 12px', cursor: 'pointer', backdropFilter: 'blur(5px)', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                      onMouseOver={(e: any) => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                      onMouseOut={(e: any) => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    ><ChevronLeft size={20} /></button>
                    <button onClick={handleNextImage} style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px', padding: '0 12px', cursor: 'pointer', backdropFilter: 'blur(5px)', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                      onMouseOver={(e: any) => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                      onMouseOut={(e: any) => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    ><ChevronRight size={20} /></button>
                  </>
                )}
                <Link to={`/product/${product.id}`} onClick={() => setShowGallery(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: 'var(--color-accent)', color: '#000', borderRadius: '4px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                  <ShoppingCart size={16} />Mua ngay
                </Link>
                <button onClick={() => setShowGallery(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(e: any) => (e.currentTarget.style.background = 'rgba(239,68,68,0.8)')}
                  onMouseOut={(e: any) => (e.currentTarget.style.background = 'rgba(0,0,0,0.7)')}
                ><X size={20} /></button>
              </div>

              {/* Mobile indicators (Dots) */}
              {isMobile && product.images?.length > 1 && (
                <div style={{ position: 'absolute', bottom: '5rem', display: 'flex', gap: '8px', zIndex: 20 }}>
                  {product.images.map((_: any, idx: number) => (
                    <div key={idx} style={{ 
                      width: idx === galleryIndex ? '20px' : '8px', 
                      height: '8px', 
                      borderRadius: '4px', 
                      background: idx === galleryIndex ? 'var(--color-accent)' : 'rgba(255,255,255,0.3)', 
                      transition: 'all 0.3s' 
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Thumbnails */}
            {!isMobile && product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', maxWidth: '90%', overflowX: 'auto', padding: '10px', scrollbarWidth: 'none' }} onClick={(e) => e.stopPropagation()}>
                {product.images.map((img: string, idx: number) => (
                  <motion.div
                    key={idx}
                    onClick={() => {
                      setSlideDirection(idx > galleryIndex ? 1 : -1);
                      setGalleryIndex(idx);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer',
                      border: galleryIndex === idx ? '2px solid var(--color-accent)' : '2px solid transparent',
                      opacity: galleryIndex === idx ? 1 : 0.5,
                      transition: 'opacity 0.3s',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};



