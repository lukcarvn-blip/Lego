const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = "const isAdmin = pathname.toLowerCase().startsWith('/hoang');";

const effectBlock = `const isAdmin = pathname.toLowerCase().startsWith('/hoang');

  useEffect(() => {
    // Apply 90% scale to the whole website except admin
    if (!isAdmin) {
      document.body.style.zoom = '0.9';
    } else {
      document.body.style.zoom = '1';
    }
    return () => { document.body.style.zoom = '1'; }
  }, [isAdmin]);`;

if (code.includes(target)) {
  code = code.replace(target, effectBlock);
  fs.writeFileSync('src/App.tsx', code, 'utf8');
  console.log('App.tsx updated successfully');
} else {
  console.log('Target string not found');
}
