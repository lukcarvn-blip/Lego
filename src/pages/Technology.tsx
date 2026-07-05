import React from 'react';
import { motion } from 'framer-motion';
import { Printer, Zap, Hexagon, Layers, Cpu, Wrench } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Technology = () => {
  const { language } = useStore();

  return (
    <div className="technology-page" style={{ paddingTop: '80px', paddingBottom: '6rem' }}>
      {/* Hero Section */}
      <section className="container" style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(74, 222, 128, 0.1)', color: 'var(--color-accent)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', marginBottom: '2rem', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
            <Zap size={16} />
            <span style={{ fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {language === 'vi' ? 'Công Nghệ Lõi' : 'Core Technology'}
            </span>
          </div>
          
          <h1 className="hero-title" style={{ fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
            {language === 'vi' ? 'Kỷ Nguyên In 3D FDM' : 'The Era of FDM 3D Printing'}
            <br />
            <span style={{ color: 'var(--color-accent)' }}>
              {language === 'vi' ? 'Đa Sắc Màu' : 'Multi-Color'}
            </span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            {language === 'vi' 
              ? 'Công nghệ in FDM (Fused Deposition Modeling) tiên tiến nhất hiện nay, mang đến khả năng pha trộn đa sắc màu mượt mà. Chúng tôi sử dụng chất liệu nhựa sinh học PLA thân thiện với môi trường, an toàn tuyệt đối cho người sử dụng.'
              : 'The most advanced FDM (Fused Deposition Modeling) printing technology, offering seamless multi-color blending. We use eco-friendly PLA bioplastics, completely safe for everyday use.'}
          </p>
        </motion.div>
      </section>

      {/* Main Image Section */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <motion.div
          initial={{ opacity: 1, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ 
            borderRadius: 'var(--radius-lg)', 
            overflow: 'hidden',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            position: 'relative'
          }}
        >
          <img 
            src="/images/fdm_3d_printer_neon.png" 
            alt="FDM 3D Printer Neon Concept" 
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-bg), transparent 50%)' }}></div>
        </motion.div>
      </section>

      {/* Printer Manufacturers Section */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>
            {language === 'vi' ? 'Hệ Sinh Thái Máy In Hàng Đầu' : 'Top Tier Printer Ecosystem'}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            {language === 'vi' 
              ? 'Chúng tôi vận hành hệ thống xưởng in sử dụng các dòng máy công nghiệp và dân dụng tân tiến nhất trên thế giới để đảm bảo độ nét và màu sắc hoàn hảo.'
              : 'We operate a printing farm utilizing the world\'s most advanced industrial and consumer printers to ensure perfect resolution and colors.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
          {[
            {
              name: 'Bambu Lab',
              desc: language === 'vi' ? 'Dẫn đầu cuộc cách mạng in 3D tốc độ cao với hệ thống thay màu tự động AMS, cho phép in tối đa 16 màu trong một mô hình duy nhất.' : 'Leading the high-speed 3D printing revolution with the automatic AMS color system, allowing up to 16 colors in a single model.',
              icon: <Printer size={32} color="var(--color-accent)" />
            },
            {
              name: 'Creality',
              desc: language === 'vi' ? 'Thương hiệu phổ biến nhất thế giới với các dòng máy K1 Series siêu tốc, đáp ứng nhu cầu in kích thước lớn và độ bền công nghiệp.' : 'The world\'s most popular brand with the ultra-fast K1 Series, meeting demands for large sizes and industrial durability.',
              icon: <Cpu size={32} color="var(--color-accent)" />
            },
            {
              name: 'Prusa Research',
              desc: language === 'vi' ? 'Được mệnh danh là "Apple của ngành in 3D", mang lại sự ổn định tuyệt đối và chất lượng hoàn thiện bề mặt mượt mà nhất.' : 'Known as the "Apple of 3D printing", offering absolute reliability and the smoothest surface finishes.',
              icon: <Layers size={32} color="var(--color-accent)" />
            }
          ].map((brand, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 1, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel"
              style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}
            >
              <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', display: 'inline-flex', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                {brand.icon}
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>{brand.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{brand.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section with Image */}
      <section className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '4rem', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 1, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>
              {language === 'vi' ? 'Dịch Vụ In Ấn Đa Dạng' : 'Diverse Printing Services'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
              {language === 'vi' 
                ? 'Không chỉ sản xuất mô hình đồ chơi, LEGATO còn cung cấp dịch vụ in 3D theo yêu cầu cho mọi nhu cầu trong cuộc sống hàng ngày.'
                : 'Beyond producing toy models, LEGATO offers on-demand 3D printing services for all your daily life needs.'}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                {
                  title: language === 'vi' ? 'Decor Trang Trí' : 'Home Decor',
                  desc: language === 'vi' ? 'In chậu cây cảnh, đèn ngủ nghệ thuật, phù điêu treo tường độc bản.' : 'Custom planters, artistic lamps, and unique wall reliefs.',
                  icon: <Hexagon size={24} color="var(--color-accent)" />
                },
                {
                  title: language === 'vi' ? 'Quà Tặng Cá Nhân Hóa' : 'Personalized Gifts',
                  desc: language === 'vi' ? 'In tên, logo, tượng chân dung hay kỷ niệm chương mang dấu ấn riêng.' : 'Print names, logos, busts, or trophies with a personal touch.',
                  icon: <Zap size={24} color="var(--color-accent)" />
                },
                {
                  title: language === 'vi' ? 'Linh Kiện Khó Tìm' : 'Hard-to-find Parts',
                  desc: language === 'vi' ? 'In thay thế các linh kiện nhựa hỏng hóc trong thiết bị gia dụng, phụ kiện độ xe.' : 'Replacement parts for appliances or custom modding accessories.',
                  icon: <Wrench size={24} color="var(--color-accent)" />
                }
              ].map((service, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    {service.icon}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{service.title}</h4>
                    <p style={{ color: 'var(--color-text-muted)' }}>{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 1, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}
          >
            <img 
              src="/images/colorful_3d_models.png" 
              alt="Colorful 3D Printed Models" 
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};
