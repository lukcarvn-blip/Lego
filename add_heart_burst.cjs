const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import
if (!code.includes('import { HeartBurst }')) {
  code = code.replace(
    "import { FloatingActions } from './components/FloatingActions';",
    "import { FloatingActions } from './components/FloatingActions';\nimport { HeartBurst } from './components/HeartBurst';"
  );
}

// 2. Render HeartBurst
if (!code.includes('<HeartBurst />')) {
  code = code.replace(
    "{!isAdmin && <FloatingActions />}",
    "{!isAdmin && <FloatingActions />}\n        <HeartBurst />"
  );
}

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Added HeartBurst to App.tsx');
