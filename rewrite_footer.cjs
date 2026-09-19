const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// Extract the social icons part. We know the exact structure.
const lines = code.split('\n');
const col1Start = lines.findIndex(l => l.includes('<div>') && lines[lines.indexOf(l)+1] && lines[lines.indexOf(l)+1].includes('footer-logo-social-wrapper'));

if (col1Start !== -1) {
  // We need to re-write column 1.
  // Column 1 ends right before: <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
  const col2Start = lines.findIndex(l => l.includes('gridTemplateColumns: \'1fr 1fr\''));
  
  if (col2Start !== -1) {
    const col1Lines = lines.slice(col1Start, col2Start);
    const col1Str = col1Lines.join('\n');
    
    // Replace <div className="footer-logo-social-wrapper"> 
    // And extract social icons.
    
    // Instead of parsing, let's just use Regex to find the blocks:
    // 1. Logo Block
    const logoBlockRegex = /<h3[^>]*>[\s\S]*?<\/h3>/;
    const logoMatch = col1Str.match(logoBlockRegex);
    
    // 2. Social Block
    const socialBlockRegex = /<div className="footer-social-icons">[\s\S]*?<\/div>\s*<\/div>/;
    let socialMatch = col1Str.match(socialBlockRegex);
    
    // 3. Contact Block
    const contactBlockRegex = /<div style={{ color: 'var\(--color-text-muted\)', marginBottom: '1.5rem'[^>]*>[\s\S]*?<\/div>/;
    const contactMatch = col1Str.match(contactBlockRegex);
    
    if (logoMatch && socialMatch && contactMatch) {
      // Fix social match (remove the extra closing div of wrapper)
      const socialContent = socialMatch[0].replace(/<\/div>\s*<\/div>$/, '</div>');
      // Fix contact match (add className footer-contact-info)
      const contactContent = contactMatch[0].replace('<div style={{', '<div className="footer-contact-info" style={{');
      
      const newCol1Str = `
        <div className="footer-col-1">
          <div className="footer-logo-container">
            ${logoMatch[0]}
          </div>
          ${contactContent}
          ${socialContent}
        </div>
      `;
      
      lines.splice(col1Start, col2Start - col1Start, newCol1Str);
      fs.writeFileSync('src/components/Footer.tsx', lines.join('\n'), 'utf8');
      console.log('Replaced Col 1 HTML');
    } else {
      console.log('Failed to match blocks', { logo: !!logoMatch, social: !!socialMatch, contact: !!contactMatch });
    }
  }
}

