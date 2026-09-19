const fs = require('fs');

const file1 = 'src/pages/Products.tsx';
let code1 = fs.readFileSync(file1, 'utf8');

const oldAd1 = `<Zap size={48} color="var(--color-accent)" style={{ marginBottom: '1.5rem' }} className="flash-shake" />
                      <p style={{ color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}><Zap size={14} style={{display:'inline-block', verticalAlign:'middle', marginRight:'4px'}}/> Flash Deal</p>
                      <h3 className="ad-title" style={{ fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem', color: '#fff' }}>
                        {language === 'vi' ? 'Giảm 40%' : '40% OFF'}<br/>Marvel Sets
                      </h3>
                      <Link to="/category/superheroes?q=marvel" style={{ textDecoration: 'none', width: '100%', marginTop: 'auto' }}>
                        <motion.button whileHover={{ scale: 1.05 }} style={{ width: '100%', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.8rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                          {language === 'vi' ? 'Mua Ngay' : 'Shop Now'}
                        </motion.button>
                      </Link>`;

const newAd = `<Icons.MessageSquarePlus size={48} color="var(--color-accent)" style={{ marginBottom: '1.5rem' }} className="flash-shake" />
                      <p style={{ color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        <Icons.Star size={14} style={{display:'inline-block', verticalAlign:'middle', marginRight:'4px'}}/> {language === 'vi' ? 'FAN CỨNG' : 'TOP FAN'}
                      </p>
                      <h3 className="ad-title" style={{ fontWeight: 800, lineHeight: 1.3, marginBottom: '0.5rem', color: '#fff', fontSize: '1.25rem' }}>
                        {language === 'vi' ? 'NHÂN VẬT TIẾP THEO?' : 'NEXT CHARACTER?'}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                        {language === 'vi' ? 'Hãy trở thành FAN CỨNG và gửi yêu cầu cho chúng tôi' : 'Become a TOP FAN and send us your request'}
                      </p>
                      <Link to="/community" style={{ textDecoration: 'none', width: '100%', marginTop: 'auto' }}>
                        <motion.button whileHover={{ scale: 1.05 }} style={{ width: '100%', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.8rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                          {language === 'vi' ? 'Gửi Yêu Cầu' : 'Send Request'}
                        </motion.button>
                      </Link>`;

if (code1.includes('Flash Deal')) {
  code1 = code1.replace(oldAd1, newAd);
  fs.writeFileSync(file1, code1, 'utf8');
}


const file2 = 'src/pages/Home.tsx';
let code2 = fs.readFileSync(file2, 'utf8');

const oldAd2 = `<Zap size={48} color="var(--color-accent)" style={{ marginBottom: '1.5rem' }} className="flash-shake" />
                    <p style={{ color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}><Zap size={14} style={{display:'inline-block', verticalAlign:'middle', marginRight:'4px'}}/> Flash Deal</p>
                    <h3 className="ad-title" style={{ fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem', color: '#fff' }}>
                      {language === 'vi' ? 'Giảm 40%' : '40% OFF'}<br/>Marvel Sets
                    </h3>
                    <Link to="/category/superheroes?q=marvel" style={{ textDecoration: 'none', width: '100%', marginTop: 'auto' }}>
                      <motion.button whileHover={{ scale: 1.05 }} style={{ width: '100%', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.8rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                        {language === 'vi' ? 'Mua Ngay' : 'Shop Now'}
                      </motion.button>
                    </Link>`;
                    
const newAd2 = `<Icons.MessageSquarePlus size={48} color="var(--color-accent)" style={{ marginBottom: '1.5rem' }} className="flash-shake" />
                    <p style={{ color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      <Icons.Star size={14} style={{display:'inline-block', verticalAlign:'middle', marginRight:'4px'}}/> {language === 'vi' ? 'FAN CỨNG' : 'TOP FAN'}
                    </p>
                    <h3 className="ad-title" style={{ fontWeight: 800, lineHeight: 1.3, marginBottom: '0.5rem', color: '#fff', fontSize: '1.25rem' }}>
                      {language === 'vi' ? 'NHÂN VẬT TIẾP THEO?' : 'NEXT CHARACTER?'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                      {language === 'vi' ? 'Hãy trở thành FAN CỨNG và gửi yêu cầu cho chúng tôi' : 'Become a TOP FAN and send us your request'}
                    </p>
                    <Link to="/community" style={{ textDecoration: 'none', width: '100%', marginTop: 'auto' }}>
                      <motion.button whileHover={{ scale: 1.05 }} style={{ width: '100%', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.8rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                        {language === 'vi' ? 'Gửi Yêu Cầu' : 'Send Request'}
                      </motion.button>
                    </Link>`;

if (code2.includes('Flash Deal')) {
  code2 = code2.replace(oldAd2, newAd2);
  fs.writeFileSync(file2, code2, 'utf8');
}
