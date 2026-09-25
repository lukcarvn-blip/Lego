const fs = require('fs');

let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

const startIntro = lines.findIndex(l => l.includes('{/* Header */}'));
const endIntro = lines.findIndex((l, i) => i > startIntro && l.includes('</div>') && lines[i+1].includes('</div>') && lines[i+2].includes('community-header-vision'));

const startVision = lines.findIndex(l => l.includes('{/* Development Vision */}'));
const endVision = lines.findIndex((l, i) => i > startVision && l.includes('</div>') && lines[i+1].includes('</div>') && lines[i+2].includes('community-main-layout'));

console.log('Intro:', startIntro, endIntro);
console.log('Vision:', startVision, endVision);

if (startIntro !== -1 && startVision !== -1) {
  // Replace Intro
  const newIntro = [
    '          {/* Header */}',
    '          <div className="glass-panel" style={{ padding: \'2rem\', borderRadius: \'16px\', height: \'100%\' }}>',
    '            <h2 style={{ fontSize: \'1.25rem\', fontWeight: 700, marginBottom: \'1rem\', display: \'flex\', alignItems: \'center\', gap: \'0.5rem\', color: \'var(--color-accent)\' }}>',
    '              <Layers size={24} />',
    '              {language === \'vi\' ? \'Sân chơi Mô hình Up-scale Cao cấp\' : \'High-end Up-scale Model Playground\'}',
    '            </h2>',
    '            <p style={{ color: \'var(--color-text)\', lineHeight: 1.7 }}>',
    '              {language === \'vi\' ',
    '                ? \'Mục tiêu của chúng tôi là xây dựng một sân chơi mô hình được up-scale tương tự như các mô hình của BEARBRICK cao cấp. Chúng tôi muốn tạo ra một cộng đồng sưu tầm các mô hình độc bản được chế tác bằng công nghệ máy in 3D đa màu sắc tiên tiến nhất.\' ',
    '                : \'Our goal is to build a playground for up-scaled models similar to high-end BEARBRICKs. We want to create a collector community for unique models crafted using the most advanced multi-color 3D printing technology.\'}',
    '            </p>',
    '          </div>'
  ];
  
  lines.splice(startIntro, endIntro - startIntro + 1, ...newIntro);
  
  // Re-calculate vision index since we changed array length
  const newStartVision = lines.findIndex(l => l.includes('{/* Development Vision */}'));
  // Find the closing div of the vision block. It's the one before `</div>` then `community-main-layout`.
  let newEndVision = newStartVision;
  while (!lines[newEndVision].includes('</div>') || !lines[newEndVision+1].includes('</div>') || !lines[newEndVision+2].includes('community-main-layout')) {
    newEndVision++;
    if (newEndVision > lines.length) break;
  }
  
  const newVision = [
    '          {/* Development Vision */}',
    '          <div className="glass-panel" style={{ padding: \'2rem\', borderRadius: \'16px\', height: \'100%\' }}>',
    '            <h2 style={{ fontSize: \'1.25rem\', fontWeight: 700, marginBottom: \'1rem\', display: \'flex\', alignItems: \'center\', gap: \'0.5rem\', color: \'var(--color-accent)\' }}>',
    '              <Star size={24} /> ',
    '              {language === \'vi\' ? \'Định Hướng Phát Triển\' : \'Development Vision\'}',
    '            </h2>',
    '            <p style={{ color: \'var(--color-text)\', lineHeight: 1.7, marginBottom: \'1rem\' }}>',
    '              {language === \'vi\' ',
    '                ? \'Vì đây là mô hình tự thiết kế độc quyền, lượng thiết kế hiện tại còn hạn chế. Tuy nhiên, chúng tôi cam kết sẽ phát triển thiết kế thêm nhiều nhân vật mới mỗi tháng.\'',
    '                : \'Since these are exclusive self-designed models, the current design inventory is limited. However, we are committed to developing new character designs every month.\'}',
    '            </p>',
    '            <p style={{ color: \'var(--color-text)\', lineHeight: 1.7 }}>',
    '              {language === \'vi\'',
    '                ? \'Các Collector (người sưu tầm) có quyền đề xuất nhân vật yêu thích. Chúng tôi sẽ tổng hợp các đề xuất đó theo bảng xếp hạng (Leaderboard) và lần lượt thực hiện chế tác dựa trên số lượng FAN CỨNG yêu cầu!\'',
    '                : \'Collectors have the right to propose their favorite characters. We will aggregate these requests into a Leaderboard and sequentially craft them based on the number of TOP FAN requests!\'}',
    '            </p>',
    '          </div>'
  ];
  
  lines.splice(newStartVision, newEndVision - newStartVision + 1, ...newVision);
  
  fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
  console.log('Fixed Header styling to match vision!');
} else {
  console.log('Failed to find blocks.');
}
