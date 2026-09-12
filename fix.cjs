const fs = require('fs');
let lines = fs.readFileSync('src/pages/Admin.tsx', 'utf8').split('\n');

lines[806] = lines[806].replace('i}', 'String(h)}');
lines[1330] = lines[1330].replace('i}', 'String(h)}');
lines[1723] = lines[1723].replace('i}', 'String(h)}');

lines[1919] = lines[1919].replace('style={{ padding: \'0.875rem 2.5rem\' }} style={{ display: \'flex\', alignItems: \'center\', gap: \'0.5rem\' }}', 'style={{ padding: \'0.875rem 2.5rem\', display: \'flex\', alignItems: \'center\', gap: \'0.5rem\' }}');

fs.writeFileSync('src/pages/Admin.tsx', lines.join('\n'), 'utf8');
