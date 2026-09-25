const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  useEffect(() => {
    if (!isAdmin) {
      document.documentElement.style.zoom = '0.9';
      document.documentElement.style.width = '100%';
      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.minHeight = '100vh';
      document.body.style.width = '100%';
      document.body.style.margin = '0 auto';
      document.body.style.minHeight = '100vh';
    } else {
      document.documentElement.style.zoom = '1';
      document.documentElement.style.width = '100%';
      document.documentElement.style.overflowX = 'auto';
      document.documentElement.style.minHeight = '100vh';
      document.body.style.width = '100%';
      document.body.style.margin = '0';
      document.body.style.minHeight = '100vh';
    }
  }, [isAdmin]);`;

const replacement = `  useEffect(() => {
    if (!isAdmin) {
      document.documentElement.style.zoom = '';
      document.documentElement.style.width = '';
      document.documentElement.style.overflowX = '';
      document.documentElement.style.minHeight = '';
      
      document.body.style.margin = '0';
      document.body.style.width = '111.11vw';
      document.body.style.minHeight = '111.11vh';
      document.body.style.transform = 'scale(0.9)';
      document.body.style.transformOrigin = 'top left';
      document.body.style.overflowX = 'hidden';
    } else {
      document.documentElement.style.zoom = '';
      document.documentElement.style.width = '';
      document.documentElement.style.overflowX = '';
      document.documentElement.style.minHeight = '';
      
      document.body.style.width = '';
      document.body.style.minHeight = '';
      document.body.style.transform = '';
      document.body.style.transformOrigin = '';
      document.body.style.overflowX = '';
      document.body.style.margin = '0';
    }
  }, [isAdmin]);`;

// Since the target might be slightly different due to previous replacements, I'll use regex to replace the entire useEffect
code = code.replace(/useEffect\(\(\) => \{\s*if \(!isAdmin\) \{[\s\S]*?\}, \[isAdmin\]\);/m, replacement);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Applied transform to body.');
