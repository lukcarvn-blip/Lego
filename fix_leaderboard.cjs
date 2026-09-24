const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// 1. Add Trophy to imports
code = code.replace(
  "import { ShieldCheck, Wrench, Gift, RefreshCw, Send, Star, Layers, MessageSquarePlus } from 'lucide-react';",
  "import { ShieldCheck, Wrench, Gift, RefreshCw, Send, Star, Layers, MessageSquarePlus, Trophy } from 'lucide-react';"
);

// 2. Replace the h2 tag for leaderboard
const oldH2 = `<h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'left', marginBottom: '2rem', marginTop: 0 }}>
            {language === 'vi' ? 'BẢNG XẾP HẠNG VŨ TRỤ' : 'UNIVERSE LEADERBOARD'}
          </h2>`;

const newH2 = `<h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', marginTop: 0 }}>
            <Trophy size={28} style={{ color: 'var(--color-accent)' }} />
            {language === 'vi' ? 'BẢNG XẾP HẠNG VŨ TRỤ' : 'UNIVERSE LEADERBOARD'}
          </h2>`;

if (code.includes('BẢNG XẾP HẠNG VŨ TRỤ')) {
  // Try exact replacement first
  if (code.includes(oldH2)) {
    code = code.replace(oldH2, newH2);
    fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
    console.log('Fixed Leaderboard heading (exact match)');
  } else {
    // Regex replacement if whitespace doesn't match perfectly
    const regex = /<h2[^>]*BẢNG XẾP HẠNG VŨ TRỤ[\s\S]*?<\/h2>/;
    code = code.replace(regex, newH2);
    fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
    console.log('Fixed Leaderboard heading (regex match)');
  }
} else {
  console.log('Could not find Leaderboard text.');
}
