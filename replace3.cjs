const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const replacements = {
    '<div style={{ fontSize: \'4rem\', marginBottom: \'1rem\' }}>🔒</div>': '<div style={{ marginBottom: \'1rem\' }}><AlertTriangle size={64} color="#ef4444" /></div>',
    '📝 Thông tin cơ bản': '<Info size={18} style={{marginRight:6}}/> Thông tin cơ bản',
    '🖼 Hình ảnh & Video': '<ImageIcon size={18} style={{marginRight:6}}/> Hình ảnh & Video',
    '🚀 Đăng bài viết': '<span><Send size={16} style={{marginRight:6}}/> Đăng bài viết</span>',
    '\'❤️\', \'👁\'': '<Heart size={14} />, <Eye size={14} />',
    '{[\'Ảnh\', \'SKU\', \'Tên sản phẩm\', \'Danh mục\', \'Giá\', \'Tồn kho\', <Heart size={14} />, <Eye size={14} />, \'Sale\', \'Thao tác\'].map(h => (': '{[\'Ảnh\', \'SKU\', \'Tên sản phẩm\', \'Danh mục\', \'Giá\', \'Tồn kho\', <Heart size={14} />, <Eye size={14} />, \'Sale\', \'Thao tác\'].map((h, i) => (',
    '<th key={h} style={{ padding: \'0.75rem 1rem\' }}>{h}</th>': '<th key={typeof h === \'string\' ? h : i} style={{ padding: \'0.75rem 1rem\' }}>{h}</th>'
};

for (const [oldVal, newVal] of Object.entries(replacements)) {
    content = content.replaceAll(oldVal, newVal);
}

fs.writeFileSync('src/pages/Admin.tsx', content, 'utf8');
