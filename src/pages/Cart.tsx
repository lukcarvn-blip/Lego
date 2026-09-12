import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2, ArrowRight, Mail, LogIn, ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Zap, ShieldCheck, PieChart, QrCode, Wallet, CreditCard, MapPin, Navigation, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

type CheckoutStep = 'cart' | 'auth_choice' | 'verify_email' | 'details';

const PROVINCES = [
  "Hà Nội", "Hồ Chí Minh", "Hải Phòng", "Đà Nẵng", "Cần Thơ", 
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", 
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", 
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", 
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", 
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình", 
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", 
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", 
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Quảng Bình", 
  "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", 
  "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", 
  "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", 
  "Vĩnh Phúc", "Yên Bái", "Phú Yên"
].sort((a, b) => a.localeCompare(b, 'vi'));


export const Cart = () => {
  const { cart, removeFromCart, createOrder, updateOrder, t, language, showToast, formatPrice, user, clearCart, settings, loginWithGoogle } = useStore();
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const checkoutStep = (searchParams.get('step') as CheckoutStep) || 'cart';
  const setCheckoutStep = (step: CheckoutStep) => {
    setSearchParams(prev => {
      prev.set('step', step);
      return prev;
    });
  };
  const fastEmail = searchParams.get('email') || '';
  const setFastEmail = (email: string) => {
    setSearchParams(prev => {
      if (email) {
        prev.set('email', email);
      } else {
        prev.delete('email');
      }
      return prev;
    });
  };

  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [paymentType, setPaymentType] = useState<'FULL' | 'DEPOSIT'>('FULL');
  const [paymentChannel, setPaymentChannel] = useState<'BANK' | 'ZALOPAY' | 'CARD'>('BANK');
  
  const [otp, setOtp] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast(language === 'vi' ? 'Trình duyệt không hỗ trợ định vị' : 'Geolocation is not supported');
      return;
    }
    
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=vi`);
          const data = await res.json();
          if (data && data.address) {
            const addrParts = [];
            if (data.address.house_number) addrParts.push(data.address.house_number);
            if (data.address.road) addrParts.push(data.address.road);
            if (data.address.suburb || data.address.quarter || data.address.neighbourhood) addrParts.push(data.address.suburb || data.address.quarter || data.address.neighbourhood);
            if (data.address.city_district || data.address.county) addrParts.push(data.address.city_district || data.address.county);
            
            setAddress(addrParts.join(', '));
            
            const cityName = data.address.city || data.address.state || data.address.province;
            if (cityName) {
              const matchedCity = PROVINCES.find(p => cityName.includes(p) || p.includes(cityName));
              if (matchedCity) setCity(matchedCity);
              else setCity(cityName);
            }
            showToast(language === 'vi' ? 'Đã lấy vị trí thành công' : 'Location retrieved successfully');
          }
        } catch (error) {
          showToast(language === 'vi' ? 'Không thể lấy địa chỉ từ tọa độ' : 'Could not get address from coordinates');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        showToast(language === 'vi' ? 'Lỗi khi lấy vị trí: ' + error.message : 'Error getting location: ' + error.message);
      }
    );
  };


  const parseSizePercentage = (sizeStr: string | null) => {
    if (!sizeStr) return 1;
    const num = parseInt(sizeStr.replace('Size ', ''), 10);
    return isNaN(num) ? 1 : num / 400;
  };

  const getBoxUnitCost = (boxType?: string) => {
    return boxType === 'standard' ? 150000 / 25400 : boxType === 'led' ? 250000 / 25400 : 0;
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * parseSizePercentage(item.size) * (item.material === 'PETG' ? 1.2 : 1) * (item.isFastCrafting ? 1.1 : 1) + getBoxUnitCost(item.micaBox)) * item.quantity, 0);
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

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleFastCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fastEmail) return;
    
    setIsSendingEmail(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('checkout_otp', code);
    
    try {
      await emailjs.send(
        'service_ydp5cwb',
        'template_iwfr6lq',
        {
          to_email: fastEmail,
          otp_code: code
        },
        'fvqJq3OxYOnEP7cso'
      );
      
      setCheckoutStep('verify_email');
      showToast(language === 'vi' ? `Mã xác minh đã gửi tới ${fastEmail}` : `Verification code sent to ${fastEmail}`);
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      const errorMsg = error?.text || error?.message || 'Unknown error';
      showToast(language === 'vi' ? `Lỗi gửi email: ${errorMsg}` : `Error sending email: ${errorMsg}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const savedOtp = localStorage.getItem('checkout_otp');
    if (otp !== savedOtp) {
      return showToast(language === 'vi' ? 'Mã xác minh không chính xác' : 'Incorrect verification code');
    }
    setCheckoutStep('details');
    showToast(language === 'vi' ? 'Xác minh thành công!' : 'Verified successfully!');
  };

  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<string>('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return showToast(language === 'vi' ? 'Vui lòng nhập tên của bạn để đặt hàng.' : 'Please enter your name for the order.');
    
    setIsProcessingCheckout(true);
    setCheckoutStatus(language === 'vi' ? 'Đang khởi tạo đơn hàng...' : 'Creating order...');
    
    const emailToSend = user ? user.email : fastEmail;
    
    const additionalInfo = {
      email: emailToSend,
      address,
      city,
    };
    
    const orderId = await createOrder(customerName, paymentChannel, additionalInfo);
    if (!orderId) {
      setIsProcessingCheckout(false);
      return showToast(language === 'vi' ? 'Lỗi tạo đơn hàng' : 'Error creating order');
    }

    if (paymentChannel === 'BANK' || paymentChannel === 'ZALOPAY' || paymentChannel === 'CARD') {
      setCheckoutStatus(language === 'vi' ? 'Đang chờ bạn quét mã QR và thanh toán...' : 'Waiting for payment confirmation...');
      // Simulate waiting for payment (e.g. 5 seconds)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      setCheckoutStatus(language === 'vi' ? 'Đã nhận được tiền! Đang xuất hóa đơn...' : 'Payment received! Generating bill...');
      await updateOrder(orderId, { status: 'Paid' });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    try {
      const billContent = `Cảm ơn bạn đã đặt hàng!\nMã đơn: ${orderId.substring(0, 8).toUpperCase()}\nTên: ${customerName}\nTổng tiền: ${formatPrice(amountToPayNow).current}`;
      
      // Gửi cho khách
      if (emailToSend) {
        await emailjs.send('service_ydp5cwb', 'template_iwfr6lq', {
          to_email: emailToSend,
          otp_code: billContent
        }, 'fvqJq3OxYOnEP7cso');
      }
      
      // Gửi cho Admin
      await emailjs.send('service_ydp5cwb', 'template_iwfr6lq', {
        to_email: settings.contactEmail || 'legatorvn@gmail.com',
        otp_code: `ĐƠN HÀNG MỚI TỪ ${customerName}\n${billContent}`
      }, 'fvqJq3OxYOnEP7cso');
      
    } catch (error) {
      console.error('Error sending bill emails:', error);
    }
    
    setIsProcessingCheckout(false);
    navigate(`/checkout/success/${orderId}`);
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <h3 className="cart-item-title" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                        {item.product.name[language]}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {item.isFastCrafting && (
                          <motion.span 
                            animate={{ 
                              boxShadow: ['0 0 0px rgba(251, 191, 36, 0)', '0 0 15px rgba(251, 191, 36, 0.8)', '0 0 0px rgba(251, 191, 36, 0)']
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{ 
                              fontSize: '0.75rem', 
                              padding: '0.3rem 0.6rem', 
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
                        <span style={{ 
                          fontSize: '0.9rem', 
                          fontWeight: 800, 
                          color: '#ef4444', 
                          background: 'rgba(239,68,68,0.15)', 
                          padding: '0.3rem 0.75rem', 
                          borderRadius: '1rem', 
                          border: '1px solid rgba(239,68,68,0.3)',
                          display: 'inline-block'
                        }}>
                          {formatPrice((item.product.price * parseSizePercentage(item.size) * (item.material === 'PETG' ? 1.2 : 1) * (item.isFastCrafting ? 1.1 : 1)) * item.quantity).current}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)' }}>📏 Size {item.size}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)' }}>🧵 {item.material}</span>
                      </div>
                      
                      {item.isFastCrafting && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', background: 'rgba(251,191,36,0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(251,191,36,0.2)', width: 'fit-content' }}>
                          <Zap size={12} /> {language === 'vi' ? 'Tăng tốc chế tác (+10%)' : 'Fast Crafting (+10%)'}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>{language === 'vi' ? 'Số lượng' : 'Qty'}: {item.quantity}</span>
                      <button 
                        onClick={() => {
                          removeFromCart(item.product.id, item.size, item.material, item.isFastCrafting);
                          showToast(language === 'vi' ? 'Đã xóa sản phẩm khỏi giỏ hàng' : 'Removed item from cart');
                        }}
                        style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(239,68,68,0.1)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}
                      >
                        <Trash2 size={14} /> {language === 'vi' ? 'Xóa' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {checkoutStep === 'auth_choice' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                {language === 'vi' ? 'Chọn cách thanh toán' : 'Choose Checkout Method'}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <LogIn size={40} style={{ marginBottom: '1rem', color: 'var(--color-accent)' }} />
                  <h3 style={{ marginBottom: '1rem' }}>{language === 'vi' ? 'Thành viên' : 'Member'}</h3>
                  <button onClick={() => navigate('/auth')} className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}>
                    {language === 'vi' ? 'Đăng nhập' : 'Log In'}
                  </button>
                  <button 
                    onClick={async () => {
                      await loginWithGoogle();
                      setCheckoutStep('details');
                    }}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'white', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer' }}
                  >
                    <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '20px', height: '20px' }} />
                    {language === 'vi' ? 'Đăng nhập với Google' : 'Continue with Google'}
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
                  <button type="submit" disabled={isSendingEmail} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'transparent', border: '1px solid var(--color-accent)', color: 'var(--color-accent)', borderRadius: 'var(--radius-sm)', cursor: isSendingEmail ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: isSendingEmail ? 0.7 : 1 }}>
                    {isSendingEmail ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Loader2 size={18} className="spin" />
                        {language === 'vi' ? 'Đang gửi...' : 'Sending...'}
                      </span>
                    ) : (
                      <>
                        <ChevronLeft size={18} style={{ opacity: 0 }} />
                        <span>{language === 'vi' ? 'Tiếp tục (Bước 1/3)' : 'Continue (Step 1/3)'}</span>
                        <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {checkoutStep === 'verify_email' && (
            <motion.form onSubmit={handleVerifyOtp} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--color-accent)' }} />
              <h2 style={{ marginBottom: '1rem' }}>{language === 'vi' ? 'Xác minh Email' : 'Verify Email'}</h2>
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
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden' }}
            >
              <h2 style={{ marginBottom: '1rem' }}>{t('checkout_form')}</h2>
              
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
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>{t('address')}</span>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button 
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isGettingLocation}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)', 
                        fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        opacity: isGettingLocation ? 0.5 : 1
                      }}
                    >
                      <Navigation size={14} className={isGettingLocation ? "spin" : ""} />
                      {isGettingLocation 
                        ? (language === 'vi' ? 'Đang lấy...' : 'Getting...') 
                        : (language === 'vi' ? 'Lấy vị trí hiện tại' : 'Get current location')}
                    </button>

                  {address && (
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + (city ? ', ' + city : ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)', fontSize: '0.85rem', textDecoration: 'none' }}
                    >
                      <MapPin size={14} />
                      {language === 'vi' ? 'Xem trên Bản đồ' : 'View on Map'}
                    </a>
                  )}
                  </div>
                </label>
                <input 
                  type="text" 
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                  placeholder={language === 'vi' ? '123 Đường Chính, Phường A...' : '123 Main St, Ward A...'}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <select 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  required 
                  style={{ 
                    width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', 
                    border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white',
                    appearance: 'none'
                  }}
                >
                  <option value="" disabled>{language === 'vi' ? 'Chọn Tỉnh / Thành phố' : 'Select City / Province'}</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input type="text" placeholder={language === 'vi' ? 'Mã bưu điện (Không bắt buộc)' : 'Zip Code (Optional)'} style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              </div>
              
              <h2 style={{ marginTop: '1rem', marginBottom: '1rem', textTransform: 'uppercase' }}>{language === 'vi' ? 'Hình thức thanh toán' : 'Payment Type'}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', 
                  padding: '1.5rem', cursor: 'pointer',
                  background: paymentType === 'FULL' ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.02)', 
                  border: `2px solid ${paymentType === 'FULL' ? 'var(--color-accent)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '50%', 
                    background: paymentType === 'FULL' ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: paymentType === 'FULL' ? '0 0 20px rgba(74,222,128,0.4)' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    <ShieldCheck size={32} color={paymentType === 'FULL' ? '#000' : 'rgba(255,255,255,0.5)'} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: paymentType === 'FULL' ? 'var(--color-accent)' : 'white' }}>
                      {language === 'vi' ? 'Thanh toán 100%' : 'Pay in Full'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {language === 'vi' ? 'Miễn phí vận chuyển' : 'Free Shipping'}
                    </p>
                  </div>
                  <input type="radio" name="paymentType" checked={paymentType === 'FULL'} onChange={() => setPaymentType('FULL')} style={{ display: 'none' }} />
                </label>

                <label style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', 
                  padding: '1.5rem', cursor: 'pointer',
                  background: paymentType === 'DEPOSIT' ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.02)', 
                  border: `2px solid ${paymentType === 'DEPOSIT' ? '#fbbf24' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '50%', 
                    background: paymentType === 'DEPOSIT' ? 'linear-gradient(135deg, #fcd34d, #f59e0b)' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: paymentType === 'DEPOSIT' ? '0 0 20px rgba(251,191,36,0.4)' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    <PieChart size={32} color={paymentType === 'DEPOSIT' ? '#000' : 'rgba(255,255,255,0.5)'} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: paymentType === 'DEPOSIT' ? '#fbbf24' : 'white' }}>
                      {language === 'vi' ? 'Đặt cọc 50%' : '50% Deposit'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {language === 'vi' ? 'Thanh toán phần còn lại khi nhận hàng' : 'Pay the rest on delivery'}
                    </p>
                  </div>
                  <input type="radio" name="paymentType" checked={paymentType === 'DEPOSIT'} onChange={() => setPaymentType('DEPOSIT')} style={{ display: 'none' }} />
                </label>
              </div>

              <h2 style={{ marginTop: '1.5rem', marginBottom: '1rem', textTransform: 'uppercase' }}>{language === 'vi' ? 'Cổng thanh toán' : 'Payment Channel'}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', 
                  padding: '1.25rem 0.5rem', cursor: 'pointer',
                  background: paymentChannel === 'BANK' ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.02)', 
                  border: `2px solid ${paymentChannel === 'BANK' ? 'var(--color-accent)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', 
                    background: paymentChannel === 'BANK' ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: paymentChannel === 'BANK' ? '0 0 15px rgba(74,222,128,0.4)' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    <QrCode size={24} color={paymentChannel === 'BANK' ? '#000' : 'rgba(255,255,255,0.5)'} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: paymentChannel === 'BANK' ? 'var(--color-accent)' : 'white' }}>
                      {language === 'vi' ? 'VietQR' : 'Bank QR'}
                    </h4>
                  </div>
                  <input type="radio" name="paymentChannel" checked={paymentChannel === 'BANK'} onChange={() => setPaymentChannel('BANK')} style={{ display: 'none' }} />
                </label>

                <label style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', 
                  padding: '1.25rem 0.5rem', cursor: 'pointer',
                  background: paymentChannel === 'ZALOPAY' ? 'rgba(0,104,255,0.1)' : 'rgba(255,255,255,0.02)', 
                  border: `2px solid ${paymentChannel === 'ZALOPAY' ? '#0068ff' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', 
                    background: paymentChannel === 'ZALOPAY' ? 'linear-gradient(135deg, #0088ff, #0068ff)' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: paymentChannel === 'ZALOPAY' ? '0 0 15px rgba(0,104,255,0.4)' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    <Wallet size={24} color={paymentChannel === 'ZALOPAY' ? '#fff' : 'rgba(255,255,255,0.5)'} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: paymentChannel === 'ZALOPAY' ? '#0068ff' : 'white' }}>
                      ZaloPay
                    </h4>
                  </div>
                  <input type="radio" name="paymentChannel" checked={paymentChannel === 'ZALOPAY'} onChange={() => setPaymentChannel('ZALOPAY')} style={{ display: 'none' }} />
                </label>

                <label style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', 
                  padding: '1.25rem 0.5rem', cursor: 'pointer',
                  background: paymentChannel === 'CARD' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.02)', 
                  border: `2px solid ${paymentChannel === 'CARD' ? '#ef4444' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', 
                    background: paymentChannel === 'CARD' ? 'linear-gradient(135deg, #f87171, #ef4444)' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: paymentChannel === 'CARD' ? '0 0 15px rgba(239,68,68,0.4)' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    <CreditCard size={24} color={paymentChannel === 'CARD' ? '#fff' : 'rgba(255,255,255,0.5)'} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: paymentChannel === 'CARD' ? '#ef4444' : 'white' }}>
                      {language === 'vi' ? 'Thẻ Tín dụng' : 'Credit Card'}
                    </h4>
                  </div>
                  <input type="radio" name="paymentChannel" checked={paymentChannel === 'CARD'} onChange={() => setPaymentChannel('CARD')} style={{ display: 'none' }} />
                </label>
              </div>

              {paymentChannel === 'BANK' && (
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-accent)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>{language === 'vi' ? 'Quét mã QR để thanh toán' : 'Scan QR to Pay'}</h3>
                  <div style={{ background: 'white', padding: '10px', borderRadius: '12px', display: 'inline-block', marginBottom: '1rem', maxWidth: '100%' }}>
                    <img src={qrUrl} alt="QR Code" style={{ width: '100%', maxWidth: '250px', height: 'auto', aspectRatio: '1/1', objectFit: 'contain' }} />
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    {language === 'vi' ? 'Sau khi chuyển khoản thành công, vui lòng nhấn nút "Đặt Hàng" bên dưới.' : 'After successful transfer, please click the "Place Order" button below.'}
                  </p>
                </div>
              )}

              {paymentChannel === 'ZALOPAY' && (
                <div style={{ padding: '1.5rem', background: 'rgba(0,104,255,0.05)', border: '1px solid #0068ff', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <h3 style={{ marginBottom: '1rem', color: '#0068ff' }}>{language === 'vi' ? 'Thanh toán qua ZaloPay' : 'Pay via ZaloPay'}</h3>
                  <div style={{ background: 'white', padding: '10px', borderRadius: '12px', display: 'inline-block', marginBottom: '1rem', maxWidth: '100%' }}>
                    <img src="/images/zalopay-qr-mock.png" onError={(e) => { e.currentTarget.src = qrUrl; }} alt="ZaloPay QR" style={{ width: '100%', maxWidth: '250px', height: 'auto', aspectRatio: '1/1', objectFit: 'contain' }} />
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    {language === 'vi' ? 'Quét mã bằng ứng dụng ZaloPay để thanh toán.' : 'Scan with ZaloPay app to pay.'}
                  </p>
                </div>
              )}

              {paymentChannel === 'CARD' && (
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                  <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{language === 'vi' ? 'Thông tin thẻ' : 'Card Details'}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="text" id="cc-number" name="ccnumber" autoComplete="cc-number" inputMode="numeric" pattern="[0-9\s]{13,19}" placeholder={language === 'vi' ? 'Số thẻ' : 'Card Number'} style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <input type="text" id="cc-exp" name="ccexp" autoComplete="cc-exp" placeholder="MM/YY" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                      <input type="text" id="cc-csc" name="cvc" autoComplete="cc-csc" placeholder="CVC" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                    </div>
                    <input type="text" id="cc-name" name="ccname" autoComplete="cc-name" placeholder={language === 'vi' ? 'Tên chủ thẻ' : 'Cardholder Name'} style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                  </div>
                </div>
              )}

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
          <div className="glass-panel" style={{ padding: '1.75rem', position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            
            {/* Header */}
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📋 {language === 'vi' ? 'Tạm Tính' : 'Order Summary'}
            </h2>

            {/* Summary rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              
              {/* Subtotal row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Tạm tính' : 'Subtotal'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{cart.length} {language === 'vi' ? 'sản phẩm' : 'items'}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{formatPrice(subtotal).current}</span>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.25rem 0' }} />

              {/* Shipping row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Phí vận chuyển' : 'Shipping'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Giao hàng tiêu chuẩn' : 'Standard delivery'}</span>
                </div>
                {checkoutStep !== 'cart' ? (
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: shippingFee === 0 ? 'var(--color-accent)' : 'var(--color-text)' }}>
                    {shippingFee === 0 ? (language === 'vi' ? 'Miễn phí' : 'Free') : formatPrice(shippingFee).current}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'right', maxWidth: '120px' }}>{language === 'vi' ? 'Tính khi thanh toán' : 'At checkout'}</span>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.25rem 0' }} />

              {/* Total row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{language === 'vi' ? 'Tổng cộng' : 'Total'}</span>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#ef4444' }}>{formatPrice(total).current}</span>
              </div>

              {/* To Pay Now (checkout step only) */}
              {checkoutStep !== 'cart' && (
                <>
                  <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.25rem 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-accent)' }}>⚡ {language === 'vi' ? 'Thanh toán ngay' : 'Pay Now'}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Bao gồm phí vận chuyển' : 'Incl. shipping'}</span>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#ef4444' }}>{formatPrice(amountToPayNow).current}</span>
                  </div>
                </>
              )}
            </div>

            {/* CTA Buttons */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {checkoutStep === 'cart' ? (
                <button 
                  onClick={handleProceedClick}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none', fontSize: '1rem', fontWeight: 700 }}
                >
                  {language === 'vi' ? 'Tiến hành thanh toán' : 'Proceed to Checkout'} <ArrowRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => setCheckoutStep('cart')}
                  className="btn-primary"
                  style={{ width: '100%', padding: '1rem', cursor: 'pointer', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700 }}
                >
                  <ArrowLeft size={20} /> {language === 'vi' ? 'Quay lại Giỏ hàng' : 'Back to Cart'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
