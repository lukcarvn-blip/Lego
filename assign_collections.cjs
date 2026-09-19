const fs = require('fs');
let code = fs.readFileSync('src/data/mockProducts.ts', 'utf8');

const assignments = {
    'Iron Man': 'Avengers',
    'Thor': 'Avengers',
    'Loki': 'Avengers',
    'Spider-Man': 'Marvel',
    'Venom': 'Marvel',
    'Deadpool': 'Marvel',
    'Batman': 'DC Comics',
    'Superman': 'DC Comics',
    'Goku': 'Anime',
    'Buzz Lightyear': 'Space',
    'Darth Vader': 'Star Wars'
};

for (const [key, collection] of Object.entries(assignments)) {
    // Find the product block by matching the English name containing the key
    const regex = new RegExp(`(en:\\s*".*?${key}.*?"\\s*\\}\\s*,\\s*category:\\s*".*?"\\s*,)`, 'g');
    if (code.match(regex)) {
        code = code.replace(regex, `$1\n    collection: "${collection}",`);
    } else {
        console.log('Could not match:', key);
    }
}

fs.writeFileSync('src/data/mockProducts.ts', code, 'utf8');
console.log('Assigned collections to mockProducts');
