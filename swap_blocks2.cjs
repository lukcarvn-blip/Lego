const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const target = `<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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

          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto" }}>`;

const startIdx = code.indexOf(target);
if(startIdx === -1) {
  console.log("Could not find full target");
  process.exit(1);
}

const reqFormStartStr = `{/* Request Form */}`;
const reqFormEndStr = `</form>\n            )}\n          </div>\n          </div>`;
const rStart = code.indexOf(reqFormStartStr, startIdx);
const rEnd = code.indexOf(reqFormEndStr, startIdx) + reqFormEndStr.length;

const requestForm = code.substring(rStart, rEnd).replace(/<\/div>\s*<\/div>\s*$/, '</div>'); // remove the extra container closing div

const policies = `
          {/* Exclusive Policies */}
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>
            {language === 'vi' ? 'Đặc Quyền & Chính Sách' : 'Exclusive Policies'}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '0' }}>
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
`;

const replacement = `<div className="community-bottom-split">
            <div className="community-request-side">
              ${requestForm}
            </div>
            <div className="community-policies-side">
              ${policies}
            </div>
          </div>`;

// Replace from startIdx to rEnd
const newCode = code.substring(0, startIdx) + replacement + code.substring(rEnd);

fs.writeFileSync('src/pages/Community.tsx', newCode, 'utf8');
console.log('Successfully swapped blocks with correct tags');
