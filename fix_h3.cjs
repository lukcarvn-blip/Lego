const fs = require('fs');

let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

const lineIndices = [83, 86, 106, 108, 359, 361, 411, 413]; // 0-indexed corresponding to output line numbers - 1.

// Let's just find them automatically.
let targets = [
  'Định Hướng Phát Triển',
  'BẢNG XẾP HẠNG VŨ TRỤ',
  'Đặc Quyền & Chính Sách',
  'Gửi Đề Xuất Nhân Vật Mới'
];

targets.forEach(target => {
  const lineIdx = lines.findIndex(l => l.includes(target));
  if (lineIdx !== -1) {
    // Look up for <h3
    for (let i = lineIdx; i >= Math.max(0, lineIdx - 3); i--) {
      if (lines[i].includes('<h3')) {
        lines[i] = lines[i].replace('<h3', '<h2');
        break;
      }
    }
    // Look down for </h3
    for (let i = lineIdx; i <= Math.min(lines.length - 1, lineIdx + 3); i++) {
      if (lines[i].includes('</h3')) {
        lines[i] = lines[i].replace('</h3', '</h2');
        break;
      }
    }
  }
});

fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
console.log('Replaced specific h3 with h2');
