const fs = require('fs');

function replaceFlashDeal(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find start and end indices of the Flash Deal content
  const startStr = '<Zap size={48} color="var(--color-accent)"';
  const endStr = '</Link>';
  
  const startIdx = content.indexOf(startStr);
  if (startIdx !== -1) {
    const nextLinkEnd = content.indexOf(endStr, startIdx);
    if (nextLinkEnd !== -1) {
      const endIdx = nextLinkEnd + endStr.length;
      
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
                      
      content = content.substring(0, startIdx) + newAd + content.substring(endIdx);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + filePath);
    }
  }
}

replaceFlashDeal('src/pages/Products.tsx');
replaceFlashDeal('src/pages/Home.tsx');
