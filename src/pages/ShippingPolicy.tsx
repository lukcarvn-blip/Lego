import React from 'react';
import { useStore } from '../context/StoreContext';

export const ShippingPolicy = () => {
  const { language } = useStore();

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem', fontWeight: 800 }}>
          {language === 'vi' ? 'Chính Sách Vận Chuyển' : 'Shipping Policy'}
        </h1>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
            {language === 'vi' ? 'Phương thức vận chuyển' : 'Shipping Methods'}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {language === 'vi' 
              ? 'Chúng tôi sử dụng các dịch vụ chuyển phát nhanh nội địa và quốc tế đáng tin cậy nhất.' 
              : 'We use the most reliable domestic and international express delivery services.'}
          </p>

          <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
            {language === 'vi' ? 'Chi phí vận chuyển' : 'Shipping Cost'}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {language === 'vi' 
              ? 'Miễn phí giao hàng (Free Ship) cho các đơn hàng thanh toán trước 100%. Phí 5$ áp dụng cho các đơn hàng cọc 50%.' 
              : 'Free shipping for orders paid in full. A $5 fee applies for orders with a 50% deposit.'}
          </p>
        </div>
      </div>
    </div>
  );
};
