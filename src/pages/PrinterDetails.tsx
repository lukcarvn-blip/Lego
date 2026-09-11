import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Star, Heart, Zap, Shield, Cpu } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PrinterDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, formatPrice, language, t } = useStore();
  
  const product = products.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product || product.category !== '3d-printer') {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>{language === 'vi' ? 'Không tìm thấy máy in' : 'Printer not found'}</h2>
        <button className="btn btn-outline" onClick={() => navigate('/technology')} style={{ marginTop: '1rem' }}>
          {language === 'vi' ? 'Quay lại trang Công nghệ' : 'Back to Technology'}
        </button>
      </div>
    );
  }

  const priceInfo = formatPrice(product.price, product.discountPercentage);

  const handleAddToCart = (e: React.MouseEvent) => {
    addToCart(product, 'Standard', 'PLA', quantity, e, false);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    addToCart(product, 'Standard', 'PLA', quantity, e, true);
    navigate('/checkout');
  };

  return (
    <div className="product-details-page" style={{ paddingTop: '80px', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div className="container">
        <button 
          onClick={() => navigate('/technology')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          className="hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} />
          {language === 'vi' ? 'Quay lại Công nghệ' : 'Back to Technology'}
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
          
          {/* L - Image Gallery */}
          <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.name[language]}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2rem' }}
              />
            </motion.div>
            
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    style={{ 
                      width: '80px', height: '80px', borderRadius: 'var(--radius-md)', border: `2px solid ${activeImage === idx ? 'var(--color-accent)' : 'var(--glass-border)'}`,
                      overflow: 'hidden', background: 'rgba(255,255,255,0.02)', flexShrink: 0, cursor: 'pointer'
                    }}
                  >
                    <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* R - Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
                  <Cpu size={18} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {language === 'vi' ? 'Thiết bị in 3D' : '3D Printer'}
                  </span>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
                  {product.name[language]}
                </h1>
              </div>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)', color: isLiked ? '#ff4757' : 'var(--color-text)', transition: 'all 0.3s', cursor: 'pointer' }}
              >
                <Heart fill={isLiked ? '#ff4757' : 'none'} size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                <Star fill="currentColor" size={16} />
                <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{product.rating}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>({product.reviews} {language === 'vi' ? 'đánh giá' : 'reviews'})</span>
              </div>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {priceInfo.current}
              {priceInfo.isOnSale && (
                <span style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', textDecoration: 'line-through', fontWeight: 500 }}>
                  {priceInfo.original}
                </span>
              )}
            </div>

            <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={20} color="var(--color-accent)" />
                {language === 'vi' ? 'Thông số kỹ thuật' : 'Specifications'}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                {product.description[language]}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{language === 'vi' ? 'Độ tin cậy' : 'Reliability'}</div>
                  <div style={{ fontWeight: 600 }}>100% {language === 'vi' ? 'Chính hãng' : 'Authentic'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{language === 'vi' ? 'Tốc độ' : 'Speed'}</div>
                  <div style={{ fontWeight: 600 }}>{product.estimatedPrintTime}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <button 
                onClick={handleAddToCart}
                className="btn btn-outline"
                style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <ShoppingBag size={20} />
                {t('add_to_cart')}
              </button>
              <button 
                onClick={handleBuyNow}
                className="btn btn-primary"
                style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <Zap size={20} />
                {language === 'vi' ? 'Mua ngay' : 'Buy Now'}
              </button>
            </div>

            {/* Guarantees */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <Shield size={24} color="var(--color-accent)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{language === 'vi' ? 'Bảo hành 12 tháng' : '12 Month Warranty'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <Star size={24} color="var(--color-accent)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{language === 'vi' ? 'Hỗ trợ kỹ thuật 24/7' : '24/7 Tech Support'}</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};
