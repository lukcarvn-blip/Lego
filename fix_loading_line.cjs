const fs = require('fs');

let code = fs.readFileSync('src/components/LoadingScreen.tsx', 'utf8');

// Replace h2 with div for the loading text
code = code.replace(
  /<h2 style=\{\{([\s\S]*?)\}\}>/g,
  '<div style={{$1}}>`' // Wait, I will just replace the exact tags
);

code = code.replace(
  /<h2 style=\{\{\s*margin: 0,\s*fontSize: '1\.5rem',\s*fontWeight: 800,\s*letterSpacing: '4px',\s*background: 'linear-gradient\(90deg, #fff, var\(--color-accent\)\)',\s*WebkitBackgroundClip: 'text',\s*WebkitTextFillColor: 'transparent',\s*textTransform: 'uppercase'\s*\}\}>([\s\S]*?)<\/h2>/g,
  `<div style={{ 
              margin: 0, 
              fontSize: '1.5rem', 
              fontWeight: 800, 
              letterSpacing: '4px',
              background: 'linear-gradient(90deg, #fff, var(--color-accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              border: 'none',
              padding: 0
            }}>
              $1
            </div>`
);

fs.writeFileSync('src/components/LoadingScreen.tsx', code, 'utf8');
console.log('Replaced h2 with div in LoadingScreen');
