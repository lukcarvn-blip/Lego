import React, { useState, useMemo } from 'react';
import { useStore, type OrderStatus } from '../context/StoreContext';
import { 
  Package, Clock, Truck, CheckCircle, Edit2, Plus, Settings,
  LayoutDashboard, ShoppingBag, Users, BookOpen, TrendingUp,
  Search, Filter, Download, Eye, ExternalLink, Trash2, X,
  AlertTriangle, Heart, BarChart2, ChevronRight, Award, RefreshCw
} from 'lucide-react';
import type { Product } from '../data/mockProducts';
import type { Order, BlogPost } from '../context/StoreContext';
import { Link, useSearchParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image', 'video'],
    ['clean']
  ]
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatVND = (usd: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(usd * 25000);

const statusColor: Record<OrderStatus, string> = {
  Pending: '#9ca3af',
  Crafting: '#eab308',
  Shipping: '#3b82f6',
  Delivered: '#22c55e',
};

const statusLabel: Record<OrderStatus, string> = {
  Pending: '⏳ Chờ xử lý',
  Crafting: '🛠 Đang chế tác',
  Shipping: '🚚 Đang giao',
  Delivered: '✅ Đã giao',
};

const generateSKU = (category: string, existingProducts: Product[]) => {
  const catMap: Record<string, string> = {
    classic: 'CLS', superheroes: 'SUP', 'sci-fi': 'SCI',
    fantasy: 'FAN', anime: 'ANI',
  };
  const code = catMap[category.toLowerCase()] || category.substring(0, 3).toUpperCase();
  const existing = existingProducts.filter(p => p.sku?.includes(`LGT-${code}`)).length;
  return `LGT-${code}-${String(existing + 1).padStart(3, '0')}`;
};

const exportCSV = (orders: Order[]) => {
  const headers = ['Mã đơn', 'Khách hàng', 'Ngày đặt', 'Tổng tiền (VNĐ)', 'Trạng thái', 'Sản phẩm'];
  const rows = orders.map(o => [
    `#${o.id.substring(0, 8).toUpperCase()}`,
    o.customerName,
    new Date(o.date).toLocaleDateString('vi-VN'),
    (o.total * 25000).toFixed(0),
    o.status,
    o.items.map(i => `${i.product.name.vi} x${i.quantity}`).join(' | ')
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'don-hang-legato.csv'; a.click();
};

// ── Sub-components ─────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, color, sub }: { icon: React.ReactNode, label: string, value: string | number, color: string, sub?: string }) => (
  <div style={{
    background: 'rgba(0,0,0,0.3)', border: `1px solid ${color}30`,
    borderRadius: 'var(--radius-md)', padding: '1.25rem',
    display: 'flex', flexDirection: 'column', gap: '0.5rem',
    boxShadow: `0 0 20px ${color}15`
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ color, opacity: 0.8 }}>{icon}</span>
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: 800, color }}>{value}</div>
    {sub && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{sub}</div>}
  </div>
);

const InputField = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div>
    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.7rem 1rem', borderRadius: 'var(--radius-sm)',
  background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)',
  color: 'white', outline: 'none', fontSize: '0.9rem'
};

// ── Order Detail Modal ──────────────────────────────────────────────────────
const OrderModal = ({ order, onClose, onStatusChange }: { order: Order, onClose: () => void, onStatusChange: (id: string, s: OrderStatus) => void }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
  }} onClick={onClose}>
    <div style={{
      background: '#0a1c0a', border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)', padding: '2rem', width: '100%', maxWidth: '600px',
      maxHeight: '90vh', overflowY: 'auto'
    }} onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-accent)' }}>#{order.id.substring(0, 10).toUpperCase()}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(order.date).toLocaleString('vi-VN')}</p>
        </div>
        <button onClick={onClose} style={{ color: 'var(--color-text-muted)', padding: '0.25rem' }}><X size={20} /></button>
      </div>

      {/* Customer */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>KHÁCH HÀNG</p>
        <p style={{ fontWeight: 700 }}>{order.customerName}</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Thanh toán: {order.paymentMethod || 'COD'}</p>
      </div>

      {/* Items */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>SẢN PHẨM</p>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
            <img src={item.product.images[0]} onError={e => { e.currentTarget.src = '/images/fallback-logo.jpg' }} style={{ width: '48px', height: '48px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '4px' }} alt="" />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.product.name.vi}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {item.size} · {item.material} · x{item.quantity}
                {item.isFastCrafting && <span style={{ color: '#ef4444', marginLeft: '0.5rem' }}>🚀 Tăng tốc</span>}
              </p>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '0.9rem' }}>
              {formatVND(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(74,222,128,0.08)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid rgba(74,222,128,0.2)' }}>
        <span style={{ fontWeight: 700 }}>Tổng cộng</span>
        <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-accent)' }}>{formatVND(order.total)}</span>
      </div>

      {/* Status */}
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>CẬP NHẬT TRẠNG THÁI</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['Pending', 'Crafting', 'Shipping', 'Delivered'] as OrderStatus[]).map(s => (
            <button key={s} onClick={() => onStatusChange(order.id, s)}
              style={{
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600,
                background: order.status === s ? statusColor[s] : 'rgba(0,0,0,0.3)',
                color: order.status === s ? '#000' : statusColor[s],
                border: `1px solid ${statusColor[s]}`,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >{statusLabel[s]}</button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ── Main Admin Component ───────────────────────────────────────────────────
export const Admin = () => {
  const { 
    orders, updateOrderStatus, 
    products, updateProduct, addProduct, deleteProduct,
    blogPosts, addBlogPost, deleteBlogPost,
    settings, updateSettings,
    t, language, showToast, formatPrice,
    appUsers, currentUserRole, updateUserRole, deleteUser, user
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'blog' | 'members' | 'settings'>('dashboard');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const [productSearch, setProductSearch] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  
  // Blog State
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<Partial<BlogPost>>({});
  
  const [tempSettings, setTempSettings] = useState(settings);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Dashboard stats ────────────────────────────────────────────────────
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.date.startsWith(todayStr));
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const craftingCount = orders.filter(o => o.status === 'Crafting').length;
  const shippingCount = orders.filter(o => o.status === 'Shipping').length;
  const topProducts = [...products].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);
  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // ── Filtered orders ───────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = orderSearch === '' || 
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, orderSearch, orderStatusFilter]);

  // ── Filtered products ─────────────────────────────────────────────────
  const filteredProducts = useMemo(() =>
    products.filter(p =>
      productSearch === '' ||
      p.name.vi.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    ), [products, productSearch]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleOpenAddProduct = () => {
    setEditingProduct({
      name: { vi: '', en: '' }, description: { vi: '', en: '' },
      price: 0, stock: 0, category: 'Classic',
      images: [''], estimatedPrintTime: '2-4 days',
      rating: 5, reviews: 0, likes: 0,
      availableSizes: ['Size 300', 'Size 400', 'Size 1000']
    });
    setIsEditingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct.id) {
      updateProduct(editingProduct as Product);
      showToast(language === 'vi' ? 'Đã cập nhật sản phẩm!' : 'Product updated!');
    } else {
      const sku = generateSKU(editingProduct.category || 'Classic', products);
      addProduct({ ...editingProduct, sku } as Omit<Product, 'id'>);
      showToast(language === 'vi' ? `Đã thêm sản phẩm! SKU: ${sku}` : `Product added! SKU: ${sku}`);
    }
    setIsEditingProduct(false); setEditingProduct({});
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault(); updateSettings(tempSettings);
    showToast(language === 'vi' ? 'Đã lưu cài đặt!' : 'Settings saved!');
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!editingBlogPost.title) return;
    
    // Create excerpt from content if it doesn't exist
    const plainTextContent = editingBlogPost.content ? editingBlogPost.content.replace(/<[^>]+>/g, '') : '';
    const excerpt = plainTextContent.slice(0, 150) + (plainTextContent.length > 150 ? '...' : '');

    const postData = { 
      title: editingBlogPost.title, 
      content: editingBlogPost.content || '', 
      excerpt: editingBlogPost.excerpt || excerpt, 
      date: editingBlogPost.date || new Date().toISOString().split('T')[0], 
      image: editingBlogPost.image || 'https://images.unsplash.com/photo-1580477667995-15120f1fb93e?q=80&w=600',
      id: editingBlogPost.id || Date.now().toString()
    };

    if (editingBlogPost.id) {
       deleteBlogPost(editingBlogPost.id);
       addBlogPost(postData as any); 
       showToast(language === 'vi' ? 'Đã cập nhật bài viết!' : 'Post updated!');
    } else {
       addBlogPost(postData as any);
       showToast(language === 'vi' ? 'Đã đăng bài viết!' : 'Post published!');
    }
    
    setIsEditingBlog(false); 
    setEditingBlogPost({});
  };

  const handleEditBlog = (post: BlogPost) => {
    setEditingBlogPost(post);
    setIsEditingBlog(true);
  };

  if (currentUserRole !== 'admin') {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h1 style={{ color: '#ef4444' }}>Truy cập bị từ chối</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Bạn cần quyền Admin để xem trang này.</p>
      </div>
    );
  }

  // ── Sidebar items ─────────────────────────────────────────────────────
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: 'Đơn hàng', icon: <ShoppingBag size={18} />, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'products', label: 'Sản phẩm', icon: <Package size={18} /> },
    { id: 'blog', label: 'Bài viết', icon: <BookOpen size={18} /> },
    { id: 'members', label: 'Thành viên', icon: <Users size={18} /> },
    { id: 'settings', label: 'Cài đặt', icon: <Settings size={18} /> },
  ] as const;

  const panelStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem'
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '220px' : '60px', flexShrink: 0,
        background: 'rgba(10,28,10,0.95)', borderRight: '1px solid var(--glass-border)',
        height: 'calc(100vh - 80px)', position: 'sticky', top: '80px',
        display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease',
        overflow: 'hidden', zIndex: 10
      }}>
        {/* Admin identity */}
        <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user?.photoURL && <img src={user.photoURL} style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, border: '2px solid var(--color-accent)' }} alt="" />}
          {sidebarOpen && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.displayName || 'Admin'}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'rgba(74,222,128,0.15)', padding: '1px 6px', borderRadius: '20px', display: 'inline-block' }}>ADMIN</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setIsEditingProduct(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)',
                background: activeTab === tab.id ? 'rgba(74,222,128,0.15)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                border: activeTab === tab.id ? '1px solid rgba(74,222,128,0.3)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left',
                fontWeight: activeTab === tab.id ? 700 : 400, position: 'relative', flexShrink: 0
              }}
            >
              <span style={{ flexShrink: 0 }}>{tab.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace: 'nowrap', fontSize: '0.875rem' }}>{tab.label}</span>}
              {'badge' in tab && tab.badge !== undefined && (
                <span style={{
                  marginLeft: 'auto', background: '#ef4444', color: '#fff',
                  borderRadius: '50%', width: '18px', height: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 800, flexShrink: 0
                }}>{tab.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Toggle sidebar */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ padding: '1rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center' }}>
          <ChevronRight size={16} style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem', overflowX: 'auto', minWidth: 0 }}>

        {/* ── DASHBOARD TAB ─────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '0.5rem' }}>📊 Dashboard</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Tổng quan hệ thống LEGATO</p>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <StatCard icon={<TrendingUp size={20} />} label="Doanh thu hôm nay" value={formatVND(todayRevenue)} color="#4ade80" sub={`${todayOrders.length} đơn hàng`} />
              <StatCard icon={<BarChart2 size={20} />} label="Tổng doanh thu" value={formatVND(totalRevenue)} color="#86efac" sub={`${orders.length} đơn tổng cộng`} />
              <StatCard icon={<Clock size={20} />} label="Chờ xử lý" value={pendingCount} color="#eab308" sub="cần xác nhận" />
              <StatCard icon={<Package size={20} />} label="Đang chế tác" value={craftingCount} color="#a855f7" sub="đang sản xuất" />
              <StatCard icon={<Truck size={20} />} label="Đang giao hàng" value={shippingCount} color="#3b82f6" sub="trên đường đi" />
              <StatCard icon={<Users size={20} />} label="Thành viên" value={appUsers.length} color="#f59e0b" sub="đã đăng ký" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Top products */}
              <div style={panelStyle}>
                <h2 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} color="var(--color-accent)" /> Top sản phẩm yêu thích
                </h2>
                {topProducts.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', width: '16px', textAlign: 'center' }}>#{i + 1}</span>
                    <img src={p.images[0]} onError={e => { e.currentTarget.src = '/images/fallback-logo.jpg' }} style={{ width: '36px', height: '36px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '3px' }} alt="" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name.vi}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{p.sku || 'No SKU'}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#ef4444', fontSize: '0.8rem' }}>
                      <Heart size={12} fill="#ef4444" />{p.likes.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div style={panelStyle}>
                <h2 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingBag size={18} color="var(--color-accent)" /> Đơn hàng gần đây
                </h2>
                {recentOrders.length === 0 ? (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Chưa có đơn hàng nào.</p>
                ) : recentOrders.map(o => (
                  <div key={o.id} onClick={() => setSelectedOrder(o)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{o.customerName}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>#{o.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '20px', background: `${statusColor[o.status]}20`, color: statusColor[o.status], fontWeight: 600 }}>{o.status}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatVND(o.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low stock alert */}
            {products.filter(p => p.stock <= 3).length > 0 && (
              <div style={{ ...panelStyle, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                  <AlertTriangle size={18} /> Cảnh báo tồn kho thấp
                </h2>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {products.filter(p => p.stock <= 3).map(p => (
                    <div key={p.id} style={{ background: 'rgba(239,68,68,0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.name.vi}</p>
                      <p style={{ fontSize: '0.75rem', color: '#ef4444' }}>Còn {p.stock} sản phẩm</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}>📦 Quản lý đơn hàng</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{orders.length} tổng đơn</p>
              </div>
              <button onClick={() => exportCSV(filteredOrders)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: 'var(--color-accent)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                <Download size={16} /> Xuất CSV
              </button>
            </div>

            {/* Search + filter */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Tìm tên khách, mã đơn..." style={{ ...inputStyle, paddingLeft: '2.25rem' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(['All', 'Pending', 'Crafting', 'Shipping', 'Delivered'] as const).map(s => (
                  <button key={s} onClick={() => setOrderStatusFilter(s)}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600,
                      background: orderStatusFilter === s ? (s === 'All' ? 'var(--color-accent)' : statusColor[s as OrderStatus]) : 'rgba(0,0,0,0.3)',
                      color: orderStatusFilter === s ? '#000' : 'var(--color-text-muted)',
                      border: `1px solid ${s === 'All' ? 'var(--glass-border)' : statusColor[s as OrderStatus] + '60'}`,
                      cursor: 'pointer'
                    }}
                  >{s === 'All' ? 'Tất cả' : statusLabel[s as OrderStatus]}</button>
                ))}
              </div>
            </div>

            {/* Orders table */}
            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>Không tìm thấy đơn hàng nào.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Tổng tiền', 'Ngày đặt', 'Trạng thái', ''].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-accent)' }}>
                          #{order.id.substring(0, 8).toUpperCase()}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.9rem' }}>{order.customerName}</td>
                        <td style={{ padding: '0.875rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', maxWidth: '200px' }}>
                          {order.items.map(i => `${i.product.name.vi} x${i.quantity}`).join(', ').substring(0, 50)}
                          {order.items.length > 1 ? '...' : ''}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--color-accent)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                          {formatVND(order.total)}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {new Date(order.date).toLocaleDateString('vi-VN')}
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', background: `${statusColor[order.status]}20`, color: statusColor[order.status], border: `1px solid ${statusColor[order.status]}50`, outline: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            {(['Pending', 'Crafting', 'Shipping', 'Delivered'] as OrderStatus[]).map(s => (
                              <option key={s} value={s} style={{ background: '#0a1c0a', color: '#fff' }}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <button onClick={() => setSelectedOrder(order)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 600 }}>
                            <Eye size={14} /> Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ──────────────────────────────────────────── */}
        {activeTab === 'products' && !isEditingProduct && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}>🏪 Quản lý sản phẩm</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{products.length} sản phẩm</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    if (window.confirm('Khôi phục Lượt xem và Tim về 0 cho tất cả sản phẩm?')) {
                      products.forEach(p => {
                        updateProduct({ ...p, views: 0, likes: 0 });
                      });
                      alert('Đã reset thành công!');
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
                >
                  <RefreshCw size={16} /> Reset Tim/View
                </button>
                <button 
                  onClick={() => {
                    const discountStr = window.prompt('Nhập phần trăm giảm giá Khuyến Mãi cho TẤT CẢ sản phẩm (0-100).\n\n(Lưu ý: Mức này sẽ hiển thị giá gạch chéo. Nhập 0 để gỡ bỏ toàn bộ sale)');
                    if (discountStr !== null) {
                      const discount = parseInt(discountStr, 10);
                      if (!isNaN(discount) && discount >= 0 && discount <= 100) {
                        products.forEach(p => {
                          if (discount === 0) {
                            updateProduct({ ...p, discountPercentage: 0, saleType: null });
                          } else {
                            updateProduct({ ...p, discountPercentage: discount, saleType: 'SALE' });
                          }
                        });
                        alert(`Đã ${discount === 0 ? 'gỡ bỏ sale' : `áp dụng sale ${discount}%`} cho toàn bộ kho!`);
                      } else {
                        alert('Số phần trăm không hợp lệ. Vui lòng nhập từ 0 đến 100.');
                      }
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
                >
                  <TrendingUp size={16} style={{ transform: 'scaleY(-1)' }} /> Cài Sale Hàng Loạt
                </button>
                <button className="btn-primary" onClick={handleOpenAddProduct} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}>
                  <Plus size={18} /> Thêm sản phẩm
                </button>
              </div>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Tìm SKU, tên, danh mục..." style={{ ...inputStyle, paddingLeft: '2.25rem' }} />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {['Ảnh', 'SKU', 'Tên sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', '❤️', '👁', 'Sale', 'Thao tác'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ width: '44px', height: '44px', background: 'rgba(74,222,128,0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', border: '1px solid var(--glass-border)' }}>
                          <img src={product.images[0]} onError={e => { e.currentTarget.src = '/images/fallback-logo.jpg' }} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#86efac', fontWeight: 700 }}>
                        {product.sku || <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.875rem', maxWidth: '180px' }}>
                        <span style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name.vi}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '20px', background: 'rgba(74,222,128,0.1)', color: 'var(--color-accent)', fontWeight: 600 }}>{product.category}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                        {formatPrice(product.price, product.discountPercentage).current}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, background: product.stock <= 3 ? 'rgba(239,68,68,0.15)' : 'rgba(74,222,128,0.1)', color: product.stock <= 3 ? '#ef4444' : 'var(--color-accent)' }}>
                          {product.stock <= 3 && '⚠ '}{product.stock}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#ef4444' }}>
                        {product.likes.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {(product.views || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {product.saleType ? (
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '20px', background: product.saleType === 'FLASH_SALE' ? 'rgba(239,68,68,0.2)' : 'rgba(251,191,36,0.2)', color: product.saleType === 'FLASH_SALE' ? '#ef4444' : '#fbbf24', fontWeight: 700 }}>
                            {product.saleType === 'FLASH_SALE' ? `⚡ −${product.discountPercentage}%` : `SALE −${product.discountPercentage}%`}
                          </span>
                        ) : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>—</span>}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button onClick={() => { setEditingProduct(product); setIsEditingProduct(true); }} style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', padding: '0.35rem 0.6rem', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 'var(--radius-sm)', background: 'rgba(74,222,128,0.05)' }}>
                            <Edit2 size={13} />
                          </button>
                          <Link to={`/product/${product.id}`} target="_blank" style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', padding: '0.35rem 0.6rem', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-sm)', background: 'rgba(59,130,246,0.05)' }}>
                            <ExternalLink size={13} />
                          </Link>
                          <button onClick={() => { if (window.confirm('Xóa sản phẩm này?')) deleteProduct(product.id) }} style={{ color: '#ef4444', display: 'flex', alignItems: 'center', padding: '0.35rem 0.6rem', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.05)' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PRODUCT FORM ──────────────────────────────────────────── */}
        {activeTab === 'products' && isEditingProduct && (
          <form onSubmit={handleSaveProduct} style={{ maxWidth: '900px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.75rem' }}>{editingProduct.id ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h1>
              <button type="button" onClick={() => setIsEditingProduct(false)} style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <X size={18} /> Hủy
              </button>
            </div>

            {editingProduct.id && (
              <div style={{ ...panelStyle, background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>SKU</p>
                <p style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--color-accent)', fontSize: '1.1rem' }}>{editingProduct.sku || 'Chưa có SKU'}</p>
              </div>
            )}

            <div style={panelStyle}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>📝 Thông tin cơ bản</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <InputField label="Tên tiếng Việt *">
                  <input type="text" required value={editingProduct.name?.vi || ''} onChange={e => setEditingProduct({...editingProduct, name: { ...editingProduct.name!, vi: e.target.value }})} style={inputStyle} />
                </InputField>
                <InputField label="Tên tiếng Anh *">
                  <input type="text" required value={editingProduct.name?.en || ''} onChange={e => setEditingProduct({...editingProduct, name: { ...editingProduct.name!, en: e.target.value }})} style={inputStyle} />
                </InputField>
                <InputField label="Mô tả (VI)">
                  <textarea rows={3} value={editingProduct.description?.vi || ''} onChange={e => setEditingProduct({...editingProduct, description: { ...editingProduct.description!, vi: e.target.value }})} style={{...inputStyle, resize: 'vertical'}} />
                </InputField>
                <InputField label="Mô tả (EN)">
                  <textarea rows={3} value={editingProduct.description?.en || ''} onChange={e => setEditingProduct({...editingProduct, description: { ...editingProduct.description!, en: e.target.value }})} style={{...inputStyle, resize: 'vertical'}} />
                </InputField>
              </div>
            </div>

            <div style={panelStyle}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>💰 Giá & Tồn kho</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <InputField label="Danh mục *">
                  <select value={editingProduct.category || ''} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} style={inputStyle}>
                    {['Classic', 'Superheroes', 'Sci-Fi', 'Fantasy', 'Anime'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </InputField>
                <InputField label="Giá ($USD) *">
                  <input type="number" required step="0.01" value={editingProduct.price || 0} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} style={inputStyle} />
                </InputField>
                <InputField label="Tồn kho *">
                  <input type="number" required value={editingProduct.stock || 0} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} style={inputStyle} />
                </InputField>
                <InputField label="Thời gian in *">
                  <input type="text" required placeholder="vd: 2-4 days" value={editingProduct.estimatedPrintTime || ''} onChange={e => setEditingProduct({...editingProduct, estimatedPrintTime: e.target.value})} style={inputStyle} />
                </InputField>
                <InputField label="Loại khuyến mãi">
                  <select value={editingProduct.saleType || ''} onChange={e => setEditingProduct({...editingProduct, saleType: e.target.value ? e.target.value as any : null})} style={inputStyle}>
                    <option value="">Không có</option>
                    <option value="SALE">Normal Sale</option>
                    <option value="FLASH_SALE">Flash Sale</option>
                  </select>
                </InputField>
                {editingProduct.saleType && (
                  <InputField label="Giảm giá (%)">
                    <input type="number" min="1" max="100" value={editingProduct.discountPercentage || 0} onChange={e => setEditingProduct({...editingProduct, discountPercentage: parseInt(e.target.value)})} style={inputStyle} />
                  </InputField>
                )}
              </div>
            </div>

            <div style={panelStyle}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>🖼 Hình ảnh & Video</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <InputField label="URL Hình ảnh chính *">
                    <input type="text" required placeholder="/images/product.png" value={editingProduct.images?.[0] || ''} onChange={e => setEditingProduct({...editingProduct, images: [e.target.value]})} style={inputStyle} />
                  </InputField>
                  {editingProduct.images?.[0] && (
                    <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'center' }}>
                      <img src={editingProduct.images[0]} onError={e => { e.currentTarget.src = '/images/fallback-logo.jpg' }} style={{ height: '100px', objectFit: 'contain' }} alt="preview" />
                    </div>
                  )}
                </div>
                <InputField label="URL Video (tùy chọn)">
                  <input type="text" placeholder="https://..." value={editingProduct.video || ''} onChange={e => setEditingProduct({...editingProduct, video: e.target.value})} style={inputStyle} />
                </InputField>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                {editingProduct.id ? '💾 Lưu thay đổi' : '🚀 Thêm sản phẩm'}
              </button>
              <button type="button" onClick={() => setIsEditingProduct(false)} style={{ padding: '0.875rem 1.5rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)' }}>Hủy</button>
            </div>
          </form>
        )}

        {/* ── BLOG TAB ──────────────────────────────────────────────── */}
        {activeTab === 'blog' && !isEditingBlog && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}>📝 Quản lý bài viết</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{blogPosts.length} bài viết đã xuất bản</p>
              </div>
              <button className="btn-primary" onClick={() => { setEditingBlogPost({}); setIsEditingBlog(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}>
                <Plus size={18} /> Viết bài mới
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {['Ảnh bìa', 'Tiêu đề', 'Lượt xem', 'Ngày đăng', 'Thao tác'].map(h => <th key={h} style={{ padding: '0.75rem 1rem' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.map(post => (
                    <tr key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <img src={post.image} onError={e => { e.currentTarget.src = '/images/fallback-logo.jpg' }} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{post.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {post.excerpt}
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}>
                          <Eye size={14} /> {Math.floor(Math.random() * 500) + 50}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{post.date}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEditBlog(post)} style={{ color: 'var(--color-accent)', padding: '0.35rem' }}><Edit2 size={15} /></button>
                          <button onClick={() => { if(window.confirm('Xóa bài viết này?')) deleteBlogPost(post.id) }} style={{ color: '#ef4444', padding: '0.35rem' }}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── BLOG EDITOR MODAL ─────────────────────────────────────── */}
        {activeTab === 'blog' && isEditingBlog && (
          <div style={{ maxWidth: '900px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.75rem' }}>{editingBlogPost.id ? '✏️ Chỉnh sửa bài viết' : '✍️ Viết bài mới'}</h1>
              <button type="button" onClick={() => setIsEditingBlog(false)} style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <X size={18} /> Hủy
              </button>
            </div>

            <form onSubmit={handleSaveBlog} style={panelStyle}>
              <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <InputField label="Tiêu đề bài viết *">
                  <input type="text" required value={editingBlogPost.title || ''} onChange={e => setEditingBlogPost({...editingBlogPost, title: e.target.value})} style={inputStyle} />
                </InputField>
                
                <InputField label="Đoạn trích (Excerpt - Hiển thị ở danh sách)">
                  <textarea rows={2} value={editingBlogPost.excerpt || ''} onChange={e => setEditingBlogPost({...editingBlogPost, excerpt: e.target.value})} style={{...inputStyle, resize: 'vertical'}} />
                </InputField>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <InputField label="URL Ảnh bìa *">
                    <input type="text" required value={editingBlogPost.image || ''} onChange={e => setEditingBlogPost({...editingBlogPost, image: e.target.value})} style={inputStyle} placeholder="https://..." />
                  </InputField>
                  <InputField label="Ngày đăng">
                    <input type="date" required value={editingBlogPost.date || new Date().toISOString().split('T')[0]} onChange={e => setEditingBlogPost({...editingBlogPost, date: e.target.value})} style={inputStyle} />
                  </InputField>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nội dung bài viết *
                  </label>
                  <div style={{ background: '#fff', color: '#000', borderRadius: '4px', overflow: 'hidden' }}>
                    <ReactQuill 
                      theme="snow" 
                      value={editingBlogPost.content || ''} 
                      onChange={content => setEditingBlogPost({...editingBlogPost, content})} 
                      style={{ height: '400px', border: 'none' }}
                      modules={QUILL_MODULES}
                    />
                  </div>
                  {/* Padding to account for Quill toolbar pushing content up */}
                  <div style={{ height: '40px' }}></div> 
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ padding: '0.875rem 2rem' }}>
                  {editingBlogPost.id ? '💾 Cập nhật bài viết' : '🚀 Đăng bài viết'}
                </button>
              </div>
            </form>
          </div>
        )}        {/* ── MEMBERS TAB ───────────────────────────────────────────── */}
        {activeTab === 'members' && (
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '1.5rem' }}>👥 Quản lý thành viên</h1>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {['Avatar', 'Email / Tên', 'Ngày tham gia', 'Quyền hạn', 'Thao tác'].map(h => <th key={h} style={{ padding: '0.75rem 1rem' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {appUsers.map(u => (
                    <tr key={u.uid} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        {u.photoURL ? <img src={u.photoURL} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--glass-border)' }} alt="" /> : <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>👤</div>}
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.displayName || 'Unknown'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{new Date(u.joinDate).toLocaleDateString('vi-VN')}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <select value={u.role} onChange={e => updateUserRole(u.uid, e.target.value as 'admin' | 'user')}
                          style={{ ...inputStyle, width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: u.role === 'admin' ? 'var(--color-accent)' : '#fff' }}>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <button onClick={() => { if (window.confirm('Xóa người dùng này?')) deleteUser(u.uid) }} style={{ color: '#ef4444', padding: '0.35rem' }}><Trash2 size={15} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ──────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '1.5rem' }}>⚙️ Cài đặt Website</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={panelStyle}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Nhận diện thương hiệu</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <InputField label="Tên thương hiệu (khi không có logo)">
                    <input type="text" required value={tempSettings.logoText} onChange={e => setTempSettings({...tempSettings, logoText: e.target.value})} style={inputStyle} />
                  </InputField>
                  <InputField label="URL Logo (.png/.svg)">
                    <input type="text" placeholder="https://..." value={tempSettings.logoImage || ''} onChange={e => setTempSettings({...tempSettings, logoImage: e.target.value})} style={inputStyle} />
                  </InputField>
                  <InputField label="URL Video Hero Trang chủ (.mp4)">
                    <input type="text" required value={tempSettings.heroVideoUrl} onChange={e => setTempSettings({...tempSettings, heroVideoUrl: e.target.value})} style={inputStyle} />
                  </InputField>
                </div>
              </div>

              <div style={panelStyle}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Tối ưu SEO & Trình duyệt</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <InputField label="Tiêu đề trang (SEO Title)">
                    <input type="text" value={tempSettings.seoTitle || ''} onChange={e => setTempSettings({...tempSettings, seoTitle: e.target.value})} style={inputStyle} />
                  </InputField>
                  <InputField label="Mô tả trang (SEO Description)">
                    <textarea rows={3} value={tempSettings.seoDescription || ''} onChange={e => setTempSettings({...tempSettings, seoDescription: e.target.value})} style={{...inputStyle, resize: 'vertical'}} />
                  </InputField>
                  <InputField label="URL Favicon (.ico/.png)">
                    <input type="text" value={tempSettings.favicon || ''} onChange={e => setTempSettings({...tempSettings, favicon: e.target.value})} style={inputStyle} />
                  </InputField>
                </div>
              </div>
            </div>

            <div style={panelStyle}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Thông tin liên hệ & Cửa hàng</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <InputField label="Hotline">
                  <input type="text" value={tempSettings.contactHotline || ''} onChange={e => setTempSettings({...tempSettings, contactHotline: e.target.value})} style={inputStyle} />
                </InputField>
                <InputField label="Email hỗ trợ">
                  <input type="email" value={tempSettings.contactEmail || ''} onChange={e => setTempSettings({...tempSettings, contactEmail: e.target.value})} style={inputStyle} />
                </InputField>
                <div style={{ gridColumn: '1 / -1' }}>
                  <InputField label="Địa chỉ cửa hàng">
                    <input type="text" value={tempSettings.contactAddress || ''} onChange={e => setTempSettings({...tempSettings, contactAddress: e.target.value})} style={inputStyle} />
                  </InputField>
                </div>
              </div>
            </div>

            <div style={panelStyle}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Mạng xã hội</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <InputField label="Facebook">
                  <input type="text" value={tempSettings.socialFacebook || ''} onChange={e => setTempSettings({...tempSettings, socialFacebook: e.target.value})} style={inputStyle} />
                </InputField>
                <InputField label="Instagram">
                  <input type="text" value={tempSettings.socialInstagram || ''} onChange={e => setTempSettings({...tempSettings, socialInstagram: e.target.value})} style={inputStyle} />
                </InputField>
                <InputField label="TikTok">
                  <input type="text" value={tempSettings.socialTiktok || ''} onChange={e => setTempSettings({...tempSettings, socialTiktok: e.target.value})} style={inputStyle} />
                </InputField>
                <InputField label="YouTube">
                  <input type="text" value={tempSettings.socialYoutube || ''} onChange={e => setTempSettings({...tempSettings, socialYoutube: e.target.value})} style={inputStyle} />
                </InputField>
              </div>
            </div>

            <div style={panelStyle}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Thông tin Ngân hàng (Thanh toán)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <InputField label="Tên Ngân hàng">
                  <input type="text" placeholder="VD: Vietcombank" value={tempSettings.bankName || ''} onChange={e => setTempSettings({...tempSettings, bankName: e.target.value})} style={inputStyle} />
                </InputField>
                <InputField label="Số tài khoản">
                  <input type="text" value={tempSettings.bankAccount || ''} onChange={e => setTempSettings({...tempSettings, bankAccount: e.target.value})} style={inputStyle} />
                </InputField>
                <InputField label="Tên chủ tài khoản">
                  <input type="text" placeholder="VIET NAM" value={tempSettings.bankOwner || ''} onChange={e => setTempSettings({...tempSettings, bankOwner: e.target.value})} style={inputStyle} />
                </InputField>
              </div>
            </div>

            <div style={panelStyle}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Banner Thông báo (Khuyến mãi, Freeship...)</h3>
              <InputField label="Nội dung Banner (Để trống để ẩn)">
                <input type="text" placeholder="Nhập thông báo sẽ hiển thị trên cùng website..." value={tempSettings.bannerText || ''} onChange={e => setTempSettings({...tempSettings, bannerText: e.target.value})} style={inputStyle} />
              </InputField>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '0.875rem 2.5rem' }}>💾 Lưu cài đặt</button>
          </form>
        )}
      </main>

      {/* Order detail modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(id, s) => { updateOrderStatus(id, s); setSelectedOrder(prev => prev ? {...prev, status: s} : null); }}
        />
      )}
    </div>
  );
};
