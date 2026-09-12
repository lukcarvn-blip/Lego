const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Quản lý bài viết
code = code.replace(
    '<h1 style={{ fontSize: \'clamp(1.5rem,3vw,2rem)\' }}><BookOpen size={28} style={{marginRight:8}}/> Quản lý bài viết</h1>\n                <p style={{ color: \'var(--color-text-muted)\', fontSize: \'0.875rem\' }}>{blogPosts.length} bài viết đã xuất bản</p>',
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
              </div>`
);

// Quản lý File
code = code.replace(
    '<h1 style={{ fontSize: \'clamp(1.5rem,3vw,2rem)\' }}><Folder size={28} style={{marginRight:8}}/> Quản lý File (Vietnix S3)</h1>\n                <p style={{ color: \'var(--color-text-muted)\', fontSize: \'0.875rem\' }}>{cloudFiles.length} tệp trong thư mục hiện tại</p>',
    `<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3.5rem', height: '3.5rem', background: 'rgba(74,222,128,0.1)', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.2)', color: 'var(--color-accent)' }}>
                  <Folder size={28} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h1 style={{ fontSize: 'clamp(1.25rem,2vw,1.5rem)', margin: 0, lineHeight: 1.2, fontWeight: 700 }}>
                    Quản lý File (Vietnix S3)
                  </h1>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', width: '100%' }}></div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>
                    {cloudFiles.length} tệp trong thư mục hiện tại
                  </p>
                </div>
              </div>`
);

// Quản lý thành viên (no subtext in original, I will add "X thành viên")
code = code.replace(
    '<h1 style={{ fontSize: \'clamp(1.5rem,3vw,2rem)\', marginBottom: \'1.5rem\' }}><Users size={28} style={{marginRight:8}}/> Quản lý thành viên</h1>',
    `<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3.5rem', height: '3.5rem', background: 'rgba(74,222,128,0.1)', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.2)', color: 'var(--color-accent)' }}>
                  <Users size={28} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h1 style={{ fontSize: 'clamp(1.25rem,2vw,1.5rem)', margin: 0, lineHeight: 1.2, fontWeight: 700 }}>
                    Quản lý thành viên
                  </h1>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', width: '100%' }}></div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>
                    {users.length} thành viên
                  </p>
                </div>
              </div>`
);

// Also need to remove the parent <div> wrapper for the first two if it was left empty, 
// wait, the regex above replaces the h1 and p tags, so it still leaves the <div>...</div> wrap.
// That is perfectly fine.

fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
