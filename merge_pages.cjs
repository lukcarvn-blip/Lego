const fs = require('fs');

// Read files
const leaderboardCode = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf8');
const communityCode = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// Extract Leaderboard Logic
const lbLogicRegex = /const getRankColor[\s\S]*?\}, \[products, settings\.collections\]\);/;
const lbLogicMatch = leaderboardCode.match(lbLogicRegex);
const lbLogic = lbLogicMatch ? lbLogicMatch[0] : '';

// Extract Leaderboard JSX
const lbJsxRegex = /\{\/\* List of Collections \*\/\}[\s\S]*?<\/AnimatePresence>\s*<\/div>/;
const lbJsxMatch = leaderboardCode.match(lbJsxRegex);
let lbJsx = lbJsxMatch ? lbJsxMatch[0] : '';

// Inject Navigate to imports if missing, and merge icons
let newCommunityCode = communityCode;
newCommunityCode = newCommunityCode.replace(
  "import { Link } from 'react-router-dom';",
  "import { Link, useNavigate } from 'react-router-dom';\nimport { Trophy, Zap, Shield, Crosshair, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';\nimport { AnimatePresence } from 'framer-motion';\nimport * as Icons from 'lucide-react';"
);

// Inject logic
newCommunityCode = newCommunityCode.replace(
  'const { settings, language } = useStore();',
  'const { products, settings, language } = useStore();\n  const navigate = useNavigate();\n  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);\n\n  ' + lbLogic
);

// Inject JSX between Vision and Policies
const policiesRegex = /\{\/\* Exclusive Policies \*\/\}/;
// Add a heading for Leaderboard
const leaderboardHeader = `
          {/* Bảng xếp hạng */}
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem', marginTop: '4rem' }}>
            {language === 'vi' ? 'BẢNG XẾP HẠNG VŨ TRỤ' : 'UNIVERSE LEADERBOARD'}
          </h3>
          <div style={{ marginBottom: '4rem' }}>
            ${lbJsx}
          </div>

          {/* Exclusive Policies */}`;

newCommunityCode = newCommunityCode.replace(policiesRegex, leaderboardHeader);

fs.writeFileSync('src/pages/Community.tsx', newCommunityCode, 'utf8');
console.log('Successfully merged Leaderboard into Community.');
