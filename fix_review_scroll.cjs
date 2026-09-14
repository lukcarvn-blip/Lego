const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Add refs and handlers
const stateCode = `const [isReviewOverlayOpen, setIsReviewOverlayOpen] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);`;

const newStateCode = `const [isReviewOverlayOpen, setIsReviewOverlayOpen] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const reviewBoxRef = useRef<HTMLDivElement>(null);
  const [prevScrollY, setPrevScrollY] = useState(0);

  const handleOpenReview = () => {
    setPrevScrollY(window.scrollY);
    setIsReviewOverlayOpen(true);
    setTimeout(() => {
      if (reviewBoxRef.current) {
        reviewBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleCloseReview = () => {
    setIsReviewOverlayOpen(false);
    setTimeout(() => {
      window.scrollTo({ top: prevScrollY, behavior: 'smooth' });
    }, 50);
  };`;

if (code.includes(stateCode)) {
  code = code.replace(stateCode, newStateCode);
} else {
  code = code.replace(stateCode.replace(/\n/g, '\r\n'), newStateCode);
}

// 2. Replace setIsReviewOverlayOpen(true)
code = code.replace(/onClick=\{\(\) => setIsReviewOverlayOpen\(true\)\}/g, `onClick={handleOpenReview}`);

// 3. Replace setIsReviewOverlayOpen(false)
code = code.replace(/onClick=\{\(\) => setIsReviewOverlayOpen\(false\)\}/g, `onClick={handleCloseReview}`);

// 4. Add ref to material-size-wrapper
const materialWrapper = `<div className="material-size-wrapper" style={{ position: 'relative' }}>`;
const newMaterialWrapper = `<div className="material-size-wrapper" ref={reviewBoxRef} style={{ position: 'relative' }}>`;

code = code.replace(materialWrapper, newMaterialWrapper);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Added review scroll logic');
