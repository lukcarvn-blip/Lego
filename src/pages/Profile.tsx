import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShoppingBag, ShoppingCart, Bell, Clock, ChevronRight, Package, Truck, CheckCircle, CreditCard, XCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, orders, savedCarts, notifications, language, formatPrice, logout } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'saved_carts'>('dashboard');

  // If no user is logged in, redirect to auth or show error
  if (!user) {
    return (
      <div className="container" style={{ paddingTop: '120px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2>{language === 'vi' ? 'Vui lòng đăng nhập' : 'Please log in'}</h2>
        <button className="btn-primary" onClick={() => navigate('/auth')} style={{ marginTop: '1rem', padding: '0.75rem 2rem' }}>
          {language === 'vi' ? 'Đăng nhập' : 'Log In'}
        </button>
      </div>
    );
  }

  // Filter orders for the current user
  const userOrders = orders.filter(o => o.userId === user.uid || o.customerName === user.email);

  const renderDashboard = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {language === 'vi' ? 'Tổng quan hồ sơ' : 'Profile Overview'}
      </h2>
      
      {/* Notifications Section */}
      {notifications.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} />
            {language === 'vi' ? 'Thông báo mới' : 'New Notifications'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map(notif => (
              <div key={notif.id} style={{ 
                padding: '1.5rem', 
                borderRadius: 'var(--radius-md)', 
                background: notif.type === 'warning' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(0, 0, 0, 0.2)',
                border: `1px solid ${notif.type === 'warning' ? 'rgba(255, 152, 0, 0.3)' : 'var(--glass-border)'}`,
                display: 'flex', alignItems: 'flex-start', gap: '1rem'
              }}>
                <div style={{ color: notif.type === 'warning' ? '#ff9800' : 'var(--color-accent)', marginTop: '0.25rem' }}>
                  {notif.type === 'warning' ? <Clock size={24} /> : <CheckCircle size={24} />}
                </div>
                <div>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: notif.type === 'warning' ? '#ff9800' : 'var(--color-text)' }}>{notif.message}</p>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{new Date(notif.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => setActiveTab('orders')}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={24} color="var(--color-accent)" />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{userOrders.length}</div>
            <div style={{ color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Đơn hàng' : 'Orders'}</div>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => setActiveTab('saved_carts')}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={24} color="#ff9800" />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{savedCarts.length}</div>
            <div style={{ color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Giỏ hàng đang lưu' : 'Saved Carts'}</div>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <button onClick={logout} className="btn-primary" style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
          <LogOut size={18} />
          {language === 'vi' ? 'Đăng xuất' : 'Log Out'}
        </button>
      </div>
    </motion.div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#4caf50';
      case 'Shipping': return '#2196f3';
      case 'Crafting': return '#ff9800';
      default: return 'var(--color-text-muted)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle size={16} />;
      case 'Shipping': return <Truck size={16} />;
      case 'Crafting': return <Package size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const renderOrders = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{language === 'vi' ? 'Lịch sử mua hàng' : 'Order History'}</h2>
      {userOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
          <Package size={48} style={{ margin: '0 auto 1rem', color: 'var(--color-text-muted)' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Bạn chưa có đơn hàng nào.' : 'You have no orders yet.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {userOrders.map(order => (
            <div key={order.id} className="glass-panel" style={{ padding: '1.5rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{language === 'vi' ? 'Mã đơn' : 'Order ID'}: #{order.id.substring(0, 8).toUpperCase()}</div>
                  <div style={{ fontWeight: 500 }}>{new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', background: 'rgba(0,0,0,0.3)', color: getStatusColor(order.status), fontSize: '0.85rem', fontWeight: 'bold' }}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                      <img src={item.product.images[0]} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt={item.product.name.en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{item.product.name[language as keyof typeof item.product.name]}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{item.size} • {item.material} {item.isFastCrafting && '• 🚀'}</div>
                    </div>
                    <div style={{ fontWeight: 'bold' }}>x{item.quantity}</div>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  <CreditCard size={16} />
                  {order.paymentMethod || 'COD'}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                  {formatPrice(order.total).current}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderSavedCarts = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{language === 'vi' ? 'Giỏ hàng đang lưu' : 'Saved Carts'}</h2>
      {savedCarts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
          <ShoppingCart size={48} style={{ margin: '0 auto 1rem', color: 'var(--color-text-muted)' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Không có giỏ hàng nào đang được lưu trữ.' : 'You have no saved carts.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {savedCarts.map(cart => (
            <div key={cart.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(255, 152, 0, 0.3)', background: 'rgba(255, 152, 0, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#ff9800', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Clock size={16} />
                    {language === 'vi' ? 'Đang lưu tạm thời' : 'Temporarily Saved'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {language === 'vi' ? 'Cập nhật lần cuối' : 'Last updated'}: {new Date(cart.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {cart.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                      <img src={item.product.images[0]} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt={item.product.name.en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.product.name[language as keyof typeof item.product.name]}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.size} • {item.material} (x{item.quantity})</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="btn-primary" onClick={() => navigate('/cart')} style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#ff9800', borderColor: '#ff9800' }}>
                {language === 'vi' ? 'Mở lại & Thanh toán ngay' : 'Restore & Checkout Now'}
                <ChevronRight size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="container profile-page" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Profile Sidebar / Header */}
        <div className="glass-panel profile-sidebar" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', marginBottom: '1.5rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-accent)' }}>
            {user.photoURL ? (
              <img src={user.photoURL} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt={user.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={48} color="var(--color-accent)" />
            )}
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{user.displayName || user.email}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>{user.email}</p>
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('dashboard')}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'dashboard' ? 'white' : 'var(--color-text-muted)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <User size={20} />
              {language === 'vi' ? 'Tổng quan' : 'Overview'}
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'orders' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'orders' ? 'white' : 'var(--color-text-muted)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <Package size={20} />
              {language === 'vi' ? 'Lịch sử mua hàng' : 'Order History'}
            </button>
            <button 
              onClick={() => setActiveTab('saved_carts')}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'saved_carts' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'saved_carts' ? 'white' : 'var(--color-text-muted)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <ShoppingCart size={20} />
              {language === 'vi' ? 'Giỏ hàng đang lưu' : 'Saved Carts'}
              {savedCarts.length > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ff9800', color: '#000', padding: '0.15rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {savedCarts.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div style={{ minHeight: '500px' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderDashboard()}</motion.div>}
            {activeTab === 'orders' && <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderOrders()}</motion.div>}
            {activeTab === 'saved_carts' && <motion.div key="saved_carts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderSavedCarts()}</motion.div>}
          </AnimatePresence>
        </div>

      </div>

      <style>{`
        @media (min-width: 768px) {
          .profile-page > div {
            grid-template-columns: 300px 1fr !important;
            align-items: flex-start;
          }
          .profile-sidebar {
            position: sticky;
            top: 100px;
          }
        }
      `}</style>
    </div>
  );
};
