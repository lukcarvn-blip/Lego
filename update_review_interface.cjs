const fs = require('fs');

let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

const anchor = `  content: string;
  createdAt: string;`;
const newBlock = `  content: string;
  images?: string[];
  video?: string;
  createdAt: string;`;

if (code.includes(anchor) && !code.includes('images?: string[]')) {
  code = code.replace(anchor, newBlock);
  fs.writeFileSync('src/context/StoreContext.tsx', code, 'utf8');
  console.log('Updated Review interface');
} else {
  console.log('Match not found or already added');
}
