import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, Upload, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Partnership = () => {
  const { language, showToast } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    socialMedia: '',
    workshopInfo: ''
  });

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 10) {
        showToast(language === 'vi' ? 'Chỉ được tải lên tối đa 10 hình ảnh.' : 'Maximum 10 images allowed.');
        return;
      }
      setImages(prev => [...prev, ...files]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (videos.length + files.length > 5) {
        showToast(language === 'vi' ? 'Chỉ được tải lên tối đa 5 video.' : 'Maximum 5 videos allowed.');
        return;
      }
      setVideos(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const allFiles = [...images, ...videos];
      
      // Upload all files to S3
      for (const file of allFiles) {
        const response = await fetch('/api/get-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type })
        });
        
        if (!response.ok) throw new Error('Failed to get signed URL');
        const { signedUrl } = await response.json();
        
        const uploadRes = await fetch(signedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type }
        });
        
        if (!uploadRes.ok) throw new Error('Failed to upload file to S3');
      }

      // Here you would normally also send the formData and the array of public URLs to your backend database
      
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Upload error", error);
      showToast(language === 'vi' ? 'Lỗi tải file lên!' : 'Upload failed!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-sm)',
    color: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
    marginTop: '0.5rem'
  };

  const labelStyle = {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    display: 'block',
    marginBottom: '0.25rem'
  };

  if (isSuccess) {
    return (
      <div style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px' }}
        >
          <CheckCircle2 size={64} color="var(--color-accent)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>{language === 'vi' ? 'Đăng Ký Thành Công!' : 'Registration Successful!'}</h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            {language === 'vi' 
              ? 'Cảm ơn bạn đã gửi thông tin. Đội ngũ LEGATO sẽ xem xét hồ sơ năng lực của xưởng và liên hệ với bạn trong thời gian sớm nhất.' 
              : 'Thank you for submitting. The LEGATO team will review your workshop profile and contact you soon.'}
          </p>
          <button 
            onClick={() => { setIsSuccess(false); setImages([]); setVideos([]); setFormData({name:'', phone:'', email:'', socialMedia:'', workshopInfo:''}); }}
            className="bling-btn"
            style={{ padding: '0.8rem 2rem', background: 'var(--color-accent)', color: '#000', fontWeight: 700, borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer' }}
          >
            {language === 'vi' ? 'Gửi Đăng Ký Khác' : 'Submit Another Registration'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ marginBottom: '1rem', fontWeight: 800 }}>
            {language === 'vi' ? 'Trở Thành Đối Tác Chế Tác' : 'Become a Crafting Partner'}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
            {language === 'vi' 
              ? 'LEGATO đang tìm kiếm mạng lưới xưởng in 3D, xưởng chế tác có tay nghề cao. Yêu cầu sự tỉ mỉ, chỉn chu và chuyên về các dòng sản phẩm mô hình (figures).' 
              : 'LEGATO is looking for a network of highly skilled 3D printing and crafting workshops. We require meticulousness, neatness, and specialization in figure models.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-accent)', fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            {language === 'vi' ? 'Thông Tin Cá Nhân & Liên Hệ' : 'Personal & Contact Info'}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={labelStyle}>{language === 'vi' ? 'Họ và tên / Tên người đại diện *' : 'Full Name / Representative *'}</label>
              <input required type="text" style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label style={labelStyle}>{language === 'vi' ? 'Số điện thoại (Zalo) *' : 'Phone Number *'}</label>
              <input required type="tel" style={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0901234567" />
            </div>
            <div>
              <label style={labelStyle}>{language === 'vi' ? 'Email *' : 'Email *'}</label>
              <input required type="email" style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" />
            </div>
            <div>
              <label style={labelStyle}>{language === 'vi' ? 'Mạng xã hội (Facebook/Tiktok...)' : 'Social Media Link'}</label>
              <input type="url" style={inputStyle} value={formData.socialMedia} onChange={e => setFormData({...formData, socialMedia: e.target.value})} placeholder="https://facebook.com/..." />
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={labelStyle}>{language === 'vi' ? 'Thông tin xưởng (Địa chỉ, quy mô, thiết bị đang có) *' : 'Workshop Info (Address, scale, equipment) *'}</label>
            <textarea required rows={4} style={{...inputStyle, resize: 'vertical'}} value={formData.workshopInfo} onChange={e => setFormData({...formData, workshopInfo: e.target.value})} placeholder={language === 'vi' ? 'Ví dụ: Xưởng tại TP.HCM, có 5 máy Bambu Lab X1C, 2 máy in Resin...' : 'E.g., Workshop in HCMC, 5 Bambu Lab X1C printers...'} />
          </div>

          <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-accent)', fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            {language === 'vi' ? 'Hồ Sơ Năng Lực (Portfolio)' : 'Portfolio & Capability'}
          </h3>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={labelStyle}>{language === 'vi' ? 'Tải lên hình ảnh sản phẩm đã in (Tối đa 10 ảnh)' : 'Upload printed product images (Max 10)'}</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{images.length}/10</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {images.map((file, idx) => (
                <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                  <img src={URL.createObjectURL(file)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>×</button>
                </div>
              ))}
              {images.length < 10 && (
                <label style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', border: '2px dashed var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.2)', color: 'var(--color-text-muted)' }}>
                  <Upload size={20} />
                  <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>Upload</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={labelStyle}>{language === 'vi' ? 'Tải lên video sản phẩm đã in (Tối đa 5 video)' : 'Upload printed product videos (Max 5)'}</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{videos.length}/5</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {videos.map((file, idx) => (
                <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--glass-border)', background: '#000' }}>
                  <video src={URL.createObjectURL(file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeVideo(idx)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>×</button>
                </div>
              ))}
              {videos.length < 5 && (
                <label style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', border: '2px dashed var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.2)', color: 'var(--color-text-muted)' }}>
                  <Upload size={20} />
                  <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>Video</span>
                  <input type="file" accept="video/*" multiple onChange={handleVideoChange} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bling-btn"
            style={{ 
              width: '100%', padding: '1rem', background: 'var(--color-accent)', color: '#000', 
              fontSize: '1.1rem', fontWeight: 800, borderRadius: 'var(--radius-sm)', 
              border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? (language === 'vi' ? 'Đang gửi...' : 'Submitting...') : (
              <>
                <Send size={20} />
                {language === 'vi' ? 'Gửi Hồ Sơ Đăng Ký' : 'Submit Application'}
              </>
            )}
          </button>
        </form>

        {/* Contact Info Footer */}
        <div style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <p style={{ marginBottom: '1rem' }}>{language === 'vi' ? 'Hoặc liên hệ trực tiếp với chúng tôi qua:' : 'Or contact us directly via:'}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <a href="mailto:legatorvn@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)', textDecoration: 'none' }}>
              <Mail size={18} color="var(--color-accent)" /> legatorvn@gmail.com
            </a>
            <a href="tel:0586339686" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)', textDecoration: 'none' }}>
              <Phone size={18} color="var(--color-accent)" /> 0586 339 686
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
