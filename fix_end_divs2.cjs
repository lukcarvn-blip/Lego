const fs = require('fs');
let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

// We have 1 missing closing div at the end before </motion.div> or similar.
// Looking at line 58: <div style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
// Line 59: <div className="container">
// Line 60: <motion.div ...>
// So we need: 
// </motion.div>
// </div>
// </div>
// );
// };

// Replace the end of the file with the correct tags
lines.splice(470, 5, '        </motion.div>', '      </div>', '    </div>', '  );', '};');

fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
console.log('Fixed end of file.');
