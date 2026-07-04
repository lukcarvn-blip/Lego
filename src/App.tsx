import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <StoreProvider>
      <Router>
        <ScrollToTop />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:categoryName" element={<Products />} />
              <Route path="/category/:categoryName" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/technology" element={<Technology />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </StoreProvider>
  );
}

export default App;
