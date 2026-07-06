import React from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone } from 'lucide-react';

export const Partnership = () => {
  const { language } = useStore();

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>
          {language === 'vi' ? 'Trở Thành Đối Tác' : 'Become a Partner'}
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
          {language === 'vi' ? 'Hợp tác Creator - Chia sẻ lợi nhuận' : 'Creator Partnership - Profit Sharing'}
        </p>

        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-accent)', fontWeight: 700 }}>
            {language === 'vi' ? 'Mời Các Creator Hợp Tác' : 'Inviting Creators to Partner'}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.8, fontSize: '1.1rem' }}>
            {language === 'vi' 
              ? 'Chúng tôi luôn tìm kiếm các nhà sáng tạo nội dung (Creator) đam mê với sản phẩm mô hình lắp ráp và đồ chơi nghệ thuật để cùng hợp tác bán sản phẩm và chia sẻ lợi nhuận. Khi trở thành đối tác của LEGATO, bạn sẽ nhận được mức hoa hồng hấp dẫn cho mỗi đơn hàng thành công từ kênh của bạn.'
              : 'We are always looking for passionate content creators (Creators) in the art toy and model assembly space to partner in selling products and profit sharing. By partnering with LEGATO, you will receive an attractive commission for every successful order from your channel.'}
          </p>

          <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.25rem', color: 'var(--color-accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span> Mức Lợi Nhuận
            </h4>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              {language === 'vi' ? 'Hoa hồng 10% trên từng sản phẩm bán được.' : '10% commission on every product sold.'}
            </p>
          </div>

          <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 700 }}>
            {language === 'vi' ? 'Liên hệ với chúng tôi để bắt đầu' : 'Contact us to get started'}
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={20} color="var(--color-accent)" />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Email</div>
                <a href="mailto:legatovn@gmail.com" style={{ color: 'var(--color-text)', fontWeight: 600, textDecoration: 'none' }}>legatovn@gmail.com</a>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={20} color="var(--color-accent)" />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Zalo</div>
                <a href="tel:0586339686" style={{ color: 'var(--color-text)', fontWeight: 600, textDecoration: 'none' }}>0586 339 686</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
