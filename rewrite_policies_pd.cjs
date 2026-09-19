const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const s1 = code.indexOf(`animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
            style={{ marginBottom: '2rem', marginTop: '2rem' }}
          >
            <h3`);

if (s1 === -1) {
  console.log("Could not find start");
  process.exit(1);
}

const e1 = code.indexOf(`{/* Policy 4 */}`, s1);
const e2 = code.indexOf(`</div>\n          </motion.div>`, e1);

const replacement = `animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
            style={{ marginBottom: '2rem', marginTop: '2rem' }}
          >
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem' }}>
                {language === 'vi' ? 'Đặc Quyền & Chính Sách' : 'Exclusive Policies'}
              </h3>
              
              <div className="policies-grid">
                {/* Policy 1 */}
                <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                  <ShieldCheck size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Bảo hành rơi vỡ' : 'Breakage Warranty'}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    {language === 'vi' ? 'Bảo hành rơi vỡ 1 lần miễn phí cho mọi sản phẩm.' : '1-time free replacement/warranty for accidental breakage.'}
                  </p>
                </div>
                
                {/* Policy 2 */}
                <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                  <Wrench size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Chế tác lại trọn đời' : 'Lifetime Re-crafting'}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    {language === 'vi' ? 'Hỗ trợ chế tác lại sản phẩm với giá tốt ưu đãi trọn đời.' : 'Lifetime support for re-crafting products at a favorable price.'}
                  </p>
                </div>

                {/* Policy 3 */}
                <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                  <Gift size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Dấu ấn cá nhân' : 'Personal Mark'}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    {language === 'vi' ? 'Khắc tên miễn phí lên mô hình cho bản thân hoặc làm quà tặng.' : 'Free name engraving on the model for yourself or as a gift.'}
                  </p>
                </div>

                {/* Policy 4 */}
                <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                  <RefreshCw size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Thu mua lại' : 'Trade-in Support'}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    {language === 'vi' ? 'Hỗ trợ thu mua lại các sản phẩm tùy theo tình trạng thực tế.' : 'Support for buying back products depending on their actual condition.'}
                  </p>
                </div>
              </div>
            </div>`;

code = code.substring(0, s1) + replacement + code.substring(e2);
fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Done rewriting ProductDetails.tsx policies');
