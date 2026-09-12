const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// 1. Calculate the new notification conditions
const variablesToAdd = `
  // Notification Center Logics
  const lastBlogDate = blogPosts.length > 0 ? new Date([...blogPosts].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date).getTime() : 0;
  const daysSinceLastBlog = Math.floor((new Date().getTime() - lastBlogDate) / (1000 * 3600 * 24));
  const needsBlogUpdate = daysSinceLastBlog >= 3 || blogPosts.length === 0;
  
  const lowStockProducts = products.filter(p => p.stock <= 3);
  const needsOrderAttention = pendingCount > 0 || craftingCount > 0;
  const needsRevenuePush = todayRevenue < 1000000;
`;

code = code.replace(
  "const totalRevenue = orders.reduce((s, o) => s + o.total, 0);",
  "const totalRevenue = orders.reduce((s, o) => s + o.total, 0);\n" + variablesToAdd
);


// 2. The New Notification Center JSX
const notificationCenterJSX = `
            {/* 🔔 NOTIFICATION CENTER */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              
              {/* 1. Low Stock Warning */}
              {lowStockProducts.length > 0 && (
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', color: '#ef4444', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={18} /> Cảnh báo tồn kho thấp
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {lowStockProducts.slice(0, 3).map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.9)' }}>{p.name.vi}</span>
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>Còn {p.stock}</span>
                      </div>
                    ))}
                    {lowStockProducts.length > 3 && (
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>+ {lowStockProducts.length - 3} sản phẩm khác...</span>
                    )}
                  </div>
                </div>
              )}

              {/* 2. Blog Reminder */}
              {needsBlogUpdate && (
                <div style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', color: '#eab308', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PenTool size={18} /> Nhắc nhở đăng bài
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>
                    Đã <strong>{blogPosts.length === 0 ? 'rất lâu' : daysSinceLastBlog + ' ngày'}</strong> chưa có bài viết mới. Hãy thường xuyên cập nhật tin tức để duy trì tương tác!
                  </p>
                  <button onClick={() => { setActiveTab('blog'); setEditingBlogPost({}); setIsEditingBlog(true); }} style={{ marginTop: '0.75rem', fontSize: '0.8rem', background: 'rgba(234,179,8,0.2)', color: '#fde047', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                    Đăng bài ngay
                  </button>
                </div>
              )}

              {/* 3. Order Notifications */}
              {needsOrderAttention && (
                <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', color: '#3b82f6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={18} /> Thông báo đơn hàng
                  </h3>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {pendingCount > 0 && <li>Có <strong>{pendingCount}</strong> đơn hàng đang chờ xác nhận.</li>}
                    {craftingCount > 0 && <li>Có <strong>{craftingCount}</strong> đơn đang sản xuất.</li>}
                  </ul>
                  <button onClick={() => setActiveTab('orders')} style={{ marginTop: '0.75rem', fontSize: '0.8rem', background: 'rgba(59,130,246,0.2)', color: '#93c5fd', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                    Xử lý ngay
                  </button>
                </div>
              )}

              {/* 4. Revenue Push */}
              {needsRevenuePush && (
                <div style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', color: '#a855f7', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={18} /> Nhắc nhở doanh thu
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>
                    Doanh thu hôm nay mới đạt <strong>{formatVND(todayRevenue)}</strong>. Hãy thử setup Flash Sale hoặc đăng bài chia sẻ để đẩy số ngay!
                  </p>
                  <button onClick={() => { setActiveTab('products'); }} style={{ marginTop: '0.75rem', fontSize: '0.8rem', background: 'rgba(168,85,247,0.2)', color: '#d8b4fe', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                    Set Flash Sale
                  </button>
                </div>
              )}
            </div>`;

code = code.replace(
  "{/* Stats grid */}",
  notificationCenterJSX + "\n\n            {/* Stats grid */}"
);


// 3. Remove the old low stock alert logic at the bottom
// Using regex to match from `{/* Low stock alert */}` up to `)}` before `</div>` 
// We know it is roughly at lines 744 to 760. Let's just string split / replace.
const oldLowStockRegex = /\{\/\*\s*Low stock alert\s*\*\/\}[\s\S]*?\)\}/;
// Wait, the regex might be tricky. Let's find exactly the old code block
const oldLowStockBlock = `{/* Low stock alert */}
            {products.filter(p => p.stock <= 3).length > 0 && (
              <div style={{ ...panelStyle, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                  <AlertTriangle size={18} /> Cảnh báo tồn kho thấp
                </h2>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {products.filter(p => p.stock <= 3).map(p => (
                    <div key={p.id} style={{ background: 'rgba(239,68,68,0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.name.vi}</p>
                      <p style={{ fontSize: '0.75rem', color: '#ef4444' }}>Còn {p.stock} sản phẩm</p>
                    </div>
                  ))}
                </div>
              </div>
            )}`;

if(code.includes(oldLowStockBlock)) {
    code = code.replace(oldLowStockBlock, "");
} else {
    console.log("Could not find old low stock block");
}

// 4. Ensure AlertTriangle and formatVND exist or are properly imported. formatVND is in the same file. 
// Wait! I need to check if formatVND is available globally in the file or if I should use formatPrice.
// formatVND(amount) exists in Admin.tsx at line 217! Yes, it's defined inside the component!
// What about AlertTriangle? Let's check imports.
if (!code.includes('AlertTriangle')) {
    code = code.replace(/import \{([^\}]+)\} from 'lucide-react';/, "import { AlertTriangle, $1 } from 'lucide-react';");
}

fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
