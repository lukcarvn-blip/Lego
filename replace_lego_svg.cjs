const fs = require('fs');

function replaceSvgInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const startMarker = '{/* Lego Silhouette */}';
  const startIndex = content.indexOf(startMarker);
  
  if (startIndex !== -1) {
    const endMarker = '</svg>\n                    </div>';
    const endIndex = content.indexOf(endMarker, startIndex);
    
    if (endIndex !== -1) {
      const oldBlock = content.substring(startIndex, endIndex + endMarker.length);
      
      const newBlock = `{/* Lego Silhouette */}
                    <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '66%', zIndex: 1, opacity: 0.15 }}>
                      <div className="lego-silhouette-mask">
                        <span style={{ color: 'var(--color-accent)', fontSize: '5rem', fontWeight: 900, marginTop: '-2rem' }}>?</span>
                      </div>
                    </div>`;
      
      content = content.replace(oldBlock, newBlock);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Replaced in ' + filePath);
    }
  }
}

replaceSvgInFile('src/pages/Home.tsx');
replaceSvgInFile('src/pages/Products.tsx');
