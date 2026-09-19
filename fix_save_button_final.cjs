const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// The replacement logic:
const lines = code.split('\n');

const start = lines.findIndex(l => l.includes("borderRadius: '20px', padding: '8px 12px',"));
if (start !== -1) {
    // 1. Change borderRadius and padding to width/height
    lines[start] = lines[start].replace("borderRadius: '20px', padding: '8px 12px',", "borderRadius: '50%', width: '40px', height: '40px',");
    
    // 2. Remove gap: '6px'
    lines[start + 1] = lines[start + 1].replace(", gap: '6px'", "");
    
    // 3. Find the Gift and span lines
    const giftLine = lines.findIndex((l, i) => i > start && l.includes('<Gift size={16}'));
    const spanLine = lines.findIndex((l, i) => i > start && l.includes('Lưu bộ sưu tập'));
    
    if (giftLine !== -1 && spanLine !== -1) {
        // Replace giftLine with the new icons
        lines[giftLine] = `                  {user?.savedCharacters?.includes(product.id) ? <Icons.Check size={20} color="#fff" /> : <Plus size={20} color="#fff" />}`;
        // Remove span line
        lines.splice(spanLine, 1);
    }
    
    // 4. Also add title to button
    const buttonClose = lines.findIndex((l, i) => i > start && l.includes('onMouseLeave='));
    if (buttonClose !== -1) {
        lines.splice(buttonClose + 1, 0, `                  title={language === 'vi' ? 'Lưu bộ sưu tập' : 'Save to Collection'}`);
    }

    fs.writeFileSync('src/pages/ProductDetails.tsx', lines.join('\n'), 'utf8');
    console.log('Fixed Save Button');
} else {
    console.log('Not found');
}
