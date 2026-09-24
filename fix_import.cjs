const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

code = code.replace(
  "import { ShieldCheck, Wrench, Gift, RefreshCw, Send, Star, Layers, MessageSquarePlus, Trophy } from 'lucide-react';",
  "import { ShieldCheck, Wrench, Gift, RefreshCw, Send, Star, Layers, MessageSquarePlus } from 'lucide-react';"
);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
