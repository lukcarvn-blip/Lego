const fs = require('fs');

const replacements = [
  ['import { Search, Filter, Play, CheckCircle', 'import { Search, Filter, Play, CheckCircle, Shield, Moon, Star, Wand2, Swords, PawPrint, Rocket, Castle, Building2, Settings, Zap '],
  ['import { Filter, Search, Play, ArrowRight', 'import { Filter, Search, Play, ArrowRight, Shield, Moon, Star, Wand2, Swords, PawPrint, Rocket, Castle, Building2, Settings, Zap '],
  ['emoji: \\'🕷️\\'', 'icon: <Shield size={24} />'],
  ['emoji: \\'🦇\\'', 'icon: <Moon size={24} />'],
  ['emoji: \\'⭐\\'', 'icon: <Star size={24} />'],
  ['emoji: \\'🧙\\'', 'icon: <Wand2 size={24} />'],
  ['emoji: \\'🦸\\'', 'icon: <Shield size={24} />'],
  ['emoji: \\'⛩️\\'', 'icon: <Swords size={24} />'],
  ['emoji: \\'🦖\\'', 'icon: <PawPrint size={24} />'],
  ['emoji: \\'🥷\\'', 'icon: <Swords size={24} />'],
  ['emoji: \\'🚀\\'', 'icon: <Rocket size={24} />'],
  ['emoji: \\'🏰\\'', 'icon: <Castle size={24} />'],
  ['emoji: \\'🏙️\\'', 'icon: <Building2 size={24} />'],
  ['emoji: \\'⚙️\\'', 'icon: <Settings size={24} />'],
  ['{col.emoji}', '{col.icon}'],
  ['⚡ ', '<Zap size={14} style={{display:\\'inline-block\\', verticalAlign:\\'middle\\', marginRight:\\'4px\\'}}/> ']
];

['src/pages/Home.tsx', 'src/pages/Products.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Done replacing Home and Products');
