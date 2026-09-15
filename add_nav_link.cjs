const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const target = `<Link className="hover-jump" to="/products" style={{ fontWeight: 600 }}>{language === 'vi' ? 'Cửa hàng' : 'Shop'}</Link>`;
const replacement = `<Link className="hover-jump" to="/products" style={{ fontWeight: 600 }}>{language === 'vi' ? 'Cửa hàng' : 'Shop'}</Link>
                <Link className="hover-jump" to="/leaderboard" style={{ fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Trophy size={16} /> {language === 'vi' ? 'Xếp hạng' : 'Ranking'}
                </Link>`;

code = code.replace(target, replacement);

const targetImport = `import { Menu, Search, ShoppingBag, X, LogOut, Package, Star, ShieldCheck, HelpCircle, Check, MapPin, Zap, User, Truck, Clock, Shield, Flame, Target, Camera, Music, Palette, Book, Code, Globe, MessageSquare, TrendingUp } from 'lucide-react';`;
const replacementImport = `import { Menu, Search, ShoppingBag, X, LogOut, Package, Star, ShieldCheck, HelpCircle, Check, MapPin, Zap, User, Truck, Clock, Shield, Flame, Target, Camera, Music, Palette, Book, Code, Globe, MessageSquare, TrendingUp, Trophy } from 'lucide-react';`;

if(code.includes(targetImport)) {
  code = code.replace(targetImport, replacementImport);
} else {
  // If it differs, try just inserting it below the import statement
  code = code.replace("from 'lucide-react';", "from 'lucide-react';\nimport { Trophy } from 'lucide-react';");
}

fs.writeFileSync('src/components/Navbar.tsx', code, 'utf8');
console.log('Added Leaderboard link to Navbar.tsx');
