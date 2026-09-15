const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// 1. Add MessageSquare to imports
const importRegex = /import \{([^}]+)\} from 'lucide-react';/;
code = code.replace(importRegex, (match, p1) => {
  if (!p1.includes('MessageSquare')) {
    return `import {${p1}, MessageSquare} from 'lucide-react';`;
  }
  return match;
});

// 2. Destructure reviews and functions from useStore
const destructureRegex = /appUsers, currentUserRole, updateUserRole, deleteUser, user, logout, loginWithGoogle \} = useStore\(\);/;
code = code.replace(destructureRegex, 'appUsers, currentUserRole, updateUserRole, deleteUser, user, logout, loginWithGoogle, reviews, updateReviewStatus, deleteReview } = useStore();');

// 3. Add to tabs
const tabsRegex = /\{ id: 'members', label: 'Thành viên', icon: <Users size=\{18\} \/> \},/;
if (code.match(tabsRegex) && !code.includes("{ id: 'reviews'")) {
  code = code.replace(tabsRegex, `{ id: 'members', label: 'Thành viên', icon: <Users size={18} /> },
      { id: 'reviews', label: 'Đánh giá', icon: <MessageSquare size={18} /> },`);
}

// 4. Create the Review UI Block and inject
const reviewsUI = `
        {/* ── REVIEWS TAB ───────────────────────────────────────────── */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3.5rem', height: '3.5rem', background: 'rgba(74,222,128,0.1)', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.2)', color: 'var(--color-accent)' }}>
                <MessageSquare size={28} />
              </div>
              <div>
                <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', margin: 0, lineHeight: 1.2, fontWeight: 700 }}>Quản lý Đánh giá</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>{reviews?.length || 0} đánh giá</p>
              </div>
            </div>

            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Người dùng</th>
                      <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Đánh giá</th>
                      <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Trạng thái</th>
                      <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Ngày</th>
                      <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(reviews || []).slice().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(review => (
                      <tr key={review.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {review.userAvatar ? (
                              <img src={review.userAvatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                            ) : (
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Users size={16} />
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: 600 }}>{review.userName}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', maxWidth: '300px' }}>
                          <div style={{ color: '#fbbf24', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{'★'.repeat(review.rating)}</div>
                          <div style={{ fontSize: '0.875rem', color: '#ccc', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{review.content}</div>
                          
                          {/* MEDIA DISPLAY */}
                          {(review.images?.length || review.video) && (
                            <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                              {review.video && <video src={review.video} style={{ height: '40px', borderRadius: '2px' }} />}
                              {review.images?.map((img, i) => (
                                <img key={i} src={img} style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '2px' }} />
                              ))}
                            </div>
                          )}

                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                            background: review.status === 'APPROVED' ? 'rgba(74,222,128,0.1)' : review.status === 'REJECTED' ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.1)',
                            color: review.status === 'APPROVED' ? '#4ade80' : review.status === 'REJECTED' ? '#ef4444' : '#fbbf24'
                          }}>
                            {review.status === 'APPROVED' ? 'Đã duyệt' : review.status === 'REJECTED' ? 'Đã ẩn' : 'Chờ duyệt'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {review.status !== 'APPROVED' && (
                              <button onClick={() => updateReviewStatus(review.id, 'APPROVED')} title="Duyệt" style={{ padding: '6px', background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                <CheckCircle size={16} />
                              </button>
                            )}
                            {review.status !== 'REJECTED' && (
                              <button onClick={() => updateReviewStatus(review.id, 'REJECTED')} title="Từ chối/Ẩn" style={{ padding: '6px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                <X size={16} />
                              </button>
                            )}
                            <button onClick={() => { if(confirm('Xóa vĩnh viễn đánh giá này?')) deleteReview(review.id); }} title="Xóa" style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', color: '#aaa', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!reviews || reviews.length === 0) && (
                      <tr>
                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Chưa có đánh giá nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
`;

const settingsTabAnchor = /\{\/\* ── SETTINGS TAB/;
if (code.match(settingsTabAnchor) && !code.includes('REVIEWS TAB')) {
  code = code.replace(settingsTabAnchor, reviewsUI + '\n        $&');
  console.log('Injected reviews into Admin.tsx successfully');
} else {
  console.log('Match failed or already exists');
}

fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
