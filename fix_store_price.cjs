const fs = require('fs');
let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

const n = s => s.replace(/\\r\\n/g, '\\n');
code = n(code);

const oldPrice = `  const formatPrice = (priceUSD: number, discountPercentage?: number) => {
    const rate = 25400; // 1 USD = 25,400 VND
    const isOnSale = discountPercentage !== undefined && discountPercentage > 0;
    const finalUSD = isOnSale ? priceUSD * (1 - discountPercentage / 100) : priceUSD;

    if (language === 'vi') {
      let v1 = Math.round(priceUSD * rate);
      let v2 = Math.round(finalUSD * rate);
      // Auto-append .000 (multiply by 1000) if the value is abnormally small (e.g. user typed 4572 instead of 4572000)
      if (v1 > 0 && v1 < 100000) v1 *= 1000;
      if (v2 > 0 && v2 < 100000) v2 *= 1000;

      const origVND = v1.toLocaleString('vi-VN');
      const finalVND = v2.toLocaleString('vi-VN');
      return {
        original: \`\${origVND} ₫\`,
        current: \`\${finalVND} ₫\`,
        isOnSale
      };
    } else {
      return {
        original: \`$\${priceUSD.toFixed(2)}\`,
        current: \`$\${finalUSD.toFixed(2)}\`,
        isOnSale
      };
    }
  };`;

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
      
      // Auto-append .000 (multiply by 1000) if the value is abnormally small (e.g. user typed 4572 instead of 4572000)
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

if (code.includes(oldPrice)) {
    code = code.replace(oldPrice, newPrice);
    fs.writeFileSync('src/context/StoreContext.tsx', code, 'utf8');
    console.log("Success");
} else {
    console.log("Failed to find oldPrice");
}
