import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      zIndex: 9999,
      alignItems: 'flex-end',
      pointerEvents: 'none' // allow clicking through the container
    }}>
      {/* AI Chatbox UI */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '0.5rem',
              pointerEvents: 'auto'
            }}
            className="chatbox-pc-only"
          >
            {/* Zalo Button */}
            <a href="https://zalo.me/0123456789" target="_blank" rel="noreferrer" title="Chat Zalo" style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#0068FF',
              color: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: '12px',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(0,104,255,0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Zalo
            </a>

            {/* WhatsApp Button */}
            <a href="https://wa.me/0123456789" target="_blank" rel="noreferrer" title="Chat WhatsApp" style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#25D366',
              color: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(37,211,102,0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              WA
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', pointerEvents: 'auto' }}>
        {/* Chat Toggle Button (PC only) */}
        <button
          className="chatbox-pc-only"
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--color-accent)',
            color: '#000',
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(74,222,128,0.4)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <MessageSquare size={24} />
        </button>

        {/* Back to top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              className="chatbox-pc-only"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={scrollToTop}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'var(--glass-bg)',
                color: 'var(--color-text)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                transition: 'background 0.2s, border-color 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            >
              <ArrowUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .chatbox-pc-only {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
