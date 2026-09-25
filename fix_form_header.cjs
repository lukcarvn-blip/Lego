const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const target = `<MessageSquarePlus size={32} style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {language === 'vi' ? 'Gửi Đề Xuất Nhân Vật Mới' : 'Submit New Character Request'}
              </h2>`;

const replacement = `<h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0 }}>
                <MessageSquarePlus size={32} style={{ color: 'var(--color-accent)' }} />
                {language === 'vi' ? 'Gửi Đề Xuất Nhân Vật Mới' : 'Submit New Character Request'}
              </h2>`;

if (code.includes('Gửi Đề Xuất Nhân Vật Mới')) {
  if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
    console.log('Fixed Form header (exact match)');
  } else {
    // Regex fallback
    const regex = /<MessageSquarePlus[^>]*>[\s\S]*?<h2[^>]*>[\s\S]*?Gửi Đề Xuất Nhân Vật Mới[\s\S]*?<\/h2>/;
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
    console.log('Fixed Form header (regex match)');
  }
} else {
  console.log('Could not find text');
}
