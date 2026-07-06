import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { FAQ } from './pages/FAQ';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { Returns } from './pages/Returns';
import { ContactUs } from './pages/ContactUs';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { Auth } from './pages/Auth';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Technology } from './pages/Technology';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const { pathname } = useLocation();
  const { settings } = useStore();
  
  useEffect(() => {
    window.scrollTo(0, 0);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdmin && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:categoryName" element={<Products />} />
          <Route path="/category/:categoryName" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/hoang" element={<Admin />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
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
