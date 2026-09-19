const fs = require('fs');
let code = fs.readFileSync('src/data/mockProducts.ts', 'utf8');

code = code.replace(
    /en: "Deadpool - Merc with a Mouth" \r?\n\s+\},\r?\n\s+category: "Superheroes",/,
    `en: "Deadpool - Merc with a Mouth" \n    },\n    category: "Superheroes",\n    collection: "Marvel",`
);
code = code.replace(
    /en: "Venom - Symbiote Nightmare" \r?\n\s+\},\r?\n\s+category: "Superheroes",/,
    `en: "Venom - Symbiote Nightmare" \n    },\n    category: "Superheroes",\n    collection: "Marvel",`
);
code = code.replace(
    /en: "Black Panther - Wakanda Forever" \r?\n\s+\},\r?\n\s+category: "Superheroes",/,
    `en: "Black Panther - Wakanda Forever" \n    },\n    category: "Superheroes",\n    collection: "Avengers",`
);
code = code.replace(
    /en: "Toad - Classic Mushroom Kingdom" \r?\n\s+\},\r?\n\s+category: "Classic",/,
    `en: "Toad - Classic Mushroom Kingdom" \n    },\n    category: "Classic",\n    collection: "Anime",`
);

fs.writeFileSync('src/data/mockProducts.ts', code, 'utf8');
console.log('Fixed mock products');
