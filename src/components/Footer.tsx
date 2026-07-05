import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Footer = () => {
  const { t, settings } = useStore();
  
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      style={{ 
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--glass-border)',
        padding: '2rem 0 1rem 0',
        marginTop: 'auto'
      }}
    >
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '1rem' }}>
            {settings.logoImage ? (
              <img src={settings.logoImage} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt="Logo" style={{ height: '80px', objectFit: 'contain' }} />
            ) : (
              settings.logoText
            )}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {t('footer_desc')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', fontWeight: 600 }}>
            <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }}>IG</a>
            <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }}>TW</a>
            <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }}>FB</a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>{t('nav_shop')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0, margin: 0 }}>
              <li><Link to="/category/superheroes" style={{ color: 'var(--color-text-muted)' }}>{t('cat_superheroes')}</Link></li>
              <li><Link to="/category/sci-fi" style={{ color: 'var(--color-text-muted)' }}>{t('cat_scifi')}</Link></li>
              <li><Link to="/category/classic" style={{ color: 'var(--color-text-muted)' }}>{t('cat_classic')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0, margin: 0 }}>
              <li><Link to="/faq" style={{ color: 'var(--color-text-muted)' }}>FAQ</Link></li>
              <li><Link to="/shipping-policy" style={{ color: 'var(--color-text-muted)' }}>Shipping Policy</Link></li>
              <li><Link to="/returns" style={{ color: 'var(--color-text-muted)' }}>Returns</Link></li>
              <li><Link to="/contact-us" style={{ color: 'var(--color-text-muted)' }}>Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Newsletter</h4>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Subscribe for updates on new drops.</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--glass-border)',
                background: 'rgba(0,0,0,0.2)',
                color: '#fff',
                outline: 'none'
              }}
            />
            <button className="btn-primary" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="container" style={{
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '1rem',
        paddingBottom: '1.5rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '0.875rem'
      }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} LEGATO. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};
