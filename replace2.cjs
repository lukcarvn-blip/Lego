const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const replacements = {
    '<div style={{ fontSize: \'4rem\', marginBottom: \'1rem\' }}>🔒</div>': '<div style={{ marginBottom: \'1rem\' }}><AlertTriangle size={64} color="#ef4444" /></div>',
    '📝 Thông tin cơ bản': '<Info size={18} style={{marginRight:6}}/> Thông tin cơ bản',
    '🖼 Hình ảnh & Video': '<ImageIcon size={18} style={{marginRight:6}}/> Hình ảnh & Video',
    '🚀 Đăng bài viết': '<span><Send size={16} style={{marginRight:6}}/> Đăng bài viết</span>',
    '🤖 AI đã tự động': '<Sparkles size={16} style={{marginRight:6, display:"inline"}} /> AI đã tự động',
    '\'❤️\', \'👁\'': 'Heart, Eye'
};

for (const [oldVal, newVal] of Object.entries(replacements)) {
    content = content.replaceAll(oldVal, newVal);
}

fs.writeFileSync('src/pages/Admin.tsx', content, 'utf8');
