const fs = require('fs');

let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('BẢNG XẾP HẠNG VŨ TRỤ'));

if (start !== -1) {
  lines[start - 1] = `          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', marginTop: 0 }}>`;
  lines[start] = `            <Trophy size={28} style={{ color: 'var(--color-accent)' }} />\n            {language === 'vi' ? 'BẢNG XẾP HẠNG VŨ TRỤ' : 'UNIVERSE LEADERBOARD'}`;
  
  fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
  console.log('Fixed Leaderboard styling');
} else {
  console.log('Not found');
}
