const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. We replace the start of product-detail-banner and remove the original vignette
const search1 = `<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="product-detail-banner">
          {/* Inner dark vignette for breadcrumb visibility */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            boxShadow: 'inset 0 0 150px 40px rgba(0,0,0,0.9)',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)',
            zIndex: 1, pointerEvents: 'none'
          }}></div>`;

const search1_crlf = search1.replace(/\n/g, '\r\n');

const replace1 = `<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="product-detail-banner" style={{ backgroundColor: '#050505', position: 'relative', overflow: 'hidden' }}>
          <style>{\`
            @keyframes pd-slide-reveal {
              0% { clip-path: polygon(0 0, 100% 0, 100% 0%, 0 0%); }
              100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
            }
            @keyframes pd-sci-fi-scan {
              0% { top: 0%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
              95% { top: 100%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
              100% { top: 100%; opacity: 0; box-shadow: none; }
            }
            .pd-slide-content {
              animation: pd-slide-reveal 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            .pd-scanner-overlay {
              position: absolute;
              left: 0;
              right: 0;
              height: 3px;
              background: #fff;
              z-index: 25;
              pointer-events: none;
              opacity: 0;
              animation: pd-sci-fi-scan 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            .pd-hud-delayed {
              opacity: 0;
              transform: translateY(15px);
              animation: hud-enter 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1.5s forwards;
            }
          \`}</style>
          
          <div className="pd-scanner-overlay"></div>
          
          <div className="pd-slide-content" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
            <img src={selectedBanner} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
            {/* Inner dark vignette for breadcrumb visibility */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              boxShadow: 'inset 0 0 150px 40px rgba(0,0,0,0.9)',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)',
              zIndex: 1, pointerEvents: 'none'
            }}></div>
          </div>`;

if (code.includes(search1)) {
  code = code.replace(search1, replace1);
  console.log("Replaced start (LF)");
} else if (code.includes(search1_crlf)) {
  code = code.replace(search1_crlf, replace1);
  console.log("Replaced start (CRLF)");
} else {
  console.log("Could not find start");
}

// 2. Add pd-hud-delayed to badges container
code = code.replace('<div className="product-detail-badges">', '<div className="product-detail-badges pd-hud-delayed">');

// 3. Remove the original img tag further down
code = code.replace('<img src={selectedBanner} alt="Banner" style={{ width: \'100%\', height: \'100%\', objectFit: \'cover\', display: \'block\', position: \'absolute\', top: 0, left: 0, zIndex: 0 }} />', '');

// 4. Add pd-hud-delayed to breadcrumbs
code = code.replace('<div style={{ position: \'absolute\', top: \'1.5rem\', left: \'1.5rem\', right: \'1.5rem\', zIndex: 10, display: \'flex\', gap: \'0.5rem\', fontSize: \'0.85rem\', color: \'var(--color-text-muted)\' }}>',
                    '<div className="pd-hud-delayed" style={{ position: \'absolute\', top: \'1.5rem\', left: \'1.5rem\', right: \'1.5rem\', zIndex: 10, display: \'flex\', gap: \'0.5rem\', fontSize: \'0.85rem\', color: \'var(--color-text-muted)\' }}>');

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('ProductDetails updated');
