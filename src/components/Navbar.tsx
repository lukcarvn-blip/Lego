import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Home, ArrowUp, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { cart, language, setLanguage, t, settings, user, logout } = useStore();
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const location = useLocation();
  const navigate = useNavigate();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <>
      <motion.header 
        className="nav-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '1rem 0',
        }}
      >
        <div className="container nav-container">
          <nav className="glass-panel top-navbar" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 2rem',
            borderRadius: '0 999px 999px 0',
            clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px, 10px 20px, 10px 10px, 20px 10px)',
          }}>
            
            {/* Left Nav / Action */}
            <div style={{ flex: 1, display: 'flex', gap: '2rem', justifyContent: 'flex-start', alignItems: 'center' }}>
              <div className="desktop-nav" style={{ display: 'flex', gap: '2rem' }}>
                <Link to="/products/superheroes" style={{ fontWeight: 600 }}>{t('cat_superheroes')}</Link>
                <Link to="/products/sci-fi" style={{ fontWeight: 600 }}>{t('cat_scifi')}</Link>
              </div>
              <button 
                className="mobile-action" 
                onClick={() => {
                  if (showBackToTop) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    if (location.pathname !== '/') {
                      navigate(-1);
                    }
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text)', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                {showBackToTop ? <ArrowUp size={24} /> : (location.pathname !== '/' ? <ArrowLeft size={24} /> : <div style={{width: 24, height: 24}}></div>)}
              </button>
            </div>

            {/* Center Logo */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {settings.logoImage ? (
                  <img className="nav-logo-img" src={settings.logoImage} alt="Logo" style={{ height: '64px', objectFit: 'contain' }} />
                ) : (
                  <>
                    <div style={{
                      width: '40px', height: '40px', backgroundColor: 'var(--color-accent)',
                      borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', color: '#000', border: '2px solid #fff'
                    }}>
                      {settings.logoText.slice(0, 2)}
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '2px', marginLeft: '0.5rem' }}>
                      {settings.logoText}
                    </span>
                  </>
                )}
              </Link>
            </div>

            {/* Right Nav & Actions */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.5rem' }}>
              <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', marginRight: '1rem' }}>
                <Link to="/products" style={{ fontWeight: 600 }}>{language === 'vi' ? 'Cửa hàng' : 'Shop'}</Link>
              </div>

              {/* Actions */}
              <button onClick={toggleLanguage} style={{ 
                display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '1rem', color: 'var(--color-accent)' 
              }}>
                {language.toUpperCase()}
              </button>
              
              <Link id="nav-cart-icon" to="/cart" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <ShoppingBag size={22} />
                {cartItemCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: 'var(--color-accent)', color: '#000',
                    fontSize: '0.75rem', fontWeight: 'bold',
                    width: '18px', height: '18px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="desktop-action" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} style={{ display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer' }}>
                  <Search size={22} />
                </button>
                {isSearchOpen && (
                  <form onSubmit={handleSearchSubmit} style={{ position: 'absolute', right: '100%', marginRight: '0.5rem', display: 'flex', alignItems: 'center', background: 'rgba(15, 25, 15, 0.98)', padding: '0.25rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(74, 222, 128, 0.3)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', zIndex: 50 }}>
                    <input 
                      type="text" 
                      placeholder={language === 'vi' ? 'Tìm kiếm sản phẩm...' : 'Search products...'}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.35rem 1rem', outline: 'none', width: '280px', fontSize: '0.95rem' }}
                      autoFocus
                    />
                  </form>
                )}
              </div>
              {user ? (
                <Link to="/profile" className="desktop-action" style={{ display: 'flex', alignItems: 'center' }} title={language === 'vi' ? 'Hồ sơ' : 'Profile'}>
                  {user.photoURL ? (
                    <img src={user.photoURL} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt={user.displayName || 'User'} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-accent)' }} />
                  ) : (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </Link>
              ) : (
                <Link to="/auth" className="desktop-action" style={{ display: 'flex', alignItems: 'center' }}>
                  <User size={22} />
                </Link>
              )}
            </div>

          </nav>
        </div>
      </motion.header>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav glass-panel">
        <Link to="/" className="bottom-nav-item"><Home size={22} /><span>Home</span></Link>
        <Link to="/products" className="bottom-nav-item"><Search size={22} /><span>Shop</span></Link>
        <Link id="nav-cart-icon-mobile" to="/cart" className="bottom-nav-item" style={{ position: 'relative' }}>
          <ShoppingBag size={22} />
          {cartItemCount > 0 && (
            <span style={{
              position: 'absolute', top: '-5px', right: '15px',
              background: 'var(--color-accent)', color: '#000',
              fontSize: '0.65rem', fontWeight: 'bold',
              width: '16px', height: '16px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {cartItemCount}
            </span>
          )}
          <span>Cart</span>
        </Link>
        {user ? (
          <Link to="/profile" className="bottom-nav-item">
            {user.photoURL ? (
              <img src={user.photoURL} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt="User" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <User size={22} color="var(--color-accent)" />
            )}
            <span>{language === 'vi' ? 'Hồ sơ' : 'Profile'}</span>
          </Link>
        ) : (
          <Link to="/auth" className="bottom-nav-item"><User size={22} /><span>Auth</span></Link>
        )}
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-bottom-nav {
            display: none !important;
          }
          .desktop-action {
            display: flex !important;
          }
          .mobile-action {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .nav-header {
            padding: 0 !important;
          }
          .nav-container {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .top-navbar {
            border-radius: 0 !important;
            border-top: none !important;
            border-left: none !important;
            border-right: none !important;
            padding: 0.5rem 1.5rem !important;
          }
          .nav-logo-img {
            height: 80px !important;
          }

          .desktop-nav {
            display: none !important;
          }
          .desktop-action {
            display: none !important;
          }
          .mobile-bottom-nav {
            display: flex !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 50;
            justify-content: space-around;
            align-items: center;
            padding: 0.75rem 0;
            border-radius: 24px 24px 0 0 !important;
            border-bottom: none !important;
            border-left: none !important;
            border-right: none !important;
            backdrop-filter: blur(20px);
            background: rgba(10, 20, 10, 0.85);
          }
          .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            color: var(--color-text-muted);
            font-size: 0.75rem;
            flex: 1;
          }
          .bottom-nav-item:hover {
            color: var(--color-accent);
          }
          /* Adjust main container padding for mobile so bottom content is not hidden by the bottom nav */
          body {
            padding-bottom: 80px;
          }
        }
      `}</style>
    </>
  );
};
