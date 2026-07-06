const fs = require('fs');

const placeholders = [
  '/images/venom-transparent.png',
  '/images/black-panther-transparent.png',
  '/images/cat-classic.png',
  '/images/cat-scifi.png',
  '/images/cat-superhero.png',
  '/images/tube-classic.png',
  '/images/tube-scifi.png',
  '/images/tube-superhero.png',
  '/images/santa-transparent.png'
];

let data = fs.readFileSync('src/data/mockProducts.ts', 'utf8');

data = data.replace(/images:\s*\[([\s\S]*?)\]/g, (match, inner) => {
  // Extract the first image (which might have quotes, newlines, etc.)
  const matchFirst = inner.match(/"([^"]+)"/);
  const firstImage = matchFirst ? matchFirst[1] : '';
  
  const images = [firstImage, ...placeholders];
  
  return `images: [\n      "${images.join('",\n      "')}"\n    ]`;
});

fs.writeFileSync('src/data/mockProducts.ts', data);
console.log('Done!');
