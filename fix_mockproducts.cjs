const fs = require('fs');
let code = fs.readFileSync('src/data/mockProducts.ts', 'utf8');
code = code.replace(/    collection: "Marvel",\r?\n    collection: "Marvel",/g, '    collection: "Marvel",');
code = code.replace(/    collection: "Avengers",\r?\n    collection: "Avengers",/g, '    collection: "Avengers",');
code = code.replace(/    collection: "Anime",\r?\n    collection: "Anime",/g, '    collection: "Anime",');
fs.writeFileSync('src/data/mockProducts.ts', code, 'utf8');
