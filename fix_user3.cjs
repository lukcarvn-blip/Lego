const fs = require('fs');

let lines = fs.readFileSync('src/context/StoreContext.tsx', 'utf8').split('\n');

// 1. Fix saveCharacter logic
let code = lines.join('\n');
code = code.replace(
  /const saved = user\.savedCharacters \|\| \[\];/g,
  `const appUser = appUsers.find(u => u.uid === user.uid);\n    const saved = appUser?.savedCharacters || [];`
);

lines = code.split('\n');

// 2. Add combinedUser
const returnIndex = lines.findIndex(l => l.includes('<StoreContext.Provider value={{'));
if (returnIndex !== -1) {
  // Go up to find 'return ('
  let insertAt = returnIndex;
  while(insertAt > 0 && !lines[insertAt].includes('return (')) {
    insertAt--;
  }
  
  lines.splice(insertAt, 0, 
    "  const combinedUser = React.useMemo(() => {",
    "    if (!user) return null;",
    "    const found = appUsers.find(u => u.uid === user.uid);",
    "    return found ? { ...user, ...found } : user;",
    "  }, [user, appUsers]);",
    ""
  );
}

// 3. Replace user in Provider
const providerUserIndex = lines.findIndex(l => l.trim() === 'user,');
if (providerUserIndex !== -1) {
  lines[providerUserIndex] = lines[providerUserIndex].replace('user,', 'user: combinedUser,');
}

fs.writeFileSync('src/context/StoreContext.tsx', lines.join('\n'), 'utf8');
console.log('Fixed cleanly');
