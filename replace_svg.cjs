const fs = require('fs');

const newSvg = `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                        {/* Stud */}
                        <rect x="40" y="8" width="20" height="6" rx="2" fill="#fff" />
                        {/* Head */}
                        <rect x="30" y="14" width="40" height="32" rx="8" fill="#fff" />
                        {/* Neck */}
                        <rect x="42" y="46" width="16" height="4" fill="#fff" />
                        {/* Torso */}
                        <path d="M 34 50 L 66 50 L 76 95 L 24 95 Z" fill="#fff" />
                        {/* Hips */}
                        <path d="M 24 97 L 76 97 L 76 108 L 24 108 Z" fill="#fff" />
                        {/* Legs */}
                        <rect x="24" y="110" width="23" height="35" rx="3" fill="#fff" />
                        <rect x="53" y="110" width="23" height="35" rx="3" fill="#fff" />
                        {/* Arms */}
                        <path d="M 32 50 C 15 50 10 70 12 85 C 13 90 20 90 24 85 C 24 75 22 65 32 60 Z" fill="#fff" />
                        <path d="M 68 50 C 85 50 90 70 88 85 C 87 90 80 90 76 85 C 76 75 78 65 68 60 Z" fill="#fff" />
                        {/* Hands */}
                        <path d="M 16 82 C 6 82 4 98 14 98 C 22 98 24 90 18 88 C 16 87 14 92 10 90 C 8 88 8 85 10 84 C 14 82 16 86 18 86 C 22 84 20 82 16 82 Z" fill="#fff" />
                        <path d="M 84 82 C 94 82 96 98 86 98 C 78 98 76 90 82 88 C 84 87 86 92 90 90 C 92 88 92 85 90 84 C 86 82 84 86 82 86 C 78 84 80 82 84 82 Z" fill="#fff" />
                        
                        {/* Question mark */}
                        <text x="50" y="75" fill="var(--color-accent)" fontSize="42" fontWeight="900" textAnchor="middle" dominantBaseline="middle">?</text>
                      </svg>`;

function replaceSvgInFile(filepath) {
  let code = fs.readFileSync(filepath, 'utf8');
  
  // Find the exact SVG block
  const svgStart = code.indexOf('<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg"');
  if (svgStart === -1) {
    console.log("SVG not found in", filepath);
    return;
  }
  const svgEndStr = '</svg>';
  const svgEnd = code.indexOf(svgEndStr, svgStart) + svgEndStr.length;
  
  const oldSvg = code.substring(svgStart, svgEnd);
  code = code.replace(oldSvg, newSvg);
  
  fs.writeFileSync(filepath, code, 'utf8');
  console.log("Replaced SVG in", filepath);
}

replaceSvgInFile('src/pages/Home.tsx');
replaceSvgInFile('src/pages/Products.tsx');
