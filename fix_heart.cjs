const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const target = `                )}
                
                {/* Heart Button */}
                
                <motion.button`;

const replacement = `                )}
              </>
            )}

            {/* Heart Button */}
            <motion.button`;

const target2 = `                </motion.button>
              </>
            )}
          </motion.div>`;

const replacement2 = `                </motion.button>
          </motion.div>`;

code = code.replace(target, replacement).replace(target2, replacement2);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed Heart Button');
