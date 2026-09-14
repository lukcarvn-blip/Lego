const fs = require('fs');

function applyInitialDelayHome() {
  let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');
  if (!code.includes('isInitialLoad')) {
    code = code.replace(
      `const { products, `,
      `const [isInitialLoad, setIsInitialLoad] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  const { products, `
    );
    
    code = code.replace(`className={\`hero-blog-swiper \${heroScanDir === 'reverse' ? 'is-reverse' : ''}\`}`, `className={\`hero-blog-swiper \${heroScanDir === 'reverse' ? 'is-reverse' : ''} \${isInitialLoad ? 'is-initial-load' : ''}\`}`);
      
    const css = `
          .hero-blog-swiper.is-initial-load .swiper-slide-active .hero-slide-content,
          .hero-blog-swiper.is-initial-load .swiper-slide-active .scanner-overlay {
            animation-delay: 2.5s !important;
            animation-fill-mode: both !important;
          }
          .hero-blog-swiper.is-initial-load .swiper-slide-active .hero-columns-container {
            animation-delay: 4s !important;
            animation-fill-mode: both !important;
          }`;
    code = code.replace(`@keyframes sci-fi-scan {`, css + `\n          @keyframes sci-fi-scan {`);
    fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
    console.log('Updated Home.tsx');
  }
}

function applyInitialDelayPD() {
  let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');
  if (!code.includes('isInitialLoad')) {
    code = code.replace(
      `const { id } = useParams<{ id: string }>();`,
      `const { id } = useParams<{ id: string }>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 3000);
    return () => clearTimeout(timer);
  }, []);`
    );
    
    code = code.replace(`className="product-detail-banner"`, `className={\`product-detail-banner \${isInitialLoad ? 'is-initial-load' : ''}\`}`);
    const css = `
            .product-detail-banner.is-initial-load .pd-slide-content,
            .product-detail-banner.is-initial-load .pd-scanner-overlay {
              animation-delay: 2s !important;
              animation-fill-mode: both !important;
            }
            .product-detail-banner.is-initial-load .pd-hud-delayed {
              animation-delay: 3.5s !important;
              animation-fill-mode: both !important;
            }`;
    code = code.replace(`.pd-hud-delayed {`, css + `\n            .pd-hud-delayed {`);
    fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
    console.log('Updated ProductDetails.tsx');
  }
}

applyInitialDelayHome();
applyInitialDelayPD();
