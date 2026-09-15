const fs = require('fs');
let code = fs.readFileSync('src/data/mockProducts.ts', 'utf8');

// 1. Update Product interface
code = code.replace(
  /video\?: string;/g,
  `video?: string;
  biography?: { vi: string; en: string };
  powerRanking?: number;
  alignment?: 'Hero' | 'Villain' | 'Neutral';`
);

// 2. Add mock data for some characters
// Supergirl (p-05)
code = code.replace(
  /(id: 'p-05',[\s\S]*?category: "Superheroes",)/g,
  `$1
    biography: { vi: 'Nữ siêu nhân đến từ Krypton, sở hữu sức mạnh vô song và lòng trắc ẩn.', en: 'Kryptonian superheroine possessing immense power and compassion.' },
    powerRanking: 95,
    alignment: 'Hero',`
);

// Batman (p-11)
code = code.replace(
  /(id: 'p-11',[\s\S]*?category: "Superheroes",)/g,
  `$1
    biography: { vi: 'Hiệp sĩ bóng đêm của Gotham, sử dụng trí tuệ và công nghệ để chống tội phạm.', en: 'The Dark Knight of Gotham, using intellect and tech to fight crime.' },
    powerRanking: 85,
    alignment: 'Hero',`
);

// Spider-Man (p-06)
code = code.replace(
  /(id: 'p-06',[\s\S]*?category: "Superheroes",)/g,
  `$1
    biography: { vi: 'Người nhện đu tơ bảo vệ New York với tinh thần trách nhiệm cao cả.', en: 'Web-slinging protector of New York with a great sense of responsibility.' },
    powerRanking: 88,
    alignment: 'Hero',`
);

// Darth Vader (p-02)
code = code.replace(
  /(id: 'p-02',[\s\S]*?category: "Sci-Fi",)/g,
  `$1
    biography: { vi: 'Chúa tể Sith đáng sợ với sức mạnh của Thần lực bóng tối.', en: 'Fearsome Sith Lord wielding the power of the Dark Side.' },
    powerRanking: 98,
    alignment: 'Villain',`
);

fs.writeFileSync('src/data/mockProducts.ts', code, 'utf8');
console.log('Updated mockProducts.ts');
