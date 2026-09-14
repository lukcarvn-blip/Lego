const fs = require('fs');
let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

const targetStr = `  const formatPrice = (priceUSD: number, discountPercentage?: number) => {`;
const startIdx = code.indexOf(targetStr);
const endStr = `    }
  };`;
const endIdx = code.indexOf(endStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const newPrice = `  const formatPrice = (priceUSD: number, discountPercentage?: number) => {
    const rate = 25400; // 1 USD = 25,400 VND
    
    // Auto +5% logic: The provided priceUSD is the standard (current/discounted) price.
    // We add 5% to it to create the fake original price.
    const finalUSD = priceUSD;
    const origUSD = priceUSD * 1.05;
    const isOnSale = true; // Always show 2 prices

    if (language === 'vi') {
      let v1 = origUSD * rate;
      let v2 = finalUSD * rate;
      
      // Auto-append .000 (multiply by 1000) if the value is abnormally small
      if (v1 > 0 && v1 < 100000) v1 *= 1000;
      if (v2 > 0 && v2 < 100000) v2 *= 1000;

      // Round to nearest 1000 for nicer display
      v1 = Math.round(v1 / 1000) * 1000;
      v2 = Math.round(v2 / 1000) * 1000;

      const origVND = v1.toLocaleString('vi-VN');
      const finalVND = v2.toLocaleString('vi-VN');
      return {
        original: \`\${origVND} ₫\`,
        current: \`\${finalVND} ₫\`,
        isOnSale
      };
    } else {
      return {
        original: \`$\${origUSD.toFixed(2)}\`,
        current: \`$\${finalUSD.toFixed(2)}\`,
        isOnSale
      };
    }
  };`;

  code = code.substring(0, startIdx) + newPrice + code.substring(endIdx + endStr.length);
  fs.writeFileSync('src/context/StoreContext.tsx', code, 'utf8');
  console.log("Success with index");
} else {
  console.log("Failed to find index");
}
