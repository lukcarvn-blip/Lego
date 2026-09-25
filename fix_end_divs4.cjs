const fs = require('fs');
let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

// the structure at the very end needs to be:
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// Replace lines 471 onwards
lines.splice(470, lines.length - 470, '        </motion.div>', '      </div>', '    </div>', '  );', '};');

fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
