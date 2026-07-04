import React from 'react';
import { useStore } from '../context/StoreContext';

export const FAQ = () => {
  const { language } = useStore();

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem', fontWeight: 800 }}>
          {language === 'vi' ? 'Câu Hỏi Thường Gặp (FAQ)' : 'Frequently Asked Questions (FAQ)'}
        </h1>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
            {language === 'vi' ? 'Sản phẩm làm từ chất liệu gì?' : 'What materials are your products made of?'}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {language === 'vi' ? 'Sản phẩm của chúng tôi được làm từ nhựa resin lỏng cao cấp kết hợp với sợi thủy tinh siêu nhẹ, đảm bảo độ bền và tính thẩm mỹ cao.' : 'Our products are made from premium liquid resin combined with ultra-light fiberglass, ensuring durability and high aesthetics.'}
          </p>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
            {language === 'vi' ? 'Thời gian chế tác là bao lâu?' : 'How long is the crafting time?'}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {language === 'vi' ? 'Tùy vào kích thước và độ phức tạp, thời gian chế tác có thể từ 2-7 ngày.' : 'Depending on the size and complexity, crafting time can range from 2-7 days.'}
          </p>
        </div>
      </div>
    </div>
  );
};
