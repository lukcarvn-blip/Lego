const fs = require('fs');
let pd = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

pd = pd.split('details.label').join('details?.name');
pd = pd.split('sizeDetails.label').join('sizeDetails?.name');
pd = pd.split('details.height').join('details?.heightCm');
pd = pd.split('sizeDetails.height').join('sizeDetails?.heightCm');
pd = pd.split('sizeDetails.scaleGraphic').join('(sizeDetails?.scaleGraphic || 1)');

// The old details?.heightCm isn't a string so we append ' cm'
pd = pd.split('{details?.heightCm}').join('{details?.heightCm ? `${details.heightCm} cm` : ""}');
pd = pd.split('{sizeDetails?.heightCm}').join('{sizeDetails?.heightCm ? `${sizeDetails.heightCm} cm` : ""}');

fs.writeFileSync('src/pages/ProductDetails.tsx', pd, 'utf8');
console.log('Fixed pd props');
