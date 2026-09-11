import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CheckCircle, Package, ArrowLeft, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export const CheckoutSuccess = () => {
  const { orderId } = useParams();
  const { orders, t, formatPrice } = useStore();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const found = orders.find(o => o.id === orderId);
      if (found) setOrder(found);
    }
  }, [orderId, orders]);

  if (!order) {
    return (
      <div className="container" style={{ paddingTop: '120px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center' }}
      >
        <CheckCircle size={64} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem' }} />
        <h1 style={{ marginBottom: '1rem' }}>Thanh toán thành công!</h1>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>Cảm ơn bạn đã đặt hàng. Dưới đây là thông tin hóa đơn của bạn.</p>

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Hóa Đơn #{orderId?.substring(0, 8).toUpperCase()}</h3>
          <p><strong>Khách hàng:</strong> {order.customerName}</p>
          <p><strong>Phương thức:</strong> {order.paymentMethod}</p>
          <p><strong>Ngày đặt:</strong> {new Date(order.date).toLocaleString('vi-VN')}</p>
          
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Chi tiết sản phẩm:</h4>
            {order.items.map((item: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>{item.product.name['vi']} (x{item.quantity})</span>
                <span>{formatPrice(item.product.price * item.quantity).current}</span>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-accent)' }}>
            <span>Tổng cộng:</span>
            <span>{formatPrice(order.total).current}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={20} /> Về Trang Chủ
          </Link>
          <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--color-accent)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => window.print()}>
            <Download size={20} /> Tải Hóa Đơn
          </button>
        </div>
      </motion.div>
    </div>
  );
};
