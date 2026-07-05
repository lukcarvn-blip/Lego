import React, { useState } from 'react';
import { useStore, type OrderStatus } from '../context/StoreContext';
import { Package, Clock, Truck, CheckCircle, Edit2, Plus, Image, Settings } from 'lucide-react';
import type { Product } from '../data/mockProducts';

export const Admin = () => {
  const { 
    orders, updateOrderStatus, 
    products, updateProduct, addProduct, deleteProduct,
    blogPosts, addBlogPost, deleteBlogPost,
    settings, updateSettings,
    t, language, showToast,
    appUsers, currentUserRole, updateUserRole, deleteUser
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'blog' | 'members' | 'settings'>('orders');

  // --- Orders ---
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'var(--color-text-muted)';
      case 'Crafting': return '#eab308';
      case 'Shipping': return '#3b82f6';
      case 'Delivered': return '#22c55e';
    }
  };

  // --- Blog ---
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    addBlogPost({
      title: newTitle,
      content: newContent,
      excerpt: newContent.slice(0, 50) + '...',
      date: new Date().toISOString().split('T')[0],
      image: 'https://images.unsplash.com/photo-1580477667995-15120f1fb93e?q=80&w=600'
    });
    setNewTitle('');
    setNewContent('');
    showToast(language === 'vi' ? 'Đã thêm bài viết!' : 'Blog post added!');
  };

  // --- Products ---
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});

  const handleOpenAddProduct = () => {
    setEditingProduct({
      name: { vi: '', en: '' },
      description: { vi: '', en: '' },
      price: 0,
      stock: 0,
      category: 'Classic',
      images: [''],
      estimatedPrintTime: '2-4 days',
      rating: 5,
      reviews: 0,
      likes: 0,
      availableSizes: ['Size 300']
    });
    setIsEditingProduct(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct.id) {
      // Edit existing
      updateProduct(editingProduct as Product);
    } else {
      // Add new
      addProduct(editingProduct as Omit<Product, 'id'>);
    }
    setIsEditingProduct(false);
    setEditingProduct({});
  };

  // --- Settings ---
  const [tempSettings, setTempSettings] = useState(settings);
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(tempSettings);
    showToast(language === 'vi' ? 'Đã lưu cài đặt!' : 'Settings saved!');
  };

  if (currentUserRole !== 'admin') {
    return (
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent)' }}>Access Denied</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>You do not have permission to view this page. Please log in as an administrator.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('orders')}
          className="btn-primary" 
          style={{ background: activeTab === 'orders' ? 'var(--color-accent)' : 'var(--glass-bg)', color: activeTab === 'orders' ? '#000' : '#fff' }}
        >
          {t('tab_orders')}
        </button>
        <button 
          onClick={() => { setActiveTab('products'); setIsEditingProduct(false); }}
          className="btn-primary"
          style={{ background: activeTab === 'products' ? 'var(--color-accent)' : 'var(--glass-bg)', color: activeTab === 'products' ? '#000' : '#fff' }}
        >
          {t('tab_products')}
        </button>
        <button 
          onClick={() => setActiveTab('blog')}
          className="btn-primary"
          style={{ background: activeTab === 'blog' ? 'var(--color-accent)' : 'var(--glass-bg)', color: activeTab === 'blog' ? '#000' : '#fff' }}
        >
          {t('tab_blog')}
        </button>
        <button 
          onClick={() => setActiveTab('members')}
          className="btn-primary"
          style={{ background: activeTab === 'members' ? 'var(--color-accent)' : 'var(--glass-bg)', color: activeTab === 'members' ? '#000' : '#fff' }}
        >
          {language === 'vi' ? 'Thành viên' : 'Members'}
        </button>
        <button 
          onClick={() => { setActiveTab('settings'); setTempSettings(settings); }}
          className="btn-primary"
          style={{ background: activeTab === 'settings' ? 'var(--color-accent)' : 'var(--glass-bg)', color: activeTab === 'settings' ? '#000' : '#fff' }}
        >
          <Settings size={20} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
          Settings
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
        
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t('recent_orders')}</h2>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>{t('no_orders')}</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '1rem' }}>{t('order_id')}</th>
                    <th style={{ padding: '1rem' }}>{t('customer')}</th>
                    <th style={{ padding: '1rem' }}>{t('date')}</th>
                    <th style={{ padding: '1rem' }}>{t('total')}</th>
                    <th style={{ padding: '1rem' }}>{t('status')}</th>
                    <th style={{ padding: '1rem' }}>{t('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{order.id}</td>
                      <td style={{ padding: '1rem' }}>{order.customerName}</td>
                      <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{new Date(order.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', color: 'var(--color-accent)' }}>${order.total.toFixed(2)}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: getStatusColor(order.status) }}>
                          <span>{order.status}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          style={{
                            padding: '0.5rem', borderRadius: 'var(--radius-sm)',
                            background: 'rgba(0,0,0,0.5)', color: '#fff',
                            border: '1px solid var(--glass-border)', outline: 'none'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Crafting">Crafting</option>
                          <option value="Shipping">Shipping</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && !isEditingProduct && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>{t('inventory_management')}</h2>
              <button className="btn-primary" onClick={handleOpenAddProduct} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} /> Add Product
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '1rem' }}>{t('image')}</th>
                  <th style={{ padding: '1rem' }}>{t('name')}</th>
                  <th style={{ padding: '1rem' }}>{t('price')}</th>
                  <th style={{ padding: '1rem' }}>{t('stock')}</th>
                  <th style={{ padding: '1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                        <img src={product.images[0]} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{product.name.vi}</td>
                    <td style={{ padding: '1rem' }}>${product.price}</td>
                    <td style={{ padding: '1rem' }}>{product.stock}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button onClick={() => handleOpenEditProduct(product)} style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Edit2 size={16} /> Edit
                        </button>
                        <button onClick={() => { if(window.confirm('Delete product?')) deleteProduct(product.id) }} style={{ color: 'red', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ADD/EDIT PRODUCT FORM */}
        {activeTab === 'products' && isEditingProduct && (
          <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem' }}>{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
              <button type="button" onClick={() => setIsEditingProduct(false)} style={{ color: 'var(--color-text-muted)' }}>Cancel</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Name (VI)</label>
                <input 
                  type="text" required
                  value={editingProduct.name?.vi || ''}
                  onChange={e => setEditingProduct({...editingProduct, name: { ...editingProduct.name!, vi: e.target.value }})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Name (EN)</label>
                <input 
                  type="text" required
                  value={editingProduct.name?.en || ''}
                  onChange={e => setEditingProduct({...editingProduct, name: { ...editingProduct.name!, en: e.target.value }})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Description (VI)</label>
                <textarea 
                  required rows={3}
                  value={editingProduct.description?.vi || ''}
                  onChange={e => setEditingProduct({...editingProduct, description: { ...editingProduct.description!, vi: e.target.value }})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Description (EN)</label>
                <textarea 
                  required rows={3}
                  value={editingProduct.description?.en || ''}
                  onChange={e => setEditingProduct({...editingProduct, description: { ...editingProduct.description!, en: e.target.value }})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Category</label>
                <input 
                  type="text" required
                  value={editingProduct.category || ''}
                  onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Price ($)</label>
                <input 
                  type="number" required step="0.01"
                  value={editingProduct.price || 0}
                  onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Stock</label>
                <input 
                  type="number" required
                  value={editingProduct.stock || 0}
                  onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Est. Print Time</label>
                <input 
                  type="text" required placeholder="e.g. 2-4 days"
                  value={editingProduct.estimatedPrintTime || ''}
                  onChange={e => setEditingProduct({...editingProduct, estimatedPrintTime: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Sale Type</label>
                <select 
                  value={editingProduct.saleType || ''}
                  onChange={e => setEditingProduct({...editingProduct, saleType: e.target.value ? e.target.value as any : null})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} 
                >
                  <option value="">None</option>
                  <option value="SALE">Normal Sale</option>
                  <option value="FLASH_SALE">Flash Sale</option>
                </select>
              </div>
              {editingProduct.saleType && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Discount Percentage (%)</label>
                  <input 
                    type="number" required min="1" max="100"
                    value={editingProduct.discountPercentage || 0}
                    onChange={e => setEditingProduct({...editingProduct, discountPercentage: parseInt(e.target.value)})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} 
                  />
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Image URL</label>
              <input 
                type="text" required placeholder="/images/my-product.png"
                value={editingProduct.images?.[0] || ''}
                onChange={e => setEditingProduct({...editingProduct, images: [e.target.value]})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} 
              />
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '1rem 2rem' }}>
              Save Product
            </button>
          </form>
        )}

        {/* BLOG TAB */}
        {activeTab === 'blog' && (
          <>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t('blog_posts')}</h2>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <form onSubmit={handleAddBlog} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-sm)' }}>
                <h3>{t('add_new_post')}</h3>
                <input 
                  type="text" placeholder={t('title')} required 
                  value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white' }} 
                />
                <textarea 
                  placeholder={t('content')} required rows={4}
                  value={newContent} onChange={e => setNewContent(e.target.value)}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white' }} 
                ></textarea>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>{t('publish')}</button>
              </form>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3>{t('published')}</h3>
                {blogPosts.map(post => (
                  <div key={post.id} style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: 'var(--color-accent)' }}>{post.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{post.date}</p>
                    </div>
                    <button onClick={() => { if(window.confirm('Delete post?')) deleteBlogPost(post.id) }} style={{ color: 'red', fontSize: '0.9rem' }}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{language === 'vi' ? 'Quản lý thành viên' : 'Member Management'}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Email / Name</th>
                  <th style={{ padding: '1rem' }}>Joined</th>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {appUsers.map((u) => (
                  <tr key={u.uid} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{u.displayName || 'Unknown'}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{new Date(u.joinDate).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <select 
                        value={u.role}
                        onChange={(e) => updateUserRole(u.uid, e.target.value as 'admin' | 'user')}
                        style={{
                          padding: '0.5rem', borderRadius: 'var(--radius-sm)',
                          background: 'rgba(0,0,0,0.5)', color: '#fff',
                          border: '1px solid var(--glass-border)', outline: 'none'
                        }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => { if(window.confirm('Delete user?')) deleteUser(u.uid) }} style={{ color: 'red', fontSize: '0.9rem' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Website Settings</h2>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Brand Logo</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Logo Text (if no image)</label>
                <input 
                  type="text" required
                  value={tempSettings.logoText}
                  onChange={e => setTempSettings({...tempSettings, logoText: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Logo Image URL (optional)</label>
                <input 
                  type="text" placeholder="https://example.com/logo.png"
                  value={tempSettings.logoImage || ''}
                  onChange={e => setTempSettings({...tempSettings, logoImage: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white' }} 
                />
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Homepage Slider</h3>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Hero Video/Image URL (.mp4)</label>
                <input 
                  type="text" required
                  value={tempSettings.heroVideoUrl}
                  onChange={e => setTempSettings({...tempSettings, heroVideoUrl: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white' }} 
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '1rem 2.5rem' }}>
              Save Settings
            </button>
          </form>
        )}
        
      </div>
    </div>
  );
};
