const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const errBlock = `function AppContent() {
  const { isAdmin } = useStore();
  
  useEffect(() => {
    if (!isAdmin) {
      document.documentElement.style.zoom = '0.9';
    } else {
      document.documentElement.style.zoom = '1';
    }
  }, [isAdmin]);`;

const cleanStart = `function AppContent() {`;

code = code.replace(errBlock, cleanStart);

const isAdmindef = `const isAdmin = pathname.toLowerCase().startsWith('/hoang');`;
const replacement = `const isAdmin = pathname.toLowerCase().startsWith('/hoang');

  useEffect(() => {
    if (!isAdmin) {
      document.documentElement.style.zoom = '0.9';
    } else {
      document.documentElement.style.zoom = '1';
    }
  }, [isAdmin]);`;

code = code.replace(isAdmindef, replacement);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Fixed isAdmin redeclaration.');
