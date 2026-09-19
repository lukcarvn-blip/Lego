const fs = require('fs');

let pdCode = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Insert imports
if (!pdCode.includes('ShieldCheck')) {
  pdCode = pdCode.replace('ShoppingBag, ChevronDown', 'ShieldCheck, RefreshCw, ShoppingBag, ChevronDown');
}

const policiesHTML = `          {/* Exclusive Policies */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
            style={{ marginBottom: '2rem', marginTop: '2rem' }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>
              {language === 'vi' ? 'Đặc Quyền & Chính Sách' : 'Exclusive Policies'}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
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
          </motion.div>

          {/* Crafting Progress Bar UI */}`;

pdCode = pdCode.replace('{/* Crafting Progress Bar UI */}', policiesHTML);

fs.writeFileSync('src/pages/ProductDetails.tsx', pdCode, 'utf8');
console.log('Inserted Policies into ProductDetails.tsx');
