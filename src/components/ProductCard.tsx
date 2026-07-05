import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Clock, Zap, Sparkles, ShoppingCart, Shield, Rocket, Crown, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: any;
  idx?: number;
  listMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, idx = 0, listMode = false }) => {
  const { language, formatPrice, addToCart, showToast } = useStore();
  const [craftHovered, setCraftHovered] = useState(false);
  const [displayDay, setDisplayDay] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
        {listMode ? (
          /* ── LIST ROW LAYOUT ── */
          <div className="glass-panel" style={{
            display: 'flex', flexDirection: 'row', overflow: 'hidden',
            height: '160px', position: 'relative', gap: 0,
            border: '1px solid var(--glass-border)', transition: 'border-color 0.3s'
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,222,128,0.35)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'}
          >
            {/* Thumbnail */}
            <div style={{
              width: '160px', flexShrink: 0,
              background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, rgba(0,0,0,0.5) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative'
            }}>
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

              <img src={product.images?.[0] || product.image} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt={product.name[language as keyof typeof product.name]}
                style={{ 
                  width: '100%', height: '100%', objectFit: 'contain', 
                  filter: 'drop-shadow(0 10px 16px rgba(0,0,0,0.5))', 
                  transform: 'scale(1.25)', marginTop: '20px' 
                }} 
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{product.category?.toUpperCase()}</p>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.name[language as keyof typeof product.name]}
                </h3>
                <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.75rem', color: formatPrice(product.price, product.discountPercentage).isOnSale ? '#ef4444' : 'var(--color-accent)' }}>
                    {formatPrice(product.price, product.discountPercentage).current}
                  </span>
                  {formatPrice(product.price, product.discountPercentage).isOnSale && (
                    <span style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--color-text-muted)', textDecoration: 'line-through', fontSize: '0.6rem' }}>
                      {formatPrice(product.price, product.discountPercentage).original}
                    </span>
                  )}
                </div>
              </div>
              {/* Craft time mini bar - full width */}
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
            </div>
          </div>
        ) : (
          /* ── GRID CARD LAYOUT (original) ── */
          <div className="glass-panel product-card" style={{
            display: 'flex', flexDirection: 'column',
            height: '100%', position: 'relative', overflow: 'hidden'
          }}>
          <motion.div 
            initial="rest"
            whileHover="hover"
            whileTap="hover"
            whileInView={isMobile ? "hover" : undefined}
            viewport={{ amount: 0.5, margin: "-10% 0px -10% 0px" }}
            animate={isMobile ? undefined : "rest"}
            style={{ 
            width: '100%', 
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


            {/* Bling Bling Effects (Scattered) */}
            {[
              { size: 28, top: '20%', left: '15%', delay: 0 },
              { size: 16, top: '15%', left: '75%', delay: 0.1 },
              { size: 24, top: '65%', left: '10%', delay: 0.2 },
              { size: 14, top: '80%', left: '80%', delay: 0.15 },
              { size: 22, top: '25%', left: '85%', delay: 0.05 },
              { size: 12, top: '75%', left: '20%', delay: 0.25 },
              { size: 18, top: '40%', left: '10%', delay: 0.12 },
              { size: 18, top: '55%', left: '85%', delay: 0.08 },
            ].map((bling, i) => (
              <motion.div
                key={i}
                variants={{
                  rest: { opacity: 0, scale: 0, y: 0, rotate: 0 },
                  hover: { 
                    opacity: [0, 1, 0.7, 1], 
                    scale: [0, 1.2, 1, 1.1, 1], 
                    y: [0, -15, 0],
                    rotate: 360
                  }
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity, repeatType: "reverse", delay: bling.delay },
                  opacity: { duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: bling.delay },
                  y: { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: bling.delay },
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" }
                }}
                style={{ position: 'absolute', top: bling.top, left: bling.left, color: '#facc15', zIndex: 10, pointerEvents: 'none' }}
              >
                <Sparkles size={bling.size} fill="#facc15" />
              </motion.div>
            ))}

            <motion.img 
              variants={{
                rest: { y: '50%', scale: 2.2 },
                hover: { y: 0, scale: 1 }
              }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              src={product.images[0]} alt={product.name[language as keyof typeof product.name]} 
              style={{ 
                width: '80%', 
                height: '80%', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.8))',
                transformOrigin: 'center center'
              }}
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
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: formatPrice(product.price, product.discountPercentage).isOnSale ? '#ef4444' : 'var(--color-accent)' }}>
                  {formatPrice(product.price, product.discountPercentage).current}
                </span>
                {formatPrice(product.price, product.discountPercentage).isOnSale && (
                  <span style={{ fontFamily: "'Outfit', sans-serif", color: 'rgba(255,255,255,0.6)', textDecoration: 'line-through', fontSize: '0.65rem' }}>
                    {formatPrice(product.price, product.discountPercentage).original}
                  </span>
                )}
              </div>
              <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.2)' }} />
              <ShoppingCart size={16} color="#fff" />
            </motion.div>
            

            {/* Hover State Slide-Up Panel */}
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
          </motion.div>
          
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1rem' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {product.category.toLowerCase() === 'superheroes' && <Shield size={12} />}
              {product.category.toLowerCase() === 'sci-fi' && <Rocket size={12} />}
              {product.category.toLowerCase() === 'classic' && <Crown size={12} />}
              {['superheroes', 'sci-fi', 'classic'].indexOf(product.category.toLowerCase()) === -1 && <Tag size={12} />}
              {product.category}
            </p>
            <h3 className="product-title" style={{ 
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600, 
              marginBottom: '0.5rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '1.4',
              height: '2.8em'
            }}>
              {product.name[language as keyof typeof product.name]}
            </h3>
            
            <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: formatPrice(product.price, product.discountPercentage).isOnSale ? '#ef4444' : 'var(--color-accent)' }}>
                {formatPrice(product.price, product.discountPercentage).current}
              </span>
              {formatPrice(product.price, product.discountPercentage).isOnSale && (
                <span style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--color-text-muted)', textDecoration: 'line-through', fontSize: '0.65rem' }}>
                  {formatPrice(product.price, product.discountPercentage).original}
                </span>
              )}
            </div>

            <div style={{ flex: 1 }}></div>

            <div
              style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', cursor: 'default' }}
              onMouseEnter={() => setCraftHovered(true)}
              onMouseLeave={() => setCraftHovered(false)}
            >
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                marginBottom: '0.5rem', fontSize: '0.7rem',
                color: craftHovered ? '#f59e0b' : 'rgba(255,255,255,0.35)',
                fontWeight: 600,
                transition: 'color 0.3s ease'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} />
                  {language === 'vi' ? 'THỜI GIAN CHẾ TÁC' : 'CRAFT TIME'}
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
            </div>
          </div>
          </div>
        )}
      </Link>
    </motion.div>
  );
};
