import { AlertTriangle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { PrinterDetails } from './pages/PrinterDetails';
import { FAQ } from './pages/FAQ';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { Returns } from './pages/Returns';
import { ContactUs } from './pages/ContactUs';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import { Auth } from './pages/Auth';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Technology } from './pages/Technology';
import { Partnership } from './pages/Partnership';
import { Profile } from './pages/Profile';
import { Community } from './pages/Community';
import { Leaderboard } from './pages/Leaderboard';
import { NotFound } from './pages/NotFound';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FloatingActions } from './components/FloatingActions';
import { StarBurst } from './components/StarBurst';

import { LoadingScreen } from './components/LoadingScreen';

function AppContent() {
  const { pathname } = useLocation();
  const { settings, isDataLoading, dataError } = useStore();
  const [isNavLoading, setIsNavLoading] = useState(false);
  
  useEffect(() => {
    setIsNavLoading(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsNavLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Apply SEO Settings
  useEffect(() => {
    if (settings.seoTitle) {
      document.title = settings.seoTitle;
    }
    
    if (settings.seoDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', settings.seoDescription);
    }
    
    if (settings.favicon) {
      let linkIcon = document.querySelector('link[rel="icon"]');
      if (!linkIcon) {
        linkIcon = document.createElement('link');
        linkIcon.setAttribute('rel', 'icon');
        document.head.appendChild(linkIcon);
      }
      linkIcon.setAttribute('href', settings.favicon);
    }
  }, [settings.seoTitle, settings.seoDescription, settings.favicon]);

  const isAdmin = pathname.toLowerCase().startsWith('/hoang');

  // Show full-page spinner only on first data load
  if (isDataLoading) {
    return <LoadingScreen isVisible={true} />;
  }

  return (
    <>
      <LoadingScreen isVisible={isNavLoading} />

      {/* Firebase error banner */}
      <AnimatePresence>
        {dataError && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999,
              background: 'rgba(239,68,68,0.95)', color: '#fff',
              padding: '0.75rem 1.5rem', textAlign: 'center',
              fontWeight: 700, fontSize: '0.9rem',
              backdropFilter: 'blur(8px)'
            }}
          >
            <AlertTriangle size={16} style={{marginRight:'4px'}} /> {dataError} â€” Äang thá»­ káº¿t ná»‘i láº¡i vá»›i Firebase...
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', opacity: isNavLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}>
        {!isAdmin && <Navbar />}
        <main style={{ flex: 1 }}>

          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:categoryName" element={<Products />} />
          <Route path="/category/:categoryName" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/printer/:id" element={<PrinterDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Navigate to="/community" replace />} />
          <Route path="/checkout/success/:orderId" element={<CheckoutSuccess />} />
          <Route path="/hoang" element={<Admin />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/community" element={<Community />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <FloatingActions />}
        <StarBurst />
      </div>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <Router>
          <AppContent />
        </Router>
      </StoreProvider>
    </ErrorBoundary>
  );
}

export default App;

