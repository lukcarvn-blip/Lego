const fs = require('fs');
let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// 1. Add StoreSize interface and add it to StoreSettings
code = code.replace('export interface StoreSettings {', `export interface StoreSize {
  id: string;
  name: string;
  multiplier: number;
  heightCm: number;
  scaleGraphic: number;
}

export interface StoreSettings {`);

code = code.replace('logoText: string;', 'logoText: string;\n    sizes: StoreSize[];');

// 2. Add to StoreContextType
code = code.replace("t: (key: keyof typeof translations['vi']) => string;", `t: (key: keyof typeof translations['vi']) => string;
    getSizeMultiplier: (sizeId: string | null) => number;
    getSizeDetails: (sizeId: string | null) => StoreSize | undefined;`);

// 3. Add default sizes
const defaultSizes = `sizes: [
      { id: 'NORMAL', name: 'NORMAL: 30-45cm', multiplier: 1, heightCm: 45, scaleGraphic: 0.7 },
      { id: 'PREMIUM', name: 'PREMIUM: 75-90cm', multiplier: 2.5, heightCm: 90, scaleGraphic: 1.2 }
    ],`;
code = code.replace(`logoText: 'LEGATO',`, `logoText: 'LEGATO',\n      ${defaultSizes}`);

// 4. Implement functions inside StoreProvider
const funcImpl = `
  const getSizeDetails = (sizeId: string | null) => {
    if (!sizeId) return undefined;
    if (activeSettings.sizes) {
      const s = activeSettings.sizes.find(sz => sz.id === sizeId || sz.name === sizeId);
      if (s) return s;
    }
    // Fallback for old sizes
    if (sizeId.includes('300')) return { id: sizeId, name: 'Size 300', multiplier: 0.75, heightCm: 21, scaleGraphic: 0.6 };
    if (sizeId.includes('400')) return { id: sizeId, name: 'Size 400', multiplier: 1, heightCm: 28, scaleGraphic: 0.8 };
    if (sizeId.includes('1000')) return { id: sizeId, name: 'Size 1000', multiplier: 2.5, heightCm: 70, scaleGraphic: 1.2 };
    return { id: sizeId, name: sizeId, multiplier: 1, heightCm: 30, scaleGraphic: 0.8 };
  };

  const getSizeMultiplier = (sizeId: string | null) => {
    const details = getSizeDetails(sizeId);
    return details ? details.multiplier : 1;
  };
`;

code = code.replace('const [user, setUser] = useState<any>(null);', `const [user, setUser] = useState<any>(null);\n${funcImpl}`);

// Replace parseSizePercentage usage in StoreContext
code = code.replace(/const parseSizePercentage = [\s\S]*?num \/ 400;\n    };\n/, '');
code = code.replace(/parseSizePercentage\(item\.size\)/g, 'getSizeMultiplier(item.size)');

// Add functions to provider value
code = code.replace('t,', 't,\n          getSizeMultiplier,\n          getSizeDetails,');

fs.writeFileSync('src/context/StoreContext.tsx', code, 'utf8');
console.log('Updated StoreContext');
