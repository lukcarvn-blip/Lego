const fs = require('fs');

function addHoverJump(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // 1. Navbar elements
  if (filePath.includes('Navbar.tsx')) {
    code = code.replace('<Link to="/partnership" style={{ fontWeight: 800, textTransform: \'uppercase\' }}>', 
                        '<Link className="hover-jump" to="/partnership" style={{ fontWeight: 800, textTransform: \'uppercase\' }}>');
    code = code.replace('<Link to="/products" style={{ fontWeight: 600 }}>',
                        '<Link className="hover-jump" to="/products" style={{ fontWeight: 600 }}>');
    code = code.replace('<button onClick={toggleLanguage} style={{',
                        '<button className="hover-jump" onClick={toggleLanguage} style={{');
    code = code.replace('<Link id="nav-cart-icon" to="/cart" style={{ display: \'flex\', alignItems: \'center\', position: \'relative\' }}>',
                        '<Link id="nav-cart-icon" className="hover-jump" to="/cart" style={{ display: \'flex\', alignItems: \'center\', position: \'relative\' }}>');
    code = code.replace('<button onClick={() => setIsSearchOpen(!isSearchOpen)} style={{ display: \'flex\', alignItems: \'center\', background: \'transparent\', border: \'none\', color: \'var(--color-text)\', cursor: \'pointer\' }}>',
                        '<button className="hover-jump" onClick={() => setIsSearchOpen(!isSearchOpen)} style={{ display: \'flex\', alignItems: \'center\', background: \'transparent\', border: \'none\', color: \'var(--color-text)\', cursor: \'pointer\' }}>');
    code = code.replace('<Link to="/profile" className="desktop-action" style={{ display: \'flex\', alignItems: \'center\' }}',
                        '<Link to="/profile" className="desktop-action hover-jump" style={{ display: \'flex\', alignItems: \'center\' }}');
    // Also mobile-action
    code = code.replace('<Link to="/partnership" style={{ display: \'flex\', alignItems: \'center\', color: \'var(--color-text)\' }}>',
                        '<Link className="hover-jump" to="/partnership" style={{ display: \'flex\', alignItems: \'center\', color: \'var(--color-text)\' }}>');
  }

  // 2. ProductDetails elements
  if (filePath.includes('ProductDetails.tsx')) {
    // Heart button
    code = code.replace('<motion.button \n                  onClick={handleLike}',
                        '<motion.button \n                  className="hover-jump"\n                  onClick={handleLike}');
    code = code.replace('<motion.button \r\n                  onClick={handleLike}',
                        '<motion.button \r\n                  className="hover-jump"\r\n                  onClick={handleLike}');
  }

  // 3. Home elements (Slider arrows)
  if (filePath.includes('Home.tsx')) {
    code = code.replace('className="hero-prev tech-box-wrapper"', 'className="hero-prev tech-box-wrapper hover-jump"');
    code = code.replace('className="hero-next tech-box-wrapper"', 'className="hero-next tech-box-wrapper hover-jump"');
    code = code.replace('className="flash-prev"', 'className="flash-prev hover-jump"');
    code = code.replace('className="flash-next"', 'className="flash-next hover-jump"');
  }

  // 4. Badges (both ProductDetails.tsx and Home.tsx)
  // We need to find all `pointerEvents: 'none'` and change to `'auto'`, and inject className
  const badgeRegex = /<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0\.[234]rem', width: '75px', height: '75px', [^>]+pointerEvents: 'none', textAlign: 'center' }}>/g;
  
  code = code.replace(badgeRegex, (match) => {
    let replaced = match.replace("pointerEvents: 'none'", "pointerEvents: 'auto'");
    replaced = replaced.replace("<div style={{", "<div className=\"hover-jump\" style={{");
    return replaced;
  });

  fs.writeFileSync(filePath, code, 'utf8');
}

addHoverJump('src/components/Navbar.tsx');
addHoverJump('src/pages/ProductDetails.tsx');
addHoverJump('src/pages/Home.tsx');
console.log('Hover jump applied');
