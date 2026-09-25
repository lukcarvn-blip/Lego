const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I already removed the div wrapper zoom earlier. Let's make sure it's clean.
// I will add a useEffect to AppContent to set document.documentElement.style.zoom.
code = code.replace(
  'function AppContent() {',
  `function AppContent() {
  const { isAdmin } = useStore();
  
  useEffect(() => {
    if (!isAdmin) {
      document.documentElement.style.zoom = '0.9';
    } else {
      document.documentElement.style.zoom = '1';
    }
  }, [isAdmin]);`
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
