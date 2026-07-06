import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';

const faces = [
  // 0: Smile
  <g key="smile">
    <circle cx="9" cy="11" r="1.5" fill="#000"/>
    <circle cx="15" cy="11" r="1.5" fill="#000"/>
    <path d="M9 15C9 15 10.5 17 12 17C13.5 17 15 15 15 15" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
  </g>,
  // 1: Surprised
  <g key="surprised">
    <circle cx="9" cy="10" r="1.5" fill="#000"/>
    <circle cx="15" cy="10" r="1.5" fill="#000"/>
    <circle cx="12" cy="15" r="2" fill="#000" />
  </g>,
  // 2: Wink
  <g key="wink">
    <path d="M7 11L11 11" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="15" cy="11" r="1.5" fill="#000"/>
    <path d="M9 15C9 15 10.5 17 12 17C13.5 17 15 15 15 15" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
  </g>,
  // 3: Cool
  <g key="cool">
    <path d="M7 10H17V12C17 13.1 16.1 14 15 14H14C12.9 14 12 13.1 12 12V11V12C12 13.1 11.1 14 10 14H9C7.9 14 7 13.1 7 12V10Z" fill="#000"/>
    <path d="M10 16H14" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
  </g>,
  // 4: Mustache
  <g key="mustache">
    <circle cx="9" cy="11" r="1.5" fill="#000"/>
    <circle cx="15" cy="11" r="1.5" fill="#000"/>
    <path d="M8 15C8 15 9.5 14 12 14C14.5 14 16 15 16 15C16 15 14.5 16.5 12 16.5C9.5 16.5 8 15 8 15Z" fill="#000"/>
  </g>
];

const AnimatedLegoHead = ({ size = 80 }: { size?: number }) => {
  const [faceIdx, setFaceIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFaceIdx(Math.floor(Math.random() * faces.length));
    }, 600); // Faster interval for loading effect
    return () => clearInterval(interval);
  }, []);

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 10px 20px rgba(253,224,71,0.3))' }}>
      <path d="M7 4V2H17V4M5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4Z" fill="#FDE047"/>
      <AnimatePresence mode="wait">
        <motion.g
          key={faceIdx}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {faces[faceIdx]}
        </motion.g>
      </AnimatePresence>
    </svg>
  );
};

export const LoadingScreen = ({ isVisible }: { isVisible: boolean }) => {
  const { language } = useStore();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--color-bg)',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem'
          }}
        >
          <motion.div
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <AnimatedLegoHead size={100} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.5rem', 
              fontWeight: 800, 
              letterSpacing: '4px',
              background: 'linear-gradient(90deg, #fff, var(--color-accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase'
            }}>
              {language === 'vi' ? 'CHỜ XÍU' : 'LOADING'}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)'
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
