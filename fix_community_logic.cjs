const fs = require('fs');

const leaderboardCode = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf8');

// Extract Leaderboard Logic
const lbLogicRegex = /const getRankColor[\s\S]*?\}, \[products, settings\.collections\]\);/;
const lbLogicMatch = leaderboardCode.match(lbLogicRegex);
const lbLogic = lbLogicMatch ? lbLogicMatch[0] : '';

let communityCode = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// We need to import useMemo if missing
if (!communityCode.includes('useMemo')) {
  communityCode = communityCode.replace("import React, { useState } from 'react';", "import React, { useState, useMemo } from 'react';");
}

// Replace the context and state
communityCode = communityCode.replace(
  'const { language } = useStore();',
  `const { products, settings, language } = useStore();
  const navigate = useNavigate();
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);

  ${lbLogic}`
);

fs.writeFileSync('src/pages/Community.tsx', communityCode, 'utf8');
console.log('Injected logic into Community.tsx');
