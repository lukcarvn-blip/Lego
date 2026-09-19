const fs = require('fs');

let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// 1. Fix saveCharacter logic
code = code.replace(
  /const saved = user\.savedCharacters \|\| \[\];/g,
  `const appUser = appUsers.find(u => u.uid === user.uid);\n    const saved = appUser?.savedCharacters || [];`
);

// 2. Add combinedUser right before the return <StoreContext.Provider ...>
const returnIndex = code.indexOf('  return (\n    <StoreContext.Provider');
if (returnIndex !== -1) {
  const combinedUserCode = `
  const combinedUser = React.useMemo(() => {
    if (!user) return null;
    const found = appUsers.find(u => u.uid === user.uid);
    return found ? { ...user, ...found } : user;
  }, [user, appUsers]);

`;
  code = code.substring(0, returnIndex) + combinedUserCode + code.substring(returnIndex);
}

// 3. Replace user with combinedUser in Provider
// We specifically target the exact lines in the Provider block:
//         removeToast,
//         user,
//         appUsers,
code = code.replace(
  /removeToast,\s*user,\s*appUsers,/m,
  `removeToast,\n        user: combinedUser,\n        appUsers,`
);

fs.writeFileSync('src/context/StoreContext.tsx', code, 'utf8');
console.log('Fixed StoreContext.tsx cleanly');
