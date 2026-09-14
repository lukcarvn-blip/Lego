const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Update CSS
const oldCssStr = `          @keyframes sci-fi-scan {
            0% { top: -10%; opacity: 0; }
            15% { opacity: 1; box-shadow: 0 0 40px 10px var(--color-accent); }
            50% { opacity: 1; box-shadow: 0 0 60px 15px var(--color-accent); background: #fff; }
            85% { opacity: 1; box-shadow: 0 0 40px 10px var(--color-accent); }
            100% { top: 110%; opacity: 0; }
          }
          .scanner-overlay {
            position: absolute;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--color-accent);
            z-index: 25;
            pointer-events: none;
            opacity: 0;
            animation: sci-fi-scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }`;

const newCssStr = `          @keyframes slide-reveal {
            0% { clip-path: polygon(0 0, 100% 0, 100% 0%, 0 0%); }
            100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
          }
          @keyframes sci-fi-scan {
            0% { top: 0%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
            95% { top: 100%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
            100% { top: 100%; opacity: 0; box-shadow: none; }
          }
          .hero-blog-swiper .swiper-slide {
            background-color: #050505 !important;
          }
          .hero-blog-swiper .swiper-slide-active .hero-slide-content {
            animation: slide-reveal 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .hero-blog-swiper .swiper-slide-active .scanner-overlay {
            position: absolute;
            left: 0;
            right: 0;
            height: 3px;
            background: #fff;
            z-index: 25;
            pointer-events: none;
            opacity: 0;
            animation: sci-fi-scan 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }`;

if (code.includes(oldCssStr.replace(/\\r\\n/g, '\\n'))) {
    code = code.replace(oldCssStr.replace(/\\r\\n/g, '\\n'), newCssStr.replace(/\\r\\n/g, '\\n'));
    console.log("CSS replaced LF");
} else if (code.includes(oldCssStr)) {
    code = code.replace(oldCssStr, newCssStr);
    console.log("CSS replaced CRLF");
} else {
    console.log("CSS not found");
}

// 2. Remove global scanner
const globalScannerStr = `          {/* Initial Scan Effect */}\r\n          <div className="scanner-overlay"></div>\r\n`;
if (code.includes(globalScannerStr)) code = code.replace(globalScannerStr, '');
else if (code.includes(globalScannerStr.replace(/\\r\\n/g, '\\n'))) code = code.replace(globalScannerStr.replace(/\\r\\n/g, '\\n'), '');

// 3. Update SwiperSlide content
const oldSlideStr = `<SwiperSlide key={prod.id}>\r
              <Link to={\`/product/\${prod.id}\`} style={{ display: 'block', width: '100%', height: '100%', position: 'relative', textDecoration: 'none' }}>\r
                <img `;

const newSlideStr = `<SwiperSlide key={prod.id}>\r
              <div className="scanner-overlay"></div>\r
              <div className="hero-slide-content" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>\r
                <Link to={\`/product/\${prod.id}\`} style={{ display: 'block', width: '100%', height: '100%', position: 'relative', textDecoration: 'none' }}>\r
                  <img `;

if (code.includes(oldSlideStr)) code = code.replace(oldSlideStr, newSlideStr);
else if (code.includes(oldSlideStr.replace(/\\r\\n/g, '\\n'))) code = code.replace(oldSlideStr.replace(/\\r\\n/g, '\\n'), newSlideStr.replace(/\\r\\n/g, '\\n'));
else console.log("Slide start not found");

// Close the div
const oldSlideEndStr = `                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </Link>\r
            </SwiperSlide>`;
const newSlideEndStr = `                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </Link>\r
              </div>\r
            </SwiperSlide>`;
            
if (code.includes(oldSlideEndStr)) code = code.replace(oldSlideEndStr, newSlideEndStr);
else if (code.includes(oldSlideEndStr.replace(/\\r\\n/g, '\\n'))) code = code.replace(oldSlideEndStr.replace(/\\r\\n/g, '\\n'), newSlideEndStr.replace(/\\r\\n/g, '\\n'));
else console.log("Slide end not found");

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
