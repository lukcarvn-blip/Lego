const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const regex = /\.product-detail-badges\s*\{\s*top:\s*auto;\s*bottom:\s*0\.5rem;\s*left:\s*0;\s*right:\s*0;\s*width:\s*100%;\s*flex-direction:\s*row;\s*align-items:\s*center;\s*justify-content:\s*center;\s*transform:\s*scale\(0\.5\);\s*transform-origin:\s*bottom\s*center;\s*pointer-events:\s*none;\s*\}/m;

const newCSS = `.product-detail-badges {
    top: 50%;
    bottom: auto;
    right: 0.5rem;
    left: auto;
    width: auto;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    transform: translateY(-50%) scale(0.9);
    transform-origin: right center;
    pointer-events: auto;
  }`;

if (regex.test(code)) {
    code = code.replace(regex, newCSS);
    fs.writeFileSync('src/index.css', code, 'utf8');
    console.log('CSS updated');
} else {
    console.log('CSS not matched');
}
