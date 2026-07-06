import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Mail, LogIn, ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

type CheckoutStep = 'cart' | 'auth_choice' | 'verify_email' | 'details';

export const Cart = () => {
  const { cart, removeFromCart, createOrder, t, language, showToast, formatPrice, user, clearCart, settings } = useStore();
  const navigate = useNavigate();
  
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [customerName, setCustomerName] = useState('');
  const [paymentType, setPaymentType] = useState<'FULL' | 'DEPOSIT'>('FULL');
  
  const [fastEmail, setFastEmail] = useState('');
  const [otp, setOtp] = useState('');

  const parseSizePercentage = (sizeStr: string | null) => {
    if (!sizeStr) return 1;
    const num = parseInt(sizeStr.replace('Size ', ''), 10);
    return isNaN(num) ? 1 : num / 400;
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * parseSizePercentage(item.size) * (item.material === 'PETG' ? 1.2 : 1) * (item.isFastCrafting ? 1.1 : 1)) * item.quantity, 0);
  const shippingFee = paymentType === 'FULL' ? 0 : 5; // Free shipping if paid in full, else $5
  const total = subtotal + shippingFee;
  const amountToPayNow = paymentType === 'FULL' ? total : total / 2;
  
  const bankName = settings.bankName || 'vietcombank';
  const bankAccount = settings.bankAccount || '9931028868';
  const bankOwner = settings.bankOwner || 'LE NHAT HOANG';
  const amountVND = Math.round(amountToPayNow * 25400);
  const addInfo = encodeURIComponent(`Thanh toan don hang Legato ${user?.email || fastEmail}`.substring(0, 50));
  const qrUrl = `https://img.vietqr.io/image/${bankName}-${bankAccount}-compact.png?amount=${amountVND}&addInfo=${addInfo}&accountName=${encodeURIComponent(bankOwner)}`;

  const handleProceedClick = () => {
    if (user) {
      setCheckoutStep('details');
    } else {
      setCheckoutStep('auth_choice');
    }
  };

  const handleFastCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fastEmail) return;
    setCheckoutStep('verify_email');
    showToast(language === 'vi' ? `Mã xác minh đã gửi tới ${fastEmail}` : `Verification code sent to ${fastEmail}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return showToast(language === 'vi' ? 'Mã xác minh không hợp lệ' : 'Invalid code');
    setCheckoutStep('details');
    showToast(language === 'vi' ? 'Xác minh thành công!' : 'Verified successfully!');
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return showToast(language === 'vi' ? 'Vui lòng nhập tên của bạn để đặt hàng.' : 'Please enter your name for the order.');
    createOrder(customerName);
    
    const emailToSend = user ? user.email : fastEmail;
    
    showToast(language === 'vi' ? `Thanh toán thành công! Hóa đơn đã được gửi vào: ${emailToSend}` : `Success! Bill sent to: ${emailToSend}`);
    clearCart();
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1.5rem', lineHeight: 1.2 }}>{t('empty_cart')}</h1>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block' }}>{t('continue_shopping')}</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>
        {checkoutStep === 'cart' ? t('cart_title') : t('checkout')}
      </h1>

      <div className="cart-container-grid">
        
        {/* Left Side: Items or Checkout Flow */}
        <div>
          {checkoutStep === 'cart' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.material}`} className="glass-panel cart-item-card">
                  <div className="cart-item-img-wrapper">
                    <img src={item.product.images[0]} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt={item.product.name[language]} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="cart-item-header">
                      <h3 className="cart-item-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {item.product.name[language]}
                        {item.isFastCrafting && (
                          <motion.span 
                            animate={{ 
                              boxShadow: ['0 0 0px rgba(251, 191, 36, 0)', '0 0 15px rgba(251, 191, 36, 0.8)', '0 0 0px rgba(251, 191, 36, 0)']
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{ 
                              fontSize: '0.75rem', 
                              padding: '0.25rem 0.6rem', 
                              background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #ef4444)', 
                              color: '#fff', 
                              borderRadius: '1rem',
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              border: '1px solid rgba(255,255,255,0.3)',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                          >
                            <Zap size={14} fill="#fff" /> {language === 'vi' ? 'Ưu tiên' : 'Priority'}
                          </motion.span>
                        )}
                      </h3>
                      <span className="cart-item-price">{formatPrice((item.product.price * parseSizePercentage(item.size) * (item.material === 'PETG' ? 1.2 : 1) * (item.isFastCrafting ? 1.1 : 1)) * item.quantity).current}</span>
                    </div>
                    <p className="cart-item-meta">Size: {item.size} &bull; {language === 'vi' ? 'Chất liệu' : 'Material'}: {item.material}{item.isFastCrafting ? ` \u2022 ${language === 'vi' ? 'Tăng tốc chế tác (+10%)' : 'Fast Crafting (+10%)'}` : ''}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{language === 'vi' ? 'SL' : 'Qty'}: {item.quantity}</span>
                      <button 
                        onClick={() => {
                          removeFromCart(item.product.id, item.size, item.material, item.isFastCrafting);
                          showToast(language === 'vi' ? 'Đã xóa sản phẩm khỏi giỏ hàng' : 'Removed item from cart');
                        }}
                        style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} /> {language === 'vi' ? 'Xóa' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {checkoutStep === 'auth_choice' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                {language === 'vi' ? 'Chọn cách thanh toán' : 'Choose Checkout Method'}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <LogIn size={40} style={{ marginBottom: '1rem', color: 'var(--color-accent)' }} />
                  <h3 style={{ marginBottom: '1rem' }}>{language === 'vi' ? 'Thành viên' : 'Member'}</h3>
                  <button onClick={() => navigate('/auth')} className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                    {language === 'vi' ? 'Đăng nhập' : 'Log In'}
                  </button>
                </div>
                
                <form onSubmit={handleFastCheckoutSubmit} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Mail size={40} style={{ marginBottom: '1rem', color: 'var(--color-accent)' }} />
                  <h3 style={{ marginBottom: '1rem' }}>{language === 'vi' ? 'Thanh toán nhanh' : 'Fast Checkout'}</h3>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={fastEmail}
                    onChange={(e) => setFastEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', marginBottom: '1rem' }}
                  />
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid var(--color-accent)', color: 'var(--color-accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ChevronLeft size={20} onClick={(e) => { e.preventDefault(); setCheckoutStep('cart'); }} style={{ cursor: 'pointer' }} />
                    <span style={{ fontWeight: 'bold' }}>{language === 'vi' ? 'Tiếp tục (Bước 1/3)' : 'Continue (Step 1/3)'}</span>
                    <ChevronRight size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {checkoutStep === 'verify_email' && (
            <motion.form onSubmit={handleVerifyOtp} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--color-accent)' }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{language === 'vi' ? 'Xác minh Email' : 'Verify Email'}</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                {language === 'vi' ? `Chúng tôi đã gửi mã xác minh gồm 6 chữ số đến email: ` : `We sent a 6-digit verification code to: `}
                <strong style={{ color: 'white' }}>{fastEmail}</strong>
              </p>
              
              <input 
                type="text" 
                placeholder="123456" 
                required 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ width: '100%', maxWidth: '200px', textAlign: 'center', padding: '1rem', fontSize: '1.5rem', letterSpacing: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', marginBottom: '2rem' }}
              />
              
              <div style={{ width: '100%', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 'var(--radius-sm)' }}>
                  <ChevronLeft size={24} onClick={(e) => { e.preventDefault(); setCheckoutStep('auth_choice'); }} style={{ cursor: 'pointer', padding: '2px' }} />
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{language === 'vi' ? 'Xác minh (Bước 2/3)' : 'Verify (Step 2/3)'}</span>
                  <ChevronRight size={24} />
                </button>
              </div>
            </motion.form>
          )}

          {checkoutStep === 'details' && (
            <motion.form 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleCheckout} 
              className="glass-panel" 
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('checkout_form')}</h2>
              
              {!user && (
                <div style={{ padding: '1rem', background: 'rgba(74, 222, 128, 0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(74, 222, 128, 0.3)', marginBottom: '1rem' }}>
                  Email: <strong>{fastEmail}</strong>
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('full_name')}</label>
                <input 
                  type="text" 
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('address')}</label>
                <input 
                  type="text" 
                  required
                  style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                  placeholder="123 Main St"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" placeholder={language === 'vi' ? 'Thành phố' : 'City'} required style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                <input type="text" placeholder={language === 'vi' ? 'Mã bưu điện' : 'Zip Code'} required style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              </div>
              
              <h2 style={{ fontSize: '1.5rem', marginTop: '1rem', marginBottom: '1rem' }}>{language === 'vi' ? 'Phương thức thanh toán' : 'Payment Method'}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="paymentType" 
                    checked={paymentType === 'FULL'} 
                    onChange={() => setPaymentType('FULL')} 
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                  <span>
                    {language === 'vi' ? 'Thanh toán toàn bộ (Miễn phí vận chuyển)' : 'Pay in Full (Free Shipping)'}
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="paymentType" 
                    checked={paymentType === 'DEPOSIT'} 
                    onChange={() => setPaymentType('DEPOSIT')} 
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                  <span>
                    {language === 'vi' ? 'Đặt cọc 50%' : 'Pay 50% Deposit'}
                  </span>
                </label>
              </div>

              <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-accent)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>{language === 'vi' ? 'Quét mã QR để thanh toán' : 'Scan QR to Pay'}</h3>
                <div style={{ background: 'white', padding: '10px', borderRadius: '12px', display: 'inline-block', marginBottom: '1rem' }}>
                  <img src={qrUrl} alt="QR Code" style={{ width: '250px', height: '250px', objectFit: 'contain' }} />
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  {language === 'vi' 
                    ? `Sau khi chuyển khoản thành công, vui lòng nhấn nút "Đặt Hàng" bên dưới.` 
                    : `After successful transfer, please click the "Place Order" button below.`}
                </p>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.125rem', marginTop: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <ChevronLeft size={24} onClick={(e) => { e.preventDefault(); setCheckoutStep('verify_email'); }} style={{ cursor: 'pointer', padding: '2px' }} />
                <span style={{ fontWeight: 'bold' }}>{language === 'vi' ? `${t('place_order')} (Bước 3/3)` : `${t('place_order')} (Step 3/3)`}</span>
                <CheckCircle size={24} style={{ opacity: 0.8 }} />
              </button>
            </motion.form>
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div>
          <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t('subtotal')}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
              <span>{t('subtotal')}</span>
              <span>{formatPrice(subtotal).current}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
              <span>{language === 'vi' ? 'Phí vận chuyển' : 'Shipping'}</span>
              {checkoutStep !== 'cart' ? (
                <span>{shippingFee === 0 ? (language === 'vi' ? 'Miễn phí' : 'Free') : formatPrice(shippingFee).current}</span>
              ) : (
                <span>{language === 'vi' ? 'Tính khi thanh toán' : 'Calculated at checkout'}</span>
              )}
            </div>
            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1.5rem 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem' }}>
              <span>{language === 'vi' ? 'Tổng cộng' : 'Total'}</span>
              <span>{formatPrice(total).current}</span>
            </div>

            {checkoutStep !== 'cart' && (
              <>
                <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1.5rem 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                  <span>{language === 'vi' ? 'Số tiền cần thanh toán' : 'To Pay Now'}</span>
                  <span>{formatPrice(amountToPayNow).current}</span>
                </div>
              </>
            )}
            
            {checkoutStep === 'cart' ? (
              <button 
                onClick={handleProceedClick}
                className="btn-primary" 
                style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none' }}
              >
                {language === 'vi' ? 'Tiến hành thanh toán' : 'Proceed to Checkout'} <ArrowRight size={20} />
              </button>
            ) : (
              <button 
                onClick={() => setCheckoutStep('cart')}
                style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', borderRadius: 'var(--radius-sm)', marginTop: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                <ArrowLeft size={16} /> {language === 'vi' ? 'Quay lại Giỏ hàng' : 'Back to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
