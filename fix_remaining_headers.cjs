const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// ==============================================================================
// 1. FIX DASHBOARD HEADER
// ==============================================================================
code = code.replace(
  `<h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '0.5rem' }}><BarChart2 size={28} style={{marginRight:8}}/> Dashboard</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Tổng quan hệ thống LEGATO</p>`,
  `<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3.5rem', height: '3.5rem', background: 'rgba(74,222,128,0.1)', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.2)', color: 'var(--color-accent)' }}>
                  <BarChart2 size={28} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h1 style={{ fontSize: 'clamp(1.25rem,2vw,1.5rem)', margin: 0, lineHeight: 1.2, fontWeight: 700 }}>Dashboard</h1>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', width: '100%' }}></div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>Tổng quan hệ thống LEGATO</p>
                </div>
              </div>`
);

// ==============================================================================
// 2. FIX BLOG HEADER (the old style with icon inline)
// ==============================================================================
code = code.replace(
  `<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3.5rem', height: '3.5rem', background: 'rgba(74,222,128,0.1)', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.2)', color: 'var(--color-accent)' }}>
                  <BookOpen size={28} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h1 style={{ fontSize: 'clamp(1.25rem,2vw,1.5rem)', margin: 0, lineHeight: 1.2, fontWeight: 700 }}>
                    Quản lý bài viết
                  </h1>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', width: '100%' }}></div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>
                    {blogPosts.length} bài viết đã xuất bản
                  </p>
                </div>
              </div>`,
  `<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3.5rem', height: '3.5rem', background: 'rgba(74,222,128,0.1)', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.2)', color: 'var(--color-accent)' }}>
                  <BookOpen size={28} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h1 style={{ fontSize: 'clamp(1.25rem,2vw,1.5rem)', margin: 0, lineHeight: 1.2, fontWeight: 700 }}>Quản lý bài viết</h1>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', width: '100%' }}></div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>{blogPosts.length} bài viết đã xuất bản</p>
                </div>
              </div>`
);

// ==============================================================================
// 3. FIX FILE MANAGER HEADER (old style)
// ==============================================================================
code = code.replace(
  `<h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}><Folder size={28} style={{marginRight:8}}/> Quản lý File (Vietnix S3)</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{cloudFiles.length} tệp trong thư mục hiện tại</p>`,
  `<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3.5rem', height: '3.5rem', background: 'rgba(74,222,128,0.1)', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.2)', color: 'var(--color-accent)' }}>
                  <Folder size={28} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h1 style={{ fontSize: 'clamp(1.25rem,2vw,1.5rem)', margin: 0, lineHeight: 1.2, fontWeight: 700 }}>Quản lý File (Vietnix S3)</h1>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', width: '100%' }}></div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>{cloudFiles.length} tệp trong thư mục hiện tại</p>
                </div>
              </div>`
);

fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
console.log('Done!');
