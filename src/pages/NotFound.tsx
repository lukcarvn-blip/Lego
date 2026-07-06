import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'radial-gradient(circle at center, rgba(34,197,94,0.05) 0%, transparent 70%)'
    }}>
      {/* CSS Lego Sad Face */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        style={{
          position: 'relative',
          width: '120px',
          height: '140px',
          marginBottom: '2rem'
        }}
      >
        {/* Lego Stud */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '30px',
          width: '60px',
          height: '20px',
          background: '#eab308', // Yellow
          borderRadius: '4px 4px 0 0',
          border: '4px solid #ca8a04',
          borderBottom: 'none'
        }} />
        {/* Lego Head */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: 0,
          width: '120px',
          height: '124px',
          background: '#facc15',
          borderRadius: '16px',
          border: '4px solid #ca8a04',
          boxShadow: 'inset -8px -8px 0px rgba(202,138,4,0.4), 0 10px 25px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {/* Eyes */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '-10px' }}>
            <motion.div 
              animate={{ height: ['16px', '2px', '16px'] }}
              transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1] }}
              style={{ width: '16px', height: '16px', background: '#1f2937', borderRadius: '50%' }} 
            />
            <motion.div 
              animate={{ height: ['16px', '2px', '16px'] }}
              transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1] }}
              style={{ width: '16px', height: '16px', background: '#1f2937', borderRadius: '50%' }} 
            />
          </div>
          {/* Sad Mouth */}
          <motion.div 
            initial={{ rotateX: 0 }}
            animate={{ rotateX: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              width: '40px',
              height: '20px',
              border: '4px solid #1f2937',
              borderBottom: 'none',
              borderRadius: '40px 40px 0 0',
              marginTop: '25px'
            }}
          />
        </div>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ 
          fontSize: 'clamp(4rem, 10vw, 8rem)', 
          fontWeight: 900, 
          lineHeight: 1,
          background: 'linear-gradient(to right, var(--color-accent), #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem',
          textShadow: '0 10px 30px rgba(34,197,94,0.2)'
        }}
      >
        404
      </motion.h1>
      
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}
      >
        Oops! Mảnh ghép này không tồn tại
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ color: 'var(--color-text-muted)', maxWidth: '400px', marginBottom: '2rem' }}
      >
        Có vẻ như trang bạn đang tìm kiếm đã bị tháo rời hoặc chuyển đi nơi khác. Hãy quay lại trang chủ để tiếp tục lắp ráp nhé!
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <button onClick={() => navigate(-1)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem' }}>
          <ArrowLeft size={18} /> Quay lại
        </button>
        <Link to="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem' }}>
          <Home size={18} /> Về Trang chủ
        </Link>
      </motion.div>
    </div>
  );
};
