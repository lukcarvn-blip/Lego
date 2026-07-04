import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockProducts } from '../data/mockProducts';
import { mockBlogPosts } from '../data/mockBlogPosts';
import type { Product, ProductSize } from '../data/mockProducts';
import { translations } from '../i18n/translations';
import type { Language } from '../i18n/translations';
import { auth, googleProvider } from '../config/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

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
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
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
  createOrder: (customerName: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['vi']) => string;
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  formatPrice: (priceUSD: number, discountPercentage?: number) => { original: string, current: string, isOnSale: boolean };
  toasts: ToastMessage[];
  showToast: (message: string) => void;
  removeToast: (id: string) => void;
  user: any;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<StoreSettings>({
    logoText: 'LÔ GÊ',
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
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-1001',
      customerName: 'John Doe',
      date: new Date().toISOString(),
      status: 'Crafting',
      total: 999.00,
      items: []
    }
  ]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogPosts);
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

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
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

  const createOrder = (customerName: string) => {
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      total,
      status: 'Pending',
      date: new Date().toISOString(),
      customerName
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const addBlogPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost = { ...post, id: `b-${Date.now()}` };
    setBlogPosts(prev => [newPost, ...prev]);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: `p-${Date.now()}` };
    setProducts(prev => [newProduct, ...prev]);
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

  return (
    <StoreContext.Provider value={{ 
        products, updateProduct, addProduct,
        cart, addToCart, removeFromCart, clearCart, 
        orders, createOrder, updateOrderStatus,
        blogPosts, addBlogPost,
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
              initial={{ opacity: 0, y: '50vh', scale: 0.5, rotate: -5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: '50vh', scale: 0.5, rotate: 5, transition: { duration: 0.3, ease: 'easeIn' } }}
              transition={{ type: 'spring', stiffness: 250, damping: 15 }}
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                padding: '1.5rem 3rem',
                borderRadius: '99px',
                border: '2px solid var(--color-accent)',
                boxShadow: '0 10px 40px rgba(74, 222, 128, 0.4)',
                fontWeight: 700,
                fontSize: '1.125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'auto', // But allow interacting with the toast itself
                textAlign: 'center'
              }}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
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
