const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// We want to find this specific motion div wrapper and remove it, while applying motion to the container or sections.
const regex = /<motion\.div\s*initial=\{\{ opacity: 0, y: 20 \}\}\s*animate=\{\{ opacity: 1, y: 0 \}\}\s*style=\{\{ maxWidth: '800px', margin: '0 auto' \}\}\s*>/;

if (code.match(regex)) {
  // Replace the opening tag
  code = code.replace(regex, '<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%" }}>\n          <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center", marginBottom: "4rem" }}>');
  
  // Close the intro div before the leaderboard
  code = code.replace('{/* Bảng xếp hạng */}', '</div>\n\n          {/* Bảng xếp hạng */}');
  
  // Center the form
  code = code.replace('{/* Request Form */}', '<div style={{ maxWidth: "800px", margin: "0 auto" }}>\n          {/* Request Form */}');
  
  // Close the form div just before the last motion.div
  // The structure is:
  //         </motion.div>
  //       </div>
  //     </div>
  //   );
  // };
  const endRegex = /\s*<\/motion\.div>\s*<\/div>\s*<\/div>\s*\);\s*};/;
  code = code.replace(endRegex, '\n          </div>\n        </motion.div>\n      </div>\n    </div>\n  );\n};');
  
  fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
  console.log('Successfully refactored layout in Community.tsx');
} else {
  console.log('Failed to match layout wrapper');
}
