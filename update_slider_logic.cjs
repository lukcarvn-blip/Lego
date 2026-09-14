const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldLogic = `  const sliderCandidates = [...products].sort((a, b) => (b.views || 0) - (a.views || 0));
  const heroSliderItems = sliderCandidates.slice(0, 6);`;

const newLogic = `  const sliderCandidates = [...products].filter(p => {
    // Hide ready-stock products if they are out of stock
    if (p.isReadyStock && p.stock <= 0) return false;
    
    // Include if it is featured OR ready stock
    return p.isHeroSlider || p.isReadyStock;
  }).sort((a, b) => {
    // Featured products prioritize over ready stock
    if (a.isHeroSlider && !b.isHeroSlider) return -1;
    if (!a.isHeroSlider && b.isHeroSlider) return 1;
    // Fallback to sorting by views
    return (b.views || 0) - (a.views || 0);
  });
  
  const heroSliderItems = sliderCandidates.slice(0, 6);`;

if (code.includes(oldLogic)) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
  console.log('Successfully updated slider logic in Home.tsx');
} else {
  // Regex fallback
  const fallbackRegex = /const sliderCandidates = \[\.\.\.products\]\.sort.*?\n.*?const heroSliderItems = sliderCandidates\.slice\(0, 6\);/s;
  if (fallbackRegex.test(code)) {
    code = code.replace(fallbackRegex, newLogic);
    fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
    console.log('Successfully updated slider logic using regex');
  } else {
    console.log('Could not find old logic in Home.tsx');
  }
}
