const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(/animation-delay:\s*2\.1s;/g, 'animation-delay: 3.2s;');
code = code.replace(/animation-delay:\s*2\.2s;/g, 'animation-delay: 3.35s;');
code = code.replace(/animation-delay:\s*2\.3s;/g, 'animation-delay: 3.5s;');
code = code.replace(/animation-delay:\s*2\.4s;/g, 'animation-delay: 3.65s;');
code = code.replace(/animation-delay:\s*2\.5s;/g, 'animation-delay: 3.8s;');
code = code.replace(/animation-delay:\s*2\.6s;/g, 'animation-delay: 3.95s;');

fs.writeFileSync('src/index.css', code, 'utf8');
