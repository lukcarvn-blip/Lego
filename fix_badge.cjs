const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const regex = /\{product\.collection && settings\.collections\?\.find\(\(c: any\) => c\.name === product\.collection\) && \(\(\) => \{\s*const col = settings\.collections!\.find\(\(c: any\) => c\.name === product\.collection\); if \(!col\) return null;/g;

const replacement = `{product.collection && (() => {
              const col = settings.collections?.find((c: any) => c.name === product.collection) || {
                name: product.collection,
                iconName: 'Folder',
                bg: 'rgba(255,255,255,0.1)',
                border: 'rgba(255,255,255,0.2)',
                color: '#fff'
              };`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('Fixed collection badge rendering');
} else {
  console.log('Regex did not match');
}
