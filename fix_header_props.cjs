const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldProps = `  const headerAnimProps = {
    initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };`;

const newProps = `  const headerAnimProps = {
    initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };`;

if (code.includes(oldProps)) {
  code = code.replace(oldProps, newProps);
  fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
  console.log('Successfully fixed headerAnimProps');
} else {
  console.log('Could not find headerAnimProps');
}
