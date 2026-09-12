import React, { useState, useMemo, useEffect } from 'react';
import { useStore, type OrderStatus } from '../context/StoreContext';
import { Package, Clock, Truck, CheckCircle, Edit2, Plus, Settings, LayoutDashboard, ShoppingBag, Users, BookOpen, TrendingUp, Search, Filter, Download, Eye, ExternalLink, Trash2, X, AlertTriangle, Heart, BarChart2, ChevronRight, Award, RefreshCw, Home, LogOut, DatabaseZap, Globe, Menu, Printer, Folder, LayoutGrid, List, PenTool, Image as ImageIcon, Save, Send, Wrench, Zap, Key, Box, ShoppingCart, User, Info, FileText, Sparkles } from 'lucide-react';
import type { Product } from '../data/mockProducts';
import type { Order, BlogPost } from '../context/StoreContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';


function useSessionState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        return parsed !== null ? parsed : initialValue;
      }
      return initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [state, setValue] as const;
}

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
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(usd * 25400);

const statusColor: Record<OrderStatus, string> = {
  Pending: '#9ca3af',
  Crafting: '#eab308',
  Shipping: '#3b82f6',
  Delivered: '#22c55e',
};

const statusLabel: Record<OrderStatus, string> = {
  Pending: 'Chờ xử lý',
  Crafting: 'Đang chế tác',
  Shipping: 'Đang giao',
  Delivered: 'Đã giao',
};

const generateSKU = (category: string, existingProducts: Product[]) => {
  if (!category) return `LGT-UNK-${String(existingProducts.length + 1).padStart(3, '0')}`;
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
    (o.total * 25400).toFixed(0),
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
    background: 'rgba(0,0,0,0.2)', border: `1px solid var(--glass-border)`,
    borderRadius: 'var(--radius-md)', padding: '1.25rem',
    display: 'flex', flexDirection: 'column', gap: '0.5rem',
    boxShadow: `0 2px 5px rgba(0,0,0,0.02)`
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ color, opacity: 0.8 }}>{icon}</span>
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)' }}>{value}</div>
    {sub && <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>{sub}</div>}
  </div>
);

const InputField = ({ label, children }: { label: React.ReactNode, children: React.ReactNode }) => (
  <div>
    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.7rem 1rem', borderRadius: 'var(--radius-sm)',
  background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
  color: 'var(--color-text)', outline: 'none', fontSize: '0.9rem'
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
    blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
    settings, updateSettings,
    t, language, showToast, formatPrice,
    appUsers, currentUserRole, updateUserRole, deleteUser, user, logout, loginWithGoogle
  } = useStore();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = (searchParams.get('tab') || 'dashboard') as 'dashboard' | 'orders' | 'products' | 'printers' | 'blog' | 'files' | 'members' | 'settings';
  const [activeTab, setActiveTabState] = useSessionState<'dashboard' | 'orders' | 'products' | 'printers' | 'blog' | 'files' | 'members' | 'settings'>('admin_tab', initialTab);
  const setActiveTab = (tab: typeof activeTab) => {
    setActiveTabState(tab);
    setSearchParams({ tab });
  };
  const [orderSearch, setOrderSearch] = useSessionState('admin_orderSearch', '');
  const [orderStatusFilter, setOrderStatusFilter] = useSessionState<OrderStatus | 'All'>('admin_orderStatusFilter', 'All');
  const [selectedOrder, setSelectedOrder] = useSessionState<Order | null>('admin_selectedOrder', null);
  const [isEditingProduct, setIsEditingProduct] = useSessionState('admin_isEditingProduct', false);
  const [editingProduct, setEditingProduct] = useSessionState<Partial<Product>>('admin_editingProduct', {});
  const [productSearch, setProductSearch] = useSessionState('admin_productSearch', '');
  const [newTitle, setNewTitle] = useSessionState('admin_newTitle', '');
  const [newContent, setNewContent] = useSessionState('admin_newContent', '');
  
  // Blog State
  const [isEditingBlog, setIsEditingBlog] = useSessionState('admin_isEditingBlog', false);
  const [editingBlogPost, setEditingBlogPost] = useSessionState<Partial<BlogPost>>('admin_editingBlogPost', {});
  
  const [tempSettings, setTempSettings] = useState(settings);
  const [sidebarOpen, setSidebarOpen] = useSessionState('admin_sidebarOpen', true);

  // File Manager State
  const [cloudFiles, setCloudFiles] = useState<{key: string, size: number, lastModified: string, url: string}[]>([]);
  const [cloudFolders, setCloudFolders] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [isFetchingFiles, setIsFetchingFiles] = useState(false);
  const [fileViewMode, setFileViewMode] = useState<'grid' | 'list'>('grid');
  const [fileCurrentPage, setFileCurrentPage] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  
  const fetchCloudFiles = async (prefix: string = '') => {
    setIsFetchingFiles(true);
    try {
      const res = await fetch(`/api/manage-files?prefix=${encodeURIComponent(prefix)}`);
      if (res.ok) {
        const data = await res.json();
        setCloudFiles(data.files || []);
        setCloudFolders(data.folders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingFiles(false);
      setSelectedFiles([]);
      setFileCurrentPage(1);
    }
  };

  const deleteCloudFiles = async (keys: string[]) => {
    if (!window.confirm(language === 'vi' ? `Xóa ${keys.length} file?` : `Delete ${keys.length} files?`)) return;
    try {
      const res = await fetch(`/api/manage-files`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys })
      });
      if (res.ok) {
        showToast(language === 'vi' ? 'Đã xóa file' : 'Files deleted');
        fetchCloudFiles(currentFolder);
      } else {
        showToast(language === 'vi' ? 'Lỗi khi xóa file' : 'Error deleting files');
      }
    } catch (e) {
      console.error(e);
      showToast(language === 'vi' ? 'Lỗi khi xóa file' : 'Error deleting files');
    }
  };

  const renameCloudFile = async (oldKey: string) => {
    const oldName = oldKey.replace(currentFolder, '');
    const newName = window.prompt(language === 'vi' ? 'Nhập tên mới (bao gồm cả phần mở rộng):' : 'Enter new name (including extension):', oldName);
    if (!newName || newName === oldName) return;
    
    const newKey = currentFolder + newName;
    try {
      const res = await fetch(`/api/manage-files`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldKey, newKey })
      });
      if (res.ok) {
        showToast(language === 'vi' ? 'Đã đổi tên file' : 'File renamed');
        fetchCloudFiles(currentFolder);
      } else {
        showToast(language === 'vi' ? 'Lỗi khi đổi tên' : 'Error renaming file');
      }
    } catch (e) {
      console.error(e);
      showToast(language === 'vi' ? 'Lỗi khi đổi tên' : 'Error renaming file');
    }
  };

  useEffect(() => {
    if (activeTab === 'files') {
      fetchCloudFiles(currentFolder);
    }
  }, [activeTab, currentFolder]);

  // ── Dashboard stats ────────────────────────────────────────────────────
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.date?.startsWith(todayStr));
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const craftingCount = orders.filter(o => o.status === 'Crafting').length;
  const shippingCount = orders.filter(o => o.status === 'Shipping').length;
  const topProducts = [...products].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);
  const recentOrders = [...orders].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, 5);

  // ── Filtered orders ───────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = orderSearch === '' || 
        o.customerName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.id?.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    }).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }, [orders, orderSearch, orderStatusFilter]);

  // ── Filtered products ─────────────────────────────────────────────────
  const filteredProducts = useMemo(() =>
    products.filter(p =>
      productSearch === '' ||
      p.name?.vi?.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(productSearch.toLowerCase())
    ), [products, productSearch]);

  const currentDisplayProducts = useMemo(() => 
    filteredProducts.filter(p => activeTab === 'printers' ? p.category === '3d-printer' : p.category !== '3d-printer'),
  [filteredProducts, activeTab]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleOpenAddProduct = () => {
    setEditingProduct({
      name: { vi: '', en: '' }, description: { vi: '', en: '' },
      price: 0, stock: 0, category: activeTab === 'printers' ? '3d-printer' : 'Classic',
      images: [''], estimatedPrintTime: '2-4 days',
      rating: 5, reviews: 0, likes: 0,
      availableSizes: ['Size 300', 'Size 400', 'Size 1000']
    });
    setIsEditingProduct(true);
  };

  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);

  const handleAIFill = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAILoading(true);

    try {
      // Convert image to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // strip data:image/xxx;base64, prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 1. Upload the image to S3 to get a URL for the cover photo
      const uploadUrlRes = await fetch('/api/get-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type })
      });
      let coverImageUrl = '';
      if (uploadUrlRes.ok) {
        const { signedUrl, publicUrl } = await uploadUrlRes.json();
        await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        coverImageUrl = publicUrl;
      }

      // 2. Call AI description API
      const aiRes = await fetch('/api/ai-describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type })
      });

      if (!aiRes.ok) {
        throw new Error('AI API failed');
      }

      const { result } = await aiRes.json();

      // 3. Auto-fill the form
      setEditingProduct(prev => ({
        ...prev,
        name: { vi: result.nameVi || '', en: result.nameEn || '' },
        description: { vi: result.descriptionVi || '', en: result.descriptionEn || '' },
        category: result.category || 'Classic',
        availableMaterials: result.materials ? result.materials.split(',').map((s: string) => s.trim()).filter(Boolean) : ['PLA'],
        price: result.estimatedPrice ? result.estimatedPrice / 25400 : prev.price,
        dimensions: result.dimensions || '',
        images: coverImageUrl ? [coverImageUrl, ...(prev.images?.slice(1) || [])] : (prev.images || ['']),
      }));

      showToast('🤖 AI đã tự động điền thông tin sản phẩm!');
    } catch (err) {
      console.error('AI fill error:', err);
      showToast('Lỗi AI: Không thể phân tích ảnh. Vui lòng thêm GEMINI_API_KEY vào Vercel.');
    } finally {
      setIsAILoading(false);
      e.target.value = '';
    }
  };

  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'secondary') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setIsUploadingImages(true);
    
    try {
      const currentImages = editingProduct.images || [];
      const cover = currentImages[0] || '';
      let secondary = currentImages.slice(1);
      
      let uploadedUrls: string[] = [];
      for (const file of files) {
        // Request signed URL from our Serverless Function
        const response = await fetch('/api/get-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type })
        });
        
        if (!response.ok) throw new Error('Failed to get signed URL');
        
        const { signedUrl, publicUrl } = await response.json();
        
        // Upload directly to Vietnix S3 using the signed URL
        const uploadRes = await fetch(signedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type }
        });
        
        if (!uploadRes.ok) throw new Error('Failed to upload file to S3');
        
        uploadedUrls.push(publicUrl);
      }

      if (type === 'cover') {
        setEditingProduct({ ...editingProduct, images: [uploadedUrls[0], ...secondary] });
      } else {
        secondary = [...secondary, ...uploadedUrls].slice(0, 10);
        setEditingProduct({ ...editingProduct, images: [cover, ...secondary] });
      }
      
      showToast(language === 'vi' ? `Đã tải lên ${files.length} hình ảnh!` : `Uploaded ${files.length} images!`);
    } catch (err) {
      console.error("Upload error", err);
      showToast(language === 'vi' ? 'Lỗi tải ảnh lên!' : 'Upload failed!');
    } finally {
      setIsUploadingImages(false);
    }
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
      bannerImage: editingBlogPost.bannerImage || '',
      id: editingBlogPost.id || Date.now().toString()
    };

    if (editingBlogPost.id) {
       updateBlogPost(postData as BlogPost);
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
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Khu Vực Quản Trị</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          {user ? 'Tài khoản của bạn không có quyền truy cập trang này.' : 'Vui lòng đăng nhập bằng tài khoản Quản trị viên.'}
        </p>
        
        {!user && (
          <button onClick={loginWithGoogle} className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
            <Key size={18} style={{marginRight:8}}/> Đăng nhập bằng Google
          </button>
        )}
        
        {user && (
          <button onClick={logout} className="btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: 'var(--radius-md)' }}>
            Đăng xuất
          </button>
        )}
      </div>
    );
  }

  // ── Sidebar items ─────────────────────────────────────────────────────
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: 'Đơn hàng', icon: <ShoppingBag size={18} />, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'products', label: 'Sản phẩm', icon: <Package size={18} /> },
    { id: 'printers', label: 'Máy in 3D', icon: <Printer size={18} /> },
    { id: 'blog', label: 'Bài viết', icon: <BookOpen size={18} /> },
    { id: 'files', label: 'Quản lý File', icon: <Folder size={18} /> },
    { id: 'members', label: 'Thành viên', icon: <Users size={18} /> },
    { id: 'settings', label: 'Cài đặt', icon: <Settings size={18} /> },
  ] as const;

  const panelStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem'
  };

  return (
    <div style={{ paddingTop: 0, minHeight: '100vh', display: 'flex', background: 'var(--bg-dark, #050f05)', color: 'var(--color-text)', position: 'relative' }}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} style={{
        width: sidebarOpen ? '220px' : '60px', flexShrink: 0,
        background: 'rgba(10,28,10,0.95)', borderRight: '1px solid var(--glass-border)',
        height: '100vh', position: 'sticky', top: 0,
        display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease, transform 0.3s ease',
        overflow: 'hidden', zIndex: 50
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
      <main style={{ flex: 1, overflowX: 'auto', minWidth: 0 }}>

        {/* ── ADMIN TOP UTILITY NAVBAR ──────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.65rem 1.5rem',
          background: 'rgba(5,15,5,0.95)',
          borderBottom: '1px solid var(--glass-border)',
          flexWrap: 'wrap',
          position: 'sticky', top: 0, zIndex: 9
        }}>
          {/* Left: quick nav */}
          <div style={{ display: 'flex', gap: '0.4rem', flex: 1, flexWrap: 'wrap' }}>
            <button 
              className="admin-mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <Menu size={16} />
            </button>
            <a href="/" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
            >
              <Globe size={14} /> Xem trang chủ
            </a>
            <button
              onClick={() => { localStorage.removeItem('legato_cart'); showToast('Đã xoá cache giỏ hàng!'); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <DatabaseZap size={14} /> Xoá cache giỏ hàng
            </button>
            <button
              onClick={() => exportCSV(orders)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <Download size={14} /> Xuất CSV đơn hàng
            </button>
            <button
              onClick={() => { setActiveTab('settings' as any); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <Settings size={14} /> Cài đặt trang
            </button>
            <button
              onClick={() => { products.forEach(p => updateProduct({ ...p, views: 0, likes: 0 })); showToast('Đã reset thống kê!'); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <RefreshCw size={14} /> Reset thống kê
            </button>
          </div>
          {/* Right: logout */}
          <button
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto', flexShrink: 0 }}
          >
            <LogOut size={14} /> Đăng xuất Admin
          </button>
        </div>

        <div style={{ padding: '2rem' }}>

        {/* ── DASHBOARD TAB ─────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '0.5rem' }}><BarChart2 size={28} style={{marginRight:8}}/> Dashboard</h1>
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

        {/* ── PRODUCTS & PRINTERS TAB ──────────────────────────────────────────── */}
        {(activeTab === 'products' || activeTab === 'printers') && !isEditingProduct && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}>{activeTab === 'printers' ? '<Printer size={28} style={{marginRight:8}}/> Quản lý máy in' : '🏪 Quản lý sản phẩm'}</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{currentDisplayProducts.length} sản phẩm</p>
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
                  {currentDisplayProducts.map(product => (
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
                          {product.stock <= 3 && <AlertTriangle size={14} style={{display:'inline-block', verticalAlign:'middle', marginRight: 4}}/>}{product.stock}
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
          <form onSubmit={handleSaveProduct} className="admin-product-form-wrap">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.75rem' }}>{editingProduct.id ? <span><Edit2 size={24} style={{marginRight:8}}/> Sửa sản phẩm</span> : <span><Plus size={24} style={{marginRight:8}}/> Thêm sản phẩm mới</span>}</h1>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 1.1rem', borderRadius: 'var(--radius-sm)',
                  background: isAILoading ? 'rgba(139, 92, 246, 0.2)' : 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.25))',
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  color: '#c4b5fd', fontWeight: 700, fontSize: '0.875rem',
                  cursor: isAILoading ? 'wait' : 'pointer',
                  boxShadow: isAILoading ? 'none' : '0 0 12px rgba(139,92,246,0.2)',
                  transition: 'all 0.3s'
                }}>
                  {isAILoading ? (<><RefreshCw size={16} className="spin" /> Đang phân tích ảnh...</>) : (<><Sparkles size={16} /> AI Đăng Nhanh</>)}
                  <input type="file" accept="image/*" onChange={handleAIFill} style={{ display: 'none' }} disabled={isAILoading} />
                </label>
                <button type="button" onClick={() => setIsEditingProduct(false)} style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <X size={18} /> Hủy
                </button>
              </div>
            </div>

            {editingProduct.id && (
              <div style={{ ...panelStyle, background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>SKU</p>
                <p style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--color-accent)', fontSize: '1.1rem' }}>{editingProduct.sku || 'Chưa có SKU'}</p>
              </div>
            )}

            {/* Two-column layout */}
            <div className="admin-product-form-grid">

              {/* ── LEFT: Main content ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Basic info */}
                <div style={panelStyle}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>📝 Thông tin cơ bản</h3>
                  <div className="admin-form-2col">
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

                {/* Images */}
                <div style={panelStyle}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>🖼 Hình ảnh & Video</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <InputField label={
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span>Ảnh bìa (1 hình đại diện) *</span>
                          <label style={{ cursor: isUploadingImages ? 'wait' : 'pointer', background: 'var(--color-accent)', color: '#000', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {isUploadingImages ? <RefreshCw size={12} className="spin" /> : <Plus size={12} />}
                            Tải ảnh bìa lên
                            <input type="file" accept="image/*" onChange={(e) => handleUploadFiles(e, 'cover')} style={{ display: 'none' }} disabled={isUploadingImages} />
                          </label>
                        </div>
                      }>
                        <input type="text" required placeholder="URL Ảnh bìa..." value={editingProduct.images?.[0] || ''} onChange={e => { const newImages = [...(editingProduct.images || [])]; newImages[0] = e.target.value; setEditingProduct({...editingProduct, images: newImages}); }} style={inputStyle} />
                      </InputField>
                      <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', display: 'inline-block' }}>
                        <img src={editingProduct.images?.[0] || '/images/fallback-logo.jpg'} style={{ height: '80px', width: '80px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '2px' }} alt="cover preview" />
                      </div>
                    </div>

                    <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                      <InputField label={
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span>Ảnh phụ (tối đa 10 ảnh, mỗi dòng 1 link)</span>
                          <label style={{ cursor: isUploadingImages ? 'wait' : 'pointer', background: 'rgba(255,255,255,0.1)', color: 'var(--color-text)', border: '1px solid var(--glass-border)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {isUploadingImages ? <RefreshCw size={12} className="spin" /> : <Plus size={12} />}
                            Tải ảnh phụ
                            <input type="file" multiple accept="image/*" onChange={(e) => handleUploadFiles(e, 'secondary')} style={{ display: 'none' }} disabled={isUploadingImages} />
                          </label>
                        </div>
                      }>
                        <textarea placeholder="/images/phu-1.png&#10;/images/phu-2.png" rows={4} value={(editingProduct.images?.slice(1) || []).join('\n')} onChange={e => { const cover = editingProduct.images?.[0] || ''; const secondary = e.target.value.split('\n').map(s => s.trim()).filter(s => s).slice(0, 10); setEditingProduct({...editingProduct, images: [cover, ...secondary]}); }} style={{...inputStyle, resize: 'vertical'}} />
                      </InputField>
                      <div className="admin-image-grid" style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                        {Array.from({ length: 10 }).map((_, idx) => {
                          const img = editingProduct.images?.[idx + 1];
                          return (
                            <div key={idx} style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                              {img ? (
                                <>
                                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} alt={`secondary preview ${idx}`} />
                                  <button type="button" onClick={() => { const newSecondary = [...(editingProduct.images?.slice(1) || [])]; newSecondary.splice(idx, 1); setEditingProduct({...editingProduct, images: [editingProduct.images?.[0] || '', ...newSecondary]}); }} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                                </>
                              ) : (
                                <div style={{ opacity: 0.3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <img src="/images/fallback-logo.jpg" style={{ width: '24px', height: '24px', filter: 'grayscale(100%)' }} alt="placeholder" />
                                  <span style={{ fontSize: '0.6rem', marginTop: '4px' }}>{idx + 1}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                      <InputField label="URL Video (tùy chọn)">
                        <input type="text" placeholder="https://..." value={editingProduct.video || ''} onChange={e => setEditingProduct({...editingProduct, video: e.target.value})} style={inputStyle} />
                      </InputField>
                      
                      <div style={{ marginTop: '1.5rem' }}>
                        <InputField label="Banner Sản Phẩm (Tùy chọn, tỉ lệ 16:3)">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input type="text" placeholder="URL banner..." value={editingProduct.bannerImage || ''} onChange={e => setEditingProduct({...editingProduct, bannerImage: e.target.value})} style={inputStyle} />
                            <input 
                              type="file" 
                              accept="image/*" 
                              id="product-banner-upload"
                              style={{ display: 'none' }}
                              disabled={isUploadingImages}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                
                                setIsUploadingImages(true);
                                try {
                                  const response = await fetch('/api/get-upload-url', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ filename: file.name, contentType: file.type })
                                  });
                                  if (!response.ok) throw new Error('Failed to get signed URL');
                                  const { signedUrl, publicUrl } = await response.json();
                                  
                                  const uploadRes = await fetch(signedUrl, {
                                    method: 'PUT',
                                    body: file,
                                    headers: { 'Content-Type': file.type }
                                  });
                                  if (!uploadRes.ok) throw new Error('Failed to upload file to S3');
                                  
                                  setEditingProduct({...editingProduct, bannerImage: publicUrl});
                                  showToast(language === 'vi' ? 'Đã tải lên banner!' : 'Uploaded banner!');
                                } catch (err) {
                                  console.error("Upload error", err);
                                  showToast(language === 'vi' ? 'Lỗi tải ảnh lên!' : 'Upload failed!');
                                } finally {
                                  setIsUploadingImages(false);
                                }
                              }}
                            />
                            <label htmlFor="product-banner-upload" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--glass-border)', cursor: isUploadingImages ? 'wait' : 'pointer', color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(74,222,128,0.05)' }}>
                              {isUploadingImages ? <RefreshCw size={14} className="spin" /> : '📁'} {isUploadingImages ? 'Đang tải lên...' : 'Chọn banner từ máy tính'}
                            </label>
                            {editingProduct.bannerImage && (
                              <div style={{ marginTop: '0.5rem', position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                                <img src={editingProduct.bannerImage} alt="Banner Preview" style={{ height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--glass-border)', aspectRatio: '16/3' }} />
                                <button type="button" onClick={() => setEditingProduct({...editingProduct, bannerImage: ''})} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                              </div>
                            )}
                          </div>
                        </InputField>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit row */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                    {editingProduct.id ? <span><Save size={16} style={{marginRight:6}}/> Lưu thay đổi</span> : <span><Plus size={16} style={{marginRight:6}}/> Thêm sản phẩm</span>}
                  </button>
                  <button type="button" onClick={() => setIsEditingProduct(false)} style={{ padding: '0.875rem 1.5rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)' }}>Hủy</button>
                </div>
              </div>

              {/* ── RIGHT SIDEBAR: Giá & Tồn kho ── */}
              <div className="admin-product-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '1rem' }}>

                {/* Pricing */}
                <div style={{ ...panelStyle, padding: '1rem' }}>
                  <h3 style={{ marginBottom: '0.875rem', color: 'var(--color-accent)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    💰 Giá & Loại bán
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <InputField label="Danh mục *">
                      <select value={editingProduct.category || ''} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} style={inputStyle}>
                        {['Classic', 'Superheroes', 'Sci-Fi', 'Fantasy', 'Anime'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </InputField>
                    <InputField label="Giá (VNĐ) *">
                      <input type="number" required step="1000" value={(editingProduct.price || 0) * 25400} onChange={e => setEditingProduct({...editingProduct, price: (parseFloat(e.target.value) || 0) / 25400})} style={inputStyle} />
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

                {/* Stock & logistics */}
                <div style={{ ...panelStyle, padding: '1rem' }}>
                  <h3 style={{ marginBottom: '0.875rem', color: 'var(--color-accent)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📦 Tồn kho & Giao hàng
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <InputField label="Nguồn hàng *">
                      <select value={editingProduct.isReadyStock ? 'ready' : 'crafting'} onChange={e => setEditingProduct({...editingProduct, isReadyStock: e.target.value === 'ready'})} style={inputStyle}>
                        <option value="crafting">Chế tác (In 3D)</option>
                        <option value="ready">Hàng sẵn</option>
                      </select>
                    </InputField>
                    {editingProduct.isReadyStock ? (
                      <InputField label="Số lượng sẵn có *">
                        <input type="number" required min="0" value={editingProduct.stock || 0} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} style={inputStyle} />
                      </InputField>
                    ) : (
                      <InputField label="Thời gian chế tác *">
                        <input type="text" required placeholder="vd: 2-4 days" value={editingProduct.estimatedPrintTime || ''} onChange={e => setEditingProduct({...editingProduct, estimatedPrintTime: e.target.value})} style={inputStyle} />
                      </InputField>
                    )}
                    <InputField label="Cân nặng">
                      <input type="text" placeholder="vd: 500g" value={editingProduct.weight || ''} onChange={e => setEditingProduct({...editingProduct, weight: e.target.value})} style={inputStyle} />
                    </InputField>
                  </div>
                </div>

                {/* Materials - add/edit/delete */}
                <div style={{ ...panelStyle, padding: '1rem' }}>
                  <h3 style={{ marginBottom: '0.875rem', color: 'var(--color-accent)', fontSize: '0.95rem' }}>🧪 Loại nhựa</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(editingProduct.availableMaterials || []).map((mat, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={mat}
                          onChange={e => {
                            const arr = [...(editingProduct.availableMaterials || [])];
                            arr[idx] = e.target.value;
                            setEditingProduct({...editingProduct, availableMaterials: arr});
                          }}
                          style={{ ...inputStyle, flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        />
                        <button type="button" onClick={() => {
                          const arr = [...(editingProduct.availableMaterials || [])];
                          arr.splice(idx, 1);
                          setEditingProduct({...editingProduct, availableMaterials: arr});
                        }} style={{ padding: '0.35rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setEditingProduct({...editingProduct, availableMaterials: [...(editingProduct.availableMaterials || []), '']})}
                      style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', background: 'rgba(74,222,128,0.08)', border: '1px dashed rgba(74,222,128,0.3)', borderRadius: '4px', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Plus size={13} /> Thêm loại nhựa
                    </button>
                  </div>
                </div>

                {/* Sizes - add/edit/delete */}
                <div style={{ ...panelStyle, padding: '1rem' }}>
                  <h3 style={{ marginBottom: '0.875rem', color: 'var(--color-accent)', fontSize: '0.95rem' }}>📐 Kích thước có sẵn</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(editingProduct.availableSizes || []).map((sz, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={sz}
                          onChange={e => {
                            const arr = [...(editingProduct.availableSizes || [])] as string[];
                            arr[idx] = e.target.value;
                            setEditingProduct({...editingProduct, availableSizes: arr as any});
                          }}
                          style={{ ...inputStyle, flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        />
                        <button type="button" onClick={() => {
                          const arr = [...(editingProduct.availableSizes || [])] as string[];
                          arr.splice(idx, 1);
                          setEditingProduct({...editingProduct, availableSizes: arr as any});
                        }} style={{ padding: '0.35rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setEditingProduct({...editingProduct, availableSizes: [...(editingProduct.availableSizes || []), 'Size 300'] as any})}
                      style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', background: 'rgba(74,222,128,0.08)', border: '1px dashed rgba(74,222,128,0.3)', borderRadius: '4px', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Plus size={13} /> Thêm kích thước
                    </button>
                  </div>
                </div>

                {/* Dimensions display */}
                <div style={{ ...panelStyle, padding: '1rem' }}>
                  <h3 style={{ marginBottom: '0.875rem', color: 'var(--color-accent)', fontSize: '0.95rem' }}>📏 Kích thước sản phẩm</h3>
                  <InputField label="Kích thước (LxWxH)">
                    <select value={editingProduct.dimensions || ''} onChange={e => setEditingProduct({...editingProduct, dimensions: e.target.value})} style={inputStyle}>
                      <option value="">Tùy chỉnh (Nhập tay)...</option>
                      <option value="300% (21cm)">300% (21cm)</option>
                      <option value="400% (28cm)">400% (28cm)</option>
                      <option value="1000% (70cm)">1000% (70cm)</option>
                    </select>
                  </InputField>
                  {(!editingProduct.dimensions || editingProduct.dimensions === '') && (
                    <input type="text" placeholder="vd: 15x10x25cm" value={''} onChange={e => setEditingProduct({...editingProduct, dimensions: e.target.value})} style={{ ...inputStyle, marginTop: '0.5rem' }} />
                  )}
                </div>

              </div>
            </div>
          </form>
        )}

        {/* ── BLOG TAB ──────────────────────────────────────────────── */}
        {activeTab === 'blog' && !isEditingBlog && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}><BookOpen size={28} style={{marginRight:8}}/> Quản lý bài viết</h1>
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
              <h1 style={{ fontSize: '1.75rem' }}>{editingBlogPost.id ? <span><Edit2 size={24} style={{marginRight:8}}/> Chỉnh sửa bài viết</span> : '✍️ Viết bài mới'}</h1>
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
                  <InputField label="Ảnh bìa (Upload từ máy tính)">
                    <div>
                      <input 
                        type="file" 
                        accept="image/*"
                        id="blog-cover-upload"
                        style={{ display: 'none' }}
                        disabled={isUploadingImages}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          setIsUploadingImages(true);
                          try {
                            const response = await fetch('/api/get-upload-url', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ filename: file.name, contentType: file.type })
                            });
                            if (!response.ok) throw new Error('Failed to get signed URL');
                            const { signedUrl, publicUrl } = await response.json();
                            
                            const uploadRes = await fetch(signedUrl, {
                              method: 'PUT',
                              body: file,
                              headers: { 'Content-Type': file.type }
                            });
                            if (!uploadRes.ok) throw new Error('Failed to upload file to S3');
                            
                            setEditingBlogPost({...editingBlogPost, image: publicUrl});
                            showToast(language === 'vi' ? 'Đã tải lên ảnh bìa!' : 'Uploaded cover image!');
                          } catch (err) {
                            console.error("Upload error", err);
                            showToast(language === 'vi' ? 'Lỗi tải ảnh lên!' : 'Upload failed!');
                          } finally {
                            setIsUploadingImages(false);
                          }
                        }}
                      />
                      <label htmlFor="blog-cover-upload" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--glass-border)', cursor: isUploadingImages ? 'wait' : 'pointer', color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(74,222,128,0.05)' }}>
                        {isUploadingImages ? <RefreshCw size={14} className="spin" /> : '📁'} {isUploadingImages ? 'Đang tải lên...' : 'Chọn ảnh từ máy tính'}
                      </label>
                      {editingBlogPost.image && (
                        <div style={{ marginTop: '0.5rem', position: 'relative', display: 'inline-block' }}>
                          <img src={editingBlogPost.image} alt="Preview" style={{ height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} />
                          <button type="button" onClick={() => setEditingBlogPost({...editingBlogPost, image: ''})} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                      )}
                    </div>
                  </InputField>
                  <InputField label="Banner Bài Viết (Tùy chọn, tỉ lệ 16:3)">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input type="text" placeholder="URL banner..." value={editingBlogPost.bannerImage || ''} onChange={e => setEditingBlogPost({...editingBlogPost, bannerImage: e.target.value})} style={inputStyle} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="blog-banner-upload"
                        style={{ display: 'none' }}
                        disabled={isUploadingImages}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          setIsUploadingImages(true);
                          try {
                            const response = await fetch('/api/get-upload-url', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ filename: file.name, contentType: file.type })
                            });
                            if (!response.ok) throw new Error('Failed to get signed URL');
                            const { signedUrl, publicUrl } = await response.json();
                            
                            const uploadRes = await fetch(signedUrl, {
                              method: 'PUT',
                              body: file,
                              headers: { 'Content-Type': file.type }
                            });
                            if (!uploadRes.ok) throw new Error('Failed to upload file to S3');
                            
                            setEditingBlogPost({...editingBlogPost, bannerImage: publicUrl});
                            showToast(language === 'vi' ? 'Đã tải lên banner!' : 'Uploaded banner!');
                          } catch (err) {
                            console.error("Upload error", err);
                            showToast(language === 'vi' ? 'Lỗi tải ảnh lên!' : 'Upload failed!');
                          } finally {
                            setIsUploadingImages(false);
                          }
                        }}
                      />
                      <label htmlFor="blog-banner-upload" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--glass-border)', cursor: isUploadingImages ? 'wait' : 'pointer', color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(74,222,128,0.05)' }}>
                        {isUploadingImages ? <RefreshCw size={14} className="spin" /> : '📁'} {isUploadingImages ? 'Đang tải lên...' : 'Chọn banner từ máy tính'}
                      </label>
                      {editingBlogPost.bannerImage && (
                        <div style={{ marginTop: '0.5rem', position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                          <img src={editingBlogPost.bannerImage} alt="Banner Preview" style={{ height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--glass-border)', aspectRatio: '16/3' }} />
                          <button type="button" onClick={() => setEditingBlogPost({...editingBlogPost, bannerImage: ''})} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                      )}
                    </div>
                  </InputField>
                  <InputField label="Ngày đăng">
                    <input type="date" required value={editingBlogPost.date || new Date().toISOString().split('T')[0]} onChange={e => setEditingBlogPost({...editingBlogPost, date: e.target.value})} style={inputStyle} />
                  </InputField>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nội dung bài viết *
                  </label>
                  <div style={{ background: '#fff', color: '#111', borderRadius: '4px', overflow: 'hidden', minHeight: '480px' }}>
                    <ReactQuill 
                      theme="snow" 
                      value={editingBlogPost.content || ''} 
                      onChange={content => setEditingBlogPost({...editingBlogPost, content})} 
                      style={{ height: '400px', border: 'none', color: '#111', background: '#fff' }}
                      modules={QUILL_MODULES}
                    />
                  </div>
                </div>

              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ padding: '0.875rem 2rem' }}>
                  {editingBlogPost.id ? <span><Save size={16} style={{marginRight:6}}/> Cập nhật bài viết</span> : '🚀 Đăng bài viết'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* ── FILES TAB ─────────────────────────────────────────────── */}
        {activeTab === 'files' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}><Folder size={28} style={{marginRight:8}}/> Quản lý File (Vietnix S3)</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{cloudFiles.length} tệp trong thư mục hiện tại</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {selectedFiles.length > 0 && (
                  <button className="btn-primary" onClick={() => deleteCloudFiles(selectedFiles)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', background: '#ef4444', border: 'none', color: '#fff' }}>
                    <Trash2 size={16} /> Xóa {selectedFiles.length} file
                  </button>
                )}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', padding: '0.2rem' }}>
                  <button onClick={() => setFileViewMode('grid')} style={{ padding: '0.4rem 0.6rem', border: 'none', background: fileViewMode === 'grid' ? 'rgba(74,222,128,0.2)' : 'transparent', color: fileViewMode === 'grid' ? 'var(--color-accent)' : 'var(--color-text-muted)', borderRadius: '4px', cursor: 'pointer' }}><LayoutGrid size={16} /></button>
                  <button onClick={() => setFileViewMode('list')} style={{ padding: '0.4rem 0.6rem', border: 'none', background: fileViewMode === 'list' ? 'rgba(74,222,128,0.2)' : 'transparent', color: fileViewMode === 'list' ? 'var(--color-accent)' : 'var(--color-text-muted)', borderRadius: '4px', cursor: 'pointer' }}><List size={16} /></button>
                </div>
                <button className="btn-primary" onClick={() => fetchCloudFiles(currentFolder)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}>
                  <RefreshCw size={18} className={isFetchingFiles ? 'spin' : ''} /> Tải lại
                </button>
              </div>
            </div>
            
            <div style={panelStyle}>
              {currentFolder && (
                <button onClick={() => {
                  const parts = currentFolder.split('/').filter(Boolean);
                  parts.pop();
                  setCurrentFolder(parts.length > 0 ? parts.join('/') + '/' : '');
                }} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--color-text)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> Quay lại (.. /)
                </button>
              )}
              
              {fileViewMode === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {cloudFolders.map(folder => {
                    const displayName = folder.replace(currentFolder, '').replace(/\/$/, '');
                    return (
                      <div key={folder} onClick={() => setCurrentFolder(folder)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                        <Folder size={24} color="var(--color-accent)" />
                        <span style={{ fontWeight: 600, wordBreak: 'break-all' }}>{displayName}</span>
                      </div>
                    );
                  })}
                  
                  {(() => {
                    const startIndex = (fileCurrentPage - 1) * 20;
                    return cloudFiles.slice(startIndex, startIndex + 20).map(file => {
                      const isSelected = selectedFiles.includes(file.key);
                      return (
                        <div key={file.key} style={{ background: isSelected ? 'rgba(74,222,128,0.1)' : 'rgba(0,0,0,0.3)', border: isSelected ? '1px solid var(--color-accent)' : '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                          <input type="checkbox" checked={isSelected} onChange={e => {
                            if (e.target.checked) setSelectedFiles([...selectedFiles, file.key]);
                            else setSelectedFiles(selectedFiles.filter(k => k !== file.key));
                          }} style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2, cursor: 'pointer', width: '18px', height: '18px', accentColor: 'var(--color-accent)' }} />
                          <div style={{ height: '140px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {file.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                              <img src={file.url} alt="" onClick={() => window.open(file.url, '_blank')} style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                              <DatabaseZap size={40} color="var(--color-text-muted)" />
                            )}
                            <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '0.4rem' }}>
                              <button onClick={() => renameCloudFile(file.key)} style={{ background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                                <Edit2 size={13} />
                              </button>
                              <button onClick={() => deleteCloudFiles([file.key])} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div style={{ padding: '0.75rem', fontSize: '0.75rem' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={file.key}>{file.key.replace(currentFolder, '')}</div>
                            <div style={{ color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                              <span>{(file.size / 1024).toFixed(1)} KB</span>
                              <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '0.75rem 1rem', width: '40px' }}>
                          <input type="checkbox" onChange={e => {
                            if (e.target.checked) {
                              const startIndex = (fileCurrentPage - 1) * 20;
                              const visibleFiles = cloudFiles.slice(startIndex, startIndex + 20).map(f => f.key);
                              setSelectedFiles(Array.from(new Set([...selectedFiles, ...visibleFiles])));
                            } else {
                              const startIndex = (fileCurrentPage - 1) * 20;
                              const visibleFiles = cloudFiles.slice(startIndex, startIndex + 20).map(f => f.key);
                              setSelectedFiles(selectedFiles.filter(k => !visibleFiles.includes(k)));
                            }
                          }} checked={cloudFiles.length > 0 && (() => {
                            const startIndex = (fileCurrentPage - 1) * 20;
                            const visibleFiles = cloudFiles.slice(startIndex, startIndex + 20);
                            return visibleFiles.length > 0 && visibleFiles.every(f => selectedFiles.includes(f.key));
                          })()} style={{ accentColor: 'var(--color-accent)' }} />
                        </th>
                        <th style={{ padding: '0.75rem 1rem' }}>Tên tệp/Thư mục</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Kích thước</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Ngày sửa đổi</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cloudFolders.map(folder => (
                        <tr key={folder} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '0.75rem 1rem' }}></td>
                          <td style={{ padding: '0.75rem 1rem', cursor: 'pointer', fontWeight: 600 }} onClick={() => setCurrentFolder(folder)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Folder size={18} color="var(--color-accent)" />
                              {folder.replace(currentFolder, '').replace(/\/$/, '')}
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>—</td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>—</td>
                          <td style={{ padding: '0.75rem 1rem' }}></td>
                        </tr>
                      ))}
                      
                      {(() => {
                        const startIndex = (fileCurrentPage - 1) * 20;
                        return cloudFiles.slice(startIndex, startIndex + 20).map(file => {
                          const isSelected = selectedFiles.includes(file.key);
                          return (
                            <tr key={file.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isSelected ? 'rgba(74,222,128,0.05)' : 'transparent' }}>
                              <td style={{ padding: '0.75rem 1rem' }}>
                                <input type="checkbox" checked={isSelected} onChange={e => {
                                  if (e.target.checked) setSelectedFiles([...selectedFiles, file.key]);
                                  else setSelectedFiles(selectedFiles.filter(k => k !== file.key));
                                }} style={{ accentColor: 'var(--color-accent)' }} />
                              </td>
                              <td style={{ padding: '0.75rem 1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  {file.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                    <img src={file.url} alt="" style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '4px' }} />
                                  ) : (
                                    <DatabaseZap size={18} color="var(--color-text-muted)" />
                                  )}
                                  <a href={file.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text)', textDecoration: 'none', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {file.key.replace(currentFolder, '')}
                                  </a>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{(file.size / 1024).toFixed(1)} KB</td>
                              <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{new Date(file.lastModified).toLocaleDateString()} {new Date(file.lastModified).toLocaleTimeString()}</td>
                              <td style={{ padding: '0.75rem 1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button onClick={() => renameCloudFile(file.key)} style={{ color: 'var(--color-accent)', padding: '0.35rem 0.5rem', background: 'rgba(74,222,128,0.1)', borderRadius: '4px', border: '1px solid rgba(74,222,128,0.2)' }}>
                                    <Edit2 size={14} />
                                  </button>
                                  <button onClick={() => deleteCloudFiles([file.key])} style={{ color: '#ef4444', padding: '0.35rem 0.5rem', background: 'rgba(239,68,68,0.1)', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)' }}>
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Pagination Controls */}
              {cloudFiles.length > 20 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                  <button onClick={() => setFileCurrentPage(Math.max(1, fileCurrentPage - 1))} disabled={fileCurrentPage === 1} style={{ padding: '0.5rem 1rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: fileCurrentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text)', border: '1px solid var(--glass-border)', cursor: fileCurrentPage === 1 ? 'not-allowed' : 'pointer' }}>
                    Trang trước
                  </button>
                  <span style={{ fontSize: '0.875rem' }}>
                    Trang {fileCurrentPage} / {Math.ceil(cloudFiles.length / 20)}
                  </span>
                  <button onClick={() => setFileCurrentPage(Math.min(Math.ceil(cloudFiles.length / 20), fileCurrentPage + 1))} disabled={fileCurrentPage === Math.ceil(cloudFiles.length / 20)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: fileCurrentPage === Math.ceil(cloudFiles.length / 20) ? 'var(--color-text-muted)' : 'var(--color-text)', border: '1px solid var(--glass-border)', cursor: fileCurrentPage === Math.ceil(cloudFiles.length / 20) ? 'not-allowed' : 'pointer' }}>
                    Trang sau
                  </button>
                </div>
              )}
              
              {!isFetchingFiles && cloudFiles.length === 0 && cloudFolders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  Thư mục trống
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* ── MEMBERS TAB ───────────────────────────────────────────── */}
        {activeTab === 'members' && (
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '1.5rem' }}><Users size={28} style={{marginRight:8}}/> Quản lý thành viên</h1>
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
            <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '1.5rem' }}><Settings size={28} style={{marginRight:8}}/> Cài đặt Website</h1>
            
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

            <div style={panelStyle}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Banner Giữa (Thay thế Video Thực Tế)</h3>
              <InputField label="Upload Ảnh Banner Giữa">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {tempSettings.middleBannerImage && (
                    <img src={tempSettings.middleBannerImage} alt="Middle Banner" style={{ height: '60px', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
                  )}
                  <input type="text" value={tempSettings.middleBannerImage || ''} onChange={e => setTempSettings({...tempSettings, middleBannerImage: e.target.value})} placeholder="URL ảnh banner hoặc tải lên" style={{ ...inputStyle, flex: 1 }} />
                  <label style={{ cursor: isUploadingImages ? 'wait' : 'pointer', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', padding: '0.6rem 1rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                    {isUploadingImages ? 'Đang tải...' : 'Tải ảnh lên'}
                    <input type="file" accept="image/*" onChange={async (e) => {
                      if (!e.target.files?.length) return;
                      // using the same upload logic as other images but setting directly
                      // wait, handleUploadFiles is for products. Let's write a small inline uploader using the api.
                      setIsUploadingImages(true);
                      try {
                        const file = e.target.files[0];
                        const res = await fetch(`/api/get-upload-url?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
                        const { uploadUrl, fileUrl } = await res.json();
                        await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
                        setTempSettings({...tempSettings, middleBannerImage: fileUrl});
                      } catch(err) {
                        console.error('Upload failed', err);
                        alert('Upload failed');
                      } finally {
                        setIsUploadingImages(false);
                      }
                    }} style={{ display: 'none' }} disabled={isUploadingImages} />
                  </label>
                </div>
              </InputField>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '0.875rem 2.5rem' }}>💾 Lưu cài đặt</button>
          </form>
        )}

        </div>
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
