import React from 'react';
import { useStore } from '../context/StoreContext';

export const Returns = () => {
  const { language } = useStore();

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem', fontWeight: 800 }}>
          {language === 'vi' ? 'Chính Sách Đổi Trả' : 'Returns Policy'}
        </h1>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
            {language === 'vi' ? 'Điều kiện đổi trả' : 'Return Conditions'}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {language === 'vi' 
              ? 'Sản phẩm chỉ được đổi trả nếu có lỗi từ nhà sản xuất hoặc hư hỏng trong quá trình vận chuyển. Quý khách vui lòng quay video khi mở hàng.' 
              : 'Products can only be returned if there is a manufacturing defect or damage during shipping. Please record a video when unboxing.'}
          </p>

          <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
            {language === 'vi' ? 'Thời gian xử lý' : 'Processing Time'}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {language === 'vi' 
              ? 'Yêu cầu đổi trả sẽ được xử lý trong vòng 3-5 ngày làm việc kể từ khi nhận được sản phẩm hoàn trả.' 
              : 'Return requests will be processed within 3-5 business days upon receiving the returned product.'}
          </p>
        </div>
      </div>
    </div>
  );
};
