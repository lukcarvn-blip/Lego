import re
with open('src/pages/Admin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    '<h1>📦 Quản lý đơn hàng</h1>': '<h1 style={{ display: \'flex\', alignItems: \'center\' }}><Package size={28} style={{marginRight:8}}/> Quản lý đơn hàng</h1>',
    '<h1 style={{ fontSize: \'clamp(1.5rem,3vw,2rem)\' }}>📦 Quản lý đơn hàng</h1>': '<h1 style={{ fontSize: \'clamp(1.5rem,3vw,2rem)\', display: \'flex\', alignItems: \'center\' }}><Package size={28} style={{marginRight:8}}/> Quản lý đơn hàng</h1>',
    '\'✍️ Viết bài mới\'': '<span><PenTool size={24} style={{marginRight:8}}/> Viết bài mới</span>',
    '\'📝 Đăng bài viết\'': '<span><Send size={16} style={{marginRight:6}}/> Đăng bài viết</span>',
    '>💾 Lưu cài đặt</button>': ' style={{ display: \'flex\', alignItems: \'center\', gap: \'0.5rem\' }}><Save size={18} /> Lưu cài đặt</button>',
    '🚀 Tăng tốc': 'Tăng tốc',
    '<div style={{ fontSize: \'4rem\', marginBottom: \'1rem\' }}>🛑</div>': '<div style={{ marginBottom: \'1rem\' }}><AlertTriangle size={64} color=\"#ef4444\" /></div>',
    'ℹ️ Thông tin cơ bản': '<Info size={18} style={{marginRight:6}}/> Thông tin cơ bản',
    '📸 Hình ảnh & Video': '<ImageIcon size={18} style={{marginRight:6}}/> Hình ảnh & Video',
    '💰 Giá & Loại bán': '<DatabaseZap size={18} style={{marginRight:6}}/> Giá & Loại bán',
    '📦 Tồn kho & Giao hàng': '<Box size={18} style={{marginRight:6}}/> Tồn kho & Giao hàng',
    '🧪 Loại nhựa': '<Sparkles size={18} style={{marginRight:6}}/> Loại nhựa',
    '📐 Kích thước có sẵn': '<LayoutGrid size={18} style={{marginRight:6}}/> Kích thước có sẵn',
    '📏 Kích thước sản phẩm': '<LayoutDashboard size={18} style={{marginRight:6}}/> Kích thước sản phẩm',
    '\'📁\'': '<Folder size={14} />',
    '>👤</div>': '><User size={20} /></div>'
}

for old, new_val in replacements.items():
    content = content.replace(old, new_val)

with open('src/pages/Admin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
