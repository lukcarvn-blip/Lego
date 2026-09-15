const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const tdAnchor = `<div style={{ fontSize: '0.875rem', color: '#ccc', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{review.content}</div>
                        </td>`;

const tdNew = `<div style={{ fontSize: '0.875rem', color: '#ccc', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{review.content}</div>
                          {(review.images?.length || review.video) && (
                            <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                              {review.video && <video src={review.video} style={{ height: '40px', borderRadius: '2px' }} />}
                              {review.images?.map((img, i) => (
                                <img key={i} src={img} style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '2px' }} />
                              ))}
                            </div>
                          )}
                        </td>`;

if (code.includes(tdAnchor) && !code.includes('review.images?.map')) {
  code = code.replace(tdAnchor, tdNew);
  fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
  console.log('Patched Admin.tsx with media render');
} else {
  console.log('Match not found or already patched');
}
