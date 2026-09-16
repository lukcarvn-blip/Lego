import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, Gift, RefreshCw, Send, Star, Layers, MessageSquarePlus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';

export const Community = () => {
  const { language } = useStore();
  const [requestText, setRequestText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestText.trim()) {
      setIsSubmitted(true);
      setRequestText('');
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
              <Layers size={40} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: '#fff' }}>
              {language === 'vi' ? 'Sân chơi Mô hình Up-scale Cao cấp' : 'High-end Up-scale Model Playground'}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              {language === 'vi' 
                ? 'Mục tiêu của chúng tôi là xây dựng một sân chơi mô hình được up-scale tương tự như các mô hình của BEARBRICK cao cấp. Chúng tôi muốn tạo ra một cộng đồng sưu tầm các mô hình độc bản được chế tác bằng công nghệ máy in 3D đa màu sắc tiên tiến nhất.' 
                : 'Our goal is to build a playground for up-scaled models similar to high-end BEARBRICKs. We want to create a collector community for unique models crafted using the most advanced multi-color 3D printing technology.'}
            </p>
          </div>

          {/* Development Vision */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
              <Star size={24} /> 
              {language === 'vi' ? 'Định Hướng Phát Triển' : 'Development Vision'}
            </h3>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '1rem' }}>
              {language === 'vi' 
                ? 'Vì đây là mô hình tự thiết kế độc quyền, lượng thiết kế hiện tại còn hạn chế. Tuy nhiên, chúng tôi cam kết sẽ phát triển thiết kế thêm nhiều nhân vật mới mỗi tháng.'
                : 'Since these are exclusive self-designed models, the current design inventory is limited. However, we are committed to developing new character designs every month.'}
            </p>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.7 }}>
              {language === 'vi'
                ? 'Các Collector (người sưu tầm) có quyền đề xuất nhân vật yêu thích. Chúng tôi sẽ tổng hợp các đề xuất đó theo bảng xếp hạng (Leaderboard) và lần lượt thực hiện chế tác dựa trên số lượng FAN CỨNG yêu cầu!'
                : 'Collectors have the right to propose their favorite characters. We will aggregate these requests into a Leaderboard and sequentially craft them based on the number of TOP FAN requests!'}
            </p>
          </div>

          {/* Exclusive Policies */}
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>
            {language === 'vi' ? 'Đặc Quyền & Chính Sách' : 'Exclusive Policies'}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {/* Policy 1 */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
              <ShieldCheck size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Bảo hành rơi vỡ' : 'Breakage Warranty'}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {language === 'vi' ? 'Bảo hành rơi vỡ 1 lần miễn phí cho mọi sản phẩm.' : '1-time free replacement/warranty for accidental breakage.'}
              </p>
            </div>
            
            {/* Policy 2 */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
              <Wrench size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Chế tác lại trọn đời' : 'Lifetime Re-crafting'}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {language === 'vi' ? 'Hỗ trợ chế tác lại sản phẩm với giá tốt ưu đãi trọn đời.' : 'Lifetime support for re-crafting products at a favorable price.'}
              </p>
            </div>

            {/* Policy 3 */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
              <Gift size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Dấu ấn cá nhân' : 'Personal Mark'}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {language === 'vi' ? 'Khắc tên miễn phí lên mô hình cho bản thân hoặc làm quà tặng.' : 'Free name engraving on the model for yourself or as a gift.'}
              </p>
            </div>

            {/* Policy 4 */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
              <RefreshCw size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Thu mua lại' : 'Trade-in Support'}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {language === 'vi' ? 'Hỗ trợ thu mua lại các sản phẩm tùy theo tình trạng thực tế.' : 'Support for buying back products depending on their actual condition.'}
              </p>
            </div>
          </div>

          {/* Request Form */}
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-accent)', background: 'rgba(74, 222, 128, 0.05)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <MessageSquarePlus size={32} style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {language === 'vi' ? 'Gửi Đề Xuất Nhân Vật Mới' : 'Submit New Character Request'}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {language === 'vi' 
                  ? 'Hãy cho chúng tôi biết bạn muốn LEGATO chế tác nhân vật nào tiếp theo!'
                  : 'Let us know which character you want LEGATO to craft next!'}
              </p>
            </div>

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '12px' }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-accent)', color: '#000', marginBottom: '1rem' }}>
                  <ShieldCheck size={24} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
                  {language === 'vi' ? 'Đề xuất đã được ghi nhận!' : 'Request recorded!'}
                </h4>
                <p style={{ color: 'var(--color-text)' }}>
                  {language === 'vi' ? 'Cảm ơn bạn. Yêu cầu của bạn đã được thêm vào Bảng xếp hạng!' : 'Thank you. Your request has been added to the Leaderboard!'}
                </p>
                <Link to="/leaderboard" style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--color-accent)', textDecoration: 'underline' }}>
                  {language === 'vi' ? 'Xem Bảng Xếp Hạng' : 'View Leaderboard'}
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <textarea 
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder={language === 'vi' ? 'Ví dụ: Tôi muốn thấy mô hình Deadpool hoặc Optimus Prime...' : 'Example: I want to see a Deadpool or Optimus Prime model...'}
                  style={{
                    width: '100%', minHeight: '120px', padding: '1rem',
                    background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)',
                    borderRadius: '8px', color: '#fff', fontSize: '1rem',
                    marginBottom: '1rem', resize: 'vertical'
                  }}
                  required
                />
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{
                    width: '100%', padding: '1rem',
                    background: 'var(--color-accent)', color: '#000',
                    border: 'none', borderRadius: '8px',
                    fontSize: '1.1rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={20} />
                  {language === 'vi' ? 'Gửi Yêu Cầu' : 'Submit Request'}
                </motion.button>
              </form>
            )}
          </div>
          
        </motion.div>
      </div>
    </div>
  );
};
