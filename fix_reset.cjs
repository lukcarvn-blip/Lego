const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const hookStr = `
  useEffect(() => {
    // Reset states when changing products
    setPoliciesExpanded(false);
    setCraftingExpanded(false);
    setIsLiked(!!localStorage.getItem('liked_' + id));
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);
`;

// Insert it around line 103 (after the useState declarations)
const insertTarget = `const [isTopFan, setIsTopFan] = useState(false);`;
if (code.includes(insertTarget) && !code.includes('setPoliciesExpanded(false)')) {
  code = code.replace(insertTarget, insertTarget + '\n' + hookStr);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('Fixed ProductDetails.tsx resetting');
} else {
  console.log('Target not found or already fixed.');
}
