const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldImg = `<img 
                              src={product.bannerImages?.[0] || product.bannerImage || product.images?.[0]} 
                              alt={product.name[language as keyof typeof product.name]}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            />`;

const newImg = `<img 
                              src={product.bannerImages?.[0] || product.bannerImage || product.images?.[0]} 
                              alt={product.name[language as keyof typeof product.name]}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.75) 100%)', pointerEvents: 'none', zIndex: 1 }} />`;

if (code.includes(oldImg)) {
  code = code.replace(oldImg, newImg);
} else {
  // Try line by line fallback
  const fallbackOld = "style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}\n                            />";
  const fallbackNew = "style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}\n                            />\n                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.75) 100%)', pointerEvents: 'none', zIndex: 1 }} />";
  
  const fallbackOldCRLF = fallbackOld.replace(/\\n/g, '\\r\\n');
  const fallbackNewCRLF = fallbackNew.replace(/\\n/g, '\\r\\n');

  if (code.includes(fallbackOld)) {
      code = code.replace(fallbackOld, fallbackNew);
  } else if (code.includes(fallbackOldCRLF)) {
      code = code.replace(fallbackOldCRLF, fallbackNewCRLF);
  } else {
      console.log('Regex and exact match both failed.');
  }
}

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Added dark fade to slider');
