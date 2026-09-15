const fs = require('fs');

// 1. StoreContext.tsx
let store = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');
store = store.replace(
  /deleteReview,/g,
  "deleteReview, saveCharacter, unsaveCharacter,"
);
fs.writeFileSync('src/context/StoreContext.tsx', store, 'utf8');

// 2. Profile.tsx
let prof = fs.readFileSync('src/pages/Profile.tsx', 'utf8');
if (!prof.includes('UniverseSpace')) {
  prof = prof.replace(
    /import \{ ProductCard \} from '\.\.\/components\/ProductCard';/,
    `import { ProductCard } from '../components/ProductCard';\nimport { UniverseSpace } from '../components/UniverseSpace';\nimport { Sparkles } from 'lucide-react';`
  );
}
fs.writeFileSync('src/pages/Profile.tsx', prof, 'utf8');

console.log('Fixed provider value and import');
