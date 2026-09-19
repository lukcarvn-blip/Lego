const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const additionalRules = `
/* CSS grid layout for mobile footer */
@media (max-width: 640px) {
  .footer-top-grid > div:first-child {
    display: grid !important;
    grid-template-areas: 
      "logo contact"
      "social social";
    grid-template-columns: 3.5fr 6.5fr !important;
    align-items: center;
    gap: 1.5rem 1rem;
  }
  
  .footer-logo-social-wrapper {
    display: contents !important;
  }
  
  .footer-logo-social-wrapper h3 {
    grid-area: logo;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .footer-logo {
    width: 100% !important;
    height: auto !important;
    max-width: 100% !important;
    max-height: 80px !important;
    object-fit: contain !important;
  }

  .footer-top-grid > div:first-child > div:nth-child(2) {
    grid-area: contact;
    margin-bottom: 0 !important;
  }
  
  .footer-top-grid > div:first-child > div:nth-child(2) span {
    font-size: 0.75rem;
    word-break: break-word;
    line-height: 1.3 !important;
  }
  
  .footer-top-grid > div:first-child > div:nth-child(2) svg {
    width: 16px;
    height: 16px;
    margin-top: 2px !important;
  }
  
  .footer-social-icons {
    grid-area: social;
    display: flex !important;
    flex-wrap: wrap;
    justify-content: center !important;
    gap: 1.5rem !important;
  }
}
`;

code += '\n' + additionalRules;
fs.writeFileSync('src/index.css', code, 'utf8');
console.log('Appended mobile footer layout to CSS');
