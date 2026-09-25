const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// Replace Intro
const oldIntro = `<div style={{ textAlign: 'left', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', color: 'var(--color-accent)' }}>
                <Layers size={32} />
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.3 }}>
                {language === 'vi' ? 'Sân chơi Mô hình Up-scale Cao cấp' : 'High-end Up-scale Model Playground'}
              </h2>
            </div>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              {language === 'vi' 
                ? 'Mục tiêu của chúng tôi là xây dựng một sân chơi mô hình được up-scale tương tự như các mô hình của BEARBRICK cao cấp. Chúng tôi muốn tạo ra một cộng đồng sưu tầm các mô hình độc bản được chế tác bằng công nghệ máy in 3D đa màu sắc tiên tiến nhất.' 
                : 'Our goal is to build a playground for up-scaled models similar to high-end BEARBRICKs. We want to create a collector community for unique models crafted using the most advanced multi-color 3D printing technology.'}
            </p>
          </div>`;

const newIntro = `<div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', height: '100%', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
              <Layers size={24} />
              {language === 'vi' ? 'Sân chơi Mô hình Up-scale Cao cấp' : 'High-end Up-scale Model Playground'}
            </h2>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.7 }}>
              {language === 'vi' 
                ? 'Mục tiêu của chúng tôi là xây dựng một sân chơi mô hình được up-scale tương tự như các mô hình của BEARBRICK cao cấp. Chúng tôi muốn tạo ra một cộng đồng sưu tầm các mô hình độc bản được chế tác bằng công nghệ máy in 3D đa màu sắc tiên tiến nhất.' 
                : 'Our goal is to build a playground for up-scaled models similar to high-end BEARBRICKs. We want to create a collector community for unique models crafted using the most advanced multi-color 3D printing technology.'}
            </p>
          </div>`;


// Replace Vision
const oldVision = `<div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
              <Star size={24} /> 
              {language === 'vi' ? 'Định Hướng Phát Triển' : 'Development Vision'}
            </h2>`;

const newVision = `<div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', height: '100%', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
              <Star size={24} /> 
              {language === 'vi' ? 'Định Hướng Phát Triển' : 'Development Vision'}
            </h2>`;

// Manual find and replace
if (code.includes('High-end Up-scale Model Playground')) {
  // Intro replacement via regex because exact string matching on spacing might fail
  code = code.replace(/<div style={{ textAlign: 'left', marginBottom: '3rem' }}>[\s\S]*?<\/div>[\s]*<\/div>[\s]*<div className="community-header-vision">/, newIntro + '\n          </div>\n          <div className="community-header-vision">');
  code = code.replace(oldVision, newVision);
  fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
  console.log('Fixed styling via regex');
} else {
  console.log('Failed');
}
