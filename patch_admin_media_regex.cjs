const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /WebkitBoxOrient: 'vertical', overflow: 'hidden' \}\}>\{review\.content\}<\/div>\s*<\/td>/;

if (code.match(regex) && !code.includes('review.images?.map')) {
  code = code.replace(regex, `WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{review.content}</div>
                          {(review.images?.length || review.video) && (
                            <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                              {review.video && <video src={review.video} style={{ height: '40px', borderRadius: '2px' }} />}
                              {review.images?.map((img, i) => (
                                <img key={i} src={img} style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '2px' }} />
                              ))}
                            </div>
                          )}
                        </td>`);
  fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
  console.log('Patched Admin.tsx media');
} else {
  console.log('Match not found');
}
