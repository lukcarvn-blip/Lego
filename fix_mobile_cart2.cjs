const fs = require('fs');

// Fix 1: Update CSS - move sticky cart wrapper to bottom 0
let css = fs.readFileSync('src/index.css', 'utf8');
const oldCss = "    bottom: 65px; /* above mobile nav */\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 90;\r\n    padding: 0 0.75rem;\r\n  }\r\n}";
const newCss = "    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 90;\r\n    padding: 0 0.75rem calc(65px + 0.5rem);\r\n  }\r\n}";
if (css.includes(oldCss)) {
  css = css.replace(oldCss, newCss);
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('CSS updated successfully');
} else {
  console.log('CSS anchor not found, trying raw replace...');
  css = css.replace('    bottom: 65px; /* above mobile nav */', '    bottom: 0; /* sits at bottom edge */')
           .replace('    padding: 0 0.75rem;', '    padding: 0 0.75rem calc(65px + 0.5rem); /* clear bottom nav */');
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('CSS updated with fallback replace');
}

// Fix 2: Add isSummaryOpen state to ProductDetails.tsx
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Add state variable after isMobile state
const stateAnchor = "  const [isLightboxOpen, setIsLightboxOpen] = useState(false);";
const newStateAnchor = `  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);`;

if (code.includes(stateAnchor)) {
  code = code.replace(stateAnchor, newStateAnchor);
  console.log('Added isSummaryOpen state');
} else {
  console.log('State anchor not found');
}

// Fix 3: Replace the summary-note-container div with collapsible version
// First find the exact text
const summaryIdx = code.indexOf('summary-note-container');
if (summaryIdx !== -1) {
  const snippet = code.slice(summaryIdx - 5, summaryIdx + 600);
  console.log('Summary section snippet:');
  console.log(JSON.stringify(snippet.slice(0, 400)));
}

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
