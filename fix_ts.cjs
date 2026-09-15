const fs = require('fs');

// 1. UniverseSpace.tsx
let uni = fs.readFileSync('src/components/UniverseSpace.tsx', 'utf8');
uni = uni.replace(/import \{ Product \} from/g, "import type { Product } from");
uni = uni.replace(/import \{ AppUser \} from/g, "import type { AppUser } from");
fs.writeFileSync('src/components/UniverseSpace.tsx', uni, 'utf8');

// 2. StoreContext.tsx
let store = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');
store = store.replace(/id => id !== productId/g, "(id: string) => id !== productId");
store = store.replace(
  /deleteReview,\n\s*saveCharacter,\n\s*unsaveCharacter,/g,
  "deleteReview,\nsaveCharacter,\nunsaveCharacter,"
);
// In the return statement: `<StoreContext.Provider value={{...}}>`
store = store.replace(
  /addReview,\n\s*deleteReview\n\s*\}\}>/g,
  "addReview,\ndeleteReview,\nsaveCharacter,\nunsaveCharacter\n}}>"
);
fs.writeFileSync('src/context/StoreContext.tsx', store, 'utf8');

// 3. Profile.tsx
let prof = fs.readFileSync('src/pages/Profile.tsx', 'utf8');
prof = prof.replace(
  /const \[activeTab, setActiveTab\] = useState<'dashboard' \| 'orders' \| 'saved_carts'>/g,
  "const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'saved_carts' | 'universe'>"
);
// Import UniverseSpace if it's not there
if (!prof.includes('UniverseSpace')) {
  prof = prof.replace(
    /import \{ ProductCard \} from '\.\.\/components\/ProductCard';/,
    `import { ProductCard } from '../components/ProductCard';\nimport { UniverseSpace } from '../components/UniverseSpace';\nimport { Sparkles } from 'lucide-react';`
  );
}
fs.writeFileSync('src/pages/Profile.tsx', prof, 'utf8');

console.log('Fixed TypeScript errors');
