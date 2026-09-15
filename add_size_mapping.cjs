const fs = require('fs');
let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

const mappingCode = `      data = data.map(p => {
        if (p.availableSizes) {
          const mappedSizes = p.availableSizes.map(s => {
            if (typeof s === 'string' && (s.includes('300') || s.includes('400'))) return 'NORMAL';
            if (typeof s === 'string' && s.includes('1000')) return 'PREMIUM';
            return s;
          });
          p.availableSizes = Array.from(new Set(mappedSizes));
        }`;

code = code.replace(/data = data\.map\(p => \{/, mappingCode);
fs.writeFileSync('src/context/StoreContext.tsx', code, 'utf8');
console.log('Added size mapping');
