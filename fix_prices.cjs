const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

// Replace in listMode
code = code.replace(
    '<div className="mobile-only" style={{ display: \'flex\', alignItems: \'center\', gap: \'0.5rem\', marginBottom: \'0.5rem\', flexWrap: \'wrap\' }}>',
    '<div className="mobile-only" style={{ display: \'flex\', flexDirection: \'column\', alignItems: \'flex-start\', gap: \'0.1rem\', marginBottom: \'0.5rem\' }}>'
);

// Replace in gridMode
code = code.replace(
    '<div className="mobile-only" style={{ display: \'flex\', alignItems: \'center\', gap: \'0.5rem\', marginTop: \'0.25rem\', marginBottom: \'0.5rem\' }}>',
    '<div className="mobile-only" style={{ display: \'flex\', flexDirection: \'column\', alignItems: \'flex-start\', gap: \'0.1rem\', marginTop: \'0.25rem\', marginBottom: \'0.5rem\' }}>'
);

fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
