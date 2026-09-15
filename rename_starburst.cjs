const fs = require('fs');

let code = fs.readFileSync('src/components/HeartBurst.tsx', 'utf8');
code = code.split('HeartBurst').join('StarBurst');
code = code.split('heart-burst').join('star-burst');
code = code.split('HeartParticle').join('StarParticle');
code = code.split("import { Heart } from 'lucide-react';").join("import { Star } from 'lucide-react';");
code = code.split("const colors = ['#ef4444', '#f43f5e', '#ec4899', '#d946ef', '#ffb5a7', '#ff6b6b'];").join("const colors = ['#f59e0b', '#fbbf24', '#fcd34d', '#ffb84d'];");
code = code.split("<Heart ").join("<Star ");

// Make stars look like the image (some inside circles)
code = code.replace(/<Star size=\{p\.size\} fill=\{p\.color\} color=\{p\.color\} \/>/g, 
  `<div style={{ 
    width: p.size, height: p.size, 
    background: p.color, 
    borderRadius: '50%', 
    display: 'flex', alignItems: 'center', justifyContent: 'center' 
  }}>
    <Star size={p.size * 0.6} fill="#fff" color="#fff" />
  </div>`
);

fs.writeFileSync('src/components/StarBurst.tsx', code, 'utf8');
fs.unlinkSync('src/components/HeartBurst.tsx');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.split('HeartBurst').join('StarBurst');
fs.writeFileSync('src/App.tsx', appCode, 'utf8');

console.log('Renamed to StarBurst');
