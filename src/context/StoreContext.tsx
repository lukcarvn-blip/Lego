import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { mockBlogPosts } from '../data/mockBlogPosts';
import type { Product, ProductSize } from '../data/mockProducts';
import { translations } from '../i18n/translations';
import type { Language } from '../i18n/translations';
import { auth, googleProvider, db } from '../config/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
export type OrderStatus = 'Pending' | 'Crafting' | 'Shipping' | 'Delivered';

export type ProductMaterial = 'PLA' | 'PETG';

export interface CartItem {
  product: Product;
  size: ProductSize;
  material: ProductMaterial;
  quantity: number;
  isFastCrafting?: boolean;
  engravingText?: string;
  micaBox?: string;
  isSelfAssembly?: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  customerName: string;
  userId?: string;
  paymentMethod?: string;
}

export interface SavedCart {
  id: string;
  date: string;
  items: CartItem[];
  expiresIn: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  date: string;
  read: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  bannerImage?: string; // Additional banner image (16:3) for the post details
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'user';
  joinDate: string;
}


export interface CollectionItem {
  name: string;
  iconName: string;
  color: string;
  bg: string;
  border: string;
  path: string;
  image?: string;
}

export interface StoreSettings {
  logoText: string;
  logoImage?: string; // Optional image URL
  heroVideoUrl: string;
  contactHotline?: string;
  contactEmail?: string;
  contactAddress?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialTiktok?: string;
  socialYoutube?: string;
  seoTitle?: string;
  seoDescription?: string;
  favicon?: string;
  bannerText?: string;
  middleBannerImage?: string; // Banner replacing video shorts
  middleBannerImageMobile?: string; // Banner for mobile
  bankName?: string;
  bankAccount?: string;
  bankOwner?: string;
  siteTheme?: string;
  adminTheme?: string;
  applyThemeScope?: 'global' | 'storefront' | 'admin';
  customColors?: {
    bg?: string;
    bgLight?: string;
    accent?: string;
    text?: string;
  };
  customFonts?: {
    heading?: string;
    body?: string;
  };
  collections?: CollectionItem[];
}

export interface ToastMessage {
  id: string;
  message: string;
}

interface StoreContextType {
  products: Product[];
  isDataLoading: boolean;
  dataError: string | null;
  updateProduct: (updated: Product) => void;
  cart: CartItem[];
  addToCart: (product: Product, size: ProductSize, material: ProductMaterial, quantity: number, e?: React.MouseEvent, isFastCrafting?: boolean, engravingText?: string, micaBox?: string, isSelfAssembly?: boolean) => void;
  removeFromCart: (productId: string, size: ProductSize, material: ProductMaterial, isFastCrafting?: boolean, engravingText?: string, micaBox?: string, isSelfAssembly?: boolean) => void;
  clearCart: () => void;
  orders: Order[];
  savedCarts: SavedCart[];
  notifications: Notification[];
  createOrder: (customerName: string, paymentMethod?: string, additionalInfo?: any) => Promise<string | null>;
  updateOrder: (orderId: string, data: any) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id'>) => Promise<void>;
  updateBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['vi']) => string;
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  previewSettings: StoreSettings | null;
  setPreviewSettings: (settings: StoreSettings | null) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  formatPrice: (priceUSD: number, discountPercentage?: number) => { original: string, current: string, isOnSale: boolean };
  toasts: ToastMessage[];
  showToast: (message: string) => void;
  removeToast: (id: string) => void;
  user: any;
  appUsers: AppUser[];
  currentUserRole: 'admin' | 'user';
  updateUserRole: (uid: string, newRole: 'admin' | 'user') => void;
  deleteUser: (uid: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [previewSettings, setPreviewSettings] = useState<StoreSettings | null>(null);
  const [settings, setSettings] = useState<StoreSettings>({
    logoText: 'LEGATO',
    logoImage: '/images/custom-logo.png',
    heroVideoUrl: 'https://cdn.pixabay.com/video/2021/08/04/83894-585141019_large.mp4',
    contactHotline: '0586339686',
    contactEmail: 'legatorvn@gmail.com',
    contactAddress: 'Số 44 Đường 13 - LakeView City,\nBình Trưng Đông, Tp.Hồ Chí Minh',
    socialFacebook: 'https://facebook.com',
    socialInstagram: 'https://instagram.com',
    socialTiktok: 'https://tiktok.com',
    socialYoutube: 'https://youtube.com',
    seoTitle: 'LEGATO - Khám phá thế giới sáng tạo',
    seoDescription: 'Cửa hàng đồ chơi thông minh và mô hình xếp khối sáng tạo hàng đầu.',
    bankName: 'vietcombank',
    bankAccount: '9931028868',
    bankOwner: 'LE NHAT HOANG',
    collections: [
    { name: 'Marvel', iconName: 'Shield', color: '#e23636', bg: 'rgba(226,54,54,0.1)', border: 'rgba(226,54,54,0.3)', path: '/category/superheroes?q=marvel' },
    { name: 'DC Comics', iconName: 'Moon', color: '#0074e4', bg: 'rgba(0,116,228,0.1)', border: 'rgba(0,116,228,0.3)', path: '/category/superheroes?q=dc' },
    { name: 'Star Wars', iconName: 'Star', color: '#ffe81f', bg: 'rgba(255,232,31,0.1)', border: 'rgba(255,232,31,0.3)', path: '/category/sci-fi?q=starwars' },
    { name: 'Harry Potter', iconName: 'Wand2', color: '#9c59b6', bg: 'rgba(156,89,182,0.1)', border: 'rgba(156,89,182,0.3)', path: '/category/fantasy?q=harrypotter' },
    { name: 'Avengers', iconName: 'Zap', color: '#c0392b', bg: 'rgba(192,57,43,0.1)', border: 'rgba(192,57,43,0.3)', path: '/category/superheroes?q=avengers' },
    { name: 'Anime', iconName: 'Swords', color: '#e91e8c', bg: 'rgba(233,30,140,0.1)', border: 'rgba(233,30,140,0.3)', path: '/category/anime' },
    { name: 'Jurassic', iconName: 'PawPrint', color: '#2ecc71', bg: 'rgba(46,204,113,0.1)', border: 'rgba(46,204,113,0.3)', path: '/category/sci-fi?q=jurassic' },
    { name: 'Ninjago', iconName: 'Swords', color: '#e67e22', bg: 'rgba(230,126,34,0.1)', border: 'rgba(230,126,34,0.3)', path: '/category/classic?q=ninjago' },
    { name: 'Space', iconName: 'Rocket', color: '#3498db', bg: 'rgba(52,152,219,0.1)', border: 'rgba(52,152,219,0.3)', path: '/category/sci-fi?q=space' },
    { name: 'Castle', iconName: 'Castle', color: '#f39c12', bg: 'rgba(243,156,18,0.1)', border: 'rgba(243,156,18,0.3)', path: '/category/fantasy?q=castle' },
    { name: 'City', iconName: 'Building2', color: '#1abc9c', bg: 'rgba(26,188,156,0.1)', border: 'rgba(26,188,156,0.3)', path: '/category/classic?q=city' },
    { name: 'Technic', iconName: 'Settings', color: '#95a5a6', bg: 'rgba(149,165,166,0.1)', border: 'rgba(149,165,166,0.3)', path: '/category/classic?q=technic' },
  ]
  });
  // activeSettings prioritizes previewSettings if it exists
  const activeSettings = previewSettings || settings;

  // Apply theme CSS class to document
  useEffect(() => {
    const isAdminPath = window.location.pathname.startsWith('/admin');
    let theme = 'dark'; // default
    
    if (activeSettings.applyThemeScope === 'admin' && isAdminPath) {
      theme = activeSettings.adminTheme || 'dark';
    } else if (activeSettings.applyThemeScope === 'admin' && !isAdminPath) {
      theme = activeSettings.siteTheme || 'dark';
    } else if (activeSettings.applyThemeScope === 'storefront' && isAdminPath) {
      theme = activeSettings.adminTheme || 'dark'; // Assuming they fallback to separate admin if scope is storefront
    } else if (activeSettings.applyThemeScope === 'storefront' && !isAdminPath) {
      theme = activeSettings.siteTheme || 'dark';
    } else {
      // 'global' or default
      theme = activeSettings.siteTheme || 'dark';
    }
    
    document.documentElement.setAttribute('data-theme', theme);
  }, [activeSettings.siteTheme, activeSettings.adminTheme, activeSettings.applyThemeScope, window.location.pathname]);

  const [language, setLanguage] = useState<Language>('vi');
  const [user, setUser] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast(language === 'vi' ? 'Đăng nhập thành công' : 'Logged in successfully');
    } catch (error) {
      console.error(error);
      showToast(language === 'vi' ? 'Đăng nhập thất bại' : 'Login failed');
    }
  };

  const logout = async () => {
    await signOut(auth);
    showToast(language === 'vi' ? 'Đã đăng xuất' : 'Logged out');
  };

  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('legato_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem('legato_cart', JSON.stringify(cart));
  }, [cart]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'user'>('user');

  // Track how many collections have finished their first snapshot load
  const loadedRef = React.useRef(0);
  const TOTAL_COLLECTIONS = 4; // products, blogs, orders, users

  useEffect(() => {
    setIsDataLoading(true);
    setDataError(null);
    loadedRef.current = 0;

    const markLoaded = () => {
      loadedRef.current += 1;
      if (loadedRef.current >= TOTAL_COLLECTIONS) setIsDataLoading(false);
    };

    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
      
      // MOCK FIX: assign dummy createdAt to mock products if missing, based on their ID (e.g. p-01, p-02)
      data = data.map(p => {
        if (!p.createdAt) {
          const mockIndex = mockProducts.findIndex(mp => mp.id === p.id);
          if (mockIndex !== -1) {
            return { ...p, createdAt: mockIndex }; // higher index = newer = appears first
          }
          return { ...p, createdAt: 0 };
        }
        return p;
      });

      // Sort newest first (descending by createdAt)
      data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        if (data.length === 0) {
          mockProducts.forEach(async (p) => { await setDoc(doc(db, 'products', p.id), p); });
        } else {
          setProducts(data);
        }
        markLoaded();
      },
      (err) => { console.error('products:', err); setDataError('Lỗi tải sản phẩm'); markLoaded(); }
    );

    const unsubBlogs = onSnapshot(
      collection(db, 'blogs'),
      (snapshot) => {
        let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as BlogPost[];
      data.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        if (data.length === 0) {
          mockBlogPosts.forEach(async (p) => { await setDoc(doc(db, 'blogs', p.id), p); });
        } else { setBlogPosts(data); }
        markLoaded();
      },
      (err) => { console.error('blogs:', err); markLoaded(); }
    );

    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        let ords = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
      ords.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      setOrders(ords);
        markLoaded();
      },
      (err) => { console.error('orders:', err); markLoaded(); }
    );

    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        setAppUsers(snapshot.docs.map(d => ({ uid: d.id, ...d.data() })) as AppUser[]);
        markLoaded();
      },
      (err) => { console.error('users:', err); markLoaded(); }
    );

    // Listen to settings from Firestore
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'main'),
      (snap) => {
        if (snap.exists()) {
          setSettings(prev => ({ ...prev, ...snap.data() as Partial<StoreSettings> }));
        }
      },
      (err) => console.error('settings:', err)
    );

    return () => { unsubProducts(); unsubBlogs(); unsubOrders(); unsubUsers(); unsubSettings(); };
  }, []);

  useEffect(() => {
    if (user) {
      const found = appUsers.find(u => u.uid === user.uid);
      const hasAdmins = appUsers.some(u => u.role === 'admin');

      if (found) {
        setCurrentUserRole(found.role);
        if (found.role === 'user' && !hasAdmins) {
          updateDoc(doc(db, 'users', user.uid), { role: 'admin' });
        }
      } else {
        const role = hasAdmins ? 'user' : 'admin';
        setCurrentUserRole(role);
        setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role,
          joinDate: new Date().toISOString()
        }, { merge: true });
      }
    } else {
      setCurrentUserRole('user');
    }
  }, [user, appUsers]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [flyingIcons, setFlyingIcons] = useState<{ id: string, startX: number, startY: number, image: string }[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 1200);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateProduct = async (updated: Product) => {
    try {
      await updateDoc(doc(db, 'products', updated.id), updated as any);
    } catch (e) { console.error(e); }
  };

  const addToCart = (product: Product, size: ProductSize, material: ProductMaterial, quantity: number, e?: React.MouseEvent, isFastCrafting: boolean = false, engravingText?: string, micaBox?: string, isSelfAssembly: boolean = false) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const id = `fly-${Date.now()}-${Math.random()}`;
      setFlyingIcons(prev => [...prev, { id, startX, startY, image: product.images[0] }]);
      setTimeout(() => {
        setFlyingIcons(prev => prev.filter(icon => icon.id !== id));
      }, 800);
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size && item.material === material && item.isFastCrafting === isFastCrafting && item.engravingText === engravingText && item.micaBox === micaBox && item.isSelfAssembly === isSelfAssembly);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, size, material, quantity, isFastCrafting, engravingText, micaBox, isSelfAssembly }];
    });
  };

  const removeFromCart = (productId: string, size: ProductSize, material: ProductMaterial, isFastCrafting: boolean = false, engravingText?: string, micaBox?: string, isSelfAssembly: boolean = false) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size && item.material === material && !!item.isFastCrafting === isFastCrafting)));
  };

  const clearCart = () => setCart([]);

  const createOrder = async (customerName: string, paymentMethod: string = 'COD', additionalInfo: any = {}) => {
    const parseSizePercentage = (sizeStr: string | null) => {
      if (!sizeStr) return 1;
      const num = parseInt(sizeStr.replace('Size ', ''), 10);
      return isNaN(num) ? 1 : num / 400;
    };
    const getBoxUnitCost = (boxType?: string) => {
      return boxType === 'standard' ? 150000 / 25400 : boxType === 'led' ? 250000 / 25400 : 0;
    };
    const total = cart.reduce((sum, item) => sum + (item.product.price * parseSizePercentage(item.size) * (item.material === 'PETG' ? 1.2 : 1) * (item.isFastCrafting ? 1.1 : 1) + getBoxUnitCost(item.micaBox)) * item.quantity, 0);
    const newOrder = {
      items: [...cart],
      total,
      status: 'Pending' as OrderStatus,
      date: new Date().toISOString(),
      customerName,
      userId: user?.uid || null,
      paymentMethod,
      ...additionalInfo
    };
    try {
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      clearCart();
      return docRef.id;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const updateOrder = async (orderId: string, data: any) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), data);
    } catch (e) { console.error(e); }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (e) { console.error(e); }
  };

  const addBlogPost = async (post: Omit<BlogPost, 'id'>) => {
    try {
      await addDoc(collection(db, 'blogs'), post);
    } catch (e) { console.error(e); }
  };

  const updateBlogPost = async (updated: BlogPost) => {
    try {
      await updateDoc(doc(db, 'blogs', updated.id), updated as any);
    } catch (e) { console.error(e); }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), { ...product, createdAt: Date.now() });
    } catch (e) { console.error(e); }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) { console.error(e); }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (e) { console.error(e); }
  };

  const updateUserRole = async (uid: string, newRole: 'admin' | 'user') => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
    } catch (e) { console.error(e); }
  };

  const deleteUser = async (uid: string) => {
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (e) { console.error(e); }
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    try {
      await setDoc(doc(db, 'settings', 'main'), newSettings, { merge: true });
    } catch (e) { console.error('updateSettings:', e); }
  };

  const t = (key: keyof typeof translations['vi']) => {
    return translations[language][key] || key;
  };

  const formatPrice = (priceUSD: number, discountPercentage?: number) => {
    const rate = 25400; // 1 USD = 25,400 VND
    
    // Auto +5% logic: The provided priceUSD is the standard (current/discounted) price.
    // We add 5% to it to create the fake original price.
    const finalUSD = priceUSD;
    const origUSD = priceUSD * 1.05;
    const isOnSale = true; // Always show 2 prices

    if (language === 'vi') {
      let v1 = origUSD * rate;
      let v2 = finalUSD * rate;
      
      // Auto-append .000 (multiply by 1000) if the value is abnormally small
      if (v1 > 0 && v1 < 100000) v1 *= 1000;
      if (v2 > 0 && v2 < 100000) v2 *= 1000;

      // Round to nearest 1000 for nicer display
      v1 = Math.round(v1 / 1000) * 1000;
      v2 = Math.round(v2 / 1000) * 1000;

      const origVND = v1.toLocaleString('vi-VN');
      const finalVND = v2.toLocaleString('vi-VN');
      return {
        original: `${origVND} ₫`,
        current: `${finalVND} ₫`,
        isOnSale
      };
    } else {
      return {
        original: `$${origUSD.toFixed(2)}`,
        current: `$${finalUSD.toFixed(2)}`,
        isOnSale
      };
    }
  };

  // Mock data for Profile Page
  const savedCarts: SavedCart[] = user ? [
    {
      id: 'cart-1',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      items: [
        {
          product: mockProducts[0],
          size: mockProducts[0].availableSizes[0],
          material: 'PLA',
          quantity: 1
        }
      ],
      expiresIn: '24h'
    }
  ] : [];

  const notifications: Notification[] = user ? [
    {
      id: 'notif-1',
      message: language === 'vi' ? 'Bạn có 1 giỏ hàng chưa thanh toán! Ưu đãi 10% sẽ hết hạn sau 24h.' : 'You have 1 unpaid cart! 10% discount expires in 24h.',
      type: 'warning',
      date: new Date().toISOString(),
      read: false
    },
    {
      id: 'notif-2',
      message: language === 'vi' ? 'Chào mừng bạn trở lại, chúc bạn mua sắm vui vẻ!' : 'Welcome back, happy shopping!',
      type: 'info',
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      read: true
    }
  ] : [];

  return (
    <StoreContext.Provider value={{
        previewSettings,
        setPreviewSettings,
        products, isDataLoading, dataError, updateProduct, addProduct, deleteProduct,
        cart, addToCart, removeFromCart, clearCart, 
        orders, savedCarts, notifications, createOrder, updateOrder, updateOrderStatus,
        blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
        language,
        setLanguage,
        t,
        settings,
        updateSettings,
        formatPrice,
        toasts,
        showToast,
        removeToast,
        user,
        appUsers,
        currentUserRole,
        updateUserRole,
        deleteUser,
        loginWithGoogle,
        logout
      }}
    >
      {children}
      
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        zIndex: 9999,
        pointerEvents: 'none', // Allow clicking through the container
        alignItems: 'center'
      }}>
        <AnimatePresence>
          {toasts.map(toast => (
              <motion.div
                key={toast.id}
                className="toast-message"
                initial={{ opacity: 0, y: '50vh', scale: 0.5, rotate: -5 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, y: '50vh', scale: 0.5, rotate: 5, transition: { duration: 0.3, ease: 'easeIn' } }}
                transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                style={{
                  background: 'var(--color-surface)',
                  color: '#fbbf24',
                  border: '2px solid #fbbf24',
                  boxShadow: '0 10px 40px rgba(251, 191, 36, 0.4)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  pointerEvents: 'auto',
                  textAlign: 'center'
                }}
              >
                <Zap size={20} color="#fbbf24" fill="#fbbf24" />
                {toast.message}
              </motion.div>
            ))}
          </AnimatePresence>
          <style>{`
            .toast-message {
              padding: 1.5rem 3rem;
              border-radius: 16px;
              font-size: 1.125rem;
            }
            @media (max-width: 768px) {
              .toast-message {
                padding: 1rem 1.5rem;
                border-radius: 12px;
                font-size: 0.75rem;
              }
            }
          `}</style>
        </div>

      {/* Flying Cart Icons Container */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10000 }}>
        <AnimatePresence>
          {flyingIcons.map(icon => {
            let cartEl = document.getElementById('nav-cart-icon');
            let cartRect = cartEl?.getBoundingClientRect();
            if (!cartRect || cartRect.width === 0) {
              cartEl = document.getElementById('nav-cart-icon-mobile');
              cartRect = cartEl?.getBoundingClientRect();
            }
            // Default to top-right if not found
            const endX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 50;
            const endY = cartRect ? cartRect.top + cartRect.height / 2 : 50;

            return (
              <motion.img
                key={icon.id}
                src={icon.image}
                initial={{ x: icon.startX - 50, y: icon.startY - 50, scale: 0.8, opacity: 1 }}
                animate={{ 
                  x: endX - 50, 
                  y: endY - 50, 
                  scale: 0.1, 
                  opacity: 0.2 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100px', height: '100px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
