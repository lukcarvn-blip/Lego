const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const target = `        </div>
            </div>
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Exclusive Policies */}`;

const replacement = `        </div>
            </div>
          </div>
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Exclusive Policies */}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Added missing closing div');
