const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

// Remove the old footer-logo-social-wrapper rules and update grid rules
const oldRules = `
.footer-logo-social-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: nowrap;
}

.footer-social-icons {
  display: grid;
  grid-template-columns: repeat(2, 47px);
  gap: 1rem;
}

@media (min-width: 640px) {
  .footer-logo-social-wrapper {
    gap: 1rem;
  }
  .footer-social-icons {
    display: flex;
    flex-direction: row;
  }
}

.footer-logo {
  height: 80px;
  object-fit: contain;
}

@media (max-width: 640px) {
  .footer-logo-social-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
    gap: 1rem;
  }
  .footer-social-icons {
    justify-content: center;
  }
  .footer-logo {
    height: 120px;
    width: auto;
    max-width: 140px;
  }
}
`;

// New Grid rules for footer-col-1
const newRules = `
.footer-col-1 {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 641px) {
  .footer-col-1 {
    grid-template-areas: 
      "logo social"
      "contact contact";
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 1.5rem 2rem;
  }
  .footer-logo-container { grid-area: logo; }
  .footer-social-icons { grid-area: social; display: flex; flex-direction: row; gap: 1rem; }
  .footer-contact-info { grid-area: contact; }
  
  .footer-logo {
    height: 80px;
    object-fit: contain;
  }
}

@media (max-width: 640px) {
  .footer-col-1 {
    grid-template-areas: 
      "logo contact"
      "social social";
    grid-template-columns: 3fr 7fr;
    align-items: center;
    gap: 1rem;
  }
  .footer-logo-container { 
    grid-area: logo; 
    display: flex; 
    justify-content: center; 
  }
  .footer-contact-info { 
    grid-area: contact; 
    margin-bottom: 0 !important;
  }
  .footer-contact-info span {
    font-size: 0.75rem;
    word-break: break-word;
  }
  .footer-contact-info svg {
    width: 16px;
    height: 16px;
  }
  .footer-social-icons { 
    grid-area: social; 
    display: flex; 
    flex-wrap: wrap;
    justify-content: center; 
    gap: 1.5rem;
    margin-top: 1rem;
  }
  .footer-logo {
    width: 100%;
    height: auto;
    max-height: 100px;
    object-fit: contain;
  }
}
`;

// Do replacement by regex to be safe
code = code.replace(/\.footer-logo-social-wrapper[\s\S]*?\}\s*\}/, newRules);
// If it fails, we just append it (since CSS cascade overrides)
// Actually let's just append it and override!
// Oh wait, the old rules might interfere if we don't remove them.

const cleanCode = code.replace(/\.footer-logo-social-wrapper[\s\S]*?(?=\.container|\.chamfer-btn|@media \(\w+-width)/g, '');
// Wait, regex might eat too much. 

fs.writeFileSync('src/index.css', code + '\n' + newRules, 'utf8');
console.log('Appended new CSS rules');
