const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('src/App.tsx', [
  ['⚠️ {dataError}', '<AlertTriangle size={16} style={{marginRight:\'4px\'}} /> {dataError}']
]);

replaceInFile('src/pages/Admin.tsx', [
  ['from \'lucide-react\';', ', Clock, CheckCircle, PenTool, Image as ImageIcon, Settings, Save, Send, Plus, Edit2, Package, Wrench, Zap, Key, Box, ShoppingCart, User, Info, FileText } from \'lucide-react\';'],
  ['\\'⏳ Chờ xử lý\\'', '\\'Chờ xử lý\\''],
  ['\\'🛠 Đang chế tác\\'', '\\'Đang chế tác\\''],
  ['\\'🚚 Đang giao\\'', '\\'Đang giao\\''],
  ['\\'✅ Đã giao\\'', '\\'Đã giao\\''],
  ['\\'⚡ Làm gấp\\'', '<><Zap size={14} style={{marginRight:4}}/> Làm gấp</>'],
  ['{product.stock <= 3 && \\'⚠ \\'}{product.stock}', '{product.stock <= 3 && <AlertTriangle size={14} style={{display:\\'inline-block\\', verticalAlign:\\'middle\\', marginRight: 4}}/>}{product.stock}'],
  ['\⚡ -%\', '<><Zap size={14} style={{display:\\'inline-block\\', verticalAlign:\\'middle\\'}}/> -{product.discountPercentage}%</>'],
  ['\\'✏️ Sửa sản phẩm\\'', '<><Edit2 size={24} style={{marginRight:8}}/> Sửa sản phẩm</>'],
  ['\\'➕ Thêm sản phẩm mới\\'', '<><Plus size={24} style={{marginRight:8}}/> Thêm sản phẩm mới</>'],
  ['\\'✏️ Chỉnh sửa bài viết\\'', '<><Edit2 size={24} style={{marginRight:8}}/> Chỉnh sửa bài viết</>'],
  ['\\'📝 Viết bài mới\\'', '<><PenTool size={24} style={{marginRight:8}}/> Viết bài mới</>'],
  ['\\'💾 Lưu thay đổi\\'', '<><Save size={16} style={{marginRight:6}}/> Lưu thay đổi</>'],
  ['\\'🚀 Thêm\\'', '<><Plus size={16} style={{marginRight:6}}/> Thêm</>'],
  ['\\'💾 Cập nhật bài viết\\'', '<><Save size={16} style={{marginRight:6}}/> Cập nhật bài viết</>'],
  ['\\'🚀 Đăng\\'', '<><Send size={16} style={{marginRight:6}}/> Đăng</>'],
  ['\\'💾 Lưu Cài đặt\\'', '<><Save size={16} style={{marginRight:6}}/> Lưu Cài đặt</>'],
  ['📊 Dashboard', '<BarChart2 size={28} style={{marginRight:8}}/> Dashboard'],
  ['📦 Quản lý Đơn hàng', '<Package size={28} style={{marginRight:8}}/> Quản lý Đơn hàng'],
  ['🖨️ Quản lý máy in', '<Printer size={28} style={{marginRight:8}}/> Quản lý máy in'],
  ['🛍️ Quản lý sản phẩm', '<ShoppingBag size={28} style={{marginRight:8}}/> Quản lý sản phẩm'],
  ['📝 Quản lý bài viết', '<BookOpen size={28} style={{marginRight:8}}/> Quản lý bài viết'],
  ['🗂 Quản lý File (Vietnix S3)', '<Folder size={28} style={{marginRight:8}}/> Quản lý File (Vietnix S3)'],
  ['👥 Quản lý thành viên', '<Users size={28} style={{marginRight:8}}/> Quản lý thành viên'],
  ['⚙️ Cài đặt Website', '<Settings size={28} style={{marginRight:8}}/> Cài đặt Website'],
  ['🔑 Đăng nhập bằng Google', '<Key size={18} style={{marginRight:8}}/> Đăng nhập bằng Google'],
  ['🖼️', '<ImageIcon size={14} style={{marginRight:4}}/>']
]);
