import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'user';
  joinDate: string;
}

export interface StoreSettings {
  logoText: string;
  logoImage?: string; // Optional image URL
  heroVideoUrl: string;
}

export interface ToastMessage {
  id: string;
  message: string;
}

interface StoreContextType {
  products: Product[];
  updateProduct: (updated: Product) => void;
  cart: CartItem[];
  addToCart: (product: Product, size: ProductSize, material: ProductMaterial, quantity: number, e?: React.MouseEvent, isFastCrafting?: boolean) => void;
  removeFromCart: (productId: string, size: ProductSize, material: ProductMaterial, isFastCrafting?: boolean) => void;
  clearCart: () => void;
  orders: Order[];
  savedCarts: SavedCart[];
  notifications: Notification[];
  createOrder: (customerName: string, paymentMethod?: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['vi']) => string;
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  deleteBlogPost: (id: string) => void;
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
  const [settings, setSettings] = useState<StoreSettings>({
    logoText: 'LEGATO',
    logoImage: '/images/custom-logo.png',
    heroVideoUrl: 'https://cdn.pixabay.com/video/2021/08/04/83894-585141019_large.mp4'
  });
  const [language, setLanguage] = useState<Language>('vi');
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'user'>('user');

  React.useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      if (data.length === 0) {
        mockProducts.forEach(async (p) => { await setDoc(doc(db, 'products', p.id), p); });
      } else { 
        setProducts(data); 
      }
    });

    const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
      if (data.length === 0) {
        mockBlogPosts.forEach(async (p) => { await setDoc(doc(db, 'blogs', p.id), p); });
      } else { setBlogPosts(data); }
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]);
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setAppUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as AppUser[]);
    });

    return () => { unsubProducts(); unsubBlogs(); unsubOrders(); unsubUsers(); };
  }, []);

  React.useEffect(() => {
    if (user) {
      const found = appUsers.find(u => u.uid === user.uid);
      const hasAdmins = appUsers.some(u => u.role === 'admin');

      if (found) {
        if (found.role === 'user' && !hasAdmins) {
          updateDoc(doc(db, 'users', user.uid), { role: 'admin' });
          setCurrentUserRole('admin');
        } else {
          setCurrentUserRole(found.role);
        }
      } else {
        setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: hasAdmins ? 'user' : 'admin',
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

  const addToCart = (product: Product, size: ProductSize, material: ProductMaterial, quantity: number, e?: React.MouseEvent, isFastCrafting: boolean = false) => {
    if (e) {
      const startX = e.clientX;
      const startY = e.clientY;
      const id = `fly-${Date.now()}-${Math.random()}`;
      setFlyingIcons(prev => [...prev, { id, startX, startY, image: product.images[0] }]);
      setTimeout(() => {
        setFlyingIcons(prev => prev.filter(icon => icon.id !== id));
      }, 800);
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size && item.material === material && item.isFastCrafting === isFastCrafting);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id && item.size === size && item.material === material && item.isFastCrafting === isFastCrafting
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, size, material, quantity, isFastCrafting }];
    });
  };

  const removeFromCart = (productId: string, size: ProductSize, material: ProductMaterial, isFastCrafting: boolean = false) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size && item.material === material && !!item.isFastCrafting === isFastCrafting)));
  };

  const clearCart = () => setCart([]);

  const createOrder = async (customerName: string, paymentMethod: string = 'COD') => {
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder = {
      items: [...cart],
      total,
      status: 'Pending' as OrderStatus,
      date: new Date().toISOString(),
      customerName,
      userId: user?.uid || null,
      paymentMethod
    };
    try {
      await addDoc(collection(db, 'orders'), newOrder);
      clearCart();
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

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), product);
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

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const t = (key: keyof typeof translations['vi']) => {
    return translations[language][key] || key;
  };

  const formatPrice = (priceUSD: number, discountPercentage?: number) => {
    const rate = 25400; // 1 USD = 25,400 VND
    const isOnSale = discountPercentage !== undefined && discountPercentage > 0;
    const finalUSD = isOnSale ? priceUSD * (1 - discountPercentage / 100) : priceUSD;

    if (language === 'vi') {
      const origVND = Math.round(priceUSD * rate).toLocaleString('vi-VN');
      const finalVND = Math.round(finalUSD * rate).toLocaleString('vi-VN');
      return {
        original: `${origVND} ₫`,
        current: `${finalVND} ₫`,
        isOnSale
      };
    } else {
      return {
        original: `$${priceUSD.toFixed(2)}`,
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
        products, updateProduct, addProduct, deleteProduct,
        cart, addToCart, removeFromCart, clearCart, 
        orders, savedCarts, notifications, createOrder, updateOrderStatus,
        blogPosts, addBlogPost, deleteBlogPost,
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
                  color: 'var(--color-text)',
                  border: '2px solid var(--color-accent)',
                  boxShadow: '0 10px 40px rgba(74, 222, 128, 0.4)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  pointerEvents: 'auto',
                  textAlign: 'center'
                }}
              >
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
