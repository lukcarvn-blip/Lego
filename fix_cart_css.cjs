const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const targetCSS1 = `        @media (max-width: 1023px) {
          .sticky-cart-wrapper {
            position: fixed;
            bottom: 20px;
            left: 1rem;
            right: 1rem;
            z-index: 999;
            margin: 0;
            padding: 0;
          }`;
const newCSS1 = `        @media (max-width: 1023px) {
          .sticky-cart-wrapper {
            position: fixed;
            top: auto !important;
            bottom: 20px;
            left: 1rem;
            right: 1rem;
            z-index: 999;
            margin: 0;
            padding: 0;
          }`;

const targetCSS1_lf = targetCSS1.replace(/\\r\\n/g, '\\n');
const newCSS1_lf = newCSS1.replace(/\\r\\n/g, '\\n');

if (code.includes(targetCSS1)) code = code.replace(targetCSS1, newCSS1);
if (code.includes(targetCSS1_lf)) code = code.replace(targetCSS1_lf, newCSS1_lf);

const targetCSS2 = `        @media (max-width: 768px) {
          .sticky-cart-wrapper {
            bottom: 80px;
          }`;
const newCSS2 = `        @media (max-width: 768px) {
          .sticky-cart-wrapper {
            top: auto !important;
            bottom: 80px;
          }`;

const targetCSS2_lf = targetCSS2.replace(/\\r\\n/g, '\\n');
const newCSS2_lf = newCSS2.replace(/\\r\\n/g, '\\n');

if (code.includes(targetCSS2)) code = code.replace(targetCSS2, newCSS2);
if (code.includes(targetCSS2_lf)) code = code.replace(targetCSS2_lf, newCSS2_lf);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log("CSS fixed");
