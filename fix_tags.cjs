const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const target = `            </div>
          </div>
              </div>
              <button className="pd-review-btn"`;

const replacement = `            </div>
          </div>
              
              <button className="pd-review-btn"`;

code = code.replace(target, replacement);

const target2 = `              </button>
          </div>`;

const replacement2 = `              </button>
            </div>
          </div>`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed tags');
