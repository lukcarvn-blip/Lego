import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, Lock, User, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export const Auth = () => {
  const { language, loginWithGoogle, user, showToast } = useStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect to home
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // Implement Email Login
        if (authMethod === 'email') {
          await signInWithEmailAndPassword(auth, email, password);
          showToast(language === 'vi' ? 'Đăng nhập thành công!' : 'Logged in successfully!');
        } else {
          // Phone login mock since Firebase phone requires Recaptcha
          setError(language === 'vi' ? 'Đăng nhập bằng SĐT đang bảo trì' : 'Phone login temporarily unavailable');
        }
      } else {
        // Implement Register
        if (authMethod === 'email') {
          await createUserWithEmailAndPassword(auth, email, password);
          showToast(language === 'vi' ? 'Đăng ký thành công!' : 'Registered successfully!');
        } else {
          setError(language === 'vi' ? 'Đăng ký bằng SĐT đang bảo trì' : 'Phone register temporarily unavailable');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ padding: '3rem', width: '100%', maxWidth: '450px', borderRadius: 'var(--radius-lg)' }}
      >
        <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
          {isLogin ? (language === 'vi' ? 'Đăng Nhập' : 'Log In') : (language === 'vi' ? 'Đăng Ký' : 'Register')}
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          {language === 'vi' ? 'Sử dụng tài khoản của bạn để tiếp tục' : 'Use your account to continue'}
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            type="button"
            onClick={() => setAuthMethod('email')}
            style={{ 
              flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', 
              background: authMethod === 'email' ? 'var(--color-accent)' : 'rgba(0,0,0,0.2)',
              color: authMethod === 'email' ? '#000' : 'white',
              fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              border: 'none', cursor: 'pointer'
            }}
          >
            <Mail size={18} /> Email
          </button>
          <button 
            type="button"
            onClick={() => setAuthMethod('phone')}
            style={{ 
              flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', 
              background: authMethod === 'phone' ? 'var(--color-accent)' : 'rgba(0,0,0,0.2)',
              color: authMethod === 'phone' ? '#000' : 'white',
              fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              border: 'none', cursor: 'pointer'
            }}
          >
            <Phone size={18} /> {language === 'vi' ? 'SĐT' : 'Phone'}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="text" 
                placeholder={language === 'vi' ? 'Họ và tên' : 'Full Name'}
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
          )}

          {authMethod === 'email' ? (
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <Phone size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="tel" 
                placeholder={language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="password" 
              placeholder={language === 'vi' ? 'Mật khẩu' : 'Password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none' }}>
            <LogIn size={20} />
            {isLogin ? (language === 'vi' ? 'Đăng Nhập' : 'Log In') : (language === 'vi' ? 'Tạo Tài Khoản' : 'Create Account')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          <span style={{ padding: '0 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{language === 'vi' ? 'HOẶC' : 'OR'}</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
        </div>

        <button 
          onClick={loginWithGoogle}
          style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'white', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '20px', height: '20px' }} />
          {language === 'vi' ? 'Đăng nhập với Google' : 'Continue with Google'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-text-muted)' }}>
          {isLogin ? (language === 'vi' ? 'Chưa có tài khoản? ' : 'Don\'t have an account? ') : (language === 'vi' ? 'Đã có tài khoản? ' : 'Already have an account? ')}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? (language === 'vi' ? 'Đăng ký ngay' : 'Register now') : (language === 'vi' ? 'Đăng nhập' : 'Log in')}
          </span>
        </p>

      </motion.div>
    </div>
  );
};
