const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Move heart button
const oldTitleBlock = `              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>{product.name[language]}</h1>\r
              <motion.button \r
                whileTap={{ scale: 0.9 }}\r
                onClick={handleLike}\r
                style={{ padding: '0.5rem', background: isLiked ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass-bg)', borderRadius: '50%', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s' }}\r
              >\r
                <Heart size={24} color={isLiked ? '#ef4444' : 'currentColor'} fill={isLiked ? '#ef4444' : 'none'} />\r
              </motion.button>\r
            </div>`;

const newTitleBlock = `              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>{product.name[language]}</h1>\r
            </div>`;

if (code.includes(oldTitleBlock)) code = code.replace(oldTitleBlock, newTitleBlock);
else if (code.includes(oldTitleBlock.replace(/\\r\\n/g, '\\n'))) code = code.replace(oldTitleBlock.replace(/\\r\\n/g, '\\n'), newTitleBlock.replace(/\\r\\n/g, '\\n'));
else console.log("oldTitleBlock not found");

// 2. Replace maximize button
const oldMaximize = `                {/* Maximize Button */}\r
                <button \r
                  onClick={() => setIsLightboxOpen(true)}\r
                  style={{\r
                    position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 30,\r
                    background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid var(--glass-border)',\r
                    borderRadius: '50%', width: '44px', height: '44px',\r
                    display: 'flex', alignItems: 'center', justifyContent: 'center',\r
                    cursor: 'pointer', backdropFilter: 'blur(5px)', transition: 'all 0.2s'\r
                  }}\r
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.color = '#000'; }}\r
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; e.currentTarget.style.color = '#fff'; }}\r
                >\r
                  <Maximize size={20} />\r
                </button>`;

const newHeartBlock = `                {/* Heart Button */}\r
                <motion.button \r
                  whileTap={{ scale: 0.9 }}\r
                  onClick={handleLike}\r
                  style={{\r
                    position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 30,\r
                    background: isLiked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)',\r
                    borderRadius: '50%', width: '44px', height: '44px',\r
                    display: 'flex', alignItems: 'center', justifyContent: 'center',\r
                    cursor: 'pointer', backdropFilter: 'blur(5px)', transition: 'all 0.2s'\r
                  }}\r
                  onMouseEnter={e => { if (!isLiked) { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; } }}\r
                  onMouseLeave={e => { if (!isLiked) { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; } }}\r
                >\r
                  <Heart size={20} color={isLiked ? '#ef4444' : '#fff'} fill={isLiked ? '#ef4444' : 'none'} />\r
                </motion.button>`;

if (code.includes(oldMaximize)) code = code.replace(oldMaximize, newHeartBlock);
else if (code.includes(oldMaximize.replace(/\\r\\n/g, '\\n'))) code = code.replace(oldMaximize.replace(/\\r\\n/g, '\\n'), newHeartBlock.replace(/\\r\\n/g, '\\n'));
else console.log("oldMaximize not found");

// 3. Make main image clickable
const oldImgStyle = `                    alt={product.name[language as keyof typeof product.name]} \r
                    style={{ \r
                      width: '100%', \r
                      height: '100%', \r
                      objectFit: 'contain',\r
                      position: 'absolute'\r
                    }} \r
                  />`;

const newImgStyle = `                    alt={product.name[language as keyof typeof product.name]} \r
                    onClick={() => setIsLightboxOpen(true)}\r
                    style={{ \r
                      width: '100%', \r
                      height: '100%', \r
                      objectFit: 'contain',\r
                      position: 'absolute',\r
                      cursor: 'pointer'\r
                    }} \r
                  />`;

if (code.includes(oldImgStyle)) code = code.replace(oldImgStyle, newImgStyle);
else if (code.includes(oldImgStyle.replace(/\\r\\n/g, '\\n'))) code = code.replace(oldImgStyle.replace(/\\r\\n/g, '\\n'), newImgStyle.replace(/\\r\\n/g, '\\n'));
else console.log("oldImgStyle not found");

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log("Changes applied");
