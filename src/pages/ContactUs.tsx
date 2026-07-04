import React from 'react';
import { useStore } from '../context/StoreContext';

export const ContactUs = () => {
  const { language } = useStore();

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem', fontWeight: 800 }}>
          {language === 'vi' ? 'Liên Hệ' : 'Contact Us'}
        </h1>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                {language === 'vi' ? 'Họ và tên' : 'Full Name'}
              </label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                {language === 'vi' ? 'Email' : 'Email'}
              </label>
              <input 
                type="email" 
                style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                {language === 'vi' ? 'Lời nhắn' : 'Message'}
              </label>
              <textarea 
                rows={5}
                style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }}
              ></textarea>
            </div>
            <button type="button" className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>
              {language === 'vi' ? 'Gửi Lời Nhắn' : 'Send Message'}
            </button>
          </form>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>
              {language === 'vi' ? 'Thông tin khác' : 'Other Info'}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Email: support@logestore.com</p>
            <p style={{ color: 'var(--color-text-muted)' }}>Hotline: +84 123 456 789</p>
          </div>
        </div>
      </div>
    </div>
  );
};
