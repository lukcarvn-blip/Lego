const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// 1. Update Swiper Props: remove navigation, add slideToClickedSlide
code = code.replace(/pagination=\{\{ clickable: true, dynamicBullets: true \}\}\s*navigation=\{true\}\s*modules=\{\[EffectCoverflow, Pagination, Navigation\]\}/,
`pagination={{ clickable: true, dynamicBullets: true }}
                            navigation={false}
                            slideToClickedSlide={true}
                            modules={[EffectCoverflow, Pagination]}`); // removing Navigation from modules array, though keeping it is fine, we just set navigation={false}. Actually, we can just remove navigation prop and keep modules same to avoid import errors.

code = code.replace(/navigation=\{true\}/, 'navigation={false}\n                            slideToClickedSlide={true}');

// 2. Fix the loop logic to include rank
const oldLoopLogic = `let displayProducts = col.products;
                            if (displayProducts.length > 0 && displayProducts.length < 10) {
                              while (displayProducts.length < 10) {
                                displayProducts = [...displayProducts, ...col.products];
                              }
                            }
                            return displayProducts.map((char: any, idx: number) => (
                              <SwiperSlide key={\`\${char.id}-\${idx}\`} style={{ width: '280px', height: 'auto' }}>

                            <div onClick={() => navigate(\`/product/\${char.id}\`)}`;

const newLoopLogic = `let displayProducts = col.products.map((p: any, i: number) => ({...p, rank: i + 1}));
                            if (displayProducts.length > 0 && displayProducts.length < 10) {
                              const original = [...displayProducts];
                              while (displayProducts.length < 10) {
                                displayProducts = [...displayProducts, ...original];
                              }
                            }
                            return displayProducts.map((char: any, idx: number) => (
                              <SwiperSlide key={\`\${char.id}-\${idx}\`} style={{ width: '280px', height: 'auto' }}>
                              {({ isActive }) => (
                                <div onClick={() => isActive && navigate(\`/product/\${char.id}\`)}`;

code = code.replace(oldLoopLogic, newLoopLogic);

// 3. Add Rank Badge and move Alignment badge down
// Original alignment badge: 
// {/* Alignment Badge over image */}
// {char.alignment && (
//   <div style={{ 
//     position: 'absolute', top: '10px', left: '10px', 
//     background: char.alignment === 'Hero' ? 'rgba(59, 130, 246, 0.8)' : (char.alignment === 'Villain' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(168, 162, 158, 0.8)'),

const oldAlignment = `{/* Alignment Badge over image */}
                                {char.alignment && (
                                  <div style={{ 
                                    position: 'absolute', top: '10px', left: '10px',`;

const newAlignment = `{/* Rank Badge */}
                                <div style={{ 
                                  position: 'absolute', top: '10px', left: '10px', zIndex: 10,
                                  background: 'var(--color-accent)', color: '#000',
                                  width: '32px', height: '32px', borderRadius: '8px',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                }}>
                                  #{char.rank}
                                </div>

                                {/* Alignment Badge over image */}
                                {char.alignment && (
                                  <div style={{ 
                                    position: 'absolute', top: '48px', left: '10px',`;

code = code.replace(oldAlignment, newAlignment);

// 4. Close the {({ isActive }) => ( ... )} wrapper
// Find the end of SwiperSlide
const oldSlideEnd = `</div>
                            </div>
                            </SwiperSlide>
                          ))})()}`;

const newSlideEnd = `</div>
                            </div>
                            )}
                            </SwiperSlide>
                          ))})()}`;

code = code.replace(oldSlideEnd, newSlideEnd);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Applied slideToClickedSlide and Rank Badges');
