const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const regex = /onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*const isSaved = user\?\.savedCharacters\?\.includes\(product\.id\);\s*if \(isSaved\) \{\s*unsaveCharacter\(product\.id\);\s*\} else \{\s*saveCharacter\(product\.id\);\s*\}\s*\}\}/;

const replacement = `onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      loginWithGoogle();
                      return;
                    }
                    const isSaved = user?.savedCharacters?.includes(product.id);
                    if (isSaved) {
                      unsaveCharacter(product.id);
                    } else {
                      saveCharacter(product.id);
                    }
                  }}`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('Fixed ProductDetails save button regex');
} else {
  console.log('Regex target not found in ProductDetails.tsx');
}
