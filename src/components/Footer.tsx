import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { Music, MapPin, Phone, Mail } from 'lucide-react';
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
      <div className="container footer-top-grid">
        <div>
          <div className="footer-logo-social-wrapper">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '2px', margin: 0 }}>
              {settings.logoImage ? (
                <img src={settings.logoImage} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt="Logo" className="footer-logo" />
              ) : (
                settings.logoText
              )}
            </h3>
            <div className="footer-social-icons">
              {settings.socialInstagram && (
                <a href={settings.socialInstagram} target="_blank" rel="noreferrer" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '47px', height: '47px', color: '#000', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <svg width="47" height="47" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
                    <path d="M7 4V2H17V4M5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4Z" fill="#FDE047"/>
                  </svg>
                  <div style={{ position: 'relative', zIndex: 1, paddingTop: '2px', display: 'flex' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                </a>
              )}
              {settings.socialTiktok && (
                <a href={settings.socialTiktok} target="_blank" rel="noreferrer" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '47px', height: '47px', color: '#000', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <svg width="47" height="47" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
                    <path d="M7 4V2H17V4M5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4Z" fill="#FDE047"/>
                  </svg>
                  <div style={{ position: 'relative', zIndex: 1, paddingTop: '2px', display: 'flex' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#000"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 3.18-4.51v-3.5a6.33 6.33 0 0 0-5.39 10.69 6.33 6.33 0 0 0 10.86-4.42V8.69a8.18 8.18 0 0 0 4.77 1.53V6.79a4.83 4.83 0 0 1-1-.1z"></path></svg>
                  </div>
                </a>
              )}
              {settings.socialFacebook && (
                <a href={settings.socialFacebook} target="_blank" rel="noreferrer" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '47px', height: '47px', color: '#000', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <svg width="47" height="47" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
                    <path d="M7 4V2H17V4M5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4Z" fill="#FDE047"/>
                  </svg>
                  <div style={{ position: 'relative', zIndex: 1, paddingTop: '2px', display: 'flex' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </div>
                </a>
              )}
              {settings.socialYoutube && (
                <a href={settings.socialYoutube} target="_blank" rel="noreferrer" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '47px', height: '47px', color: '#000', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <svg width="47" height="47" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
                    <path d="M7 4V2H17V4M5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4Z" fill="#FDE047"/>
                  </svg>
                  <div style={{ position: 'relative', zIndex: 1, paddingTop: '2px', display: 'flex' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </div>
                </a>
              )}
            </div>
          </div>
          <div style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', textTransform: 'uppercase' }}>
            {settings.contactAddress && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={20} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} /> <span style={{ lineHeight: 1.5, whiteSpace: 'pre-line' }}>{settings.contactAddress}</span></div>}
            {settings.contactHotline && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={20} style={{ color: 'var(--color-accent)' }} /> <span>{settings.contactHotline}</span></div>}
            {settings.contactEmail && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={20} style={{ color: 'var(--color-accent)' }} /> <span>{settings.contactEmail}</span></div>}
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
